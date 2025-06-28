import Movies from "../../components/home/Movies";
import Banner from "../../components/home/Banner";
import { useGetRecommendedMoviesQuery } from "./services/homeApi";
import Loader from "../search/components/Loader";
import ContinueWatching from "../../components/home/ContinueWatching";
import { useSelector } from "react-redux";
import FilteredByType from "../../components/home/FilteredByType";
import "../../components/home/home.css";
import { useGetRecordQuery } from "../profile/services/profileApi";
import HomeAds from "../../components/home/HomeAds";
import { useEffect } from "react";

const Home: React.FC = () => {
  const { data, isLoading, refetch } = useGetRecommendedMoviesQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,        // optional: refetch if internet reconnects
    refetchOnFocus: true,            // optional: refetch when tab is focused, // Refetch if data is older than 60 seconds
  });
  // console.log(data, "data");
  const activeTab = useSelector((state: any) => state.home.activeTab);
  const isLoggedIn = localStorage.getItem("authToken");
  const parsedLoggedIn = isLoggedIn ? JSON.parse(isLoggedIn) : null;
  const token = parsedLoggedIn?.data?.access_token;
  const { data: movies } = useGetRecordQuery(undefined, { skip: !token });

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     refetch(); // Force refetch every 2 minutes
  //   }, 10000);
  //   return () => clearInterval(interval);
  // }, [refetch]);

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, [activeTab]);

  useEffect(()=>{
    if(activeTab === 0) {
      refetch();
    }
  },[activeTab])

  return (
    <>
      <div className="home-bg"></div>
      {activeTab !== 0 ? (
        <FilteredByType />
      ) : (
        <>
          {data && !isLoading ? (
            <div className="text-text min-h-screen pb-24 flex flex-col gap-5">
              {data?.data?.map((movieData: any, index: any) => {
                if (movieData?.layout === "index_recommend_carousel") {
                  return (
                    <>
                      <Banner key={index} list={movieData?.list} />
                      {movies?.length !== 0 && <ContinueWatching />}
                    </>
                  );
                } else if (movieData?.layout === "advert_self") {
                  return (
                    <HomeAds data={movieData?.data} isLoading={isLoading} />
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
