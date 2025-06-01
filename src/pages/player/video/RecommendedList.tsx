import React from "react";
// import MovieCard from "./MovieCard";
import MovieCard from "./MovieCard";

const RecommendedList = ({ data, showRecommandMovie }: any) => {
  return (
    <div className="pb-16 px-5">
      <h1 className="text-white mb-3 my-5 text-[18px]">相关推荐</h1>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 pt-1">
        {data?.recommendList?.map((movie: any) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            height={"200px"}
            showRecommandMovie={showRecommandMovie}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendedList;
