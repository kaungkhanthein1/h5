import { useEffect, useState } from "react";
import Header from "./components/notifications/Header";
import Sidebar from "./components/notifications/Sidebar";
import Content from "./components/notifications/Content";
import "./profile.css";
import { useGetNotificationQuery } from "./services/profileApi";
// import { useGetAdsQuery } from "../search/services/searchApi";
import Ads from "../search/components/Ads";
import Loader from "../search/components/Loader";
import NewAds from "../../components/NewAds";
import { useGetAdsQuery } from "../../services/helperService";

const Notifications = () => {
  const { data, isLoading, isFetching } = useGetNotificationQuery(); // Fetch data from API
  const {
    data: ads,
    isFetching: isFetched,
    isLoading: isLoaded,
  } = useGetAdsQuery();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // To track the selected category
  const [selectedNotice, setSelectedNotice] = useState<number | null>(null); // To track the selected notice

  useEffect(() => {
    if (data && data.data.length > 0) {
      const firstCategory = data.data[0];
      setSelectedCategory(firstCategory.id); // Set the first category as selected
      if (firstCategory.notices.length > 0) {
        setSelectedNotice(firstCategory.notices[0].id); // Set the first notice of the first category as selected
      }
    }
  }, [data]);

  if (isLoading || isFetching)
    return (
      <div className="flex justify-center items-center h-screen bg-[#161619]">
        <Loader />
      </div>
    );

  const advert = ads?.data?.notice_up?.data;

  const categories = data?.data || []; // Safely get categories

  const handleCategoryClick = (categoryId: number) => {
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

  return (
    <>
      <div className="fixed-bg"></div>
      <div className="bg-[#161619] text-white">
        {/* Header */}
        <Header
          categories={categories}
          onCategoryClick={handleCategoryClick}
          selectedCategory={selectedCategory}
        />

        <div className="border-b-[1px] border-[#242426] mb-5"></div>

        {/* Ads */}
        {/* <Ads advert={advert} /> */}
        <NewAds section="notice_up" />

        {/* Sidebar and Content */}
        <div className="grid grid-cols-3 gap-2 mt-10 h-full pb-[100px]">
          <div className="col-span-1">
            <Sidebar
              notices={notices}
              onNoticeClick={handleNoticeClick}
              selectedNotice={selectedNotice}
            />
          </div>
          <div className="col-span-2">
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
    </>
  );
};

export default Notifications;
