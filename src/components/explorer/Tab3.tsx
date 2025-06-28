import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetMovieTopicListQuery } from "../../pages/explorer/services/explorerAPi";
import Loader from "../../pages/search/components/Loader";

const Tab3 = () => {
  const { data: topicData, isLoading } = useGetMovieTopicListQuery();

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-[90vh]">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pb-20 px-3 pt-16 min-h-screen">
          {topicData?.data?.list?.map((item: any) => (
            <Link to={`/explorer/${item?.id}`} key={item?.id}>
              <Card item={item} />
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Tab3;

const Card = ({ item }: any) => {
  return (
    <div className="">
      <div className="relative">
        <img
          src={item?.cover}
          alt=""
          className="h-[110px] md:h-[180px] w-full object-cover object-center rounded-tl-[8px] rounded-tr-[8px]"
        />
        <div className="absolute bottom-0 w-full">
          <div className="w-full py-1 relative">
            <p className="text-white font-bold text-[14px] truncate w-[90%] px-3">
              {item?.name}
            </p>
            <div className="absolute  h-full w-full inset-0 bg-gradient-to-t from-black via-black/5 to-transparent"></div>
          </div>
        </div>
      </div>
      <div className="flex text-[12px] text-gray-500 bg-[#1f1f21] p-3 gap-3 items-center rounded-bl-[8px] rounded-br-[8px]">
        <p>影片 {item?.movie_count}</p>
        <p>|</p>
        <p>浏览 {item?.view}+</p>
      </div>
    </div>
  );
};
