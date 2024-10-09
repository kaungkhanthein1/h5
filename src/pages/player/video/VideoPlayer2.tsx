import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import screenfull from 'screenfull';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faExpand, faSpinner, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import floatingScreen from '../../../assets/floatingScreen.png';

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
  play_from: {
    name: string;
    code: string;
    list: Episode[];
    total: number | null;
    tips: string;
  }[];
}

interface VideoPlayerProps {
  videoUrl: string;
  onBack: () => void;
  movieDetail: MovieDetail;
  selectedEpisode?: Episode | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onBack, movieDetail, selectedEpisode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const STORAGE_KEY = 'watchHistory';
  const STORAGE_KEY_V2 = 'lastWatchHistory'; 

  // Helper function to format time (e.g., 1:05)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Save the movie progress when back button or episode change happens
  const saveProgress = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;      
      const savedHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

      if (!savedHistory[movieDetail.name]) {
        savedHistory[movieDetail.name] = {};
      }

      savedHistory[movieDetail.name][`episode_${selectedEpisode?.episode_id}`] = {
        progressTime: currentTime,
      };

      savedHistory[movieDetail.name]['movieDetail'] = {
        movieDetail: movieDetail
      };

      console.log('Saving progress:', currentTime);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedHistory));

      console.log('ideoRef.current =>', videoRef.current);
      const lastWatchHistoryList = JSON.parse(localStorage.getItem(STORAGE_KEY_V2) || '{}');

      if (!lastWatchHistoryList[movieDetail.name]) {
        lastWatchHistoryList[movieDetail.name] = {};
      }

      const latestWatchHistory = {
        playedTime: new Date(),
        progressTime: currentTime,
        movieId: (movieDetail as any)['id'],
        duration: videoRef.current?.duration,
        image: (movieDetail as any).cover,
        ...selectedEpisode
      }
      lastWatchHistoryList[movieDetail.name] = latestWatchHistory;
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(lastWatchHistoryList));
    }
  };

  // Load saved progress if available
  const loadProgress = () => {
    setIsBuffering(true);
    const savedHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (savedHistory[movieDetail.name] && savedHistory[movieDetail.name][`episode_${selectedEpisode?.episode_id}`]) {
      const savedTime = savedHistory[movieDetail.name][`episode_${selectedEpisode?.episode_id}`].progressTime;
      if (videoRef.current && savedTime) {
        console.log('Resuming from:', savedTime);
        videoRef.current.currentTime = savedTime || 0;
      }
    }
  };

  // Set up HLS for .m3u8 files and handle auto play with progress loading
  useEffect(() => {
    const initHls = () => {
      setIsBuffering(true);
      if (Hls.isSupported()) {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }

        const hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(videoRef.current as HTMLMediaElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setDuration(formatTime(videoRef.current?.duration || 0));
          loadProgress();
          setIsBuffering(false);
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', data);
          setIsBuffering(false);
        });

        hlsRef.current = hls;
      } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = videoUrl;
        videoRef.current.addEventListener('loadedmetadata', () => {
          setDuration(formatTime(videoRef.current?.duration || 0));
          loadProgress();
        });
      }
    };

    if (videoUrl && videoRef.current) {
      initHls();
    }

    const videoElement = videoRef.current;
    if (videoElement) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);

      return () => {
        saveProgress();
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
      };
    }
  }, [videoUrl, selectedEpisode]);

  // Handle hiding controls after 3 seconds of inactivity
  const hideControls = () => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);
  };

  // Handle showing controls on interaction
  const showControls = () => {
    setControlsVisible(true);
    hideControls();
  };

  // Save progress on back button click
  const handleBack = () => {
    saveProgress();
    onBack();
  };

  // Toggle play/pause state
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        setIsBuffering(true);
        videoRef.current.play().then(() => {
          setIsBuffering(false);
        }).catch((error) => {
          console.error('Video play failed:', error);
          setIsBuffering(false);
        });
      } else {
        videoRef.current.pause();
        saveProgress();
      }
    }
  };

  // Seek video using custom progress bar
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = (Number(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
    }
  };

  // Fullscreen functionality
  const handleFullscreenToggle = () => {
    if (videoRef.current) {
      // For iOS devices, request fullscreen directly on the video element
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        (videoRef.current as any).webkitEnterFullscreen?.();
      } else if (screenfull.isEnabled) {
        screenfull.toggle(videoRef.current).catch((err) => {
          console.error('Fullscreen error:', err);
        });
      }
    }
  };

  return (
    <div
      className="relative bg-black h-full w-full"
      onMouseMove={showControls}
      onTouchStart={showControls}
    >
      {/* The video player */}
      <video
        ref={videoRef}
        width="100%"
        height="auto"
        controls={false}
        // muted // Muted to bypass auto-play restrictions
        playsInline // Ensure inline playback on iPhone to avoid default controls
        onTimeUpdate={() => {
          if (videoRef.current) {
            const currentTime = videoRef.current.currentTime;
            const duration = videoRef.current.duration;
            setProgress((currentTime / duration) * 100);
            setCurrentTime(formatTime(currentTime));
          }
        }}
        onLoadedMetadata={() => setDuration(formatTime(videoRef.current?.duration || 0))}
        style={{ objectFit: 'contain', minHeight: '40vh' }}
        autoPlay
      >
        Your browser does not support the video tag.
      </video>

      {/* Back button */}
      <div className={`absolute top-0 left-0 p-4 z-10`}>
        <button onClick={handleBack} className="text-white">
          <FontAwesomeIcon icon={faArrowLeft} size="1x" />
        </button>
      </div>

      {/* Buffering Icon */}
      {isBuffering && (
        <div className="absolute inset-0 flex justify-center items-center">
          <FontAwesomeIcon icon={faSpinner} size="1x" spin className="text-playerNavigator" />
        </div>
      )}

      {/* Custom Play/Pause Button */}
      {controlsVisible && (
        <div className="absolute inset-0 flex justify-center items-center">
          <button onClick={handlePlayPause} className="text-white/60 text-3xl">
            {!isBuffering && (
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size="lg" />
            )}
          </button>
        </div>
      )}

      {/* Custom Progress Bar and Fullscreen button */}
      {controlsVisible && (
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex justify-between items-center text-white mb-2">
            <span>{currentTime}</span>
            <span>{duration}</span>
          </div>
          <div className="flex items-center">
            <input
              type="range"
              className="w-full h-2 bg-gray-600 cursor-pointer"
              value={progress}
              onChange={handleProgressChange}
              style={{
                background: `linear-gradient(to right, #FFA500 ${progress}%, gray 0%)`
              }}
            />
            {/* Fullscreen button */}
            <button onClick={handleFullscreenToggle} className="ml-2 text-white">
              <FontAwesomeIcon icon={faExpand} size="lg" />
            </button>
          </div>
        </div>
      )}

      {/* Picture-in-Picture button */}
      <div className="absolute top-0 right-0 p-4 z-10">
        <button className="text-white" onClick={() => {
          if (videoRef.current) {
            if (document.pictureInPictureEnabled && videoRef.current.requestPictureInPicture) {
              videoRef.current.requestPictureInPicture().catch((error) => {
                console.error('PiP request failed:', error);
              });
            } else {
              console.error('Picture-in-Picture is not supported on this device.');
            }
          }
        }}>
          <img src={floatingScreen} alt="PiP" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;