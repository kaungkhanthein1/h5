import React, { useEffect } from "react";
import bg2 from "../../../assets/share/bg2.png";
// import bg3 from "../../../assets/share/bg3.png";
// import bg4 from "../../../assets/share/bg4.png";
import BG from "../../../assets/share/BG.png";
import rain from "../../../assets/share/rain.gif";
import dust from "../../../assets/share/dust.png";
import back from "../../../assets/login/back.svg";
import user from "../../../assets/share/user.svg";
import { Link, useNavigate } from "react-router-dom";
import "../share.css";
import { useGetInvitedDetailsQuery } from "../../../features/share/ShareApi";
import axios from "axios";
import { convertToSecureUrl } from "../../../services/newEncryption";
import Loader from "../../../components/login/Loader";
import { useGetInvitaionMemberQuery } from "../../../pages/Point/service/PointApi";

interface MemberProps {}

const Member: React.FC<MemberProps> = ({}) => {
  const navigate = useNavigate();
  const {
    data: memberList,
    refetch,
    isFetching,
    isError,
  }: any = useGetInvitedDetailsQuery({
    act: "list",
    page: 1,
    pagesize: 10,
  });

  // console.log(memberList);

  // Trigger refetch when the component mounts
  useEffect(() => {
    refetch();
  }, [refetch]);

  const { data: invite } = useGetInvitaionMemberQuery("");

  return (
    <div className=" relative">
      <img
        className=" absolute top-0 z-[-1] w-screen h-scree h-[350px object-center object-cover"
        src={BG}
        alt=""
      />
      <img
        src={dust}
        className=" absolute left-0 right-0 top-0 z-[-1] rain_effect_thuHtoo"
        alt=""
      />
      <div className=" absolute hidden">
        <div className="rain_effect_thuHtoo"></div>
      </div>
      {/* header */}
      <div className=" flex justify-between items-center px-[20px] py-[10px]">
        <div onClick={() => navigate(-1)}>
          <img src={back} className=" p-[20px" alt="" />
        </div>
        <h1 className=" text-white text-[18px] pl-[16px] font-[600]">
          {/* Invitation */}
          邀请的好友
        </h1>
        <a
          target="_blink"
          href="https://cc3e497d.qdhgtch.com:1333/help"
          className=" py-[8px] px-[10px mt-[5px"
        >
          <span className=" text-white text-[14px] font-[500]">
            {/* Point Rules */}
            积分规则
          </span>
        </a>
      </div>

      {/* box */}
      <div className=" top_box m-[20px]">
        <div className=" relative pb-[20px]">
          {/* header */}
          <div className="  top-0 flex justify-center items-center w-full">
            <span className="absolute text-[#CCC] text-[10px] font-[500]">
              {/* Invited Users */}
              我的邀请
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="174"
              height="20"
              viewBox="0 0 174 20"
              fill="none"
            >
              <path
                d="M0 0H174L156.627 13.364C151.033 17.6669 144.174 20 137.116 20H34.3714C26.4109 20 18.7362 17.0329 12.8459 11.6781L0 0Z"
                fill="url(#paint0_linear_4207_3430)"
                fill-opacity="0.5"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_4207_3430"
                  x1="75.1598"
                  y1="20"
                  x2="86.5607"
                  y2="-22.3144"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#CDBFA6" stop-opacity="0.12" />
                  <stop
                    offset="0.640707"
                    stop-color="#CDBFA6"
                    stop-opacity="0.24"
                  />
                  <stop
                    offset="0.901452"
                    stop-color="#E9D8BB"
                    stop-opacity="0.32"
                  />
                  <stop offset="1" stop-color="#FFECCC" stop-opacity="0.52" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* shareInfo */}
          <div className=" p-[30px] flex w-full justify-between items-center">
            <div className=" flex flex-col gap-[4px] justify-center items-center">
              <span className=" text-white text-[16px] font-[600]">
                {invite?.data?.today}
              </span>
              <span className=" text-[#888] font-[500] text-[10px]">今日邀请</span>
            </div>
            <div className=" flex flex-col gap-[4px] justify-center items-center">
              <span className=" text-white text-[16px] font-[600]">
                {invite?.data?.yesterday}
              </span>
              <span className=" text-[#888] font-[500] text-[10px]">
              昨日邀请{" "}
              </span>
            </div>
            <div className=" flex flex-col gap-[4px] justify-center items-center">
              <span className=" text-white text-[16px] font-[600]">
                {invite?.data?.thisweek}
              </span>
              <span className=" text-[#888] font-[500] text-[10px]">
              本周邀请
              </span>
            </div>
          </div>
          {/* badge */}
          <div className=" flex justify-center items-center">
            <div className="share_badge_box flex justify-center items-center w-fit">
              {invite?.data?.total} 邀请人数
            </div>
          </div>
        </div>
      </div>

      {/* member list */}
      {isFetching ? (
        <Loader />
      ) : (
        <div className="text-white text-2xl px-4 mt-[0px] h-fit ">
          {isFetching ? (
            <div className=" h-[500px] member_pag">
              <div className="flex flex-col h-full justify-center items-center w-full gap-2">
                <img src={user} alt="" />
                <h1 className=" text-[#888] text-[14px] font-[400]">加载中</h1>
              </div>
            </div>
          ) : isError ? (
            <div className="text-red-500 text-xl">Error fetching data</div>
          ) : memberList?.data?.list.length === 0 ? (
            <div className=" h-[600px] member_pag">
              <div className="flex flex-col h-full justify-center items-center w-full gap-2">
                <img src={user} alt="" />
                <h1 className=" text-[#888] text-[14px] font-[400]">
                  没有受邀用户
                </h1>
              </div>
            </div>
          ) : (
            <div>
              <ul className="">
                {memberList?.data?.list?.map((member: any, index: string) => (
                  <li
                    key={index}
                    className="flex items-center gap-4 p-4 member_list"
                  >
                    {/* Avatar */}
                    <img
                      src={member?.avatar || user}
                      alt={member.nickname}
                      className="w-10 h-10 rounded-full"
                    />
                    {/* Nickname */}
                    <div className="flex flex-col gap-[4px]">
                      <span className="font-[500] text-[16px] leading-[20px] text-white">
                        {member.nickname}
                      </span>
                      {/* Display create_time if needed */}
                      <span className="text-[14px] font-[400] text-[#888]">
                        {(() => {
                          const now = new Date();
                          const memberTime = new Date(
                            member.create_time * 1000
                          );
                          const timeDifference =
                            now.getTime() - memberTime.getTime(); // Time difference in milliseconds
                          const minutesDifference = Math.floor(
                            timeDifference / (1000 * 60)
                          );
                          // If the time difference is less than 5 minutes, show "Just Now"
                          if (minutesDifference < 5) {
                            return "Just Now";
                          } else {
                            // Otherwise, return the formatted date and time
                            return `${memberTime.getFullYear()}-${(
                              memberTime.getMonth() + 1
                            )
                              .toString()
                              .padStart(2, "0")}-${memberTime
                              .getDate()
                              .toString()
                              .padStart(2, "0")} - ${memberTime
                              .getHours()
                              .toString()
                              .padStart(2, "0")}:${memberTime
                              .getMinutes()
                              .toString()
                              .padStart(2, "0")}`;
                          }
                        })()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>{" "}
              {/* Render the member list items here */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Member;
