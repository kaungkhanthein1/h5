import React, { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import lozad from "lozad";

const Player = ({ src, thumbnail }: { src: any; thumbnail: any }) => {
  const playerContainerRef = useRef(null);
  const artPlayerInstanceRef = useRef<Artplayer | null>(null);

  useEffect(() => {
    if (playerContainerRef.current) {
      const observer = lozad(playerContainerRef.current, {
        rootMargin: "50px 0px", // Adjust rootMargin as needed
        threshold: 0.1, // Adjust threshold as needed
        loaded: function (el) {
          // This function is called when the element is loaded and observed
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
          }
        },
      });

      // Start observing
      observer.observe();
      const handleIntersection = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // if (artPlayerInstanceRef.current) {
            //     artPlayerInstanceRef.current.play();
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

  return (
    <div
      ref={playerContainerRef}
      className="artplayer-app w-full h-[250px] md:h-[350px] lg:h-[400px] xl:h-[400px]"
    />
  );
};

export default Player;
