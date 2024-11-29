/* eslint-disable no-unused-vars */
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import MovieCard from "./MovieCard";

import rightvg from "../../assets/rightvg.svg";

const Movies = ({ movieData }) => {
  const apiMovie = movieData?.list;

  if (apiMovie?.length === 0) {
    return (
      <div className="px-10 max-md:px-3 max-md:mt-[30px] mt-[100px]">
        <div className="flex justify-center items-center pt-[120px]">
          <img
            src=""
            width={300}
            height={300}
            className="max-sm:w-[150px] max-sm:h-[150px]"
          />
        </div>
      </div>
    );
  }

  return (
    // <div className="px-10 max-md:px-3">
    //   <div className="flex justify-between items-center">
    //     <h1 className="text-sm uppercase text-white font-semibold flex items-center">
    //       <span className="text-white font-headerFont">{movieData?.title}</span>
    //     </h1>
    //     <h1 className="">{movieData?.navigator?.title}</h1>
    //     <img src={rightvg} alt="" />
    //   </div>
    //   <div className="max-md:mt-3 mt-3">
    //     <div className="flex overflow-x-scroll whitespace-nowrap scrollbar-hide gap-2 mt-0">
    //       {apiMovie?.map((movie) => (
    //         <div key={movie.id}>
    //           <MovieCard movie={movie} height={"200px"} isSlider={true} />
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </div>
    <div className="text-text max-md:px-3 px-10">
      <div className="">
        <div className="flex justify-between items-center px-3 text-[16px] mb-3">
          <h1 className="uppercase text-white font-semibold flex items-center">
            <span className="text-white font-headerFont">
              {movieData?.title}
            </span>
          </h1>
          {/* <h1 className="">{movieData?.navigator?.title}</h1> */}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 pl-3 lg:grid-cols-8 gap-y-5 gap-2 mt-0 pt-1 pb-2 px-3">
          {apiMovie?.map((movie) => (
            <div key={movie?.id} className="mx-auto w-full">
              <MovieCard movie={movie} height={"200px"} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Movies;
