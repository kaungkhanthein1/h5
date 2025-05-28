// import React, { useEffect, useRef, useState } from "react";
// import Artplayer from "artplayer";
// import lozad from "lozad";

// const Player = ({ src, thumbnail }: { src: any; thumbnail: any }) => {
//   const playerContainerRef = useRef<HTMLDivElement>(null);
//   const artPlayerInstanceRef = useRef<Artplayer | null>(null);
//   const [showPauseButton, setShowPauseButton] = useState(false);
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to store timeout ID

//   useEffect(() => {
//     if (playerContainerRef.current) {
//       const observer = lozad(playerContainerRef.current, {
//         rootMargin: "200px 0px",
//         threshold: 0.1,
//         loaded: function (el) {
//           Artplayer.MOBILE_DBCLICK_PLAY = false;
//           Artplayer.MOBILE_CLICK_PLAY = false;

//           if (!artPlayerInstanceRef.current) {
//             artPlayerInstanceRef.current = new Artplayer({
//               container: el as HTMLDivElement,
//               url: src,
//               poster: thumbnail,
//               volume: 0.5,
//               muted: false,
//               autoplay: false,
//               aspectRatio: true,
//               miniProgressBar: true,
//               fastForward: true,
//               fullscreen: true,
//               theme: "#00a1d6",
//             });
//             //   artPlayerInstanceRef.current.on('control', (state) => {
//             //     if(state && artPlayerInstanceRef.current?.playing) {
//             //       setShowPauseButton(true);
//             //     } else {
//             //       setShowPauseButton(false);
//             //     }
//             // });
//           }
//         },
//       });

//       // Start observing
//       observer.observe();
//       const handleIntersection = (entries: IntersectionObserverEntry[]) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
//             // If the video is in the center of the viewport, play it
//             artPlayerInstanceRef.current?.play();
//           } else {
//             // Pause the video if it's not in the center
//             artPlayerInstanceRef.current?.pause();
//           }
//         });
//       };
//       const intersectionObserver = new IntersectionObserver(
//         handleIntersection,
//         {
//           root: null, // Default is the viewport
//           rootMargin: "0px",
//           threshold: [0.5], // Trigger when 50% of the element is visible
//         }
//       );

//       intersectionObserver.observe(playerContainerRef.current);

//       // const handleIntersection = (entries: IntersectionObserverEntry[]) => {
//       //   entries.forEach((entry) => {
//       //     if (entry.isIntersecting) {
//       //       // if (artPlayerInstanceRef.current) {
//       //       //   artPlayerInstanceRef.current.play();
//       //       // }
//       //     } else {
//       //       if (artPlayerInstanceRef.current) {
//       //         artPlayerInstanceRef.current.pause();
//       //       }
//       //     }
//       //   });
//       // };

//       // const intersectionObserver = new IntersectionObserver(
//       //   handleIntersection,
//       //   {
//       //     rootMargin: "200px 0px",
//       //     threshold: 0.1,
//       //   }
//       // );

//       // intersectionObserver.observe(playerContainerRef.current);

//       return () => {
//         if (artPlayerInstanceRef.current) {
//           artPlayerInstanceRef.current.destroy();
//           artPlayerInstanceRef.current = null;
//         }
//         intersectionObserver.disconnect(); // Stop observing the element when component unmounts
//       };
//     }
//   }, [src, thumbnail]);

//   const pausePlayer = () => {
//     setShowPauseButton(false);
//     if (artPlayerInstanceRef.current) {
//       artPlayerInstanceRef.current.pause();
//     }
//   };

//   return (
//     <div className="social-player">
//       <div
//         ref={playerContainerRef}
//         className="relative artplayer-app w-full h-[250px] md:h-[350px] lg:h-[400px] xl:h-[400px]"
//       ></div>
//     </div>
//   );
// };

// export default Player;

// {
//   /* {showPauseButton && (
//         <svg
//           onClick={pausePlayer}
//           className="pause-btn"
//           xmlns="http://www.w3.org/2000/svg"
//           width="73"
//           height="73"
//           viewBox="0 0 53 53"
//           fill="none"
//         >
//           <path
//             opacity="0.2"
//             d="M47.7918 26.7086C47.7918 38.6446 38.0669 48.3648 26.1252 48.3648C14.1834 48.3648 4.4585 38.6446 4.4585 26.7086C4.4585 14.7517 14.1834 5.03146 26.1252 5.03146C38.0669 5.03146 47.7918 14.7517 47.7918 26.7086Z"
//             fill="black"
//           />
//           <path
//             d="M20.125 21C20.125 20.4477 20.5727 20 21.125 20H23.125C23.6773 20 24.125 20.4477 24.125 21V33C24.125 33.5523 23.6773 34 23.125 34H21.125C20.5727 34 20.125 33.5523 20.125 33V21ZM28.125 21C28.125 20.4477 28.5727 20 29.125 20H31.125C31.6773 20 32.125 20.4477 32.125 21V33C32.125 33.5523 31.6773 34 31.125 34H29.125C28.5727 34 28.125 33.5523 28.125 33V21Z"
//             fill="white"
//           />
//         </svg>
//       )} */
// }

// import React, { useEffect, useRef, useState } from "react";
// import Artplayer from "artplayer";
// import lozad from "lozad";
// import Loader from "../../../pages/search/components/Loader";

// const Player = ({
//   src,
//   thumbnail,
//   status,
//   isCenterPlay,
// }: {
//   src: any;
//   thumbnail: any;
//   status: any;
//   isCenterPlay: boolean;
// }) => {
//   const playerContainerRef = useRef<HTMLDivElement>(null);
//   const artPlayerInstanceRef = useRef<Artplayer | null>(null);
//   const [loading, setLoading] = useState(false); // Track fake loading state

//   const [isPlaying, setIsPlaying] = useState(false); // Track if the current player is playing
//   const [error, setError] = useState(false); // Track if there's a loading error

//   const activePlayerRef = useRef<HTMLDivElement | null>(null); // Track the currently active player
//   const { autoMode } = JSON.parse(
//     localStorage.getItem("movieAppSettings") || "{}"
//   );

//   useEffect(() => {
//     if (playerContainerRef.current) {
//       // Lozad lazy-load observer
//       let observer = lozad(playerContainerRef.current, {
//         rootMargin: "200px 0px",
//         threshold: 0.1,
//         loaded: function (el) {
//           Artplayer.MOBILE_DBCLICK_PLAY = false;
//           Artplayer.MOBILE_CLICK_PLAY = false;

//           if (!artPlayerInstanceRef.current) {
//             artPlayerInstanceRef.current = new Artplayer({
//               container: el as HTMLDivElement,
//               url: src,
//               poster: thumbnail,
//               volume: 0.5,
//               muted: false,
//               autoplay: false, // Autoplay is off, as we control it manually
//               aspectRatio: true,
//               miniProgressBar: true,
//               fastForward: true,
//               fullscreen: true,
//               theme: "#00a1d6",
//             });
//             artPlayerInstanceRef.current.on("error", () => {
//               // Set error state when video fails to load
//               setError(true);
//             });
//             setError(false); // Clear error state when player initializes
//           }
//         },
//       });

//       observer.observe();

//       // IntersectionObserver to handle auto-play/pause based on visibility
//       const handleIntersection = (entries: IntersectionObserverEntry[]) => {
//         entries.forEach((entry) => {
//           const isCenterVisible = entry.intersectionRatio >= 1; // Center visibility threshold (75%)
//           const videoContainer = entry.target as HTMLDivElement;

//           if (isCenterVisible) {
//             if (activePlayerRef.current !== videoContainer) {
//               // Pause the currently active video
//               if (artPlayerInstanceRef.current && activePlayerRef.current) {
//                 artPlayerInstanceRef.current.pause();
//                 setIsPlaying(false);
//               }

//               // Play the new center video
//               activePlayerRef.current = videoContainer;
//               if (
//                 artPlayerInstanceRef.current &&
//                 isCenterPlay &&
//                 artPlayerInstanceRef?.current?.loaded
//               ) {
//                 if (autoMode) {
//                   artPlayerInstanceRef.current.play();
//                   setIsPlaying(true);
//                 }
//               }
//             }
//           } else {
//             // Pause if the video is not visible
//             if (
//               artPlayerInstanceRef.current &&
//               activePlayerRef.current === videoContainer
//             ) {
//               artPlayerInstanceRef.current.pause();
//               setIsPlaying(false);
//               activePlayerRef.current = null;
//             }
//           }
//         });
//       };

//       const intersectionObserver = new IntersectionObserver(
//         handleIntersection,
//         {
//           root: null, // Default is the viewport
//           rootMargin: "0px",
//           threshold: [1], // Trigger when 75% of the element is visible
//         }
//       );

//       intersectionObserver.observe(playerContainerRef.current);

//       // Cleanup on component unmount
//       return () => {
//         if (artPlayerInstanceRef.current) {
//           artPlayerInstanceRef.current.destroy();
//           artPlayerInstanceRef.current = null;
//         }

//         intersectionObserver.disconnect();
//       };
//     }
//   }, [src, thumbnail]);

//   const handleRetry = () => {
// setError(false);
// setLoading(true); // Start fake loading
// setTimeout(() => {
//   setLoading(false); // End fake loading
//   setError(true); // Show error message again
// }, 1500);
//   };

//   return (
//     <div className={`social-player ${status ? "hide-controls" : ""}`}>
//       {loading && (
//         <div className="loading-message flex justify-center items-center text-center bg-black w-full h-[250px] md:h-[350px] lg:h-[400px] xl:h-[400px]">
//           {/* <p className="text-white">加载中...</p> Loading message */}
//           <Loader />
//         </div>
//       )}
//       {error && (
//         <div className="error-message flex justify-center items-center text-center bg-black w-full h-[250px] md:h-[350px] lg:h-[400px] xl:h-[400px]">
//           <div>
//             <p className="text-white">出了点小问题，请稍后重试</p>
//             <button
//               onClick={handleRetry}
//               className="p-1 px-4 text-[14px] rounded-full bg-[#F54100] mt-2"
//             >
//               重试
//             </button>
//           </div>
//         </div>
//       )}
//       {!loading && !error && (
//         <div
//           ref={playerContainerRef}
//           className="relative artplayer-app w-full h-[250px] md:h-[350px] lg:h-[400px] xl:h-[400px]"
//         ></div>
//       )}
//     </div>
//   );
// };

// export default Player;

// import React, { useEffect, useRef, useState } from "react";
// import Artplayer from "artplayer";
// import Loader from "../../../pages/search/components/Loader";

// const Player = ({
//   src,
//   thumbnail,
//   status,
//   isCenterPlay,
// }: {
//   src: string;
//   thumbnail: string;
//   status: boolean;
//   isCenterPlay: boolean;
// }) => {
//   const playerContainerRef = useRef<HTMLDivElement>(null);
//   const artPlayerInstanceRef = useRef<Artplayer | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [error, setError] = useState(false);
//   const activePlayerRef = useRef<HTMLDivElement | null>(null);
//   const observerRef = useRef<IntersectionObserver | null>(null);

//   // Get autoMode setting from localStorage
//   const { autoMode } = JSON.parse(
//     localStorage.getItem("movieAppSettings") || '{"autoMode":false}'
//   );

//   useEffect(() => {
//     if (!playerContainerRef.current) return;

//     const initializePlayer = () => {
//       Artplayer.MOBILE_DBCLICK_PLAY = false;
//       Artplayer.MOBILE_CLICK_PLAY = false;

//       artPlayerInstanceRef.current = new Artplayer({
//         container: playerContainerRef.current!,
//         url: src,
//         poster: thumbnail,
//         volume: 0.5,
//         muted: false,
//         autoplay: false,
//         aspectRatio: true,
//         miniProgressBar: true,
//         fastForward: true,
//         fullscreen: true,
//         theme: "#00a1d6",
//       });

//       artPlayerInstanceRef.current.on("play", () => setIsPlaying(true));
//       artPlayerInstanceRef.current.on("pause", () => setIsPlaying(false));
//       // artPlayerInstanceRef.current.on("destroy", () => {
//       //   setIsPlaying(false);
//       //   setError(false);
//       // });
//       artPlayerInstanceRef.current.on("error", () => {
//         setError(true);
//         // destroyPlayer();
//       });
//     };

//     const destroyPlayer = () => {
//       if (artPlayerInstanceRef.current) {
//         artPlayerInstanceRef.current.destroy();
//         artPlayerInstanceRef.current = null;
//         setIsPlaying(false);
//       }
//     };

//     const handleIntersection = (entries: IntersectionObserverEntry[]) => {
//       entries.forEach((entry) => {
//         const videoContainer = entry.target as HTMLDivElement;

//         if (entry.isIntersecting) {
//           // Initialize player if not exists
//           if (!artPlayerInstanceRef.current) {
//             initializePlayer();
//           }

//           // Handle play if this is the center video
//           if (isCenterPlay && artPlayerInstanceRef.current) {
//             activePlayerRef.current = videoContainer;
//             if (autoMode && !isPlaying) {
//               artPlayerInstanceRef.current.play().catch(() => setError(true));
//             }
//           }
//         } else {
//           // Destroy player if it's this container's player
//           if (activePlayerRef.current === videoContainer) {
//             destroyPlayer();
//             activePlayerRef.current = null;
//           }
//         }
//       });
//     };

//     // Initialize IntersectionObserver
//     observerRef.current = new IntersectionObserver(handleIntersection, {
//       root: null,
//       rootMargin: "0px",
//       threshold: 0.5, // 50% visibility threshold
//     });

//     observerRef.current.observe(playerContainerRef.current);

//     return () => {
//       // Cleanup observer and player
//       if (observerRef.current) {
//         observerRef.current.disconnect();
//       }
//       destroyPlayer();
//     };
//   }, [src, thumbnail, isCenterPlay, autoMode]);

//   const handleRetry = () => {
//     setError(false);
//     setLoading(true); // Start fake loading
//     setTimeout(() => {
//       setLoading(false); // End fake loading
//       setError(true); // Show error message again
//     }, 1500);
//     // setError(false);
//     // setLoading(true);

//     // setTimeout(() => {
//     //   setLoading(false);
//     //   if (playerContainerRef.current && !artPlayerInstanceRef.current) {
//     //     Artplayer.MOBILE_DBCLICK_PLAY = false;
//     //     Artplayer.MOBILE_CLICK_PLAY = false;

//     //     artPlayerInstanceRef.current = new Artplayer({
//     //       container: playerContainerRef.current,
//     //       url: src,
//     //       poster: thumbnail,
//     //       volume: 0.5,
//     //       muted: false,
//     //       autoplay: false,
//     //       aspectRatio: true,
//     //       miniProgressBar: true,
//     //       fastForward: true,
//     //       fullscreen: true,
//     //       theme: "#00a1d6",
//     //     });

//     //     artPlayerInstanceRef.current.on("play", () => setIsPlaying(true));
//     //     artPlayerInstanceRef.current.on("pause", () => setIsPlaying(false));
//     //     artPlayerInstanceRef.current.on("error", () => setError(true));
//     //   }
//     // }, 500);
//   };

//   return (
//     <div className={`social-player ${status ? "hide-controls" : ""}`}>
//       {loading && (
//         <div className="loading-message flex justify-center items-center text-center bg-black w-full h-[250px] md:h-[350px] lg:h-[400px] xl:h-[400px]">
//           <Loader />
//         </div>
//       )}
//       {error && (
//         <div className="error-message flex justify-center items-center text-center bg-black w-full h-[250px] md:h-[350px] lg:h-[400px] xl:h-[400px]">
//           <div>
//             <p className="text-white">出了点小问题，请稍后重试</p>
//             <button
//               onClick={handleRetry}
//               className="p-1 px-4 text-[14px] rounded-full bg-[#F54100] mt-2"
//             >
//               重试
//             </button>
//           </div>
//         </div>
//       )}
//       {!loading && !error && (
//         <div
//           ref={playerContainerRef}
//           className="relative artplayer-app w-full h-[250px] md:h-[350px] lg:h-[400px] xl:h-[400px]"
//         ></div>
//       )}
//     </div>
//   );
// };

// export default Player;

import React, { useEffect, useRef, useState } from "react";
import Artplayer from "artplayer";
import Loader from "../../../pages/search/components/Loader";

const Player = ({
  src,
  thumbnail,
  status,
  isCenterPlay,
  videoData,
}: {
  src: string;
  thumbnail: string;
  status: boolean;
  isCenterPlay: boolean;
  videoData: any;
}) => {
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const artPlayerInstanceRef = useRef<Artplayer | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Get autoMode setting from localStorage
  const { autoMode } = JSON.parse(
    localStorage.getItem("movieAppSettings") || '{"autoMode":false}'
  );

  const destroyPlayer = () => {
    // Destroy Artplayer instance
    if (artPlayerInstanceRef.current) {
      artPlayerInstanceRef.current.destroy();
      artPlayerInstanceRef.current = null;
      setIsPlaying(false);
    }
  };

  const initializePlayer = () => {
    Artplayer.MOBILE_DBCLICK_PLAY = false;
    Artplayer.MOBILE_CLICK_PLAY = false;

    artPlayerInstanceRef.current = new Artplayer({
      container: playerContainerRef.current!,
      url: src,
      poster: thumbnail,
      volume: 0.5,
      muted: false,
      autoplay: false,
      aspectRatio: true,
      miniProgressBar: true,
      fastForward: true,
      fullscreen: true,
      theme: "#00a1d6",

      customType: {
        mp4: function (video: HTMLVideoElement, url: string) {
          // Configure video element

          if (videoData.current.length > 1) {
            videoData.current[0].pause();
            videoData.current[0].removeAttribute("src");
            videoData.current[0].load(); // Reset the video element
            videoData.current.splice(0, 1); // Remove the first video element
          }

          videoData?.current?.push(video);

          const loadVideo = async () => {
            video.src = url;
          };

          // Start loading process
          loadVideo().catch(console.error);

          return () => {
            if (video) {
              video.pause();
              video.removeAttribute("src");
              video.load();
            }
          };
        },
      },
    });

    artPlayerInstanceRef.current.on("play", () => setIsPlaying(true));
    artPlayerInstanceRef.current.on("pause", () => setIsPlaying(false));
    artPlayerInstanceRef.current.on("error", () => {
      setError(true);
    });
  };

  useEffect(() => {
    if (!playerContainerRef.current) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Initialize player if not exists
          if (!artPlayerInstanceRef.current) {
            initializePlayer();
          }

          // Handle play if this is the center video
          if (artPlayerInstanceRef.current && autoMode && !isPlaying) {
            artPlayerInstanceRef.current.play().catch(() => setError(true));
          }
        } else {
          // Destroy player when not intersecting
          destroyPlayer();
        }
      });
    };

    // Initialize IntersectionObserver
    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "200px 0px",
      threshold: 0.5,
    });

    observerRef.current.observe(playerContainerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      destroyPlayer();
    };
  }, [src, thumbnail, autoMode]);

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (playerContainerRef.current && !artPlayerInstanceRef.current) {
        initializePlayer();
      }
    }, 500);
  };

  return (
    <div className={`social-player ${status ? "hide-controls" : ""}`}>
      {loading && (
        <div className="loading-message flex justify-center items-center text-center bg-black w-full h-[250px] md:h-[350px] lg:h-[400px] xl:h-[400px]">
          <Loader />
        </div>
      )}
      {error && (
        <div className="error-message flex justify-center items-center text-center bg-black w-full h-[250px] md:h-[350px] lg:h-[400px] xl:h-[400px]">
          <div>
            <p className="text-white">出了点小问题，请稍后重试</p>
            <button
              onClick={handleRetry}
              className="p-1 px-4 text-[14px] rounded-full bg-[#F54100] mt-2"
            >
              重试
            </button>
          </div>
        </div>
      )}
      {!loading && !error && (
        <div
          ref={playerContainerRef}
          className="relative artplayer-app w-full h-[250px] md:h-[350px] lg:h-[400px] xl:h-[400px]"
        ></div>
      )}
    </div>
  );
};

export default Player;
