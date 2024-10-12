import React from "react";
import MovieCard from "../../../components/home/MovieCard";

const RecommendedList = ({ data }: any) => {
  return (
    <div className="pb-20 px-3">
      <h1 className="text-white mb-3 my-5 text-[16px]">相关推荐</h1>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {data?.recommendList?.map((movie: any) => (
          <div style={{width: '30%'}}>
          <MovieCard movie={movie} height={"100px"} width={"200px"} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedList;
