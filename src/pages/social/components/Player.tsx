// import React, { useEffect, useRef } from "react";
// import Artplayer from "artplayer";
// import lozad from "lozad";

// const Player = ({ src, thumbnail }: { src: any; thumbnail: any }) => {
//   const playerContainerRef = useRef(null);
//   const artPlayerInstanceRef = useRef<Artplayer | null>(null);

//   useEffect(() => {
//     if (playerContainerRef.current) {
//       const observer = lozad(playerContainerRef.current, {
//         rootMargin: "50px 0px", // Adjust rootMargin as needed
//         threshold: 0.1, // Adjust threshold as needed
//         loaded: function (el) {
//           // This function is called when the element is loaded and observed
//           if (!artPlayerInstanceRef.current) {
//             Artplayer.MOBILE_DBCLICK_PLAY = false;
//             Artplayer.MOBILE_CLICK_PLAY = true;
//             artPlayerInstanceRef.current = new Artplayer({
//               container: el as HTMLDivElement,
//               url: src,
//               poster: thumbnail,
//               volume: 0.5,
//               muted: false,
//               autoplay: false,
//               aspectRatio: true,
//               miniProgressBar: true,
//               fullscreen: true,
//               theme: "#00a1d6",
//             });
//           }
//         },
//       });

//       // Start observing
//       observer.observe();
//       const handleIntersection = (entries: IntersectionObserverEntry[]) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             // if (artPlayerInstanceRef.current) {
//             //     artPlayerInstanceRef.current.play();
//             // }
//           } else {
//             if (artPlayerInstanceRef.current) {
//               artPlayerInstanceRef.current.pause();
//             }
//           }
//         });
//       };

//       const intersectionObserver = new IntersectionObserver(
//         handleIntersection,
//         {
//           rootMargin: "50px 0px",
//           threshold: 1,
//         }
//       );

//       intersectionObserver.observe(playerContainerRef.current);

//       return () => {
//         if (artPlayerInstanceRef.current) {
//           artPlayerInstanceRef.current.destroy();
//           artPlayerInstanceRef.current = null;
//         }
//         intersectionObserver.disconnect(); // Stop observing the element when component unmounts
//       };
//     }
//   }, [src, thumbnail]);

//   return (
//     <div
//       ref={playerContainerRef}
//       className="artplayer-app w-full h-[250px] md:h-[350px] lg:h-[400px] xl:h-[400px]"
//     />
//   );
// };

// export default Player;

import React, { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import lozad from "lozad";

const Player = ({ src, thumbnail }: { src: any; thumbnail: any }) => {
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const artPlayerInstanceRef = useRef<Artplayer | null>(null);

  useEffect(() => {
    if (playerContainerRef.current) {
      const observer = lozad(playerContainerRef.current, {
        rootMargin: "50px 0px",
        threshold: 0.1,
        loaded: function (el) {
          Artplayer.MOBILE_DBCLICK_PLAY = false;

          if (!artPlayerInstanceRef.current) {
            artPlayerInstanceRef.current = new Artplayer({
              container: el as HTMLDivElement,
              url: src,
              poster: thumbnail,
              volume: 0.5,
              muted: false,
              autoplay: false,
              aspectRatio: true,
              miniProgressBar: true,
              fullscreen: true,
              theme: "#00a1d6",
            });

            // const updateStateIcon = () => {
            //   const artState = artPlayerInstanceRef.current?.template.$state;
            //   if (artState) {
            //     const iconContainer = artState.querySelector(
            //       ".art-icon-state"
            //     ) as HTMLElement;

            //     if (iconContainer) {
            //       // Remove existing icon
            //       iconContainer.innerHTML = "";

            //       // Add play or pause icon based on the state
            //       if (
            //         artPlayerInstanceRef.current &&
            //         artPlayerInstanceRef.current.playing
            //       ) {
            //         iconContainer.innerHTML = `
            //           <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none">
            //             <path opacity="0.4" d="M47.6666 26.0104C47.6666 37.9464 37.9417 47.6667 26 47.6667C14.0582 47.6667 4.33331 37.9464 4.33331 26.0104C4.33331 14.0535 14.0582 4.33333 26 4.33333C37.9417 4.33333 47.6666 14.0535 47.6666 26.0104Z" fill="black"/>
            //             <path d="M34.6667 26.0105C34.6667 26.5581 34.4943 27.1078 34.1496 27.548C34.085 27.6343 33.7834 27.9903 33.5464 28.2219L33.4171 28.3483C31.6075 30.267 27.1049 33.1524 24.8213 34.077C24.8213 34.098 23.464 34.6477 22.8177 34.6667H22.7315C21.7405 34.6667 20.8142 34.1212 20.3402 33.2366C20.0817 32.7501 19.8447 31.339 19.8232 31.32C19.6293 30.0543 19.5 28.1166 19.5 25.9895C19.5 23.7591 19.6293 21.7351 19.8662 20.4925C19.8662 20.4714 20.1032 19.3341 20.254 18.955C20.491 18.4096 20.9219 17.9441 21.4605 17.6492C21.8913 17.4407 22.3438 17.3333 22.8177 17.3333C23.3132 17.3565 24.2396 17.6703 24.6058 17.8177C27.0187 18.7444 31.629 21.7772 33.3956 23.6306C33.6972 23.9255 34.0204 24.2856 34.1065 24.3678C34.4728 24.8311 34.6667 25.3998 34.6667 26.0105Z" fill="white"/>
            //           </svg>
            //         `;
            //         // Add Pause Icon
            //       } else {
            //         // Add Play Icon
            //         iconContainer.innerHTML = `
            //           <svg xmlns="http://www.w3.org/2000/svg" width="53" height="53" viewBox="0 0 53 53" fill="none">
            //             <path opacity="0.2" d="M47.7918 26.7086C47.7918 38.6446 38.0669 48.3648 26.1252 48.3648C14.1834 48.3648 4.4585 38.6446 4.4585 26.7086C4.4585 14.7517 14.1834 5.03146 26.1252 5.03146C38.0669 5.03146 47.7918 14.7517 47.7918 26.7086Z" fill="black"/>
            //             <path d="M20.125 21C20.125 20.4477 20.5727 20 21.125 20H23.125C23.6773 20 24.125 20.4477 24.125 21V33C24.125 33.5523 23.6773 34 23.125 34H21.125C20.5727 34 20.125 33.5523 20.125 33V21ZM28.125 21C28.125 20.4477 28.5727 20 29.125 20H31.125C31.6773 20 32.125 20.4477 32.125 21V33C32.125 33.5523 31.6773 34 31.125 34H29.125C28.5727 34 28.125 33.5523 28.125 33V21Z" fill="white"/>
            //           </svg>
            //         `;
            //       }
            //     }
            //   }
            // };

            // Listen to play and pause events
            // artPlayerInstanceRef.current.on("play", updateStateIcon);
            // artPlayerInstanceRef.current.on("pause", updateStateIcon);

            // Update the state icon initially
            // updateStateIcon();
          }
        },
      });

      // Start observing
      observer.observe();
      const handleIntersection = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // if (artPlayerInstanceRef.current) {
            //   artPlayerInstanceRef.current.play();
            // }
          } else {
            if (artPlayerInstanceRef.current) {
              artPlayerInstanceRef.current.pause();
            }
          }
        });
      };

      const intersectionObserver = new IntersectionObserver(
        handleIntersection,
        {
          rootMargin: "50px 0px",
          threshold: 1,
        }
      );

      intersectionObserver.observe(playerContainerRef.current);

      return () => {
        if (artPlayerInstanceRef.current) {
          artPlayerInstanceRef.current.destroy();
          artPlayerInstanceRef.current = null;
        }
        intersectionObserver.disconnect(); // Stop observing the element when component unmounts
      };
    }
  }, [src, thumbnail]);

  const handlePlayerClick = () => {
    if (artPlayerInstanceRef.current) {
      if (artPlayerInstanceRef.current.playing) {
        artPlayerInstanceRef.current.pause();
      } else {
        artPlayerInstanceRef.current.play();
      }
    }
  };

  return (
    <div
      ref={playerContainerRef}
      className="relative artplayer-app w-full h-[250px] md:h-[350px] lg:h-[400px] xl:h-[400px]"
      onClick={handlePlayerClick}
    ></div>
  );
};

export default Player;

// import React, { useEffect, useRef, useState } from "react";
// import Artplayer from "artplayer";
// import lozad from "lozad";

// const Player = ({ src, thumbnail }: { src: any; thumbnail: any }) => {
//   const playerContainerRef = useRef<HTMLDivElement>(null);
//   const artPlayerInstanceRef = useRef<Artplayer | null>(null);
//   const [showPauseIcon, setShowPauseIcon] = useState(false); // Control the pause icon state
//   const [playing, setPlaying] = useState(false); // Track the playing state

//   useEffect(() => {
//     if (playerContainerRef.current) {
//       const observer = lozad(playerContainerRef.current, {
//         rootMargin: "50px 0px",
//         threshold: 0.1,
//         loaded: function (el) {
//           Artplayer.MOBILE_DBCLICK_PLAY = false;

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
//               fullscreen: true,
//               theme: "#00a1d6",
//             });

//             // Listen to play and pause events
//             artPlayerInstanceRef.current.on("play", () => {
//               setPlaying(true);
//               setShowPauseIcon(false); // Hide the pause icon after playing starts
//             });

//             artPlayerInstanceRef.current.on("pause", () => {
//               setPlaying(false);
//               setShowPauseIcon(false); // Hide the pause icon after pausing
//             });
//           }
//         },
//       });

//       observer.observe();

//       return () => {
//         if (artPlayerInstanceRef.current) {
//           artPlayerInstanceRef.current.destroy();
//           artPlayerInstanceRef.current = null;
//         }
//       };
//     }
//   }, [src, thumbnail]);

//   const handleVideoClick = () => {
//     // Show pause icon when video is clicked
//     setShowPauseIcon(true);
//   };

//   const handlePauseClick = () => {
//     // Pause video and hide pause icon
//     if (artPlayerInstanceRef.current) {
//       artPlayerInstanceRef.current.pause();
//       setShowPauseIcon(false);
//     }
//   };

//   const handlePlayClick = () => {
//     // Play video and hide play icon
//     if (artPlayerInstanceRef.current) {
//       artPlayerInstanceRef.current.play();
//       setShowPauseIcon(false);
//     }
//   };

//   return (
//     <div className="relative w-full h-[250px] md:h-[350px] lg:h-[400px] xl:h-[400px]">
//       <div
//         ref={playerContainerRef}
//         className="artplayer-app w-full h-full"
//         onClick={handleVideoClick}
//       ></div>

//       {showPauseIcon && (
//         <div
//           className="absolute inset-0 flex items-center justify-center z-10"
//           onClick={handlePauseClick}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="53"
//             height="53"
//             viewBox="0 0 53 53"
//             fill="none"
//           >
//             <path
//               opacity="0.2"
//               d="M47.7918 26.7086C47.7918 38.6446 38.0669 48.3648 26.1252 48.3648C14.1834 48.3648 4.4585 38.6446 4.4585 26.7086C4.4585 14.7517 14.1834 5.03146 26.1252 5.03146C38.0669 5.03146 47.7918 14.7517 47.7918 26.7086Z"
//               fill="black"
//             />
//             <path
//               d="M20.125 21C20.125 20.4477 20.5727 20 21.125 20H23.125C23.6773 20 24.125 20.4477 24.125 21V33C24.125 33.5523 23.6773 34 23.125 34H21.125C20.5727 34 20.125 33.5523 20.125 33V21ZM28.125 21C28.125 20.4477 28.5727 20 29.125 20H31.125C31.6773 20 32.125 20.4477 32.125 21V33C32.125 33.5523 31.6773 34 31.125 34H29.125C28.5727 34 28.125 33.5523 28.125 33V21Z"
//               fill="white"
//             />
//           </svg>
//         </div>
//       )}

//       {!playing && !showPauseIcon && (
//         <div
//           className="absolute inset-0 flex items-center justify-center z-10"
//           onClick={handlePlayClick}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="52"
//             height="52"
//             viewBox="0 0 52 52"
//             fill="none"
//           >
//             <path
//               opacity="0.4"
//               d="M47.6666 26.0104C47.6666 37.9464 37.9417 47.6667 26 47.6667C14.0582 47.6667 4.33331 37.9464 4.33331 26.0104C4.33331 14.0535 14.0582 4.33333 26 4.33333C37.9417 4.33333 47.6666 14.0535 47.6666 26.0104Z"
//               fill="black"
//             />
//             <path
//               d="M34.6667 26.0105C34.6667 26.5581 34.4943 27.1078 34.1496 27.548C34.085 27.6343 33.7834 27.9903 33.5464 28.2219L33.4171 28.3483C31.6075 30.267 27.1049 33.1524 24.8213 34.077C24.8213 34.098 23.464 34.6477 22.8177 34.6667H22.7315C21.7405 34.6667 20.8142 34.1212 20.3402 33.2366C20.0817 32.7501 19.8447 31.339 19.8232 31.32C19.6293 30.0543 19.5 28.1166 19.5 25.9895C19.5 23.7591 19.6293 21.7351 19.8662 20.4925C19.8662 20.4714 20.1032 19.3341 20.254 18.955C20.491 18.4096 20.9219 17.9441 21.4605 17.6492C21.8913 17.4407 22.3438 17.3333 22.8177 17.3333C23.3132 17.3565 24.2396 17.6703 24.6058 17.8177C27.0187 18.7444 31.629 21.7772 33.3956 23.6306C33.6972 23.9255 34.0204 24.2856 34.1065 24.3678C34.4728 24.8311 34.6667 25.3998 34.6667 26.0105Z"
//               fill="white"
//             />
//           </svg>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Player;
