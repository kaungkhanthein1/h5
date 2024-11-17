import { Link, useNavigate } from "react-router-dom";
import he from "he";
// import videoIcon from "../../assets/videoIcon.svg";
import LazyLoadImage from "../../../components/home/LazyLoadImage";

const MovieCard = ({
  movie,
  height = "165px",
  width = "114px",
  showRecommandMovie,
}) => {
  const navigate = useNavigate();
  const showMovie = () => {
    console.log("heeeee");
    // navigate(`/player/${movie?.id}`);
    showRecommandMovie(movie?.id);
  };
  return (
    <div
      className={`movie-item max-sm:h-auto cursor-default relative mt-2`}
      style={{ width: "100%" }}
    >
      <div className="block relative zoom-effect" onClick={showMovie}>
        <div
          className={`relative img_a border-none ${
            height ? `max-sm:h-[${height}]` : "max-sm:h-[165px]"
          }`}
          style={{ width: "100%" }}
        >
          <LazyLoadImage
            src={movie.cover}
            alt={movie.name}
            className={`movie_img  h-[165px] rounded-lg border-none  ${
              height ? `max-sm:h-[${height}]` : "max-sm:h-[165px]"
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
        <div className="top-0 right-0 search_card_score z-1 absolute w-[50px] px-1">
          <span className="truncate">{movie?.dynamic}</span>
        </div>
      </div>

      <div className="text-container">
        <div className="movie-info">
          <h2 className="text-[12px] mt-3 leading-[18px] font-confortFont font-[400] text-white two-line-truncate">
            {he.decode(movie?.name || "Unknown Title")}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
