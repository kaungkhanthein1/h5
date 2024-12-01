import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HomeAds = ({ data, isLoading }: any) => {
  const [cur, setCur] = useState<any>([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setCur(data);
  }, [data]);

  return (
    <div className="max-md:px-3 px-10 flex flex-col justify-center">
      <div className="grid w-full grid-cols-5 md:grid-cols-10 justify-center items-center gap-2 py-1">
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div className="flex flex-col items-center gap-[4px] animate-pulse">
                <div className="w-[58px] h-[58px] bg-white/30 rounded-[10px]" />
                <div className="w-12 h-3 text-white/30 rounded">小游戏</div>
              </div>
            ))
          : cur?.map((item: any, index: any) => (
              <Link
                target="_blank"
                className="flex flex-col justify-center items-center gap-[4px]"
                to={item?.data?.url || "#"}
                key={index}
              >
                {!load && (
                  <div className="w-[58px] h-[58px] object-cover rounded-[4px] mx-auto bg-white/15 animate-pulse flex justify-center items-center">
                    <p className="text-[12px] font-[500] text-[#888]">
                      {item?.remarks}
                    </p>
                  </div>
                )}
                  <img
                    onLoad={() => setLoad(true)}
                    src={item?.data?.image}
                    className={`w-[58px] h-[58px] object-cover rounded-[4px] mx-auto ${!load && 'hidden'}`}
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
