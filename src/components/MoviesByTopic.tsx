import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import MovieCard from "./MovieCard";
const MoviesByTopic = ({ movieData }: any) => {
  return (
    <div className="px-10 max-md:px-3 max-md:mt-[30px] mt-[100px]">
      <div className="flex justify-between">
        <h1 className="uppercase max-md:text-[16px] max-md:leading-[24px] text-[24px] leading-[26px] font-[800] flex items-center gap-2">
          <span className="text-white font-headerFont">{movieData?.title}</span>
        </h1>
        <a
          href={`/topic/${movieData?.title}/${movieData?.navigator?.id}`}
          className="text-white flex hover:bg-[#171717] duration-300 items-center gap-1 max-sm:leading-[18px] text-[14px] max-md:text-[12px] leading-[20px] font-[400] p-2 px-3 bg-[#202020] rounded-3xl"
        >
          {movieData?.navigator?.title}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="12"
            viewBox="0 0 4 12"
            fill="none"
          >
            <path
              d="M3.57562 6.25726L0.939439 10.8934C0.905655 10.9272 0.865548 10.954 0.821408 10.9723C0.777267 10.9906 0.729957 11 0.682179 11C0.634402 11 0.587092 10.9906 0.542951 10.9723C0.498811 10.954 0.458703 10.9272 0.42492 10.8934C0.391136 10.8597 0.364337 10.8195 0.346053 10.7754C0.32777 10.7313 0.318359 10.684 0.318359 10.6362C0.318359 10.5884 0.32777 10.5411 0.346053 10.497C0.364337 10.4528 0.391136 10.4127 0.42492 10.3789L2.80429 6L0.42492 1.62108C0.35669 1.55285 0.318359 1.46031 0.318359 1.36382C0.318359 1.26733 0.35669 1.17479 0.42492 1.10656C0.493149 1.03833 0.585688 1 0.682179 1C0.778671 1 0.87121 1.03833 0.939439 1.10656L3.57562 5.74274C3.60943 5.77651 3.63625 5.81661 3.65455 5.86076C3.67284 5.9049 3.68226 5.95221 3.68226 6C3.68226 6.04779 3.67284 6.0951 3.65455 6.13924C3.63625 6.18339 3.60943 6.22349 3.57562 6.25726Z"
              fill="white"
              stroke="white"
              strokeWidth="0.5"
            />
          </svg>
        </a>
      </div>
      <div className="max-md:mt-5 mt-10">
        <Swiper
          modules={[Navigation]}
          slidesPerView={1}
          spaceBetween={10}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          breakpoints={{
            320: {
              slidesPerView: 2.5,
              spaceBetween: 10,
            },
            480: {
              slidesPerView: 3.5,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 3.5,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 3.5,
              spaceBetween: 10,
            },
            1000: {
              slidesPerView: 4.5,
              spaceBetween: 20,
            },
            1268: {
              slidesPerView: 6.5,
              spaceBetween: 20,
            },
            1568: {
              slidesPerView: 6.5,
              spaceBetween: 20,
            },
            2068: {
              slidesPerView: 6.5,
              spaceBetween: 20,
            },
          }}
        >
          {[]?.map((movie: any) => (
            <SwiperSlide key={movie.vod_id}>
              <MovieCard movie={movie} height={"200px"} />
            </SwiperSlide>
          ))}

          <div className="hidden md:block">
            <div className="swiper-button-prev max-md:hidden block">
              {/* <img src={swiperLeft} alt="" /> */}
            </div>
            <div className="swiper-button-next max-md:hidden block">
              {/* <img src={swiperRight} alt="" /> */}
            </div>
          </div>
        </Swiper>
      </div>
    </div>
  );
};

export default MoviesByTopic;
