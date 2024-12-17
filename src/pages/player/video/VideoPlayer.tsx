import React, { useEffect, useRef, useState } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js"; // Import Hls.js
import floatingScreen from "../../../assets/floatingScreen.png";
import axios from "axios";
import { VideoPlayerProps } from "../../../model/videoModel";
import { useGetRecordQuery } from "../../profile/services/profileApi";
import { convertToSecurePayload } from "../../../services/newEncryption";

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  onBack,
  movieDetail,
  selectedEpisode,
  resumeTime,
  handleVideoError,
}) => {
  const playerRef = useRef<any>(null);
  const videoElementRef = useRef<HTMLDivElement>(null);
  const [videoRatio, setVideoRatio] = useState(9 / 16); // Default to 16:9 ratio
  const { refetch } = useGetRecordQuery(); // Fetch favorite movies list from API
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const inactivityTimeout = useRef<number | null>(null);
  const [reHeight, setReHeight] = useState(false);
  // Function to get token from localStorage
  const getToken = () => {
    const isLoggedIn = localStorage.getItem("authToken");
    const parsedLoggedIn = isLoggedIn ? JSON.parse(isLoggedIn) : null;
    return parsedLoggedIn?.data?.access_token;
  };

  // Function to report playback progress on specific events (back or episode change)
  const reportProgress = async (currentTime: number, duration: number) => {
    const token = getToken();
    if (!token) return;

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/movie_play/report`,
        convertToSecurePayload({
          movie_id: movieDetail.id, // Assuming movie_id is movie name
          episode_id: selectedEpisode?.episode_id,
          movie_from: selectedEpisode?.from_code,
          duration: Math.floor(duration), // Report in seconds
          current_time: Math.floor(currentTime), // Report in seconds
        }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error reporting playback progress:", error);
    }
  };

  useEffect(() => {
    let hls: Hls | null = null;

    const initializePlayer = async () => {
      if (videoElementRef.current && videoUrl) {
        const art = new Artplayer({
          container: videoElementRef.current,
          url: videoUrl,
          autoplay: true,
          playbackRate: true,
          setting: true,
          fullscreen: true,
          airplay: true,
          // miniProgressBar: true,
          // moreVideoAttr: {
          //   playsInline: true,
          // },
        });

        // Use Hls.js for HLS streams
        if (Hls.isSupported() && videoUrl.includes(".m3u8")) {
          hls = new Hls();
          hls.loadSource(videoUrl);
          hls.attachMedia(art.video);

          // Handle HLS errors
          hls.on(Hls.Events.ERROR, (_, data) => {
            if (data.fatal) {
              console.error("HLS error:", data);
              handleVideoError(videoUrl);
            }
          });
        } else {
          art.video.src = videoUrl; // For Safari and iOS
        }

        // Adjust video ratio based on the video's actual dimensions
        art.once("video:loadedmetadata", () => {
          const videoWidth = art.video.videoWidth;
          const videoHeight = art.video.videoHeight;
          if (videoWidth > videoHeight) {
            sendNativeEvent('landscape_view')
          } else if (videoHeight > videoWidth) {
            sendNativeEvent('potrait_view')
          } else {
            sendNativeEvent('square_view')
          }
          setVideoRatio(videoHeight / videoWidth); // Set the dynamic aspect ratio
          setReHeight(videoWidth < videoHeight);
        });
        // Set resume time if available
        art.once("ready", () => {
          if (resumeTime > 0) {
            art.currentTime = resumeTime;
          }
          setTimeout(() => {
            if (playerRef.current) {
              const token = getToken();
              if (token) {
                reportProgress(
                  playerRef.current.currentTime,
                  playerRef.current.duration
                );
              }
            }
          }, 1000);
          setTimeout(() => {
            if (playerRef.current) {
              const token = getToken();
              if (token) {
                refetch();
              }
            }
          }, 3000);
        });
        playerRef.current = art;
      }
    };

    initializePlayer();

    // Orientation change listener
    const handleOrientationChange = () => {
      if (playerRef && playerRef.current) {
        playerRef.current.fullscreen =
          window.innerWidth > window.innerHeight ? true : false;
      }
    };

    // Add the event listener for orientation change
    window.addEventListener("orientationchange", handleOrientationChange);
    return () => {
      // Clean up HLS and ArtPlayer
      if (hls) {
        hls.destroy(); // Stop HLS requests
        hls = null;
      }
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.video.src = ""; // Clear video source
        playerRef.current.destroy(); // Destroy ArtPlayer
        playerRef.current = null;
      }
    };
  }, [videoUrl, resumeTime]);

  // Define the event handler
  const sendNativeEvent = (message: string) => {
      if (
        (window as any).webkit &&
        (window as any).webkit.messageHandlers &&
        (window as any).webkit.messageHandlers.jsBridge
      ) {
        (window as any).webkit.messageHandlers.jsBridge.postMessage(
          message
        );
    }
  };

  const handleBack = async () => {
    if (playerRef.current) {
      // Report progress before navigating back
      reportProgress(playerRef.current.currentTime, playerRef.current.duration);
      playerRef.current.pause();
      playerRef.current.video.src = ""; // Stop video requests
      playerRef.current.destroy();
      playerRef.current = null;
      const token = getToken();
      if (token) {
        refetch();
      }
    }
    onBack();
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (playerRef.current) {
        const token = getToken();
        if (token) {
          reportProgress(
            playerRef.current.currentTime,
            playerRef.current.duration
          );
          refetch();
        }
      }
    }, 15000); // 15 seconds interval

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const handlePiP = () => {
    if (document.pictureInPictureEnabled && playerRef.current) {
      if (playerRef.current.video !== document.pictureInPictureElement) {
        playerRef.current.video.requestPictureInPicture();
      } else {
        document.exitPictureInPicture();
      }
    }
  };

  const handleUserActivity = () => {
    // Show the controls when there's activity
    setIsControlsVisible(true);

    // Clear any existing timeout
    if (inactivityTimeout.current) {
      clearTimeout(inactivityTimeout.current);
    }

    // Set a timeout to hide controls after 3 seconds of inactivity
    inactivityTimeout.current = window.setTimeout(() => {
      setIsControlsVisible(false);
    }, 3000);
  };

  const handleTouchMove = () => {
    // Immediately hide the controls during a touch slide
    setIsControlsVisible(false);

    // Optionally, clear any existing timeout to avoid re-showing the controls prematurely
    if (inactivityTimeout.current) {
      clearTimeout(inactivityTimeout.current);
    }
  };

  useEffect(() => {
    // Attach event listeners for user activity
    const player = document.getElementById("my-player");
    if (player) {
      player.addEventListener("touchmove", handleTouchMove);
      player.addEventListener("mousemove", handleUserActivity);
      player.addEventListener("keydown", handleUserActivity);
      player.addEventListener("touchstart", handleUserActivity);
      player.addEventListener("touchmove", handleTouchMove);
    }

    // Cleanup event listeners on unmount
    return () => {
      if (inactivityTimeout.current) {
        clearTimeout(inactivityTimeout.current);
      }
      if (player) {
        player.removeEventListener("mousemove", handleUserActivity);
        player.removeEventListener("keydown", handleUserActivity);
        player.removeEventListener("touchstart", handleUserActivity);
        player.addEventListener("touchmove", handleTouchMove);
      }
    };
  }, []);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const playerElement = videoElementRef.current;
  //     if (!playerElement) return;

  //     const rect = playerElement.getBoundingClientRect();
  //     console.log('rect top is=>', rect);
  //     // const isOutOfView = rect.top < 0;

  //     // Minimize player when scrolled out of view
  //     // setIsMinimized(isOutOfView);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  return (
    <div
      id="my-player"
      className={`relative w-full bg-black ${reHeight ? "h-[40vh]" : ""}`}
    >
      {/* Back button */}
      {isControlsVisible && (
        <>
          <div className="absolute top-0 left-0 p-4 z-50">
            <button onClick={handleBack} className="text-white flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M7.828 11H20V13H7.828L13.192 18.364L11.778 19.778L4 12L11.778 4.22198L13.192 5.63598L7.828 11Z"
                  fill="white"
                />
              </svg>
              <p className="cus-elips">{selectedEpisode?.episode_name}</p>
            </button>
          </div>
          <div className="absolute top-0 right-0 p-4 z-50">
            <button className="text-white" onClick={handlePiP}>
              <img src={floatingScreen} alt="PiP" className="h-5 w-5" />
            </button>
          </div>
        </>
      )}

      {/* Video element wrapper */}
      <div
        className={`relative w-full ${reHeight ? "h-[40vh]" : ""}`}
        style={{ paddingTop: `${videoRatio * 100}%` }}
      >
        {/* Video element */}
        <div
          ref={videoElementRef}
          className={`absolute top-0 left-0 w-full ${
            reHeight ? "h-[40vh]" : "h-full"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default VideoPlayer;
