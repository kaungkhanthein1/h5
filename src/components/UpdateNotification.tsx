import React from "react";
import notiIcon from "../assets/noti.png";
import appIcon from "../assets/promptLogo.png";
import closeIcon from "../assets/close.png";
interface UpdateNotificationProps {
  onUpdate: () => void;
  onClose: () => void;
}

export default function UpdateNotification({ onUpdate, onClose }: UpdateNotificationProps) {
  return (
    <div 
      className="flex flex-col p-4 rounded-lg backdrop-blur-[32px]"
      style={{
        backgroundColor: "rgba(75, 75, 75, 0.4)",
        border: "1px solid rgba(255, 255, 255, 0.02)",
        color: "white"
      }}
    >
      {/* Top row: notification icon and close button */}
      <div className="flex justify-between items-center w-full mb-6">
        <div className="flex items-center">
          <img
            src={notiIcon}
            alt="Notification"
            className="w-6 h-6"
          />
          <p className="pl-2 font-bold">App Store 已上架</p>
        </div>
        <button
          className="text-gray-200 text-[22px]"
          onClick={onClose}
          aria-label="Close"
        >
          <img src={closeIcon} alt="Close" className="w-4 h-4" />
        </button>
      </div>
      
      {/* Bottom row: app icon, text, and download button */}
      <div className="flex items-center w-full">
        <img
          src={appIcon}
          alt="App Icon"
          className="w-12 h-12 rounded-lg mr-3"
        />
        <div className="flex-1">
          <div className="font-bold text-white">火车太顺</div>
          <div className="text-sm text-gray-300 mt-1">建议安装，当前版本同样可用！</div>
        </div>
        <button
          className="bg-[#F54100] text-white font-medium px-4 py-1 rounded-lg hover:opacity-90"
          onClick={onUpdate}
        >
          去下载
        </button>
      </div>
    </div>
  );
} 