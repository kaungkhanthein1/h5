import React, { useEffect, useState } from "react";
import {
  useGetFilterByMoviesByTypeIdQuery,
  useGetHeaderTopicsQuery,
} from "../../pages/home/services/homeApi";
import Movies from "./Movies";
import axios from "axios";
import MovieCard from "./MovieCard";
import { useSelector } from "react-redux";
import Loader from "../../pages/search/components/Loader";
import FilterByTag from "./FilterByTag";

const FilteredByType = () => {
  const activeTab = useSelector((state: any) => state.home.activeTab);
//   console.log(activeTab);
  const [movieData, setMovieData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const getMoviesByType = async (id: any) => {
    setIsLoading(true);
    const { data } = await axios.get(
      `https://cc3e497d.qdhgtch.com:2345/api/v1/movie/screen/list?type_id=${id}`
    );
    if (data?.data?.list?.length >= 0) setIsLoading(false);
    setMovieData(data?.data?.list);
    // console.log(data?.data?.list);
  };
  const { data: configData } = useGetHeaderTopicsQuery();
  const filteredTags = configData?.data?.movie_screen?.filter?.filter(
    (data: any) => data?.id === activeTab
  );

  useEffect(() => {
    getMoviesByType(activeTab);
  }, [activeTab]);

  return (
    <div className="bg-background text-text min-h-screen">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen bg-background">
          <Loader />
        </div>
      ) : (
        <div className="pt-32">
          <FilterByTag data={filteredTags} />

          {movieData?.length ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 pt-5 pb-32 px-3">
              {movieData?.map((movie: any) => (
                <div key={movie?.id} className="mx-auto">
                  <MovieCard movie={movie} height={"200px"} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center flex justify-center items-center w-full pt-32 px-3">
              <h1 className="text-white font-semibold text-[16px]">
                Movie Data Not Found
              </h1>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilteredByType;
