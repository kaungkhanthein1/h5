import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
const Banner = ({ list }: { list: any }) => {
  return (
    <div className="pt-36">
      <div className="px-3 md:px-10">
        <div className="relative rounded-lg">
          <Carousel showThumbs={false} showArrows={false} showStatus={false}>
            {list?.map((banner: any) => (
              <div key={banner?.image}>
                <img
                  className="relative rounded-lg"
                  src={banner?.image}
                  alt=""
                />
                <p className="absolute text-white z-50 bottom-8 pl-5 text-[16px] font-semibold">
                  {banner?.title}
                </p>
                <div className="absolute rounded-bl-lg rounded-br-lg  h-full w-full inset-0 bg-gradient-to-b from-transparent via-black/5 to-black"></div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Banner;
