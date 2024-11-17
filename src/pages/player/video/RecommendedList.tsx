import React from "react";
import MovieCard from "./MovieCard";

const RecommendedList = ({ data, showRecommandMovie }: any) => {
  return (
    <div className="pb-16 px-5">
      <h1 className="text-white mb-3 my-5">继续观看</h1>
      <div 
        className="grid gap-4 mb-5" 
        style={{ 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gridGap: '15px' 
        }}
      >
        {data?.recommendList?.map((movie: any) => (
          <MovieCard key={movie.id} movie={movie} showRecommandMovie={showRecommandMovie}/>
        ))}
      </div>
    </div>
  );
};

export default RecommendedList;