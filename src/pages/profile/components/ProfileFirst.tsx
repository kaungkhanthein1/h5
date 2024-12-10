import { startTransition, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImageWithPlaceholder from "../../search/components/ImgPlaceholder";
import { setAuthModel } from "../../../features/login/ModelSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetListQuery,
  useGetRecordQuery,
  useGetUserQuery,
} from "../services/profileApi";
import { showToast } from "../error/ErrorSlice";

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
  // Check for token in localStorage
  const isLoggedIn = localStorage.getItem("authToken");
  const parsedLoggedIn = isLoggedIn ? JSON.parse(isLoggedIn) : null;
  const token = parsedLoggedIn?.data?.access_token;

  const { data: userData, error } = useGetUserQuery(undefined, {
    skip: !token,
  });

  const user = userData?.data;

  const {
    data: favoriteMovies,
    // isLoading: isFavoritesLoading,
    // isFetching: isFavoritesFetching,
  } = useGetListQuery({ page: 1, type_id: 0 }, { skip: !token });
  const { data, isLoading, isFetching, refetch } = useGetRecordQuery(
    undefined,
    {
      skip: !token,
    }
  ); // Fetch favorite movies list from API

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

  const handleInviteClick = () => {
    if (!token) {
      // If not logged in, open the login modal
      startTransition(() => {
        dispatch(setAuthModel(true));
      });
    } else {
      if (user?.inviter_id !== 0) {
        dispatch(
          showToast({
            message: "已邀请",
            type: "success",
          })
        );
      } else {
        navigate("/invite");
      }
      // If logged in, redirect to the favorites page
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

  console.log(latestMovies);

  return (
    <div className="profile-div">
      <div className="profile-div-main w-full">
        <a className="p-first cursor-pointer" onClick={handleHistoryClick}>
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
            <div className="profile-text">观看历史</div>
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
        </a>

        {/* Horizontal Scrolling Movie List */}
        {token && movies?.length !== 0 && (
          <div className="flex overflow-x-scroll whitespace-nowrap watch_ten scrollbar-hide gap-4 ">
            {latestMovies?.map((movie: any) => (
              <Link
                to={`/player/${movie?.movie_id}`}
                key={movie?.movie_id}
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
                  <div className="absolute watchedDuration bottom-[2px] left-[3px] ">
                    {movie?.episode_name}
                  </div>
                  <div className="absolute watchedDuration top-[2px] right-[3px] ">
                    {movie?.dynamic}
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
        )}

        <a className="p-first cursor-pointer" onClick={handleFavoritesClick}>
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
            <div className="profile-text">我的收藏</div>
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
        </a>

        {/* Horizontal Scrolling Movie List */}
        {token && favorites?.length !== 0 && (
          <div className="flex overflow-x-scroll whitespace-nowrap watch_ten scrollbar-hide gap-4 ">
            {favorites?.map((movie: any) => (
              <Link
                to={`/player/${movie?.movie_id}`}
                key={movie?.movie_id}
                className="w-[114px]"
              >
                <div className="flex flex-col w-[114px] gap-2 transition-all duration-300 ease-in-out">
                  <div className="relative w-[114px] transition-transform duration-500 ease-in-out transform">
                    <ImageWithPlaceholder
                      src={movie?.cover}
                      alt={`Picture of ${movie?.movie_name}`}
                      width={114}
                      height={153}
                      className="rounded-md w-full h-[153px] object-cover object-center"
                    />
                    <div className="absolute w-full bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent rounded-sm"></div>

                    <div className="absolute bottom-[3px] right-[3px] text-[10px]">
                      {movie?.dynamic}
                    </div>
                  </div>

                  <div>
                    <h1 className=" truncate text-[#888] text-[14px]">
                      {movie?.movie_name}
                    </h1>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <a className="p-first cursor-pointer" onClick={handleInviteClick}>
          <div className="flex gap-3 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M17.6919 6.34701L9.38423 0.80855C9.27046 0.732646 9.13676 0.692139 9 0.692139C8.86324 0.692139 8.72954 0.732646 8.61577 0.80855L0.308077 6.34701C0.21324 6.41028 0.135497 6.496 0.0817527 6.59655C0.0280083 6.69709 -7.39029e-05 6.80935 1.46063e-07 6.92336V15.9234C1.46063e-07 16.2906 0.145879 16.6428 0.405545 16.9024C0.66521 17.1621 1.01739 17.308 1.38462 17.308H16.6154C16.9826 17.308 17.3348 17.1621 17.5945 16.9024C17.8541 16.6428 18 16.2906 18 15.9234V6.92336C18.0001 6.80935 17.972 6.69709 17.9182 6.59655C17.8645 6.496 17.7868 6.41028 17.6919 6.34701ZM6.29308 11.7695L1.38462 15.2311V8.2673L6.29308 11.7695ZM7.70971 12.4618H10.2903L15.191 15.9234H2.80904L7.70971 12.4618ZM11.7069 11.7695L16.6154 8.2673V15.2311L11.7069 11.7695ZM9 2.21653L16.0884 6.9424L10.2903 11.0772H7.71144L1.91337 6.9424L9 2.21653Z"
                fill="#A3A3A4"
              />
            </svg>
            <div className="profile-text">我的推广达人</div>
          </div>
          <div className="flex gap-1 items-center">
            <div className="text-[12px] text-[#d0bc94]">
              {token && user?.inviter_id !== 0
                ? user?.inviter_id
                : "输入邀请码得积分"}
            </div>
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
        </a>
      </div>
    </div>
  );
};

export default ProfileFirst;
