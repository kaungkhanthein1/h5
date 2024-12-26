import React, { useEffect, useRef, useState } from "react";
import Artplayer from "artplayer";
import lozad from "lozad";

const Player = ({ src, thumbnail }: { src: any; thumbnail: any }) => {
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const artPlayerInstanceRef = useRef<Artplayer | null>(null);
  const [showPauseButton, setShowPauseButton] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to store timeout ID

  useEffect(() => {
    if (playerContainerRef.current) {
      const observer = lozad(playerContainerRef.current, {
        rootMargin: "50px 0px",
        threshold: 0.1,
        loaded: function (el) {
          Artplayer.MOBILE_DBCLICK_PLAY = false;
          Artplayer.MOBILE_CLICK_PLAY = false;

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
            artPlayerInstanceRef.current.on('control', (state) => {
              if(state && artPlayerInstanceRef.current?.playing) {
                setShowPauseButton(true);
              } else {
                setShowPauseButton(false);
              }
          });
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


  const pausePlayer = () => {
    setShowPauseButton(false);
    if (artPlayerInstanceRef.current) {
      artPlayerInstanceRef.current.pause();
    }
  };

  return (
    <div className="social-player">
      {showPauseButton && (
        <svg
          onClick={pausePlayer}
          className="pause-btn"
          xmlns="http://www.w3.org/2000/svg"
          width="73"
          height="73"
          viewBox="0 0 53 53"
          fill="none"
        >
          <path
            opacity="0.2"
            d="M47.7918 26.7086C47.7918 38.6446 38.0669 48.3648 26.1252 48.3648C14.1834 48.3648 4.4585 38.6446 4.4585 26.7086C4.4585 14.7517 14.1834 5.03146 26.1252 5.03146C38.0669 5.03146 47.7918 14.7517 47.7918 26.7086Z"
            fill="black"
          />
          <path
            d="M20.125 21C20.125 20.4477 20.5727 20 21.125 20H23.125C23.6773 20 24.125 20.4477 24.125 21V33C24.125 33.5523 23.6773 34 23.125 34H21.125C20.5727 34 20.125 33.5523 20.125 33V21ZM28.125 21C28.125 20.4477 28.5727 20 29.125 20H31.125C31.6773 20 32.125 20.4477 32.125 21V33C32.125 33.5523 31.6773 34 31.125 34H29.125C28.5727 34 28.125 33.5523 28.125 33V21Z"
            fill="white"
          />
        </svg>
      )}
      <div
        ref={playerContainerRef}
        className="relative artplayer-app w-full h-[250px] md:h-[350px] lg:h-[400px] xl:h-[400px]"
      ></div>
    </div>
  );
};

export default Player;
