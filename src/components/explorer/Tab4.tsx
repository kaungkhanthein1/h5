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
import Loader from "../../pages/search/components/Loader";
import { convertToSecureUrl } from "../../services/newEncryption";

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
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const activeRank = useSelector((state: any) => state?.explore?.activeRank);
  const dispatch = useDispatch();
  const [rankingDataById, setRankingDataById] = useState([]);
  const [id, setId] = useState(0);
  const { data } = useGetMovieRankingListQuery();

  const getRankingById = async (id: any) => {
    // Retrieve settings from localStorage
    const settings = JSON.parse(
      localStorage.getItem("movieAppSettings") || "{}"
    );

    // Set the X-Client-Setting header dynamically
    const headers = {
      "X-Client-Setting": JSON.stringify({
        "pure-mode": settings.filterToggle ? 1 : 0,
      }),
    };
    setIsLoading(true);
    const { data } = await axios(
      convertToSecureUrl(
        `${process.env.REACT_APP_API_URL}/movie/ranking/data?id=${id}`
      ),
      { headers }
    );
    setRankingDataById(data?.data);
    // console.log(data);
    if (data?.data) setIsLoading(false);
  };

  useEffect(() => {
    getRankingById(activeRank ? activeRank : id);
  }, [id]);

  return (
    <div className="pb-32 min-h-screen">
      <div className="w-full px-3 sticky top-[50px] z-50 bg-background">
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
      {isLoading ? (
        <div className="w-full flex justify-center items-center h-[70vh]">
          <Loader />
        </div>
      ) : (
        <div className="px-3 pt-5 flex flex-col gap-3">
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
      )}
    </div>
  );
};

export default Tab4;
