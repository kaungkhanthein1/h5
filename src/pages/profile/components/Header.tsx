import { useEffect, useRef } from "react";
import { setAuthModel } from "../../../features/login/ModelSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserQuery } from "../services/profileApi"; // Import your query
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "./slice/UserSlice";
import ImageWithPlaceholder from "./info/ImageWithPlaceholder";
import { showToast } from "../error/ErrorSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check for token in localStorage
  const isLoggedIn = localStorage.getItem("authToken");
  const parsedLoggedIn = isLoggedIn ? JSON.parse(isLoggedIn) : null;
  const token = parsedLoggedIn?.data?.access_token;

  const {
    data: userData,
    error,
    refetch,
    isFetching,
    isLoading,
  } = useGetUserQuery(undefined, {
    skip: !token,
  });

  const handleLoginClick = () => {
    if (!token) {
      dispatch(setAuthModel(true)); // Open the login modal if not logged in
    }
  };

  const goToPointMall = () => {
    // dispatch(showToast({ message: "该功能正在开发中", type: "success" }));
    navigate("/point_info");
  };

  // prod
  const user = userData?.data;

  // staging
  // const parsedUserData = JSON.parse(userData || "{}");
  // const user = parsedUserData?.data;

  return (
    <div className="profile-header">
      {user && !isFetching ? (
        <div className="profile-div-main w-full justify-between profile-card_point gap-[10px]">
          <Link
            to={"/info"}
            className=" flex justify-between items-center w-full"
          >
            <div className="flex gap-4 items-center">
              <div className="profile-p">
                {user?.avatar ? (
                  <ImageWithPlaceholder
                    width={58}
                    height={58}
                    src={user?.avatar}
                    alt={user?.username || user?.nickname}
                    className="rounded-full"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="60"
                    height="60"
                    viewBox="0 0 60 60"
                    fill="none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="60"
                      height="60"
                      viewBox="0 0 60 60"
                      fill="none"
                    >
                      <rect
                        width="60"
                        height="60"
                        rx="30"
                        fill="url(#paint0_linear_160_3151)"
                      />
                      <rect
                        x="0.5"
                        y="0.5"
                        width="59"
                        height="59"
                        rx="29.5"
                        stroke="white"
                        stroke-opacity="0.12"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M30.0605 7.01392C43.2937 7.01392 53.9873 17.7075 53.9873 31.0744C53.9873 38.1588 50.9129 44.575 46.1008 48.9861C42.8927 31.8764 17.2282 31.8764 14.0202 48.9861C9.07439 44.575 6 38.1588 6 31.0744C6 17.7075 16.6935 7.01392 30.0605 7.01392ZM30.0605 19.0441C34.6052 19.0441 38.348 22.7869 38.348 27.3316C38.348 31.8764 34.6052 35.6191 30.0605 35.6191C25.5157 35.6191 21.773 31.8764 21.773 27.3316C21.773 22.7869 25.5157 19.0441 30.0605 19.0441Z"
                        fill="white"
                        fill-opacity="0.8"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_160_3151"
                          x1="9.19355"
                          y1="-1.84958e-06"
                          x2="73.7512"
                          y2="26.4991"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#888888" stop-opacity="0.5" />
                          <stop
                            offset="0.373765"
                            stop-color="#444444"
                            stop-opacity="0.27"
                          />
                          <stop
                            offset="0.602076"
                            stop-color="#5D5A5A"
                            stop-opacity="0.291875"
                          />
                          <stop
                            offset="1"
                            stop-color="#888080"
                            stop-opacity="0.33"
                          />
                        </linearGradient>
                      </defs>
                    </svg>
                  </svg>
                )}
              </div>
              <div className="flex flex-col gap-0">
                <h1>{user?.nickname || user?.username}</h1>
                <div className="flex gap-2 mt-1 items-center">
                  {user?.level && (
                    <img src={user?.level} className="w-[80px] h-[30px]" />
                  )}
                  <div className="uid">(UID: {user?.id})</div>
                </div>
              </div>
            </div>

            <div className="pr-2">
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
          <button
            onClick={goToPointMall}
            className=" flex w-full justify-between items-center pt-[15px] px-[7px]"
          >
            {/* text */}
            <div className=" flex justify-center items-center gap-[8px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M1.11085 8.16092L1.61592 9.15385C1.26808 9.4906 1.08859 9.84954 1.07746 10.2308C1.12234 10.9488 1.69723 11.5713 2.80215 12.0987C3.90708 12.6261 5.30654 12.9008 7.00054 12.9231C8.69454 12.9005 10.094 12.6256 11.1989 12.0987C12.3038 11.5718 12.8787 10.9491 12.9236 10.2308C12.9125 9.84922 12.733 9.49017 12.3852 9.15385L12.9069 8.16092C13.2548 8.45277 13.524 8.77243 13.7146 9.11992C13.9052 9.46745 14.0005 9.83769 14.0005 10.2308C13.9445 11.3414 13.2546 12.2417 11.9307 12.9317C10.6068 13.6217 8.96341 13.9777 7.00054 14C5.03731 13.9774 3.39392 13.6212 2.07038 12.9317C0.746846 12.2421 0.0568938 11.3418 0.000538422 10.2308C0.000538422 9.83802 0.0987216 9.46777 0.295077 9.11992C0.491432 8.77208 0.763 8.45241 1.11085 8.16092ZM1.11085 4.93015L1.61592 5.92308C1.26808 6.2598 1.08859 6.61877 1.07746 7C1.12234 7.71795 1.69723 8.34059 2.80215 8.86792C3.90708 9.39529 5.30654 9.67002 7.00054 9.69231C8.69454 9.66969 10.094 9.39486 11.1989 8.86792C12.3038 8.34095 12.8787 7.71831 12.9236 7C12.9125 6.61841 12.733 6.25943 12.3852 5.92308L12.9069 4.93015C13.2548 5.222 13.524 5.54166 13.7146 5.88915C13.9052 6.23665 14.0005 6.60692 14.0005 7C13.9445 8.11066 13.2546 9.01097 11.9307 9.70092C10.6068 10.3909 8.96341 10.7469 7.00054 10.7692C5.03731 10.7466 3.39392 10.3905 2.07038 9.70092C0.746846 9.01134 0.0568938 8.11103 0.000538422 7C0.000538422 6.60728 0.0987216 6.237 0.295077 5.88915C0.491432 5.54131 0.763 5.22164 1.11085 4.93015ZM7 7.53846C5.03677 7.51585 3.39338 7.15974 2.06985 6.47015C0.746308 5.78057 0.0563554 4.88026 0 3.76923C0.056 2.65857 0.745952 1.75826 2.06985 1.06831C3.39374 0.378356 5.03712 0.02226 7 0C8.96323 0.0226154 10.6066 0.378722 11.9302 1.06831C13.2537 1.75789 13.9437 2.6582 14 3.76923C13.944 4.87989 13.254 5.7802 11.9302 6.47015C10.6063 7.16011 8.96287 7.5162 7 7.53846ZM7 6.46154C8.694 6.43892 10.0935 6.16412 11.1984 5.63715C12.3033 5.11018 12.8782 4.48754 12.9231 3.76923C12.8782 3.05128 12.3033 2.42864 11.1984 1.90131C10.0935 1.37397 8.694 1.09918 7 1.07692C5.306 1.09954 3.90654 1.37434 2.80162 1.90131C1.69669 2.42828 1.1218 3.05092 1.07692 3.76923C1.1218 4.48718 1.69669 5.10982 2.80162 5.63715C3.90654 6.16449 5.306 6.43928 7 6.46154Z"
                  fill="white"
                />
              </svg>
              <span className=" text-white font-[400] text-[14px]">
                我的积分
              </span>
            </div>
            {/* point */}
            <div className=" flex justify-center items-center gap-[">
              <span className=" text-white text-[14px] font-[600]">
                {user.integral}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <g opacity="1">
                  <path
                    d="M13.1722 12L8.22217 7.04999L9.63617 5.63599L16.0002 12L9.63617 18.364L8.22217 16.95L13.1722 12Z"
                    fill="white"
                  />
                </g>
              </svg>
            </div>
          </button>
        </div>
      ) : (
        <div
          onClick={handleLoginClick}
          className="flex gap-4 bg-red-400 w-full profile-card cursor-pointer"
        >
          <div className="profile-p">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
              >
                <rect
                  width="60"
                  height="60"
                  rx="30"
                  fill="url(#paint0_linear_160_3151)"
                />
                <rect
                  x="0.5"
                  y="0.5"
                  width="59"
                  height="59"
                  rx="29.5"
                  stroke="white"
                  stroke-opacity="0.12"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M30.0605 7.01392C43.2937 7.01392 53.9873 17.7075 53.9873 31.0744C53.9873 38.1588 50.9129 44.575 46.1008 48.9861C42.8927 31.8764 17.2282 31.8764 14.0202 48.9861C9.07439 44.575 6 38.1588 6 31.0744C6 17.7075 16.6935 7.01392 30.0605 7.01392ZM30.0605 19.0441C34.6052 19.0441 38.348 22.7869 38.348 27.3316C38.348 31.8764 34.6052 35.6191 30.0605 35.6191C25.5157 35.6191 21.773 31.8764 21.773 27.3316C21.773 22.7869 25.5157 19.0441 30.0605 19.0441Z"
                  fill="white"
                  fill-opacity="0.8"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_160_3151"
                    x1="9.19355"
                    y1="-1.84958e-06"
                    x2="73.7512"
                    y2="26.4991"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#888888" stop-opacity="0.5" />
                    <stop
                      offset="0.373765"
                      stop-color="#444444"
                      stop-opacity="0.27"
                    />
                    <stop
                      offset="0.602076"
                      stop-color="#5D5A5A"
                      stop-opacity="0.291875"
                    />
                    <stop offset="1" stop-color="#888080" stop-opacity="0.33" />
                  </linearGradient>
                </defs>
              </svg>
            </svg>
          </div>
          <div className="flex gap-2 items-center">
            <p>点击登录</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="6"
              height="8"
              viewBox="0 0 6 8"
              fill="none"
            >
              <path
                d="M0.185872 0.156564C0.244327 0.106935 0.313771 0.0675604 0.390224 0.0406946C0.466677 0.0138289 0.548637 0 0.631411 0C0.714185 0 0.796145 0.0138289 0.872599 0.0406946C0.949051 0.0675604 1.01849 0.106935 1.07695 0.156564L5.26049 3.69938C5.30716 3.73882 5.34418 3.78567 5.36945 3.83724C5.39471 3.88882 5.40771 3.94411 5.40771 3.99994C5.40771 4.05578 5.39471 4.11107 5.36945 4.16264C5.34418 4.21422 5.30716 4.26107 5.26049 4.30051L1.07695 7.84332C0.830267 8.05223 0.432554 8.05223 0.185872 7.84332C-0.0608115 7.63442 -0.0608115 7.29762 0.185872 7.08872L3.83074 3.99781L0.180838 0.906907C-0.0608106 0.702268 -0.0608115 0.361203 0.185872 0.156564Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
