import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const Banner = ({ list }: { list: any }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleOnChange = (index: any) => {
    setSelectedIndex(index);
  };
  const navigate = useNavigate();

  const handleBannerClick = (clickLink: string) => {
    // console.log("clickLink is=>", clickLink);
    if (clickLink && clickLink.startsWith("http")) {
      window.open(clickLink, "_blank");
    } else {
      navigate(`/player/${clickLink}`);
      // Handle cases where clickLink is not a full URL or handle internal links
      // console.log("Clicked on banner:", clickLink);
    }
  };

  return (
    <div className="mt-[120px] max-md:px-3 px-10 pt-2">
      <div className="">
        <div className="relative block md:hidden">
          <Carousel
            showThumbs={false}
            showArrows={false}
            showStatus={false}
            autoPlay={true}
            infiniteLoop={true}
          >
            {list?.map((banner: any) => (
              <div
                key={banner?.image}
                className="h-[200px] lg:h-[400px] rounded-md"
                onClick={() => handleBannerClick(banner?.click)}
              >
                <img
                  className="relative h-[200px] lg:h-[400px] object-cover rounded-md"
                  src={banner?.image}
                  alt=""
                />
                {banner?.type == 1 && (
                  <>
                    <p className="absolute text-white z-50 bottom-[30px] pl-3 text-[16px] font-semibold">
                      {banner?.title ? banner?.title : "未知标题"}
                    </p>
                    <div className="absolute bottom-[10px] left-3 flex items-center gap-2">
                      <div className="home-label z-[999]">
                        {banner?.label ? banner?.label : "热播"}
                      </div>
                      <div className="z-[999] home-sub-title">
                        {banner?.sub_title ? banner?.sub_title : "剧情 / 古装"}
                      </div>
                    </div>
                  </>
                )}
                <div className="absolute rounded-b-md  h-full w-full inset-0 bg-gradient-to-b from-transparent via-black/5 to-black"></div>
              </div>
            ))}
          </Carousel>
        </div>
        <div className="relative hidden md:block">
          <Carousel
            showThumbs={false}
            showArrows={false}
            showStatus={false}
            showIndicators={false}
            autoPlay={true}
            infiniteLoop={true}
            centerMode
            centerSlidePercentage={60}
            selectedItem={selectedIndex}
            onChange={handleOnChange}
          >
            {list?.map((banner: any, index: any) => (
              <div
                key={banner?.image}
                className={`${
                  selectedIndex == index
                    ? "h-[200px] lg:h-[400px]"
                    : "h-[180px] lg:h-[350px] mt-[10px] lg:mt-[20px]"
                } rounded-md relative mx-3`}
                onClick={() => handleBannerClick(banner?.click)}
              >
                <img
                  className={`relative ${
                    selectedIndex == index
                      ? "h-[200px] lg:h-[400px]"
                      : "h-[180px] lg:h-[350px]"
                  } object-cover rounded-md`}
                  src={banner?.image}
                  alt=""
                />
                {banner?.type == 1 && (
                  <>
                    <p className="absolute text-white z-50 bottom-[30px] pl-3 text-[16px] font-semibold">
                      {banner?.title ? banner?.title : "未知标题"}
                    </p>
                    <div className="absolute bottom-[10px] left-3 flex items-center gap-2">
                      <div className="home-label z-[999]">
                        {banner?.label ? banner?.label : "热播"}
                      </div>
                      <div className="z-[999] home-sub-title">
                        {banner?.sub_title ? banner?.sub_title : "剧情 / 古装"}
                      </div>
                    </div>
                  </>
                )}
                <div className="absolute rounded-b-md  h-full w-full inset-0 bg-gradient-to-b from-transparent via-black/5 to-black"></div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Banner;
