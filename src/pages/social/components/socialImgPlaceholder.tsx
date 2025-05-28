import { useEffect, useRef } from "react";
import cardSkeleton from "../socialPlaceholder.png";

type ImageWithPlaceholderProps = {
  src: any;
  alt: string;

  className: string;
};

const ImageWithPlaceholder = ({
  src,
  alt,

  className,
  ...props
}: ImageWithPlaceholderProps) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (imgRef.current) {
              imgRef.current.src = src;
              imgRef.current.onload = () => {
                if (imgRef.current && imgRef.current !== null) {
                  imgRef.current.style.opacity = "1";
                  if (containerRef.current) {
                    containerRef.current.style.borderRadius = "0";
                  }
                }
              };
            }
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  return (
    <div
      ref={containerRef}
      className="social-image-container"
      style={{ width: "100%", height: "100%" }}
    >
      <img
        ref={imgRef}
        src={cardSkeleton}
        alt={alt}
        style={{ width: "100%", height: "100%" }}
        className={`${className} image-placeholder`}
        {...props}
      />
    </div>
  );
};

export default ImageWithPlaceholder;
