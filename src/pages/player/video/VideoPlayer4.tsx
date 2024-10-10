import React, { useEffect, useRef, useState } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css'; // Import Plyr styles
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
  }
}

interface VideoPlayerProps {
  videoUrl: string;
  onBack: () => void;
  movieDetail: MovieDetail;
  selectedEpisode?: Episode | null;
  resumeTime: number,
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  onBack,
  movieDetail,
  selectedEpisode,
  resumeTime
}) => {
  const playerRef = useRef<any>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);

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
        // Initialize Hls.js for HLS streams
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(videoUrl);
          hls.attachMedia(videoElementRef.current);
        } else if (videoElementRef.current.canPlayType('application/vnd.apple.mpegurl')) {
          // For Safari and iOS where Hls.js is not needed
          videoElementRef.current.src = videoUrl;
        }

        // Initialize Plyr
        const player = new Plyr(videoElementRef.current, {
          controls: ['play', 'progress', 'current-time', 'fullscreen'], // Removed 'volume' control
          autoplay: true,
          clickToPlay: true,
          fullscreen: {
            iosNative: true, // Use native fullscreen on iOS Safari
          },
        });

        player.on('play', () => setIsPlaying(true));
        player.on('pause', () => setIsPlaying(false));

        // If resume time is available, set it
        console.log('resume time is=>', resumeTime, player.currentTime);
        player.once('ready', () => {
          if (resumeTime > 0) {
            console.log('Setting resume time:', resumeTime);
            player.currentTime = resumeTime;
          }
        });
  
        // Extra check: Force seeking after the video starts playing
        player.on('play', () => {
          if (resumeTime > 0 && player.currentTime === 0) {
            console.log('Forcing seek to resume time:', resumeTime);
            player.currentTime = resumeTime; // Try setting current time after play
          }
        });

        // Cleanup the player when the component unmounts
        playerRef.current = player;
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
    console.log('hello', playerRef.current);
    if (playerRef.current) {
      // Send a final report before navigating back
      reportProgress(playerRef.current.currentTime, playerRef.current.duration);
      playerRef.current.pause();
    }
    onBack();
  };

  const handlePiP = () => {
    if (document.pictureInPictureEnabled && videoElementRef.current) {
      if (videoElementRef.current !== document.pictureInPictureElement) {
        videoElementRef.current.requestPictureInPicture();
      } else {
        document.exitPictureInPicture();
      }
    }
  };

  return (
    <div className='relative w-full h-max'>
      {/* Back button */}
      <div className="absolute top-0 left-0 p-4 z-50">
        <button onClick={handleBack} className="text-white">
          <FontAwesomeIcon icon={faArrowLeft} size="1x" />
        </button>
      </div>
      {/* PiP button */}
      <div className="absolute top-0 right-0 p-4 z-50">
        <button className="text-white" onClick={handlePiP}>
          <img src={floatingScreen} alt="PiP" className="h-5 w-5" />
        </button>
      </div>

      {/* Video element */}
      <video
        ref={videoElementRef}
        className="plyr__video-embed w-full h-full"
        playsInline
        controls
      ></video>
    </div>
  );
};

export default VideoPlayer;
