import { useEffect, useState } from "react";
import rate from "../../assets/rate.svg";
import {
  useGetMovieRankingByIdQuery,
  useGetMovieRankingListQuery,
} from "../../pages/explorer/services/explorerAPi";
import RatingCard from "./RatingCard";
import axios from "axios";

// Define the type for the movie data
interface Movie {
  cover: string;
  name: string;
  year: string;
  tags: { id: number; name: string }[];
}

// Define the type for each ranking item
interface RankingItem {
  title: string;
  movie_data: Movie[];
}

const Tab4 = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [rankingDataById, setRankingDataById] = useState([]);
  const [id, setId] = useState(0);
  const { data } = useGetMovieRankingListQuery();

  const getRankingById = async (id: any) => {
    const { data } = await axios(
      `https://cc3e497d.qdhgtch.com:2345/api/v1//movie/ranking/data?id=${id}`
    );
    setRankingDataById(data?.data);
    console.log(data);
  };

  useEffect(() => {
    getRankingById(id);
  }, [id]);

  return (
    <div className="pb-32 min-h-screen">
      <div className="w-full px-3">
        <nav className="flex overflow-x-scroll no-scrollbar pb-5 gap-3 remove-scrollbar">
          {data?.data?.map((item: any, index: number) => (
            <div
              className="relative"
              onClick={() => {
                setActiveTab(index);
                setId(item?.id);
              }}
              key={index}
            >
              <p
                className={`${
                  activeTab === index ? "text-white" : "text-gray-800"
                } whitespace-nowrap py-2 rounded-lg hover:text-white transition-colors`}
              >
                {item?.title}
              </p>
              <div
                className={`w-[29px] h-[3px] bg-[#F54100] absolute left-[20px] ${
                  activeTab === index ? "opacity-1" : "opacity-0"
                }`}
              ></div>
            </div>
          ))}
        </nav>
      </div>
      <div className="px-3">
        {data?.data[activeTab]?.movie_data?.length
          ? data?.data[activeTab]?.movie_data?.map((item: any, index: any) => (
              <RatingCard movie={item} key={index} index={index} />
            ))
          : rankingDataById?.map((item: any, index: any) => (
              <RatingCard movie={item} key={index} index={index} />
            ))}
      </div>
    </div>
  );
};

export default Tab4;
