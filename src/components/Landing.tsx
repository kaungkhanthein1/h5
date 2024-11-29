import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setPanding } from "../features/login/ModelSlice";
import { useGetAdsQuery } from "../services/helperService";
import land from "../assets/login/land.png";

import ad1 from "../assets/login/ad1.png";
import { Link } from "react-router-dom";

const Landing: React.FC = () => {
  const [cur, setCur] = useState<any>([]); // Default to an empty array
  const dispatch = useDispatch();
  const [cc, setcc] = useState<any>();
  const [skip, setSkip] = useState(3);
  const { data, isLoading } = useGetAdsQuery();
  const [imgLoad, setImgLoad] = useState(false);

  useEffect(() => {
    const gg = data?.data["start"];
    console.log(gg);
    setCur(gg);
    if (cur) {
      setcc(cur[0]);
    }
  }, [data, cur]);

  useEffect(() => {
    if (imgLoad) {
      const countdown = setInterval(() => {
        if (skip > 0) {
          setSkip((prev) => prev - 1);
        }else{
          dispatch(setPanding(false))
        }
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [skip, imgLoad]);
  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = land; // Set default image if API image fails
  };

  return (
    <div className="relative min-h-[100svh] flex flex-col justify-center items-center">
      {!cc?.data ? (
        <img
          src={land}
          className="object-center object-cover w-screen h-screen"
          alt="land"
        />
      ) : (
        <>
          <Link to={cc?.data?.url}>
            <img
              className=" h-screen object-cove"
              onLoad={() => setImgLoad(true)}
              src={cc?.data?.image}
              alt=""
            />
          </Link>
          {imgLoad && (
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
          )}
        </>
      )}
    </div>
  );
};

export default Landing;
