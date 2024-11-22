import React, { useEffect, useRef, useState } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js"; // Import Hls.js
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import floatingScreen from "../../../assets/floatingScreen.png";
import axios from "axios";
import { VideoPlayerProps } from "../../../model/videoModel";
import { useGetRecordQuery } from "../../profile/services/profileApi";

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
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const inactivityTimeout = useRef<number | null>(null);

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
        {
          movie_id: movieDetail.id, // Assuming movie_id is movie name
          episode_id: selectedEpisode?.episode_id,
          movie_from: selectedEpisode?.from_code,
          duration: Math.floor(duration), // Report in seconds
          current_time: Math.floor(currentTime), // Report in seconds
        },
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
    const initializePlayer = () => {
      if (videoElementRef.current && videoUrl) {
        const art = new Artplayer({
          container: videoElementRef.current,
          url: videoUrl,
          //   autoSize: true,
          autoplay: true,
          playbackRate: true,
          setting: true,
          fullscreen: true,
          airplay: true,
          // fullscreenWeb: true,
          //   pip: true,
          moreVideoAttr: {
            playsInline: true,
          },
        });

        // Use Hls.js for HLS streams
        if (Hls.isSupported() && videoUrl.includes(".m3u8")) {
          const hls = new Hls();
          hls.loadSource(videoUrl);
          hls.attachMedia(art.video);
          // Handle Hls.js errors
          hls.on(Hls.Events.ERROR, (_, data) => {
            if (data.fatal) {
              setTimeout(() => {
                handleVideoError(videoUrl);
              }, 1000);
            }
          });
        } else if (art.video.canPlayType("application/vnd.apple.mpegurl")) {
          art.video.src = videoUrl; // For Safari and iOS
        }

        // Adjust video ratio based on the video's actual dimensions
        art.once("video:loadedmetadata", () => {
          const videoWidth = art.video.videoWidth;
          const videoHeight = art.video.videoHeight;
          setVideoRatio(videoHeight / videoWidth); // Set the dynamic aspect ratio
        });

        // Set resume time if available
        art.once("ready", () => {
          if (resumeTime > 0) {
            art.currentTime = resumeTime;
          }
        });

        playerRef.current = art;
      }
    };

    initializePlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoUrl, resumeTime]);

  const handleBack = async() => {
    if (playerRef.current) {
      // Report progress before going back
      await reportProgress(playerRef.current.currentTime, playerRef.current.duration);
      playerRef.current.pause();
      refetch();
    }
    refetch();
    onBack();
  };

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

  return (
    <div id="my-player" className="relative w-full bg-black">
      {/* Back button */}
      {isControlsVisible && 
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
          {selectedEpisode?.episode_name}
        </button>
      </div>
      <div className="absolute top-0 right-0 p-4 z-50">
        <button className="text-white" onClick={handlePiP}>
          <img src={floatingScreen} alt="PiP" className="h-5 w-5" />
        </button>
      </div>
      </>
      }

      {/* Video element wrapper */}
      <div
        className="relative w-full"
        style={{ paddingTop: `${videoRatio * 100}%` }}
      >
        {/* Video element */}
        <div
          ref={videoElementRef}
          className="absolute top-0 left-0 w-full h-full"
        ></div>
      </div>
    </div>
  );
};

export default VideoPlayer;
