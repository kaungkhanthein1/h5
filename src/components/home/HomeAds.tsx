import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HomeAds = ({ data, isLoading }: any) => {
  const [cur, setCur] = useState<any>([]);


  useEffect(() => {
    setCur(data);
  }, [data]);

  return (
    <div className="max-md:px-3 px-10 flex flex-col justify-center">
      <div className="grid w-full grid-cols-5 justify-center items-center gap-2">
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div className="flex flex-col items-center gap-[4px] animate-pulse">
                <div className="w-[52px] h-[52px] bg-white/30 rounded-[10px]" />
                <div className="w-12 h-3 text-white/30 rounded">小游戏</div>
              </div>
            ))
          : cur?.map((item: any, index: any) => (
              <Link
                className="flex flex-col justify-center items-center gap-[4px]"
                to={item?.data?.url || "#"}
                key={index}
              >
                <img
                  src={item?.data?.image}
                  className="w-[52px] h-[52px] object-cover rounded-[10px] mx-auto"
                  alt="ad"
                />
                <p className="text-[12px] font-[500] text-[#888]">
                  {item?.remarks || "No description"}
                </p>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default HomeAds;
