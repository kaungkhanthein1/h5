import React, { useEffect, useRef, useState } from 'react';
import Artplayer from 'artplayer';
// import 'artplayer/dist/artplayer.css'; // Import Artplayer styles
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
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  onBack,
  movieDetail,
  selectedEpisode,
  resumeTime,
}) => {
  const playerRef = useRef<any>(null);
  const videoElementRef = useRef<HTMLDivElement>(null);

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
        const art = new Artplayer({
          container: videoElementRef.current,
          url: videoUrl,
          autoSize: true,
          autoplay: true,
          playbackRate: true,
          setting: true,
          fullscreen: true,
          fullscreenWeb: true,
          pip: true,
        //   controls: [
        //     'play',
        //     'progress',
        //     'volume',
        //     'currentTime',
        //     'fullscreen',
        //   ],
          moreVideoAttr: {
            playsInline: true,
          },
        });

        // Initialize Hls.js for HLS streams
        if (Hls.isSupported() && videoUrl.includes('.m3u8')) {
          const hls = new Hls();
          hls.loadSource(videoUrl);
          hls.attachMedia(art.video);
        } else if (art.video.canPlayType('application/vnd.apple.mpegurl')) {
          // For Safari and iOS where Hls.js is not needed
          art.video.src = videoUrl;
        }

        // If resume time is available, set it
        art.once('ready', () => {
          if (resumeTime > 0) {
            console.log('Setting resume time:', resumeTime);
            art.currentTime = resumeTime;
          }
        });

        // Extra check: Force seeking after the video starts playing
        art.on('play', () => {
          if (resumeTime > 0 && art.currentTime === 0) {
            console.log('Forcing seek to resume time:', resumeTime);
            art.currentTime = resumeTime; // Try setting current time after play
          }
        });

        // Set isPlaying state
        art.on('play', () => setIsPlaying(true));
        art.on('pause', () => setIsPlaying(false));

        // Cleanup the player when the component unmounts
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
      // Send a final report before navigating back
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
    <div className='relative w-full h-max'>
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
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        {/* Video element */}
        <div ref={videoElementRef} className="absolute top-0 left-0 w-full h-full"></div>
      </div>
    </div>
  );
};

export default VideoPlayer;