import React, { useState } from "react";
import "./search.css";
import Navbar from "./components/overlay/Navbar";
import Ads from "./components/Ads";
import History from "./components/History";
import Everyone from "./components/Everyone";
import { useGetAdsQuery, useGetSearchLateQuery } from "./services/searchApi";
import Rankings from "./components/Rankings";
import Loader from "./components/Loader";

const Search: React.FC = () => {
  const {
    data: ads,
    isLoading: adLoading,
    isFetching: adFetching,
  } = useGetAdsQuery();
  const {
    data: search_late,
    isLoading: lateLoading,
    isFetching: lateFetching,
    refetch,
  } = useGetSearchLateQuery();

  const advert = ads?.data?.search_result_up?.data;

  return (
    <>
      <div className="search-bg"></div>
      <Navbar />
      <div className="lg:container lg:mx-auto lg:px-[100px]">
        <div className="mt-[70px]">
          {adLoading || adFetching ? (
            <div className="ads h-[100px] text-white">
              <Loader />
            </div>
          ) : (
            <Ads advert={advert} />
          )}
        </div>
        <History />
        <Everyone
          lists={search_late?.data}
          Loading={lateLoading}
          Fetching={lateFetching}
          refetch={refetch}
        />
        <Rankings />
      </div>
    </>
  );
};

export default Search;
