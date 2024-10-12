import React, { useEffect, useRef, useState } from 'react';
import Artplayer from 'artplayer';
import Hls from 'hls.js'; // Import Hls.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import floatingScreen from '../../../assets/floatingScreen.png';
import axios from 'axios';

interface Episode {
  episode_id: number | null;
  episode_name: string;
  play_url: string;
  from_code: string;
  ready_to_play: boolean;
}

interface MovieDetail {
  name: string;
  area: string;
  year: string;
  score: string;
  content: string;
  cover: string;
  type_name: string;
  tags: { name: string }[];
  comments_count: string;
  popularity_score: number;
  id: string;
  play_from: {
    name: string;
    code: string;
    list: Episode[];
    total: number | null;
    tips: string;
  }[];
  last_playback: {
    current_time: number;
    duration: number;
    episode_id: number;
    id: string;
    movie_from: string;
  };
}

interface VideoPlayerProps {
  videoUrl: string;
  onBack: () => void;
  movieDetail: MovieDetail;
  selectedEpisode?: Episode | null;
  resumeTime: number;
  setVideoError: (videoError: boolean) => void;
  setAutoSwitch: (count: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  onBack,
  movieDetail,
  selectedEpisode,
  resumeTime,
  setVideoError,
  setAutoSwitch
}) => {
  const playerRef = useRef<any>(null);
  const videoElementRef = useRef<HTMLDivElement>(null);
  const [videoRatio, setVideoRatio] = useState(9 / 16); // Default to 16:9 ratio

  // Function to get token from localStorage
  const getToken = () => {
    const isLoggedIn = localStorage.getItem('authToken');
    const parsedLoggedIn = isLoggedIn ? JSON.parse(isLoggedIn) : null;
    return parsedLoggedIn?.data?.access_token;
  };

  // Function to report playback progress on specific events (back or episode change)
  const reportProgress = async (currentTime: number, duration: number) => {
    const token = getToken();
    if (!token) return;

    try {
      await axios.post(
        'https://cc3e497d.qdhgtch.com:2345/api/v1/movie_play/report',
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
      console.error('Error reporting playback progress:', error);
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
          fullscreenWeb: true,
        //   pip: true,
          moreVideoAttr: {
            playsInline: true,
          },
        });

        // Use Hls.js for HLS streams
        if (Hls.isSupported() && videoUrl.includes('.m3u8')) {
          const hls = new Hls();
          hls.loadSource(videoUrl);
          hls.attachMedia(art.video);
             // Handle Hls.js errors
          hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            console.log('errroer', data.fatal);
            // setVideoError(true);
            // setAutoSwitch(6);
          }
        });
        } else if (art.video.canPlayType('application/vnd.apple.mpegurl')) {
          art.video.src = videoUrl; // For Safari and iOS
        }

        // Adjust video ratio based on the video's actual dimensions
        art.once('video:loadedmetadata', () => {
          const videoWidth = art.video.videoWidth;
          const videoHeight = art.video.videoHeight;
          setVideoRatio(videoHeight / videoWidth); // Set the dynamic aspect ratio
        });

        // Set resume time if available
        art.once('ready', () => {
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

  const handleBack = () => {
    if (playerRef.current) {
      // Report progress before going back
      reportProgress(playerRef.current.currentTime, playerRef.current.duration);
      playerRef.current.pause();
    }
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

  return (
    <div className='relative w-full bg-black'>
      {/* Back button */}
      <div className="absolute top-0 left-0 p-4 z-50">
        <button onClick={handleBack} className="text-white">
          <FontAwesomeIcon icon={faArrowLeft} size="1x" /> {selectedEpisode?.episode_name}
        </button>
      </div>
      {/* PiP button */}
      <div className="absolute top-0 right-0 p-4 z-50">
        <button className="text-white" onClick={handlePiP}>
          <img src={floatingScreen} alt="PiP" className="h-5 w-5" />
        </button>
      </div>

      {/* Video element wrapper */}
      <div className="relative w-full" style={{ paddingTop: `${videoRatio * 100}%` }}>
        {/* Video element */}
        <div ref={videoElementRef} className="absolute top-0 left-0 w-full h-full"></div>
      </div>
    </div>
  );
};

export default VideoPlayer;
