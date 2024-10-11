import { FC, useEffect, useState } from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { useGetHeaderTopicsQuery } from "../../src/pages/home/services/homeApi";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../../src/pages/home/slice/HomeSlice";

const Header: FC = () => {
  const { data } = useGetHeaderTopicsQuery();
  const configData = data?.data?.index_top_nav;
  const activeTab = useSelector((state: any) => state.home.activeTab);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <header
      className={`w-full z-50 fixed top-0 ${
        activeTab !== 0
          ? "gradient-bg-home"
          : "bg-gradient-to-b from-[#151722] via-[#151722] to-[#161619]/80"
      } py-4`}
    >
      <div className="flex items-center px-3 gap-3">
        <div className="flex items-center gap-1">
          <img src={logo} alt="" className="h-8 w-auto object-contain" />
          <span className="text-white text-md font-semibold leading-none">
            电影手
          </span>
        </div>
        <div className="flex-1 relative">
          <input
            onFocus={() => navigate("/search_overlay")}
            placeholder="觉醒年代"
            type="text"
            className="rounded-[18.138px] bg-[#444B56]/50 py-[8.062px] px-[16.123px] w-full text-white outline-none"
          />
          <div className="absolute top-2 right-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="22"
              viewBox="0 0 21 22"
              fill="none"
            >
              <path
                d="M14.0482 14.0737L17 17.0248L16.0248 18L13.0737 15.0482C11.9757 15.9285 10.6099 16.4072 9.20262 16.4052C5.77877 16.4052 3 13.6265 3 10.2026C3 6.77877 5.77877 4 9.20262 4C12.6265 4 15.4052 6.77877 15.4052 10.2026C15.4072 11.6099 14.9285 12.9757 14.0482 14.0737ZM12.6657 13.5624C13.5404 12.6629 14.0289 11.4572 14.0269 10.2026C14.0269 7.53687 11.8677 5.37836 9.20262 5.37836C6.53687 5.37836 4.37836 7.53687 4.37836 10.2026C4.37836 12.8677 6.53687 15.0269 9.20262 15.0269C10.4572 15.0289 11.6629 14.5404 12.5624 13.6657L12.6657 13.5624Z"
                fill="white"
                fillOpacity="0.6"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="w-full">
        <nav className="flex overflow-x-scroll px-3 gap-3 remove-scrollbar">
          {configData?.map((item: any, index: any) => (
            <div
              className="relative"
              onClick={() => dispatch(setActiveTab(item?.id))}
              key={index}
            >
              <p
                className={`${
                  activeTab === index ? "text-white" : "text-gray-500"
                } whitespace-nowrap py-2 rounded-lg hover:text-white transition-colors`}
              >
                {item?.name}
              </p>
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
