import React from "react";
import ImageWithPlaceholder from "../../../components/home/bannerPlaceholder";
import user from "../../../assets/share/user.svg";


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

  // console.log(inviteList,'invite')
  return (
    <div className=" flex flex-col">
      {list.lenght === 0 ? (
        <div className=" h-[600px] member_pag">
          <div className="flex flex-col h-full justify-center items-center w-full gap-2">
            <img src={user} alt="" />
            <h1 className=" text-[#888] text-[14px] font-[400]">
              没有受邀用户
            </h1>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default Tab3;
