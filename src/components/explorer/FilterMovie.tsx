import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetHeaderTopicsQuery } from "../../pages/home/services/homeApi";
import MovieCard from "./MovieCard";
import Loader from "../../pages/search/components/Loader";
import FilterTag from "./FilterTag";
import { Link } from "react-router-dom";

const FilterMovie = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [movieData, setMovieData] = useState([]);
  const dispatch = useDispatch();
  const activeTab = useSelector((state: any) => state.explore.activeTab);
  const sort = useSelector((state: any) => state.explore.sort);
  const classData = useSelector((state: any) => state.explore.class);
  const area = useSelector((state: any) => state.explore.area);
  const year = useSelector((state: any) => state.explore.year);

  const getMoviesByType = async (id: any) => {
    setIsLoading(true);
    const { data } = await axios.get(
      `https://cc3e497d.qdhgtch.com:2345/api/v1/movie/explore/list?type_id=${id}&&sort=${sort}&&class=${classData}&&area=${area}&&year=${year}`
    );
    if (data?.data?.list?.length >= 0) setIsLoading(false);
    setMovieData(data?.data?.list);
  };

  useEffect(() => {
    getMoviesByType(activeTab);
  }, [activeTab, sort, area, year, classData]);

  return (
    <div className="bg-background text-text min-h-screen">
      <div className="">
        <FilterTag />
        {movieData?.length ? (
          <>
            {isLoading ? (
              <div className="flex w-full justify-center items-center mt-10">
                <Loader />
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 pt-5 pb-32 px-3">
                {movieData?.map((movie: any) => (
                  <Link
                    to={`/player/${movie?.id}`}
                    key={movie?.id}
                    className="mx-auto"
                  >
                    <MovieCard movie={movie} height={"200px"} />
                  </Link>
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
  );
};

export default FilterMovie;
