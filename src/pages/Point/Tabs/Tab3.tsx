import React from "react";
import ImageWithPlaceholder from "../../../components/home/bannerPlaceholder";

interface Tab3Props {
  inviteList: any;
}

const Tab3: React.FC<Tab3Props> = ({ inviteList }) => {
  const list = inviteList?.data.list;
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day} - ${hours}:${minutes}`;
  };
  // console.log(list);
  return (
    <div className=" flex flex-col">
      {list?.map((ll: any) => (
        <div className=" py-[20px] flex gap-[16px] justify-cente items-center w-full">
          <ImageWithPlaceholder
          alt="avatar"
            src={ll.avatar}
            width={40}
            height={40}
            className={"rounded-full"}
          />
          {/* <img
            className=" w-[40px] h-[40px] rounded-full"
            src={ll.avatar}
            alt=""
          /> */}
          <div className="">
            <h1 className=" text-white text-[14px] font-[500] leading-[20px]">
              {ll.nickname}
            </h1>
            <span className=" text-[#888] text-[12px] font-[400]">
              {formatTimestamp(ll.create_time)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tab3;
