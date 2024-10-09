import Ads from "./Ads";
import MovieCard from "./MovieCard";

const Movies = ({
  movies,
  advert,
  adLoading,
  adFetching,
}: {
  movies: any;
  advert: any;
  adLoading: any;
  adFetching: any;
}) => {
  return (
    <div className="mb-5">
      <div className="movie_title px-3 py-1">
        共 {movies?.length} 条搜索结果
      </div>
      {adLoading || adFetching ? (
        <div className="ads text-white">Ads Loading...</div>
      ) : (
        <div className="my-3">
          <Ads advert={advert} />
        </div>
      )}

      {movies?.map((movie: any, index: any) => (
        <div key={index}>
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
};

export default Movies;
