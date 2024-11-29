import { Link } from "react-router-dom";
import ImageWithPlaceholder from "../../pages/search/components/ImgPlaceholder";
import { useGetRecordQuery } from "../../pages/profile/services/profileApi";
import "./home.css";
import { useDispatch } from "react-redux";

const ContinueWatching = () => {
  const isLoggedIn = localStorage.getItem("authToken");
  const parsedLoggedIn = isLoggedIn ? JSON.parse(isLoggedIn) : null;
  const token = parsedLoggedIn?.data?.access_token;
  const { data } = useGetRecordQuery(undefined, { skip: !token }); // Fetch favorite movies list from API

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
      {/* Horizontal Scrolling Movie List */}
      {token && movies?.length !== 0 && (
        <div className="max-md:px-3 px-10">
          {latestMovies?.length > 0 && <h1 className="text-white font-headerFont">继续观看</h1>}
          <div className="flex overflow-x-scroll whitespace-nowrap scrollbar-hide gap-4 mt-5">
            {latestMovies?.map((movie: any) => (
              <Link
                to={`/player/${movie?.movie_id}`}
                key={movie.id}
                className="w-[136px]"
              >
                <div className="relative">
                  <ImageWithPlaceholder
                    src={movie?.cover}
                    alt={`Picture of ${movie?.movie_name}`}
                    width={136}
                    height={83}
                    className="w-[136px] rounded-t-md h-[86px] object-cover object-center"
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
        </div>
      )}
    </>
  );
};

export default ContinueWatching;
