import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const NetworkError: React.FC<any> = ({ switchNow, refresh, onBack }) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  // Auto-switch countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto switch when countdown reaches 0
      switchNow();
    }
  }, [countdown, switchNow]);

  return (
    <div
      className="sticky top-0 z-50 flex justify-center items-center w-full h-[220px]"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        background: "#0D0D0D"
        // background: 'linear-gradient(180deg, #000000 0%, #3C3C3C 100%)'
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

      {/* Error Content */}
      <div className="w-[324px] h-[76px] flex justify-center items-center flex-col gap-4 mt-4">
        <span className="text-[#BBBBBB] text-[18px] font-['Helvetica_Neue'] text-center font-bold leading-6">
          播放出错，请尝试切换资源，或刷新一下
        </span>
        
        <div className="flex justify-center items-center flex-row gap-3">
          {/* Refresh Button */}
          <button 
            className="w-[100px] h-[36px] rounded-[18px] border border-white/20 bg-white/10 flex items-center justify-center"
            onClick={refresh}
          >
            <span className="text-white text-[14px] font-['Helvetica_Neue']">
              刷新一下
            </span>
          </button>

          {/* Switch Resources Button with Countdown */}
          <button 
            className="w-[100px] h-[36px] rounded-[18px] bg-[#F54100] flex items-center justify-center"
            onClick={switchNow}
          >
            <span className="text-white text-[14px] font-['Helvetica_Neue'] font-bold">
              切换资源 {countdown} 秒
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkError;
