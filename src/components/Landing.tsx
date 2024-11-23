import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setPanding } from "../features/login/ModelSlice";
import { useGetAdsStartQuery } from "../features/share/AdsApi";
import land from "../assets/login/land.png";

import ad1 from "../assets/login/ad1.png";
import { Link } from "react-router-dom";

const Landing: React.FC = () => {
  const [cur, setCur] = useState<any>([]); // Default to an empty array
  const dispatch = useDispatch();
  const [skip, setSkip] = useState(6);
  const { data } = useGetAdsStartQuery("");

  useEffect(() => {
    setCur(data?.data["start"]); // Set cur only if it's an array
  }, [data]);
  console.log(cur);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (skip > 0) {
        setSkip((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [skip]);
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = land; // Set default image if API image fails
  };

  return (
    <div className="relative min-h-[100svh] flex flex-col justify-center items-center">
      {cur?.data?.image ? (
        <Link to={cur?.data?.url}>
          <img
            className="object-center object-cover w-screen h-screen"
            src={cur?.data?.image}
            alt=""
            onError={handleImageError}
          />
        </Link>
      ) : (
        <img
          src={land}
          className="object-center object-cover w-screen h-screen"
          alt="land"
        />
      )}

      <div className="fle hidden flex-c justify-center items-center gap- relative py-[20px]">
        <motion.img
          src="/path/to/mask.png"
          className="w-[60px] py-[20px]"
          alt="mask"
          initial={{ x: 20, width: "80px" }}
          animate={{ x: -10, width: "60px" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        <motion.img
          src="/path/to/text.png"
          className="w-[100px] py-[20px]"
          alt="text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
        />
      </div>

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
