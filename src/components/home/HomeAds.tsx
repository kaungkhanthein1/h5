import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useCachedImage from "../../utils/useCachedImage";

const HomeAds = ({ data, isLoading }: any) => {
  const [cur, setCur] = useState<any[]>([]);

  useEffect(() => {
    setCur(data || []);
  }, [data]);

  const AdItemComponent = ({ item }: { item: any }) => {
    const { imgSrc, isLoading: imageLoading } = useCachedImage(item.data.image);
    
    return (
      <Link
        target="_blank"
        className="flex flex-col justify-center items-center gap-[4px]"
        to={item.data?.url || "#"}
      >
        {imageLoading && (
          <div className="w-[58px] h-[58px] object-cover rounded-[4px] mx-auto bg-white/15 animate-pulse flex justify-center items-center">
            <p className="text-[12px] font-[500] text-[#888]">
              {item.remarks}
            </p>
          </div>
        )}
        {imgSrc && (
          <img
            src={imgSrc}
            className="w-[58px] h-[58px] object-cover rounded-[4px] mx-auto"
            alt="ad"
            loading="lazy"
          />
        )}
        <p className="text-[12px] font-[500] text-[#888]">
          {item.remarks || "No description"}
        </p>
      </Link>
    );
  };

  return (
    <div className="max-md:px-3 px-10 flex flex-col justify-center">
      <div className="grid w-full grid-cols-5 md:grid-cols-10 justify-center items-center gap-2 py-1">
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-[4px] animate-pulse">
                <div className="w-[58px] h-[58px] bg-white/30 rounded-[10px]" />
                <div className="w-12 h-3 text-white/30 rounded">小游戏</div>
              </div>
            ))
          : cur.map((item, index) => (
              <AdItemComponent key={index} item={item} />
            ))}
      </div>
    </div>
  );
};

export default HomeAds;