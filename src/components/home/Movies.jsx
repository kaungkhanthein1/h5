/* eslint-disable no-unused-vars */
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import MovieCard from "./MovieCard";

// import notfound from "../../assets/notfound.png";

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
    <div className="px-10 max-md:px-3">
      <div className="flex justify-between items-center">
        <h1 className="text-sm uppercase text-white font-semibold flex items-center">
          <span className="text-white font-headerFont">{movieData?.title}</span>
        </h1>
        <h1 className="">{movieData?.navigator?.title}</h1>
      </div>
      <div className="max-md:mt-5 mt-5">
        <Swiper
          modules={[Navigation]}
          slidesPerView={2}
          spaceBetween={8}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          breakpoints={{
            320: {
              slidesPerView: 3.5,
              spaceBetween: 8,
            },
            350: {
              slidesPerView: 3.5,
              spaceBetween: 8,
            },
            480: {
              slidesPerView: 3.5,
              spaceBetween: 8,
            },
            640: {
              slidesPerView: 4.5,
              spaceBetween: 8,
            },
            768: {
              slidesPerView: 5.5,
              spaceBetween: 8,
            },
            1000: {
              slidesPerView: 6.5,
              spaceBetween: 10,
            },
            1268: {
              slidesPerView: 8.5,
              spaceBetween: 10,
            },
            1568: {
              slidesPerView: 8.5,
              spaceBetween: 10,
            },
            2068: {
              slidesPerView: 7.5,
              spaceBetween: 10,
            },
          }}
        >
          {apiMovie?.map((movie) => (
            <SwiperSlide key={movie.id}>
              <MovieCard movie={movie} height={"200px"} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Movies;
