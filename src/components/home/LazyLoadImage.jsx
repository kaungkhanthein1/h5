import { useEffect, useRef, useState } from "react";
import cardSkeleton from "../../assets/blur.png"; // Placeholder image
const LazyLoadImage = ({ src, alt, width, height, className, ...props }) => {
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
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
                  setLoaded(true);
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
    <div className={`image-container2 ${className}`} style={{ width, height }}>
      <img
        ref={imgRef}
        src={cardSkeleton}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${
          loaded ? "image-loaded" : "image-placeholder"
        }`}
        {...props}
      />
    </div>
  );
};
export default LazyLoadImage;
