import React, { useState, useEffect, useRef } from "react";
import PullToRefresh from "react-simple-pull-to-refresh";

import {
  useGetPostsQuery,
  useGetRecommandPostsQuery,
  useGetFollowPostsQuery,
} from "../services/socialApi";
import PostList from "./PostList";
import Ads from "../../../components/NewAds";
import Loader from "../../../pages/search/components/Loader";

const Navbar = () => {
  const [activeTab, setActiveTab] = useState(2);
  const activeTabRef = useRef(activeTab); // Create a ref for activeTab
  activeTabRef.current = activeTab; // Update the ref whenever activeTab changes

  const [page, setPage] = useState(1);
  const [dataList, setDataList] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const {
    data: postsData,
    isLoading: postsLoading,
    isFetching: postsFetching,
    refetch: postRefetch,
  } = useGetFollowPostsQuery({ page }, { skip: activeTab !== 0 });
  const {
    data: recommandData,
    isLoading: recommandLoading,
    isFetching: recommandFetching,
    refetch: recommandRefetch,
  } = useGetRecommandPostsQuery({ page }, { skip: activeTab !== 1 });
  const {
    data: followData,
    isLoading: followLoading,
    isFetching: followFetching,
    refetch: followRefetch,
  } = useGetPostsQuery({ page }, { skip: activeTab !== 2 });

  const fetchMoreData = () => {
    if (!postsFetching && !recommandFetching && !followFetching && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (refresh) {
      const fetchData = async () => {
        if (activeTabRef.current === 0) {
          await postRefetch();
        } else if (activeTabRef.current === 1) {
          await recommandRefetch();
        } else {
          await followRefetch();
        }
        const currentData =
          activeTab === 0
            ? postsData
            : activeTab === 1
            ? recommandData
            : followData;

        if (currentData?.data?.list) {
          setDataList(currentData.data.list);
          const loadedItems = currentData.data.page * currentData.data.pageSize;
          setHasMore(loadedItems < currentData.data.total);
        }
        setRefresh(false);
      };
      fetchData();
    }
  }, [refresh]);

  useEffect(() => {
    const currentData =
      activeTab === 0
        ? postsData
        : activeTab === 1
        ? recommandData
        : followData;

    if (currentData?.data?.list) {
      if (page !== 1) {
        setDataList((prev) => [...prev, ...currentData.data.list]);
        const loadedItems = currentData.data.page * currentData.data.pageSize;
        setHasMore(loadedItems < currentData.data.total);
      } else {
        setDataList(currentData.data.list);
        const loadedItems = currentData.data.page * currentData.data.pageSize;
        setHasMore(loadedItems < currentData.data.total);
      }
    }
  }, [postsData, recommandData, followData, activeTab]);

  const handleTabClick = async (index: number) => {
    if (index === activeTab) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
      setActiveTab(index);
      setPage(1);
      setDataList([]);
      setHasMore(true);
    }
  };

  const tabs = [{ title: "关注" }, { title: "推荐" }, { title: "最新" }];

  return (
    <div className="h-full bg-background">
      {!showDetail && 
      <>
      <div className="fixed bg-background p-3 w-full z-[98] pb-3 transition-all duration-300 top-0">
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
                paddingBottom: "4px",
              }}
            >
              {tab.title}
              {activeTab === index && (
                <span className="absolute rounded-full bottom-0 left-1/2 transform -translate-x-1/2 bg-white h-[2px] w-[50%]" />
              )}
            </button>
          ))}
        </nav>
      </div>
      <div className="pt-[70px] pb-[10px] bg-background">
        <Ads section={"search_input_under"} />
      </div>
      </>
      }

      <PullToRefresh
        pullingContent={<div></div>}
        refreshingContent={
          <div className="flex justify-center py-2 mt-2 text-center">
            <Loader />
          </div>
        }
        onRefresh={async () => {
          setPage(1);
          setHasMore(true);
          setRefresh(true);
        }}
        isPullable={!showDetail}
      >
        <PostList
          setShowDetail={setShowDetail}
          showDetail={showDetail}
          data={dataList}
          loading={postsLoading || recommandLoading || followLoading}
          hasMore={hasMore}
          fetchMoreData={fetchMoreData}
        />
      </PullToRefresh>
    </div>
  );
};

export default Navbar;
