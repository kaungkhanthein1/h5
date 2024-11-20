import { useEffect, useState } from "react";
import Movies from "../../components/home/Movies";
import Banner from "../../components/home/Banner";
import { useGetRecommendedMoviesQuery } from "./services/homeApi";
import Loader from "../search/components/Loader";
import ContinueWatching from "../../components/home/ContinueWatching";
import { useDispatch, useSelector } from "react-redux";
import FilteredByType from "../../components/home/FilteredByType";
import { setActiveTab } from "./slice/HomeSlice";
import "../../components/home/home.css";
import { useGetRecordQuery } from "../profile/services/profileApi";
import Ads from "../../components/NewAds";
import NewAds from "../../components/NewAds";
import HomeAds from "../../components/home/HomeAds";

const Home: React.FC = () => {
  const [adsData, setAdsData] = useState<any>([]);
  const { data, isLoading } = useGetRecommendedMoviesQuery();
  const activeTab = useSelector((state: any) => state.home.activeTab);
  const { data: movies } = useGetRecordQuery();

  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(setActiveTab(0));
  }, []);

  const ads = data?.data?.filter((item: any) => item?.layout === "advert_self");

  return (
    <>
      <div className="home-bg"></div>
      {activeTab !== 0 ? (
        <FilteredByType />
      ) : (
        <>
          {data && !isLoading ? (
            <div className="text-text min-h-screen pb-24 flex flex-col gap-8">
              {data?.data?.map((movieData: any, index: any) => {
                if (movieData?.layout === "index_recommend_carousel") {
                  return (
                    <>
                      <Banner key={index} list={movieData?.list} />
                      {movies?.length !== 0 && <ContinueWatching />}
                      {/* <Ads section={"start"} /> */}
                      {/* <NewAds section={"screen_index"} /> */}
                      <HomeAds data={ads[0]?.data} isLoading={isLoading} />
                    </>
                  );
                } else if (movieData?.layout === "base") {
                  return <Movies key={index} movieData={movieData} />;
                }
              })}
            </div>
          ) : (
            <div className="flex justify-center items-center bg-cover min-h-screen home-bg">
              <Loader />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Home;
