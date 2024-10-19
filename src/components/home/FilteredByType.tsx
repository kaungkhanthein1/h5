import React, { useEffect, useState } from "react";
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
} from "../../pages/home/slice/HomeSlice";

const FilteredByType = () => {
  const activeTab = useSelector((state: any) => state.home.activeTab);
  const [movieData, setMovieData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const sort = useSelector((state: any) => state.home.sort);
  const classData = useSelector((state: any) => state.home.class);
  const area = useSelector((state: any) => state.home.area);
  const year = useSelector((state: any) => state.home.year);
  const dispatch = useDispatch();

  const getMoviesByType = async (id: any) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `https://cc3e497d.qdhgtch.com:2345/api/v1/movie/screen/list?type_id=${id}&&sort=${sort}&&class=${classData}&&area=${area}&&year=${year}`
      );
      if (data?.data?.list?.length >= 0) setIsLoading(false);
      setMovieData(data?.data?.list);
    } catch (err) {
      console.log("err is=>", err);
    }
  };
  const {
    data: configData,
    isLoading: isloader,
    isFetching,
  } = useGetHeaderTopicsQuery();
  const filteredTags: any = configData?.data?.movie_screen?.filter?.filter(
    (data: any) => data?.id === activeTab
  );

  useEffect(() => {
    getMoviesByType(activeTab);
    window.scrollTo(0, 0);
  }, [activeTab, sort, area, year, classData]);

  useEffect(() => {
    dispatch(setSort(configData?.data?.movie_screen?.sort[0]?.value));
    dispatch(setClass(filteredTags && filteredTags[0]?.class[0]));
    dispatch(setArea(filteredTags && filteredTags[0]?.area[0]));
    dispatch(setYear(filteredTags && filteredTags[0]?.year[0]));
  }, []);

  // console.log(filteredTags);

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

          {movieData?.length ? (
            <>
              {isLoading ? (
                <div className="mt-10 flex justify-center items-center w-full">
                  <Loader />
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 pl-3 lg:grid-cols-8 gap-y-5 gap-2 mt-0 pt-5 pb-32 px-3">
                  {movieData?.map((movie: any) => (
                    <div key={movie?.id} className="mx-auto w-full">
                      <MovieCard movie={movie} height={"200px"} />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center flex justify-center items-center w-full pt-32 px-3">
              <Loader />
              {/* <h1 className="text-white font-semibold text-[16px]">
              Movie Data Not Found
            </h1> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FilteredByType;
