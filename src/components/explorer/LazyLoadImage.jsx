import { useEffect, useRef } from "react";
import cardSkeleton from "../../assets/imgLoading.png"; // Placeholder image
const LazyLoadImage = ({ src, alt, width, height, className, ...props }) => {
  const imgRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (imgRef.current && imgRef.current !== null) {
              imgRef.current.src = src;
              imgRef.current.onload = () => {
                if (imgRef.current && imgRef.current !== null) {
                  imgRef.current.style.opacity = "1";
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
        // src=""
        alt={alt}
        width={width}
        height={height}
        className={`${className} image-placeholder`}
        {...props}
      />
    </div>
  );
};
export default LazyLoadImage;
