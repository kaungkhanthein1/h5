// import { startTransition, useEffect, useState } from "react";
// import { setAuthModel } from "../../../features/login/ModelSlice";
// import { useDispatch } from "react-redux";

// const Header = () => {
//   const [user, setUser] = useState([]);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const isLoggedIn = localStorage.getItem("authToken");
//     const parsedLoggedIn = isLoggedIn ? JSON.parse(isLoggedIn) : null;
//     const token = parsedLoggedIn?.data?.access_token;
//     if (token) {
//     }
//     console.log(parsedLoggedIn?.data?.access_token);
//   }, []);
//   const handleLoginClick = () => {
//     if (!isLoggedIn) {
//       startTransition(() => {
//         dispatch(setAuthModel(true)); // Open the login modal
//       });
//     }
//   };

//   return (
//     <div className="profile-header">
//       <div
//         onClick={handleLoginClick}
//         className="flex gap-4 bg-red-400 w-full profile-card cursor-pointer"
//       >
//         <div className="profile-p">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="60"
//             height="60"
//             viewBox="0 0 60 60"
//             fill="none"
//           >
//             <rect
//               width="60"
//               height="60"
//               rx="30"
//               fill="url(#paint0_linear_160_3151)"
//             />
//             <rect
//               x="0.5"
//               y="0.5"
//               width="59"
//               height="59"
//               rx="29.5"
//               stroke="white"
//               stroke-opacity="0.12"
//             />
//             <path
//               fill-rule="evenodd"
//               clip-rule="evenodd"
//               d="M30.0605 7.01392C43.2937 7.01392 53.9873 17.7075 53.9873 31.0744C53.9873 38.1588 50.9129 44.575 46.1008 48.9861C42.8927 31.8764 17.2282 31.8764 14.0202 48.9861C9.07439 44.575 6 38.1588 6 31.0744C6 17.7075 16.6935 7.01392 30.0605 7.01392ZM30.0605 19.0441C34.6052 19.0441 38.348 22.7869 38.348 27.3316C38.348 31.8764 34.6052 35.6191 30.0605 35.6191C25.5157 35.6191 21.773 31.8764 21.773 27.3316C21.773 22.7869 25.5157 19.0441 30.0605 19.0441Z"
//               fill="white"
//               fill-opacity="0.8"
//             />
//             <defs>
//               <linearGradient
//                 id="paint0_linear_160_3151"
//                 x1="9.19355"
//                 y1="-1.84958e-06"
//                 x2="73.7512"
//                 y2="26.4991"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stop-color="#888888" stop-opacity="0.5" />
//                 <stop
//                   offset="0.373765"
//                   stop-color="#444444"
//                   stop-opacity="0.27"
//                 />
//                 <stop
//                   offset="0.602076"
//                   stop-color="#5D5A5A"
//                   stop-opacity="0.291875"
//                 />
//                 <stop offset="1" stop-color="#888080" stop-opacity="0.33" />
//               </linearGradient>
//             </defs>
//           </svg>
//         </div>
//         <div className="flex gap-2 items-center">
//           <p>Login Or Sign Up</p>
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="6"
//             height="8"
//             viewBox="0 0 6 8"
//             fill="none"
//           >
//             <path
//               d="M0.185872 0.156564C0.244327 0.106935 0.313771 0.0675604 0.390224 0.0406946C0.466677 0.0138289 0.548637 0 0.631411 0C0.714185 0 0.796145 0.0138289 0.872599 0.0406946C0.949051 0.0675604 1.01849 0.106935 1.07695 0.156564L5.26049 3.69938C5.30716 3.73882 5.34418 3.78567 5.36945 3.83724C5.39471 3.88882 5.40771 3.94411 5.40771 3.99994C5.40771 4.05578 5.39471 4.11107 5.36945 4.16264C5.34418 4.21422 5.30716 4.26107 5.26049 4.30051L1.07695 7.84332C0.830267 8.05223 0.432554 8.05223 0.185872 7.84332C-0.0608115 7.63442 -0.0608115 7.29762 0.185872 7.08872L3.83074 3.99781L0.180838 0.906907C-0.0608106 0.702268 -0.0608115 0.361203 0.185872 0.156564Z"
//               fill="white"
//             />
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Header;

import { startTransition, useEffect, useState } from "react";
import { setAuthModel } from "../../../features/login/ModelSlice";
import { useDispatch } from "react-redux";
import { useGetUserQuery } from "../services/profileApi"; // Import your query

const Header = () => {
  interface User {
    username: string;
    avatar: string;
    level: string;
    id: any;
    // Add other properties if needed
  }

  const [user, setUser] = useState<User | null>(null); // Initialize with null
  const dispatch = useDispatch();

  // Check for token in localStorage
  const isLoggedIn = localStorage.getItem("authToken");
  const parsedLoggedIn = isLoggedIn ? JSON.parse(isLoggedIn) : null;
  const token = parsedLoggedIn?.data?.access_token;

  // Use the `skip` option to call the query conditionally based on token availability
  const { data: userData, error } = useGetUserQuery(undefined, {
    skip: !token, // Skip the query if token is not present
  });

  useEffect(() => {
    if (userData) {
      setUser(userData?.data); // Set user data when fetched
    }
  }, [userData]);

  const handleLoginClick = () => {
    if (!token) {
      startTransition(() => {
        dispatch(setAuthModel(true)); // Open the login modal
      });
    }
  };

  console.log(user);

  return (
    <div className="profile-header">
      {user ? (
        <div className="flex gap-4 bg-green-400 w-full profile-card">
          <div className="profile-p">
            {user?.avatar ? (
              <img src={user?.avatar} alt={user?.username} />
            ) : (
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
            )}
          </div>
          <div className="flex flex-col gap-0">
            <h1>{user?.username}</h1>
            <div>
              {user?.level && <img src={user?.level} />}
              <div className="uid">(UID: {user?.id})</div>
            </div>
          </div>
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
          </div>
          <div className="flex gap-2 items-center">
            <p>Login Or Sign Up</p>
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
