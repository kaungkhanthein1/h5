import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageWithPlaceholder from "../../search/components/ImgPlaceholder";

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

const ProfileFirst = () => {
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
    <div className="profile-div">
      <div className="profile-div-main w-full">
        <Link to={"/history"} className="p-first">
          <div className="flex gap-3 items-center">
            <div>
              {/* SVG Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M11.1378 5.46V9.57154L14.5541 11.6212C14.7262 11.7245 14.8502 11.892 14.8988 12.0867C14.9474 12.2815 14.9166 12.4876 14.8133 12.6597C14.7099 12.8318 14.5424 12.9557 14.3477 13.0043C14.1529 13.0529 13.9468 13.0222 13.7747 12.9188L9.9914 10.6488C9.87943 10.5816 9.78678 10.4864 9.72247 10.3727C9.65816 10.259 9.62438 10.1306 9.62442 10V5.46C9.62442 5.25932 9.70414 5.06686 9.84604 4.92496C9.98795 4.78306 10.1804 4.70334 10.3811 4.70334C10.5818 4.70334 10.7742 4.78306 10.9161 4.92496C11.058 5.06686 11.1378 5.25932 11.1378 5.46ZM10.3811 0.920011C9.18744 0.917038 8.00506 1.15083 6.90237 1.60785C5.79968 2.06486 4.79857 2.73604 3.957 3.58253C3.26938 4.27866 2.65837 4.94831 2.05777 5.64917V3.94667C2.05777 3.74599 1.97804 3.55353 1.83614 3.41163C1.69424 3.26973 1.50178 3.19001 1.3011 3.19001C1.10042 3.19001 0.907958 3.26973 0.766056 3.41163C0.624153 3.55353 0.544434 3.74599 0.544434 3.94667V7.73C0.544434 7.93068 0.624153 8.12314 0.766056 8.26504C0.907958 8.40695 1.10042 8.48667 1.3011 8.48667H5.08443C5.28511 8.48667 5.47757 8.40695 5.61947 8.26504C5.76137 8.12314 5.84109 7.93068 5.84109 7.73C5.84109 7.52932 5.76137 7.33686 5.61947 7.19496C5.47757 7.05306 5.28511 6.97334 5.08443 6.97334H2.90901C3.58528 6.17695 4.25872 5.4269 5.02673 4.64943C6.07836 3.59781 7.41657 2.8794 8.87416 2.58399C10.3317 2.28858 11.8441 2.42925 13.2222 2.98844C14.6003 3.54762 15.783 4.50052 16.6226 5.72806C17.4622 6.9556 17.9215 8.40336 17.943 9.89042C17.9645 11.3775 17.5473 12.8379 16.7436 14.0892C15.9398 15.3406 14.7851 16.3273 13.4238 16.9261C12.0624 17.5249 10.5548 17.7093 9.0893 17.4561C7.62378 17.203 6.26535 16.5236 5.18374 15.5028C5.11145 15.4345 5.02641 15.3811 4.93348 15.3457C4.84056 15.3102 4.74155 15.2934 4.64213 15.2962C4.54271 15.299 4.44481 15.3214 4.35404 15.3621C4.26326 15.4027 4.18137 15.4608 4.11306 15.5331C4.04474 15.6054 3.99134 15.6904 3.95589 15.7834C3.92044 15.8763 3.90364 15.9753 3.90645 16.0747C3.90926 16.1741 3.93162 16.272 3.97227 16.3628C4.01291 16.4536 4.07104 16.5355 4.14332 16.6038C5.22105 17.6208 6.53132 18.3586 7.95976 18.7528C9.38821 19.147 10.8914 19.1856 12.3382 18.8652C13.785 18.5449 15.1314 17.8753 16.2599 16.9149C17.3884 15.9545 18.2647 14.7326 18.8124 13.3556C19.36 11.9787 19.5623 10.4887 19.4016 9.01556C19.241 7.54246 18.7222 6.13106 17.8907 4.90455C17.0591 3.67803 15.94 2.67368 14.631 1.97914C13.322 1.2846 11.8629 0.920975 10.3811 0.920011Z"
                  fill="white"
                  fillOpacity="0.6"
                />
              </svg>
            </div>
            <div className="profile-text">History</div>
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <g opacity="0.2">
                <path
                  d="M13.1722 12L8.22217 7.04999L9.63617 5.63599L16.0002 12L9.63617 18.364L8.22217 16.95L13.1722 12Z"
                  fill="white"
                />
              </g>
            </svg>
          </div>
        </Link>

        {/* Horizontal Scrolling Movie List */}
        {movies.length !== 0 && (
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
        )}

        <Link to={"/favorites"} className="p-first">
          <div className="flex gap-3 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="22"
              viewBox="0 0 16 22"
              fill="none"
            >
              <path
                d="M1.12085 1.26069V1.25329L1.1207 1.24589C1.11816 1.11716 1.16674 0.992665 1.2558 0.899681C1.34331 0.808323 1.46288 0.754697 1.58913 0.75H14.4102C14.5365 0.75462 14.6562 0.80823 14.7438 0.899621C14.8329 0.992611 14.8815 1.11713 14.8789 1.24589L14.8788 1.25329V1.26069V20.7377H14.8787L14.8789 20.7469C14.8801 20.8464 14.8521 20.944 14.7984 21.0277C14.7451 21.1107 14.6689 21.1764 14.579 21.2169C14.5051 21.2486 14.4234 21.2578 14.3442 21.2434L14.2097 21.9812L14.3442 21.2434C14.2642 21.2288 14.1903 21.1907 14.132 21.134L14.132 21.1339L14.1248 21.1271L8.79625 16.0801C8.79581 16.0797 8.79537 16.0793 8.79494 16.0789C8.58051 15.8749 8.29586 15.7611 7.99986 15.7611C7.70383 15.7611 7.41915 15.8749 7.20471 16.0789C7.2043 16.0793 7.20389 16.0797 7.20348 16.0801L1.87483 21.1271L1.8748 21.1271L1.86825 21.1334C1.80972 21.1902 1.73564 21.2283 1.6554 21.243C1.57609 21.2574 1.49432 21.2483 1.4202 21.2167C1.33049 21.1762 1.25443 21.1106 1.20126 21.0277C1.14755 20.944 1.11957 20.8464 1.12079 20.7469H1.12085V20.7377V1.26069Z"
                stroke="white"
                stroke-opacity="0.6"
                stroke-width="1.5"
              />
            </svg>
            <div className="profile-text">My Collection</div>
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <g opacity="0.2">
                <path
                  d="M13.1722 12L8.22217 7.04999L9.63617 5.63599L16.0002 12L9.63617 18.364L8.22217 16.95L13.1722 12Z"
                  fill="white"
                />
              </g>
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProfileFirst;
