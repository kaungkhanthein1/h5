import React from "react";
import MovieCard from "../../../components/home/MovieCard";

const RecommendedList = ({ data }: any) => {
  return (
    <div className="pb-16 px-5">
      <h1 className="text-white mb-3 my-5">继续观看</h1>
      <div className="flex justify-start items-center flex-wrap gap-4 mb-5">
        {data?.recommendList?.map((movie: any) => (
          <MovieCard movie={movie} height={"100px"} width={104} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedList;
