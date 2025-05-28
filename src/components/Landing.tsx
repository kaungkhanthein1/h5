import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setPanding } from "../features/login/ModelSlice";
import { useGetAdsQuery } from "../services/helperService";
import land from "../assets/login/land.webp";
import { Link } from "react-router-dom";

import ad1 from "../assets/login/ad1.png";

interface LandingProps {
  data: any;
  preloadedImage?: string | null;
}

const Landing: React.FC<LandingProps> = ({ data, preloadedImage }) => {
  const dispatch = useDispatch();
  const [cc, setCc] = useState<any>();
  const [skip, setSkip] = useState(3);
  const [image, setImage] = useState('');
  const [blobUrl, setBlobUrl] = useState<string>('');
  const [imgLoad, setImgLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const adDisplayTime = 6000; // 6 seconds in milliseconds

  // Load and setup image
  useEffect(() => {
    if (data?.data) {
      const cur = data?.data["start"];
      if(cur && cur.length > 0) {
        setCc(cur[0]);
        
        if (preloadedImage) {
          // Use preloaded blob URL if available
          setImage(preloadedImage);
          setBlobUrl(preloadedImage);
          setIsLoading(false);
        } else if (cur[0]?.data?.image) {
          // Convert image to blob URL if not preloaded
          setIsLoading(true);
          fetch(cur[0]?.data?.image)
            .then(response => response.blob())
            .then(blob => {
              const url = URL.createObjectURL(blob);
              setBlobUrl(url);
              setImage(url);
              setIsLoading(false);
            })
            .catch(err => {
              console.error("Failed to fetch image:", err);
              setImage(land);
              setIsLoading(false);
            });
        } else {
          setImage(land);
          setIsLoading(false);
        }
      } else {
        setImage(land);
        setIsLoading(false);
      }

      return () => {
        // Clean up blob URLs and timers
        if (blobUrl) {
          URL.revokeObjectURL(blobUrl);
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
        }
      };
    }
  }, [data, preloadedImage]);

  // Handle image load success
  const handleImageLoaded = () => {
    setImgLoad(true);
    
    // Start the main timer only after image has loaded
    timeoutRef.current = setTimeout(() => {
      dispatch(setPanding(false));
      sendMessageToNative();
    }, adDisplayTime);
    
    // Start the countdown timer
    countdownRef.current = setInterval(() => {
      setSkip((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = land; // Set default image if API image fails
    handleImageLoaded(); // Continue with the default image
  };

  const sendMessageToNative = () => {
    if ((window as any).webkit && (window as any).webkit.messageHandlers && (window as any).webkit.messageHandlers.jsBridge) {
      (window as any).webkit.messageHandlers.jsBridge.postMessage("showHomeScreen");
    }
  };
  
  const skipAd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    dispatch(setPanding(false));
    sendMessageToNative();
  };
  
  return (
        <>
          {isLoading ? (
            <img
              className="h-screen w-screen object-cover"
              src={land}
              alt="Loading..."
            />
          ) : (
            <Link target="_blink" to={cc?.data?.url}>
              <img
                className="h-screen w-screen object-cover"
                onLoad={handleImageLoaded}
                src={image}
                onError={handleImageError}
                alt=""
              />
            </Link>
          )}
          {imgLoad && (
            <div
              onClick={skipAd}
              style={{
                borderRadius: "52px",
                background: "rgba(0, 0, 0, 0.98)",
                backdropFilter: "blur(2px)",
              }}
              className="absolute top-[2vh] right-[2vh]"
            >
              <h1 className="text-white text-[12px] md:text-sm font-[400] py-[4px] px-[12px]">
                跳过广告 <span>{skip}</span>
              </h1>
            </div>
          )}
        </>
  );
};

export default Landing;
