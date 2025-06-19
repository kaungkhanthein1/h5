import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import '../point.css'

interface VirtualProps {
  data: any;
}

const TextVirtual: React.FC<VirtualProps> = ({ data }) => {
  return (
    // <Swiper
    //   direction="vertical"
    //   slidesPerView={1}
    //   spaceBetween={50}
    //   loop={true}
    //   autoplay={{ delay: 2000, disableOnInteraction: false }}
    //   modules={[Autoplay]}
    //   className="h-[20px]"
    //   allowTouchMove={false}
    // >
    //   {data?.data?.virtual_lottery_winners?.map((item: any, index: number) => {
    //     const template = item.text || "用户 :name 成功瓜分红包 :price";

    //     // Split into parts around the placeholders
    //     const parts = template.split(/(:name|:price)/g);

    //     return (
    //       <SwiperSlide key={index}>
    //         <div className="text-white/80 text-[16px] tracking-wide text-center font-[400]">
    //           {parts.map((part: any, i: any) => {
    //             if (part === ":name") {
    //               return (
    //                 <span key={i} className="font-bold text-white">
    //                   {item.name}
    //                 </span>
    //               );
    //             }
    //             if (part === ":price") {
    //               return (
    //                 <span key={i} className="font-bold text-white">
    //                   {item.price}
    //                 </span>
    //               );
    //             }
    //             return <span key={i}>{part}</span>;
    //           })}
    //         </div>
    //       </SwiperSlide>
    //     );
    //   })}
    // </Swiper>
    <div className="new_v_text_box w-[230px] flex justify-center items-center">
      <div className="relative w-[208px] h-fit py-[8px] overflow-hidden  flex items-center">
        <div className="scroll-animation">
          {data?.data?.virtual_lottery_winners?.map(
            (item: any, index: number) => {
              const template = item.text || "用户 :name 成功瓜分红包 :price";
              const parts = template.split(/(:name|:price)/g);
              return (
                <span
                  key={index}
                  className="inline-block px-4 text-white/80 text-[14px] tracking-wide font-[400]"
                >
                  {parts.map((part: any, i: any) => {
                    if (part === ":name") {
                      return (
                        <span key={i} className="font-bold text-white">
                          {item.name}
                        </span>
                      );
                    }
                    if (part === ":price") {
                      return (
                        <span key={i} className="font-bold text-white">
                          {item.price}
                        </span>
                      );
                    }
                    return <span key={i}>{part}</span>;
                  })}
                </span>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default TextVirtual;
