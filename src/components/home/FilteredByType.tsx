import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import nodata from "../../assets/nodata.png";

import {
  useGetFilterByMoviesByTypeIdQuery,
  useGetHeaderTopicsQuery,
} from "../../pages/home/services/homeApi";
import Movies from "./Movies";
import axios from "axios";
import MovieCard from "./MovieCard";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../pages/search/components/Loader";
import FilterByTag from "./FilterByTag";
import {
  setSort,
  setClass,
  setArea,
  setYear,
  setSortName,
} from "../../pages/home/slice/HomeSlice";
import NewAds from "../NewAds";

const FilteredByType = () => {
  const activeTab = useSelector((state: any) => state.home.activeTab);
  const [movieData, setMovieData] = useState<any>([]);
  const [totalPage, setTotalPage] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [pageSize, setPageSize] = useState(9);
  const [page, setPage] = useState(1);
  const [page2, setPage2] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const sort = useSelector((state: any) => state.home.sort);
  const sortName = useSelector((state: any) => state.home.sortName);
  const classData = useSelector((state: any) => state.home.class);
  const area = useSelector((state: any) => state.home.area);
  const year = useSelector((state: any) => state.home.year);
  const [nomoredata, setNomoredata] = useState(false);
  const dispatch = useDispatch();
  const {
    data: configData,
    isLoading: isloader,
    isFetching,
  } = useGetHeaderTopicsQuery();
  const filteredTags: any = configData?.data?.movie_screen?.filter?.filter(
    (data: any) => data?.id === activeTab
  );

  const getMoviesByType = async (id: any) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/movie/screen/list?type_id=${id}&&sort=${sort}&&class=${classData}&&area=${area}&&year=${year}&&pageSize=${pageSize}&&page=${page}`
      );
      if (data?.data?.list?.length >= 0) {
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setNomoredata(true);
      }
      setMovieData(data?.data?.list);
      setTotalPage(data?.data?.total);
      if (data?.data?.total > page) setHasMore(true);
    } catch (err) {
      console.log("err is=>", err);
    }
  };

  const fetchData = async () => {
    setPage2((prev) => prev + 1);
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/movie/screen/list?type_id=${activeTab}&&sort=${sort}&&class=${classData}&&area=${area}&&year=${year}&&pageSize=${pageSize}&&page=${page2}`
    );
    if (data?.data?.list?.length >= 0) {
      setIsLoading(false);
    }
    // setMovieData(movieData.concat(data?.data?.list));
    setMovieData((prev: any) => [...prev, ...data?.data?.list]);
  };

  useEffect(() => {
    getMoviesByType(activeTab);
    window.scrollTo(0, 0);
    setPage(1);
    setPage2(2);
    setHasMore(true);
  }, [activeTab, sort, area, year, classData]);

  useEffect(() => {
    if (totalPage <= movieData?.length) {
      setHasMore(false);
    }
  }, [movieData]);

  useEffect(() => {
    dispatch(setSort("by_default"));
    dispatch(setSortName("综合"));
    dispatch(setClass("类型"));
    dispatch(setArea("地区"));
    dispatch(setYear("年份"));
  }, [activeTab]);

  if (isloader || isFetching) {
    return null; // Ensure you return null instead of undefined
  }

  return (
    <>
      <div className="home-bg"></div>
      <div className=" mt-[100px] text-text min-h-screen">
        <div className="">
          <FilterByTag
            data={filteredTags}
            sort={configData?.data?.movie_screen?.sort}
          />
          {/* <NewAds section="start" /> */}
          {isLoading ? (
            <div className="mt-10 flex justify-center items-center w-full">
              <Loader />
            </div>
          ) : movieData?.length ? (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 pl-3 lg:grid-cols-8 gap-y-5 gap-2 mt-0 pt-5 pb-10 px-3">
                {movieData?.map((movie: any) => (
                  <div key={movie?.id} className="mx-auto w-full">
                    <MovieCard movie={movie} height={"200px"} />
                  </div>
                ))}
              </div>
              <InfiniteScroll
                dataLength={movieData.length} //This is important field to render the next data
                next={fetchData}
                hasMore={hasMore}
                loader={
                  <div className="flex justify-center items-center w-full pb-0">
                    {/* {hasMore ? <Loader /> : "No More data"} */}
                    <Loader />
                  </div>
                }
              >
                <></>
                {/* {item} */}
              </InfiniteScroll>
            </>
          ) : (
            <div className="text-center flex justify-center flex-col items-center w-full pt-32 px-3">
              <img src={nodata} className="w-[110px]" alt="" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FilteredByType;
