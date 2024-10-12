import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Import framer-motion
import land from "../assets/login/land.png";
import ad1 from "../assets/login/ad1.png";
import mask from "../assets/login/mask.png";
import text from "../assets/login/text.png";
import { useDispatch } from "react-redux";
import { setPanding } from "../features/login/ModelSlice";

interface LandingProps {}

const Landing: React.FC<LandingProps> = ({}) => {
  const dispatch = useDispatch();
  const [skip, setSkip] = useState(6);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (skip > 0) {
        setSkip((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [skip]);

  return (
    <div className="relative min-h-[100svh] flex flex-col justify-center items-center">
      {/* Adjusted Image Section */}
      <img
        src={skip <= 3 ? ad1 : land}
        className="object-center w-screen h-[80vh]"
        alt="land"
      />

      {/* Logo Section with Animation */}
      <div className="flex flex-c justify-center items-center gap- relative py-[20px]">
        {/* Mask Animation */}
        <motion.img
          src={mask}
          className="w-[60px] py-[20px]"
          alt="mask"
          initial={{ x: 20, width: "80px" }} 
          animate={{ x: -10, width: "60px" }} 
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Text Animation */}
        <motion.img
          src={text}
          className="w-[100px] py-[20px]"
          alt="text"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }} // Smooth delayed appearance
        />
      </div>

      {/* Countdown */}
      <div
        onClick={() => dispatch(setPanding(false))}
        style={{
          borderRadius: "52px",
          background: "rgba(0, 0, 0, 0.98)",
          backdropFilter: "blur(2px)",
        }}
        className="absolute top-[2vh] right-[2vh]"
      >
        <h1 className="text-white text-xs md:text-sm font-[400] py-[4px] px-[12px]">
          跳过广告 <span>{skip}</span>
        </h1>
      </div>
    </div>
  );
};

export default Landing;
