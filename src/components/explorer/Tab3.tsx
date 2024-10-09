import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetMovieTopicListQuery } from "../../pages/explorer/services/explorerAPi";

const Tab3 = () => {
  const { data: topicData } = useGetMovieTopicListQuery();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pb-32 px-3 pt-5 min-h-screen">
      {topicData?.data?.list?.map((item: any) => (
        <Link to={`/explorer/${item?.id}`} key={item?.id}>
          <Card item={item} />
        </Link>
      ))}
    </div>
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
        <p className="text-white text-[14px] absolute bottom-2 truncate w-[90%] px-3">
          {item?.name}
        </p>
      </div>
      <div className="flex text-[12px] text-gray-500 bg-[#1f1f21] p-3 gap-3 items-center rounded-bl-[8px] rounded-br-[8px]">
        <p>影片 {item?.movie_count}</p>
        <p>|</p>
        <p>浏览 {item?.view}+</p>
      </div>
    </div>
  );
};
