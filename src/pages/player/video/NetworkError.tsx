import React from "react";
import NetworkIssue from "../../../assets/NetworkError.svg";
import SorryUnableToPlay from "../../../assets/unhappy.svg"; // Import the background image
import { useParams, useNavigate } from "react-router-dom";
import noPlayImage from "../../../assets/noplay.svg";

const NetworkError: React.FC<any> = ({ switchNow, refresh, onBack }) => {
  const navigate = useNavigate();

  return (
    <div
    className="sticky top-0 z-50 flex justify-center items-center w-full min-h-[220px]"
    style={{
      // backgroundImage: `url(${noPlayImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      background: 'linear-gradient(180deg, #000000 0%, #3C3C3C 100%)'
    }}
  >
          {/* Back Arrow */}
    <div className="absolute top-4 left-4 z-50">
      <button className="text-white text-2xl" onClick={onBack}>
        <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M7.828 11H20V13H7.828L13.192 18.364L11.778 19.778L4 12L11.778 4.22198L13.192 5.63598L7.828 11Z"
                fill="white"
              />
            </svg>
      </button>
    </div>

    <div className="relative z-10 flex flex-col items-center p-8 text-center text-white max-w-md mx-auto">
    <img src={SorryUnableToPlay} alt="" className="h-10 w-auto object-contain mb-5" />
      <p className="text-sm mb-4 tracking-wide text-white">
      播放出错，请尝试切换资源或刷新一下
      </p>
      <div className="flex space-x-4">
        <button
          className="px-6 py-2 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 transition-all duration-300 ease-in-out"
          style={{background: 'rgba(255, 255, 255, 0.2)'}}
          onClick={refresh}
        >
          刷新一下
        </button>
        <button
          onClick={switchNow}
          style={{background: 'rgba(245, 65, 0, 1)'}}
          className="px-6 py-2 bg-gradient-to-r from-gray-400 to-gray-700 text-white font-semibold  rounded-md shadow-md transition-all duration-300 ease-in-out"
        >
          切换资源
        </button>
      </div>
    </div>
  </div>
  );
};

export default NetworkError;
