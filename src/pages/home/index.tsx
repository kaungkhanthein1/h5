import { useEffect, useState } from "react";
import Movies from "../../components/home/Movies";
import Banner from "../../components/home/Banner";
import { useGetRecommendedMoviesQuery } from "./services/homeApi";
import Loader from "../search/components/Loader";
import ContinueWatching from "../../components/home/ContinueWatching";
import { useDispatch, useSelector } from "react-redux";
import FilteredByType from "../../components/home/FilteredByType";
import { setActiveTab } from "./slice/HomeSlice";

const Home: React.FC = () => {
  const { data, isLoading } = useGetRecommendedMoviesQuery();
  const activeTab = useSelector((state: any) => state.home.activeTab);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setActiveTab(0));
  }, []);
  return (
    <>
      {/* <FilteredByType /> */}
      {activeTab !== 0 ? (
        <FilteredByType />
      ) : (
        <>
          {data && !isLoading ? (
            <div className="bg-background text-text min-h-screen pb-32 flex flex-col gap-10">
              {data?.data?.map((movieData: any, index: any) => {
                if (movieData?.layout === "index_recommend_carousel") {
                  return (
                    <>
                      <Banner key={index} list={movieData?.list} />
                      <div className="">
                        <ContinueWatching />
                      </div>
                    </>
                  );
                } else if (movieData?.layout === "base") {
                  return <Movies key={index} movieData={movieData} />;
                }
              })}
            </div>
          ) : (
            <div className="flex justify-center items-center min-h-screen bg-background">
              <Loader />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Home;
