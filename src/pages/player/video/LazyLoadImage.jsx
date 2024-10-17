import { useEffect, useRef, useState } from "react";

const LazyLoadImage = ({ src, alt, width, height, lowResSrc, className, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (imgRef.current) {
              imgRef.current.src = src;
              imgRef.current.onload = () => {
                setIsLoading(false); // Hide low-res image when high-res image loads
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
    <div className={`image-container ${className}`} style={{ width, height }}>
      {isLoading && <div className="low-res-image" style={{ backgroundImage: `url(${lowResSrc})` }}></div>}
      <img
        ref={imgRef}
        src="" // High-resolution image will be loaded here
        alt={alt}
        width={width}
        height={height}
        className={`${className} image-placeholder`}
        style={{ opacity: isLoading ? 0 : 1 }}
        {...props}
      />
    </div>
  );
};

export default LazyLoadImage;