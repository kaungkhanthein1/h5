import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetAdsQuery } from "../services/helperService";

interface AdItem {
  data?: {
    url?: string;
    image?: string;
  };
  remarks?: string;
}

interface NewAdsProps {
  section: string;
  fromMovie?: boolean;
}

const NewAds: React.FC<NewAdsProps> = ({ section, fromMovie = false }) => {
  const [cur, setCur] = useState<AdItem[] | undefined>([]);
  const { data, isLoading } = useGetAdsQuery();
  const [load, setLoad] = useState(false);


  // console.log(data);

  useEffect(() => {
    if(data?.data?.[section]) {
      setCur(data?.data?.[section] as AdItem[]);
    }
  }, [data, section]);

  return (
    <div className={`${fromMovie ? '' : 'max-md:px-3 px-10'} flex flex-col justify-center py-1`}>
      <div className="grid w-full grid-cols-5 md:grid-cols-10 justify-center items-center gap-2">
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <div className="flex flex-col items-center gap-[4px] animate-pulse mb-1">
                <div className="w-[58px] h-[58px] bg-white/30 rounded-[4px]" />
                {/* <div className="w-12 h-3 text-white/30 rounded">小游戏</div> */}
              </div>
            ))
          : cur && cur.length > 0 && cur?.map((item, index) => (
            <Link
            target="_blank"
            className="flex flex-col justify-center items-center gap-[4px]"
            to={item?.data?.url || "#"}
            key={index}
          >
            {!load && (
              <div className="w-[58px] h-[58px] object-cover rounded-[8px] mx-auto bg-white/15 animate-pulse flex justify-center items-center">
                <p className="text-[12px] font-[500] text-[#888]">
                  {item?.remarks}
                </p>
              </div>
            )}
              <img
                onLoad={() => setLoad(true)}
                src={item?.data?.image}
                className={`w-[58px] h-[58px] object-cover rounded-[8px] mx-auto ${!load && 'hidden'}`}
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

export default NewAds;
