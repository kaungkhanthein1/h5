// VideoPlayer.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Player, ControlBar, BigPlayButton, ProgressControl, FullscreenToggle, CurrentTimeDisplay, DurationDisplay } from 'video-react';
import 'video-react/dist/video-react.css';
import Hls from 'hls.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faExpand } from '@fortawesome/free-solid-svg-icons';
import floatingScreen from '../../../assets/floatingScreen.png';

// [Interfaces Episode and MovieDetail remain the same]

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

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  onBack,
  movieDetail,
  selectedEpisode,
}) => {
  const playerRef = useRef<Player>(null);
  const [isReady, setIsReady] = useState(false);
  const hlsRef = useRef<Hls | null>(null);

  const STORAGE_KEY = 'watchHistory';
  const STORAGE_KEY_V2 = 'lastWatchHistory';

  // Save the movie progress
  const saveProgress = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getState().player.currentTime;
      const savedHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

      if (!savedHistory[movieDetail.name]) {
        savedHistory[movieDetail.name] = {};
      }

      savedHistory[movieDetail.name][`episode_${selectedEpisode?.episode_id}`] = {
        progressTime: currentTime,
      };

      savedHistory[movieDetail.name]['movieDetail'] = {
        movieDetail: movieDetail,
      };

      console.log('Saving progress:', currentTime);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedHistory));

      const lastWatchHistoryList = JSON.parse(
        localStorage.getItem(STORAGE_KEY_V2) || '{}'
      );

      if (!lastWatchHistoryList[movieDetail.name]) {
        lastWatchHistoryList[movieDetail.name] = {};
      }

      const latestWatchHistory = {
        playedTime: new Date(),
        progressTime: currentTime,
        movieId: (movieDetail as any)['id'],
        duration: playerRef.current.getState().player.duration,
        image: (movieDetail as any).cover,
        ...selectedEpisode,
      };
      lastWatchHistoryList[movieDetail.name] = latestWatchHistory;
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(lastWatchHistoryList));
    }
  };

  // Load saved progress if available
  const loadProgress = () => {
    const savedHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (
      savedHistory[movieDetail.name] &&
      savedHistory[movieDetail.name][`episode_${selectedEpisode?.episode_id}`]
    ) {
      const savedTime =
        savedHistory[movieDetail.name][`episode_${selectedEpisode?.episode_id}`]
          .progressTime;
      if (playerRef.current && savedTime) {
        console.log('Resuming from:', savedTime);
        playerRef.current.seek(savedTime || 0);
      }
    }
  };

  // Handle back button click
  const handleBack = () => {
    saveProgress();
    onBack();
  };

  // Handle Picture-in-Picture
  const handlePiP = () => {
    if (playerRef.current) {
      const videoElement = playerRef.current.video.video;
      if (
        document.pictureInPictureEnabled &&
        videoElement.requestPictureInPicture
      ) {
        videoElement.requestPictureInPicture().catch((error: any) => {
          console.error('PiP request failed:', error);
        });
      } else {
        console.error('Picture-in-Picture is not supported on this device.');
      }
    }
  };

  // Handle fullscreen
  const handleFullscreenToggle = () => {
    if (playerRef.current) {
      playerRef.current.toggleFullscreen();
    }
  };

  useEffect(() => {
    const videoElement = playerRef.current?.video?.video;

    if (videoElement) {
      if (Hls.isSupported()) {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }

        const hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoElement.play();
          setIsReady(true);
        });

        hlsRef.current = hls;
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = videoUrl;
        videoElement.addEventListener('loadedmetadata', () => {
          videoElement.play();
          setIsReady(true);
        });
      } else {
        console.error('This browser does not support HLS.');
      }
    }

    // Save progress on unmount
    return () => {
      saveProgress();
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUrl]);

  useEffect(() => {
    // Load progress when player is ready
    if (isReady) {
      loadProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  return (
    <div className="relative bg-black h-full w-full">
      {/* Back button */}
      <div className="absolute top-0 left-0 p-4 z-10">
        <button onClick={handleBack} className="text-white">
          <FontAwesomeIcon icon={faArrowLeft} size="1x" />
        </button>
      </div>

      {/* Picture-in-Picture button */}
      <div className="absolute top-0 right-0 p-4 z-10">
        <button className="text-white" onClick={handlePiP}>
          <img src={floatingScreen} alt="PiP" className="h-5 w-5" />
        </button>
      </div>

      {/* The video player */}
      <Player ref={playerRef} autoPlay playsInline>
        <BigPlayButton position="center" />
        <ControlBar autoHide={true} disableDefaultControls={true}>
          <CurrentTimeDisplay />
          <ProgressControl />
          <DurationDisplay />
          <FullscreenToggle />
        </ControlBar>
      </Player>
    </div>
  );
};

export default VideoPlayer;
