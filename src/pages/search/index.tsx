import React, { useEffect, useState } from "react";
import "./search.css";
import Navbar from "./components/overlay/Navbar";
import History from "./components/History";
import Everyone from "./components/Everyone";
import { useGetSearchLateQuery } from "./services/searchApi";
import Rankings from "./components/Rankings";
import Loader from "./components/Loader";
import Ads from "../../components/NewAds";
import { useLocation } from "react-router-dom";
import { useGetAdsQuery } from "../../services/helperService";

const Search: React.FC = () => {
  const {
    data: search_late,
    isLoading: lateLoading,
    isFetching: lateFetching,
    refetch,
  } = useGetSearchLateQuery();

  const location = useLocation();

  useEffect(() => {
    // Use a slight delay to ensure layout adjusts properly
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }, [location]);

  return (
    <>
      <div className="search-bg"></div>
      <Navbar />
      <div className="lg:container lg:mx-auto lg:px-[100px]">
        <div className="mt-[76px]">
          <Ads section={"search_input_under"} />
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
