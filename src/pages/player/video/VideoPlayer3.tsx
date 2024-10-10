import React, { useEffect, useRef, useState } from 'react';
import Artplayer from 'artplayer';
import Hls from 'hls.js'; // Import Hls.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
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
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Function to initialize the player
    const initializePlayer = () => {
      if (playerContainerRef.current && videoUrl) {
        // Dispose of the previous player instance
        if (playerRef.current) {
          playerRef.current.destroy(true);
        }

        const player = new Artplayer({
          container: playerContainerRef.current,
          url: videoUrl,
          autoplay: true,
          volume: 0.5,
          pip: true, // Enable Picture-in-Picture
          setting: true, // Enable the settings button
          playbackRate: true, // Enable playback speed control
          autoSize: true,
          aspectRatio: true,
          mutex: true,
          fullscreenWeb: true, // Enable fullscreen mode for the web
          playsInline: true, // Enable inline video playback on mobile
          customType: {
            m3u8: function (video: HTMLVideoElement, url: string) {
              // Hls.js is used to handle m3u8 streams
              if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(url);
                hls.attachMedia(video);
              } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
              }
            },
          },
        });

        // Handle play/pause
        player.on('play', () => setIsPlaying(true));
        player.on('pause', () => setIsPlaying(false));

        playerRef.current = player;
      }
    };

    // Initialize the player when videoUrl changes
    initializePlayer();

    // Cleanup when component is unmounted or video URL changes
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy(true);
        playerRef.current = null;
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
    if (playerRef.current) {
      playerRef.current.pip = true; // Trigger Picture-in-Picture mode
    }
  };

  return (
    <div className='w-full h-max'>
      <div className="absolute top-0 left-0 p-4 z-50">
        <button onClick={handleBack} className="text-white">
          <FontAwesomeIcon icon={faArrowLeft} size="1x" />
        </button>
      </div>
      <div className="absolute top-0 right-0 p-4 z-50">
        <button className="text-white" onClick={handlePiP}>
          <img src={floatingScreen} alt="PiP" className="h-5 w-5" />
        </button>
      </div>

      {/* ArtPlayer container */}
      <div ref={playerContainerRef} className="artplayer-container"></div>
    </div>
  );
};

export default VideoPlayer;