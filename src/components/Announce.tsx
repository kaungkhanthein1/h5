import React, { useEffect, useState } from "react";
import { useGetNotificationQuery } from "../pages/profile/services/profileApi";
import { useGetHeaderTopicsQuery } from "../services/helperService";
import Content from "./Content";
import "../pages/profile/profile.css";

interface AnnounceProps {
  setShowNotice: any;
}

const Announce: React.FC<AnnounceProps> = ({ setShowNotice }) => {
  const { data, isLoading, isFetching } = useGetNotificationQuery(); // Fetch data from API
  const { data: config } = useGetHeaderTopicsQuery();
  const categories = data?.data || [];
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // To track the selected category
  const [selectedNotice, setSelectedNotice] = useState<number | null>(null); // To track the selected notice

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  useEffect(() => {
    if (data && data.data.length > 0) {
      const firstCategory = data.data[0];
      setSelectedCategory(firstCategory.id); // Set the first category as selected
      if (firstCategory.notices.length > 0) {
        setSelectedNotice(firstCategory.notices[0].id); // Set the first notice of the first category as selected
      }
    }
  }, [data]);

  const handleCategoryClick = (categoryId: number) => {
    console.log(categoryId);
    setSelectedCategory(categoryId);
    const selectedCategoryData = categories.find(
      (cat: any) => cat.id === categoryId
    );
    if (selectedCategoryData?.notices.length > 0) {
      setSelectedNotice(selectedCategoryData.notices[0].id); // Automatically select the first notice when switching categories
    }
  };

  const handleNoticeClick = (noticeId: number) => {
    setSelectedNotice(noticeId);
  };

  const selectedCategoryData = categories.find(
    (cat: any) => cat.id === selectedCategory
  );

  const notices = selectedCategoryData?.notices || [];

  const handleAppClose = () => {
    setShowNotice(false);
  };

  return (
    <div className=" h-screen fixed bottom-0 z-[99999] w-screen  py-4 bg-black/60 px-[20px] flex flex-col justify-center items-center">
      <div className=" rounded-[25px] bg-black/80 w-[330px] h-[490px] overflow-hidden border border-white/30">
        {/* header */}
        <div className=" flex w-full justify-between px-[40px] pt-[20px] pb-[40px]">
          {categories.map((category: any, index: any) => (
            <div
              key={category.id}
              style={{ cursor: "pointer" }}
              className={`${
                selectedCategory === category.id
                  ? " text-white"
                  : " text-[#888]"
              } text-[18px] font-[600]  flex flex-col`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <h1>{category.name}</h1>
              {selectedCategory === category.id && (
                <span className=" bg-[#F54100] rounded-[8px] w-[32px] h-[3px]"></span>
              )}
            </div>
          ))}
        </div>
        {/* cc */}
        <div className="grid grid-cols-3 gap-2 h-full">
          <div className="col-span-1 h-[360px] overflow-auto rounded-lg">
            <div className="sidebar bg-[#242427] rounded-r-lg pb-10 p-1 ">
              {notices.map((notice: any) => (
                <button
                  key={notice.id}
                  className={`sidebar-button ${
                    selectedNotice === notice.id ? "active" : ""
                  }`}
                  onClick={() => handleNoticeClick(notice.id)}
                >
                  {notice.title}
                </button>
              ))}
            </div>
          </div>
          <div className="col-span-2 h-[390px] overflow-auto">
            {selectedNotice && (
              <Content
                notice={notices.find(
                  (notice: any) => notice.id === selectedNotice
                )}
              />
            )}
          </div>
        </div>
      </div>
      <div
        onClick={handleAppClose}
        className=" rounded-full bg-white/20 p-[9px] mt-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="23"
          viewBox="0 0 24 23"
          fill="none"
        >
          <path
            d="M17.75 5.75L6.25 17.25"
            stroke="white"
            strokeWidth="1.49593"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.25 5.75L17.75 17.25"
            stroke="white"
            strokeWidth="1.49593"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default Announce;
