import { useEffect, useState } from "react";
import rate from "../../assets/rate.svg";
import {
  useGetMovieRankingByIdQuery,
  useGetMovieRankingListQuery,
} from "../../pages/explorer/services/explorerAPi";
import RatingCard from "./RatingCard";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setActiveRank } from "../../pages/explorer/slice/ExploreSlice";
import NewAds from "../NewAds";

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
  const activeRank = useSelector((state: any) => state?.explore?.activeRank);
  const dispatch = useDispatch();
  const [rankingDataById, setRankingDataById] = useState([]);
  const [id, setId] = useState(0);
  const { data } = useGetMovieRankingListQuery();

  const getRankingById = async (id: any) => {
    const { data } = await axios(
      `${process.env.REACT_APP_API_URL}/movie/ranking/data?id=${id}`
    );
    setRankingDataById(data?.data);
    // console.log(data);
  };

  useEffect(() => {
    getRankingById(activeRank ? activeRank : id);
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
                dispatch(setActiveRank(item?.id));
                setId(item?.id);
              }}
              key={index}
            >
              <p
                className={`${
                  activeRank
                    ? activeRank === item?.id
                      ? "text-white"
                      : "text-gray-400"
                    : activeTab === index
                    ? "text-white"
                    : "text-gray-400"
                } whitespace-nowrap py-2 rounded-lg hover:text-white transition-colors`}
              >
                {item?.title}
              </p>
              <div
                className={`w-[29px] h-[3px] bg-[#F54100] absolute left-[20px] ${
                  activeRank
                    ? activeRank === item?.id
                      ? "opacity-1"
                      : "opacity-0"
                    : activeTab === index
                    ? "opacity-1"
                    : "opacity-0"
                }`}
              ></div>
            </div>
          ))}
        </nav>

      </div>
        <NewAds section="ranking" />
      <div className="px-3 pt-5 flex flex-col gap-7">
        {data?.data[activeRank ? activeRank : activeTab]?.movie_data?.length
          ? data?.data[activeRank ? activeRank : activeTab]?.movie_data?.map(
              (item: any, index: any) => (
                <RatingCard movie={item} key={index} index={index} />
              )
            )
          : rankingDataById?.map((item: any, index: any) => (
              <RatingCard movie={item} key={index} index={index} />
            ))}
      </div>
    </div>
  );
};

export default Tab4;
