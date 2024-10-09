import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageWithPlaceholder from "./bannerPlaceholder";
interface Movie {
  id: any;
  name: string;
  duration: any;
  playedTime: any;
  episode_name: any;
  last_episodeid: any;
  progress_time: any;
  cover: any;
}
const ContinueWatching = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const watchHistory = localStorage.getItem("lastWatchHistory");
    if (watchHistory) {
      const parsedData = JSON.parse(watchHistory);
      const movieDetails = [];

      for (const key in parsedData) {
        const movieData = parsedData[key];
        movieDetails.unshift({
          id: movieData.movieId,
          name: key,
          duration: movieData?.duration,
          playedTime: movieData?.playedTime,
          episode_name: movieData.episode_name,
          last_episodeid: movieData.episode_id,
          progress_time: movieData.progressTime,
          cover: movieData.image,
        });
      }

      setMovies(movieDetails.slice(0, 10)); // Limit to 10 movies
    }
  }, []);

  function formatDuration(durationInSeconds: any) {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = Math.floor(durationInSeconds % 60);

    // Add leading zeros if hours, minutes, or seconds are less than 10
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    const formattedDuration = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    return formattedDuration;
  }
  return (
    <>
      {movies?.length ? (
        <h1 className="text-sm uppercase text-white font-semibold flex items-center px-3">
          <span className="text-white font-headerFont">Continue Watching</span>
        </h1>
      ) : (
        <></>
      )}
      {movies.length !== 0 ? (
        <div className="flex overflow-x-scroll whitespace-nowrap watch_ten scrollbar-hide gap-4 ">
          {movies?.map((movie) => (
            <Link
              to={`/player/${movie.id}`}
              key={movie.id}
              className="min-w-[100px]"
            >
              <div className="relative">
                <ImageWithPlaceholder
                  src={movie?.cover}
                  alt={`Picture of ${movie?.name}`}
                  width={100}
                  height={65}
                  className="w-[100px] rounded-t-md h-[65px] object-cover object-center"
                />
                <div className="absolute watchedDuration bottom-[2px] right-[3px] ">
                  {formatDuration(movie.progress_time)}
                </div>
              </div>

              <div className="watchlist-item-progress">
                <div
                  className="progress-bar"
                  style={{
                    width: `${
                      movie?.duration
                        ? (movie?.progress_time / movie?.duration) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <div className="his-text mt-1">{movie.name}</div>
            </Link>
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default ContinueWatching;
