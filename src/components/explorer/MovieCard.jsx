import he from "he";
// import videoIcon from "../../assets/videoIcon.svg";
import LazyLoadImage from "./LazyLoadImage";

const MovieCard = ({ movie, height }) => {
  return (
    <div className="movie-item max-sm:h-auto cursor-default relative mb-3">
      <div className="block relative zoom-effect">
        <div
          className={`relative w-full img_a h-[165px] border-none ${
            height ? `max-sm:h-[165px]` : "max-sm:h-[165px]"
          }`}
        >
          <LazyLoadImage
            src={movie.cover}
            alt={movie.name}
            className={`movie_img  h-[165px] rounded-lg border-none  ${
              height ? `max-sm:h-[165px]` : "max-sm:h-[165px]"
            } cursor-default object-cover w-full`}
          />
          <div className="absolute rounded-bl-lg rounded-br-lg  h-full w-full inset-0 bg-gradient-to-b from-transparent via-black/5 to-black"></div>
          <div className="flex absolute text-[10px] justify-between items-center px-3 bottom-2 w-full">
            <p>{movie?.dynamic}</p>
            <p>{movie?.type_name}</p>
          </div>
        </div>

        <div className="overlay">
          {/* <img className="h-[40px]" src={videoIcon} alt="" /> */}
        </div>
      </div>

      <div className="text-container">
        <div className="movie-info">
          <h2 className="text-[12px] mt-3 leading-[18px] font-confortFont font-[400] text-white truncate">
            {he.decode(movie?.name || "Unknown Title")}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;