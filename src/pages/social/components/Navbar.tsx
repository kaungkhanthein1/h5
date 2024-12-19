import React, { useState, useEffect } from "react";
import {
  useGetPostsQuery,
  useGetRecommandPostsQuery,
  useGetFollowPostsQuery,
} from "../services/socialApi";
import PostList from "./PostList";
import Ads from "../../../components/NewAds";

const Navbar = () => {
  const [activeTab, setActiveTab] = useState(2);
  const [page, setPage] = useState(1);
  const [dataList, setDataList] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true); // State to track header visibility

  const {
    data: postsData,
    isLoading: postsLoading,
    isFetching: postsFetching,
  } = useGetFollowPostsQuery({ page }, { skip: activeTab !== 0 });
  const {
    data: recommandData,
    isLoading: recommandLoading,
    isFetching: recommandFetching,
  } = useGetRecommandPostsQuery({ page }, { skip: activeTab !== 1 });
  const {
    data: followData,
    isLoading: followLoading,
    isFetching: followFetching,
  } = useGetPostsQuery({ page }, { skip: activeTab !== 2 });

  const fetchMoreData = () => {
    if (!postsFetching && !recommandFetching && !followFetching && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const currentData =
      activeTab === 0
        ? postsData
        : activeTab === 1
        ? recommandData
        : followData;

    if (currentData?.data?.list) {
      setDataList((prev) => [...prev, ...currentData.data.list]);
      // Calculate if there is more data to load
      const loadedItems = currentData.data.page * currentData.data.pageSize;
      setHasMore(loadedItems < currentData.data.total);
    }
  }, [postsData, recommandData, followData, activeTab]);

  const handleTabClick = (index: number) => {
    window.scrollTo(0, 0);
    setActiveTab(index);
    setPage(1);
    setDataList([]);
    setHasMore(true);
  };

  const tabs = [{ title: "关注" }, { title: "推荐" }, { title: "最新" }];
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        // Scrolling down, hide the header
        setIsHeaderVisible(false);
      } else if (window.scrollY < lastScrollY) {
        // Scrolling up, show the header
        setIsHeaderVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <div className="h-full bg-background">
      <div
        // className={`fixed bg-background p-3 w-full z-[99] pb-3  transition-all duration-300 ${
        //   isHeaderVisible ? "top-0" : "-top-[135px]"
        // }`}
        className={`fixed bg-background p-3 w-full z-[99] pb-3 transition-all duration-300 top-0`}
      >
        <nav className="flex flex-wrap gap-4 items-center">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`inline-flex whitespace-nowrap social_nav transition-all duration-200 ease-in-out relative hover:text-white ${
                activeTab === index
                  ? "text-white text-[20px]"
                  : "text-[#FFFFFFB3] text-[20px]"
              }`}
              onClick={() => handleTabClick(index)}
              style={{
                paddingBottom: "4px", // Spacing for the line
              }}
            >
              {tab.title}
              {activeTab === index && (
                <span className="absolute rounded-full bottom-0 left-1/2 transform -translate-x-1/2 bg-white h-[2px] w-[50%]" /> // Small centered line
              )}
            </button>
          ))}
        </nav>
      </div>
      <div className="pt-[70px] pb-[10px] bg-background">
        <Ads section={"search_input_under"} />
      </div>
      <PostList
        data={dataList}
        loading={postsLoading || recommandLoading || followLoading}
        hasMore={hasMore}
        fetchMoreData={fetchMoreData}
      />
    </div>
  );
};

export default Navbar;
