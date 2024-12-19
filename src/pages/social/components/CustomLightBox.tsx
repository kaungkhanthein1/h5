import { useState } from "react";
import { useSwipeable } from "react-swipeable";

const CustomLightbox = ({
  images,
  isOpen,
  onClose,
  initialIndex,
}: {
  images: { resourceURL: string }[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    },
    trackMouse: true, // Allows mouse swiping for debugging
  });

  if (!isOpen) return null;

  const sendMessageToNative = (message: string) => {
    if (
      (window as any).webkit &&
      (window as any).webkit.messageHandlers &&
      (window as any).webkit.messageHandlers.jsBridge
    ) {
      (window as any).webkit.messageHandlers.jsBridge.postMessage(message);
    }
  };

  const onDownload = () => {
    sendMessageToNative("showDownload");
  };

  return (
    <div className="lightbox-overlay">
      <div
        className="lightbox-content"
        onClick={(e) => e.stopPropagation()}
        {...swipeHandlers}
      >
        <div
          className="lightbox-slider"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: "transform 0.3s ease",
          }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image.resourceURL}
              alt={`Slide ${index + 1}`}
              className="lightbox-slide"
            />
          ))}
        </div>
        <button className="index-close" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M3.828 6.99998H16V8.99998H3.828L9.192 14.364L7.778 15.778L0 7.99998L7.778 0.221985L9.192 1.63598L3.828 6.99998Z"
              fill="white"
            />
          </svg>
        </button>
        <button className="index-download" onClick={onDownload}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M18.1521 21H5.84741C4.2771 21 2.99976 19.7766 2.99976 18.2743V16.5C2.99976 15.8789 3.50366 15.375 4.12476 15.375C4.74585 15.375 5.24976 15.8789 5.24976 16.5V18.2743C5.24976 18.5321 5.52397 18.75 5.84741 18.75H18.1521C18.4755 18.75 18.7498 18.5321 18.7498 18.2743V16.5C18.7498 15.8789 19.2537 15.375 19.8748 15.375C20.4958 15.375 20.9998 15.8789 20.9998 16.5V18.2743C20.9998 19.7766 19.7224 21 18.1521 21ZM11.9998 3.00003C11.3787 3.00003 10.8748 3.50394 10.8748 4.12503V14.25C10.8748 14.8711 11.3787 15.375 11.9998 15.375C12.6208 15.375 13.1248 14.8711 13.1248 14.25V4.12503C13.1248 3.50394 12.6208 3.00003 11.9998 3.00003Z"
              fill="white"
            />
            <path
              d="M14.7252 11.1072C14.4369 11.1072 14.1486 11.2173 13.9307 11.4376L11.9994 13.3665L10.0705 11.4376C9.62989 10.997 8.91973 10.997 8.47911 11.4376C8.03848 11.8782 8.03848 12.5884 8.47911 13.029L11.2049 15.7548C11.6455 16.1954 12.3557 16.1954 12.7963 15.7548L15.5221 13.029C15.9627 12.5884 15.9627 11.8782 15.5221 11.4376C15.2994 11.2173 15.0111 11.1072 14.7252 11.1072Z"
              fill="white"
            />
          </svg>
        </button>
        <div className="index-text">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

export default CustomLightbox;
