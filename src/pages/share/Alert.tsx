import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

interface AlertProps {
  img: any;
  list: any;
}

const Alert: React.FC<AlertProps> = ({ img, list }) => {
  return (
    <div className="flex justify-center items-center pt-[20px]">
      <div className="fire_box w-[320px] px-[12px] py-[4px] flex gap-[7px] items-center">
        <img src={img} alt="" />
        <Swiper
          direction="vertical"
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          modules={[Autoplay]}
          className="h-[20px]" // Adjust height based on your text size
        >
          {list?.map((item: string, index: number) => (
            <SwiperSlide key={index}>
              <h1 className="text-white/80 text-[12px] font-[400]">{item}</h1>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Alert;
