import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import floatingScreen from '../../../assets/floatingScreen.png'; // Replace with your image path

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

  useEffect(() => {
    if (videoElementRef.current) {
      const player = videojs(videoElementRef.current, {
        controls: true,
        autoplay: true,
        preload: 'auto',
        // Disable native fullscreen for iOS to prevent conflicts
        iosNativeFullscreen: false,
        playsinline: true,
        fluid: true,
        responsive: false,
        controlBar: {
          // Hide play/pause and volume controls
          playToggle: true,
          volumePanel: false,
          fullscreenToggle: true, // Keep the fullscreen toggle
          remainingTimeDisplay: true,
          progressControl: true, // Keep the progress bar
          currentTimeDisplay: true,
          timeDivider: true,
          durationDisplay: true,
          captionsButton: false,
          pictureInPictureToggle: false
        },
      });

      playerRef.current = player;

      // Event listener for when the video is ready
      player.on('ready', () => {
        setIsReady(true);
        console.log('Video.js is ready');
      });

      player.src({
        src: videoUrl,
        type: 'application/x-mpegURL', // Use HLS for iOS devices
      });

      return () => {
        if (playerRef.current) {
          playerRef.current.dispose();
        }
      };
    }
  }, [videoUrl]);

  // Handle back button click
  const handleBack = () => {
    if (playerRef.current) {
      playerRef.current.pause();
    }
    onBack();
  };

  // Handle Picture-in-Picture (floating video)
  const handlePiP = () => {
    if (videoElementRef.current) {
      if (document.pictureInPictureEnabled) {
        videoElementRef.current.requestPictureInPicture().catch((error) => {
          console.error('Failed to enter PiP mode:', error);
        });
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
          className="video-js vjs-big-play-centered"
          playsInline
        ></video>
      </div>
    </div>
  );
};

export default VideoPlayer;
