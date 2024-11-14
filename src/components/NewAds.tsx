import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetAdsTotalQuery } from "../features/share/AdsApi";

interface AdItem {
  data?: {
    url?: string;
    image?: string;
  };
  remarks?: string;
}

interface NewAdsProps {
  section: string;
}

const NewAds: React.FC<NewAdsProps> = ({ section }) => {
  const [cur, setCur] = useState<AdItem[] | undefined>([]);
  const { data, isLoading } = useGetAdsTotalQuery("");

  useEffect(() => {
    setCur(data?.data?.[section] as AdItem[]);
  }, [data, section]);

  return (
    <div className="max-md:px-3 px-10 flex justify-center">
      <div className="grid w-full grid-cols-5 justify-center items-center gap-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center gap-[4px] animate-pulse">
              <div className="w-[52px] h-[52px] bg-gray-300 rounded-[10px]" />
              <div className="w-12 h-3 bg-gray-300 rounded"></div>
            </div>
          ))
        ) : (
          cur?.map((item, index) => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default NewAds;
