import { Link } from "react-router-dom";
import he from "he";
import cardSkeleton from "../../assets/imgLoading.png"; // Placeholder image
// import videoIcon from "../../assets/videoIcon.svg";
import LazyLoadImage from "./LazyLoadImage";

const MovieCard = ({
  movie,
  height,
  width = "114px",
  showDynamic = false,
  isSlider = false,
}) => {
  return (
    <div className="movie-item max-sm:h-auto cursor-default relative mt-2">
      <Link
        className={`block relative zoom-effect ${isSlider ? "w-[105px]" : ""}`}
        to={`/player/${movie?.id}`}
      >
        <div className={`img_a relative  w-full border-none`}>
          {movie?.cover?.length > 0 ? (
            <img
              src={movie.cover?.length ? movie?.cover : cardSkeleton}
              alt={movie.name}
              className={`movie_img rounded-[4px] border-none  cursor-default object-cover w-full`}
            />
          ) : (
            <LazyLoadImage
              src={movie.cover}
              alt={movie.name}
              className={`movie_img rounded-[4px] border-none  cursor-default object-cover w-full`}
            />
          )}

          {/* <img
            src={movie.cover?.length ? movie?.cover : cardSkeleton}
            alt={movie.name}
            className={`movie_img rounded-[4px] border-none  cursor-default object-cover w-full`}
          /> */}
          <div className="absolute rounded-[4px]  h-full w-full inset-0 bg-gradient-to-b from-transparent via-black/5 to-black"></div>
          <div className="flex absolute text-[10px] justify-between items-center px-3 bottom-2 w-full">
            <p className="flex-1 truncate text-white">{movie?.dynamic}</p>
            <p className="flex-1 flex justify-end text-white">
              {movie?.type_name}
            </p>
          </div>
        </div>

        <div className="overlay">
          {/* <img className="h-[40px]" src={videoIcon} alt="" /> */}
        </div>
        {movie?.label?.length ? (
          <div className="absolute top-0 right-0 search_card_score z-10">
            <p className="truncate text-center">{movie?.label}</p>
          </div>
        ) : (
          <></>
        )}
        {/* <div className="top-0 right-0 search_card_score truncate z-1 absolute w-[40px] flex justify-center items-center">
          <span>{movie?.label}</span>
        </div> */}
      </Link>

      <div className="text-container">
        <div className="movie-info">
          <h2
            className={`text-[12px] ${
              isSlider ? "w-[105px]" : ""
            } mt-[.14rem] leading-[18px] font-confortFont font-[400] text-white truncate`}
          >
            {he.decode(movie?.name || "Unknown Title")}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
