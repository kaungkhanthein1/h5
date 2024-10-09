import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
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

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  onBack,
  movieDetail,
  selectedEpisode,
}) => {
  const playerRef = useRef<any>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Function to initialize the player
    const initializePlayer = () => {
      if (videoElementRef.current && videoUrl) {
        // Dispose previous instance if it exists
        if (playerRef.current) {
          playerRef.current.dispose();
        }

        const player = videojs(videoElementRef.current, {
          controls: true,
          autoplay: true,
          preload: 'auto',
          iosNativeFullscreen: false, // Disable native fullscreen on iOS
          playsinline: true,
          fluid: true,
          controlBar: {
            volumePanel: false, // Hide volume control
            fullscreenToggle: true, // Show fullscreen button
            remainingTimeDisplay: true,
            progressControl: true, // Show progress bar
            currentTimeDisplay: true,
            timeDivider: true,
            durationDisplay: true,
            captionsButton: false, // Disable captions button
            pictureInPictureToggle: false, // Disable PiP toggle
          },
        });

        // Store the player instance for later use
        playerRef.current = player;

        // Set video source
        player.src({
          src: videoUrl,
          type: 'application/x-mpegURL', // HLS for iOS
        });

        // Mark video as ready
        player.on('ready', () => {
          setIsReady(true);
        });

        // Update play state on play/pause
        player.on('play', () => {
          setIsPlaying(true);
        });

        player.on('pause', () => {
          setIsPlaying(false);
        });
      }
    };

    // Initialize the player when videoUrl changes
    initializePlayer();

    // Cleanup when component is unmounted or video URL changes
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null; // Ensure reference is removed
      }
    };
  }, [videoUrl]);

  const handleBack = () => {
    if (playerRef.current) {
      playerRef.current.pause(); // Pause the video when going back
    }
    onBack(); // Trigger the back function
  };

  const handlePiP = () => {
    if (videoElementRef.current) {
      if (document.pictureInPictureEnabled) {
        videoElementRef.current.requestPictureInPicture().catch((error) => {
          console.error('Failed to enter PiP mode:', error);
        });
      }
    }
  };

  const handlePlayPause = () => {
    if (playerRef.current) {
      if (playerRef.current.paused()) {
        playerRef.current.play();
      } else {
        playerRef.current.pause();
      }
    }
  };

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

      {/* Video.js player */}
      <div data-vjs-player>
        <video
          ref={videoElementRef}
          className="video-js"
          playsInline
        ></video>
      </div>
    </div>
  );
};

export default VideoPlayer;
