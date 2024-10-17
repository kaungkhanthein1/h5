import React, { useEffect } from "react";
import bg2 from "../../../assets/share/bg2.png";
import back from "../../../assets/share/back.svg";
import user from "../../../assets/share/user.svg";
import { Link } from "react-router-dom";
import "../share.css";
import { useGetInvitedDetailsQuery } from "../../../features/share/ShareApi";

interface MemberProps {}

const Member: React.FC<MemberProps> = ({}) => {
  const {
    data: memberList,
    refetch,
    isFetching,
    isError,
  } = useGetInvitedDetailsQuery({
    act: "list",
    page: 1,
    pagesize: 10,
  });

  // Trigger refetch when the component mounts
  useEffect(() => {
    refetch(); // Refetch the data when the component renders
  }, [refetch]);

  console.log("list", memberList);

  return (
    <div className="">
      <img
        className=" absolute top-0 z-[-1] w-screen h-[350px] object-center object-cover"
        src={bg2}
        alt=""
      />
      {/* header */}
      <div className=" flex justify-between items-center px-[20px] py-[10px]">
        <Link to="/share">
          <img src={back} className=" p-[20px" alt="" />
        </Link>
        <h1 className=" text-white text-[18px] pl-[16px] font-[400]">
          Invitation
        </h1>
        <div className=" py-[8px] px-[10px mt-[5px">
          <span className=" text-white text-[14px] font-[500]">
            Point Rules
          </span>
        </div>
      </div>

      {/* member list */}
      <div className="text-white text-2xl px-4 mt-[160px] h-fit ">
        {isFetching ? (
          <div className=" h-[500px] member_page">
            <div className="flex flex-col h-full justify-center items-center w-full gap-2">
              <img src={user} alt="" />
              <h1 className=" text-[#888] text-[14px] font-[400]">加载中</h1>
            </div>
          </div>
        ) : isError ? (
          <div className="text-red-500 text-xl">Error fetching data</div>
        ) : memberList?.data?.list.length === 0 ? (
          <div className=" h-[500px] member_page">
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
                        const memberTime = new Date(member.create_time * 1000);
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
    </div>
  );
};

export default Member;
