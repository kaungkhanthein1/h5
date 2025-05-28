import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex justify-between p-5 items-center">
      <div></div>
      <div className="flex gap-2 items-center">
        <Link to={"/notifications"} className="p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
          >
            <path
              d="M22.1782 20H2.17822V18H3.17822V11.031C3.17822 6.043 7.20822 2 12.1782 2C17.1482 2 21.1782 6.043 21.1782 11.031V18H22.1782V20ZM9.67822 21H14.6782C14.6782 21.663 14.4148 22.2989 13.946 22.7678C13.4771 23.2366 12.8413 23.5 12.1782 23.5C11.5152 23.5 10.8793 23.2366 10.4105 22.7678C9.94161 22.2989 9.67822 21.663 9.67822 21Z"
              fill="white"
            />
          </svg>
        </Link>
        <Link to={"/settings"} className="p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="24"
            viewBox="0 0 22 24"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13.0276 0.519615L20.0618 4.58058C21.2619 5.2734 22.0002 6.55307 22.0002 7.93887V16.0611C22.0002 17.4468 21.2619 18.7264 20.0618 19.4194L13.0276 23.4804C11.8287 24.1732 10.3497 24.1732 9.15079 23.4804L2.11663 19.4194C0.916498 18.7266 0.178223 17.4469 0.178223 16.0611V7.93887C0.178223 6.5532 0.916498 5.27356 2.11663 4.58058L9.15079 0.519615C10.3497 -0.173205 11.8287 -0.173205 13.0276 0.519615ZM11.0892 7.79995C8.76967 7.79995 6.88932 9.68031 6.88932 11.9998C6.88932 14.3194 8.76967 16.1997 11.0892 16.1997C13.4087 16.1997 15.2891 14.3194 15.2891 11.9998C15.2891 9.68031 13.4087 7.79995 11.0892 7.79995Z"
              fill="white"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
