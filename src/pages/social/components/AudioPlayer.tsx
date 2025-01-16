import React, { useEffect, useRef, useState } from "react";

const AudioPlayer = ({
  src,
  index,
  setActivePlayer,
  activePlayer,
}: {
  src: string;
  index: number;
  setActivePlayer: (index: number) => void;
  activePlayer: number;
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Extract title from the URL
  const title = React.useMemo(() => {
    const filename = src?.split("/").pop();
    return filename?.split("_")[0] || "Audio Title";
  }, [src]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        setActivePlayer(index); // Set the active player index
      }
    }
  };

  const handleSpeedChange = () => {
    if (audioRef.current) {
      const newRate = playbackRate === 2 ? 1 : 2;
      audioRef.current.playbackRate = newRate;
      setPlaybackRate(newRate);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progressValue =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progressValue);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // useEffect(() => {
  //   if (activePlayer !== index && audioRef.current) {
  //     // Pause the audio if it's not the active player
  //     audioRef.current.pause();
  //     setIsPlaying(false);
  //   }
  // }, [activePlayer, index]);

  useEffect(() => {
    // IntersectionObserver to detect when the player is in the center of the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            // Pause the audio if this player is no longer in view
            if (audioRef.current) {
              audioRef.current.pause();
              setIsPlaying(false);
            }
          }
          // if (entry.isIntersecting && entry.intersectionRatio >= 0.75) {
          //   setActivePlayer(index); // Set this player as the active player
          // }
        });
      },
      {
        root: null, // Default to the viewport
        threshold: 0.75, // 75% visibility
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [index, setActivePlayer]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  return (
    <div ref={containerRef} className="px-4">
      <div className="bg-audio text-white rounded-lg px-3 py-2 shadow-lg space-y-2 w-full max-w-md mx-auto">
        {/* Audio Player */}
        <div className="flex items-center space-x-4">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 flex items-center justify-center bg-[#4c4c4e] rounded-full focus:outline-none min-w-10"
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            )}
          </button>
          <div className="flex flex-col flex-1 w-full">
            <div className="text-sm font-medium truncate w-full -mr-5">
              {title}
            </div>
            {/* Progress Bar */}
            <div>
              <input
                type="range"
                className="progress-bar1"
                value={progress}
                onChange={(e) => {
                  if (audioRef.current) {
                    const newTime =
                      (Number(e.target.value) / 100) *
                      audioRef.current.duration;
                    audioRef.current.currentTime = newTime;
                    setProgress(Number(e.target.value));
                  }
                }}
                style={{
                  background: `linear-gradient(to right, #f97316 0%, #f97316 ${progress}%, #4c4c4e ${progress}%, #4c4c4e 100%)`,
                }}
              />
            </div>
            {/* Bottom Section */}
            <div className="flex items-center mt-1 justify-between text-xs text-gray-400">
              {/* Time */}
              <div>
                {formatTime(
                  (audioRef.current && audioRef.current.currentTime) || 0
                )}{" "}
                / {formatTime(duration)}
              </div>

              {/* Playback Speed Button */}
              <button
                onClick={handleSpeedChange}
                className="bg-[#4c4c4e] text-white px-3 py-[2px] rounded-md"
              >
                {playbackRate}x
              </button>
            </div>
          </div>
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;

// import React, { useEffect, useRef, useState } from "react";

// const AudioPlayer = ({
//   src,
//   index,
//   setActivePlayer,
//   activePlayer,
// }: {
//   src: string;
//   index: number;
//   setActivePlayer: (index: number) => void;
//   activePlayer: number;
// }) => {
//   const audioRef = useRef<HTMLAudioElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [playbackRate, setPlaybackRate] = useState(1);

//   // Extract title from the URL
//   const title = React.useMemo(() => {
//     const filename = src.split("/").pop();
//     return filename?.split("_")[0] || "Audio Title";
//   }, [src]);

//   const togglePlay = () => {
//     if (audioRef.current) {
//       if (isPlaying) {
//         audioRef.current.pause();
//         setIsPlaying(false);
//       } else {
//         audioRef.current.play();
//         setIsPlaying(true);
//         setActivePlayer(index); // Set the active player index
//       }
//     }
//   };

//   const handleSpeedChange = () => {
//     if (audioRef.current) {
//       const newRate = playbackRate === 2 ? 1 : 2;
//       audioRef.current.playbackRate = newRate;
//       setPlaybackRate(newRate);
//     }
//   };

//   const handleTimeUpdate = () => {
//     if (audioRef.current) {
//       const progressValue =
//         (audioRef.current.currentTime / audioRef.current.duration) * 100;
//       setProgress(progressValue);
//     }
//   };

//   const handleLoadedMetadata = () => {
//     if (audioRef.current) {
//       setDuration(audioRef.current.duration);
//     }
//   };

//   useEffect(() => {
//     if (activePlayer === index && audioRef.current && !isPlaying) {
//       // Autoplay when the player becomes active
//       audioRef.current
//         .play()
//         .then(() => setIsPlaying(true))
//         .catch((err) => console.log("Autoplay failed:", err));
//     } else if (activePlayer !== index && audioRef.current) {
//       // Pause the audio if it's not the active player
//       audioRef.current.pause();
//       setIsPlaying(false);
//     }
//   }, [activePlayer, index]);

//   useEffect(() => {
//     // IntersectionObserver to detect when the player is in the center of the viewport
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting && entry.intersectionRatio >= 0.75) {
//             setActivePlayer(index); // Set this player as the active player
//           }
//         });
//       },
//       {
//         root: null, // Default to the viewport
//         threshold: 0.75, // 75% visibility
//       }
//     );

//     if (containerRef.current) {
//       observer.observe(containerRef.current);
//     }

//     return () => {
//       if (containerRef.current) {
//         observer.unobserve(containerRef.current);
//       }
//     };
//   }, [index, setActivePlayer]);

//   const formatTime = (time: number) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
//   };

//   return (
//     <div ref={containerRef} className="px-4">
//       <div className="bg-audio text-white rounded-lg px-3 py-2 shadow-lg space-y-2 w-full max-w-md mx-auto">
//         {/* Audio Player */}
//         <div className="flex items-center space-x-4">
//           {/* Play/Pause Button */}
//           <button
//             onClick={togglePlay}
//             className="w-10 h-10 flex items-center justify-center bg-[#4c4c4e] rounded-full focus:outline-none"
//           >
//             {isPlaying ? (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="white"
//                 viewBox="0 0 24 24"
//                 width="24"
//                 height="24"
//               >
//                 <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
//               </svg>
//             ) : (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="white"
//                 viewBox="0 0 24 24"
//                 width="24"
//                 height="24"
//               >
//                 <path d="M8 5v14l11-7L8 5z" />
//               </svg>
//             )}
//           </button>
//           <div className="flex flex-col flex-1">
//             <div className="text-sm font-medium truncate">{title}</div>
//             {/* Progress Bar */}
//             <div className="w-full">
//               <input
//                 type="range"
//                 className="progress-bar1"
//                 value={progress}
//                 onChange={(e) => {
//                   if (audioRef.current) {
//                     const newTime =
//                       (Number(e.target.value) / 100) *
//                       audioRef.current.duration;
//                     audioRef.current.currentTime = newTime;
//                     setProgress(Number(e.target.value));
//                   }
//                 }}
//                 style={{
//                   background: `linear-gradient(to right, #f97316 0%, #f97316 ${progress}%, #4c4c4e ${progress}%, #4c4c4e 100%)`,
//                 }}
//               />
//             </div>
//             {/* Bottom Section */}
//             <div className="flex items-center mt-1 justify-between text-xs text-gray-400">
//               {/* Time */}
//               <div>
//                 {formatTime(
//                   (audioRef.current && audioRef.current.currentTime) || 0
//                 )}{" "}
//                 / {formatTime(duration)}
//               </div>

//               {/* Playback Speed Button */}
//               <button
//                 onClick={handleSpeedChange}
//                 className="bg-[#4c4c4e] text-white px-3 py-[2px] rounded-md"
//               >
//                 {playbackRate}x
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Hidden Audio Element */}
//         <audio
//           ref={audioRef}
//           src={src}
//           onTimeUpdate={handleTimeUpdate}
//           onLoadedMetadata={handleLoadedMetadata}
//         />
//       </div>
//     </div>
//   );
// };

// export default AudioPlayer;
