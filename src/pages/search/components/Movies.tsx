// import Ads from "./Ads";
import NewAds from "../../../components/NewAds";
import Ads from "../components/Ads";
import MovieCard from "./MovieCard";

const Movies = ({
  movies,
  advert,
  adLoading,
  adFetching,
  updateMovieCollectStatus,
}: {
  movies: any;
  advert: any;
  adLoading: any;
  adFetching: any;
  updateMovieCollectStatus: any;
}) => {
  return (
    <div className="mb-5 mt-[150px]">
      {/* <div className="movie_title px-4 py-1">
        共 {movies?.length} 条搜索结果
      </div> */}
      {adLoading || adFetching ? (
        <div className="ads text-white"></div>
      ) : (
        <div className="my-3">
          {/* <Ads advert={advert} /> */}
          {/* <Ads /> */}
          <NewAds section={'search_result_up'} />
        </div>
      )}

      {movies?.map((movie: any, index: any) => (
        <div key={index}>
          <MovieCard
            movie={movie}
            updateMovieCollectStatus={updateMovieCollectStatus}
          />
        </div>
      ))}
    </div>
  );
};

export default Movies;
