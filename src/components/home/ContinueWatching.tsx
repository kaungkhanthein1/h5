import React, { startTransition, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImageWithPlaceholder from "./bannerPlaceholder";
import {
  useGetListQuery,
  useGetRecordQuery,
} from "../../pages/profile/services/profileApi";
import { useDispatch } from "react-redux";
import { setAuthModel } from "../../features/login/ModelSlice";
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
  const {
    data: favoriteMovies,
    // isLoading: isFavoritesLoading,
    // isFetching: isFavoritesFetching,
  } = useGetListQuery({ page: 1 });
  const { data, isLoading, isFetching, refetch } = useGetRecordQuery(); // Fetch favorite movies list from API

  // const [movies, setMovies] = useState<Movie[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const favorites = favoriteMovies?.data?.list?.slice(0, 10);
  const movies = data?.data;
  const moviesData = data?.data; // Assuming `data` is the fetched data containing your movie information

  // Extract all movies from the 'list' array in each 'data' object and flatten into a single array
  const allMovies = moviesData
    ?.map((section: any) => section.list) // Get the 'list' array from each section
    ?.flat(); // Flatten the arrays into a single array

  // Sort the movies by 'update_time' in descending order and take the latest 10 movies
  const latestMovies = allMovies
    ?.sort((a: any, b: any) => b.update_time - a.update_time) // Sort by update_time (newest first)
    ?.slice(0, 10); // Take the latest 10 movies

  const isLoggedIn = localStorage.getItem("authToken");
  const parsedLoggedIn = isLoggedIn ? JSON.parse(isLoggedIn) : null;
  const token = parsedLoggedIn?.data?.access_token;

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

  const handleFavoritesClick = () => {
    if (!token) {
      // If not logged in, open the login modal
      startTransition(() => {
        dispatch(setAuthModel(true));
      });
    } else {
      // If logged in, redirect to the favorites page
      navigate("/favorites");
    }
  };
  const handleHistoryClick = () => {
    if (!token) {
      // If not logged in, open the login modal
      startTransition(() => {
        dispatch(setAuthModel(true));
      });
    } else {
      // If logged in, redirect to the favorites page
      navigate("/history");
    }
  };
  return (
    <>
      {movies?.length !== 0 ? (
        <div className="text-sm uppercase text-white font-semibold flex items-center px-3 justify-between w-full">
          <span className="text-white font-headerFont">Continue Watching</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="12"
            viewBox="0 0 4 12"
            fill="none"
          >
            <path
              d="M3.57562 6.25726L0.939439 10.8934C0.905655 10.9272 0.865548 10.954 0.821408 10.9723C0.777267 10.9906 0.729957 11 0.682179 11C0.634402 11 0.587092 10.9906 0.542951 10.9723C0.498811 10.954 0.458703 10.9272 0.42492 10.8934C0.391136 10.8597 0.364337 10.8195 0.346053 10.7754C0.32777 10.7313 0.318359 10.684 0.318359 10.6362C0.318359 10.5884 0.32777 10.5411 0.346053 10.497C0.364337 10.4528 0.391136 10.4127 0.42492 10.3789L2.80429 6L0.42492 1.62108C0.35669 1.55285 0.318359 1.46031 0.318359 1.36382C0.318359 1.26733 0.35669 1.17479 0.42492 1.10656C0.493149 1.03833 0.585688 1 0.682179 1C0.778671 1 0.87121 1.03833 0.939439 1.10656L3.57562 5.74274C3.60943 5.77651 3.63625 5.81661 3.65455 5.86076C3.67284 5.9049 3.68226 5.95221 3.68226 6C3.68226 6.04779 3.67284 6.0951 3.65455 6.13924C3.63625 6.18339 3.60943 6.22349 3.57562 6.25726Z"
              fill="white"
              stroke="white"
              strokeWidth="0.5"
            />
          </svg>
        </div>
      ) : (
        <></>
      )}
      {movies?.length !== 0 ? (
        <div className="flex overflow-x-scroll whitespace-nowrap watch_ten scrollbar-hide gap-4 ">
          {latestMovies?.map((movie: any) => (
            <Link
              to={`/player/${movie?.id}`}
              key={movie.id}
              className="w-[150px]"
            >
              <div className="relative">
                <ImageWithPlaceholder
                  src={movie?.cover}
                  alt={`Picture of ${movie?.movie_name}`}
                  width={150}
                  height={85}
                  className="w-[150px] rounded-t-md h-[86px] object-cover object-center"
                />
                <div className="absolute watchedDuration bottom-[2px] right-[3px] ">
                  {formatDuration(movie?.current_time)}
                </div>
              </div>

              <div className="watchlist-item-progress">
                <div
                  className="progress-bar"
                  style={{
                    width: `${
                      movie?.duration
                        ? (movie?.current_time / movie?.duration) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <div className="his-text mt-1">{movie?.movie_name}</div>
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
