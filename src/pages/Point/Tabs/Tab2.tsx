import React from "react";
import coin from "../../../assets/Point/Challenge/coin.png";
import { useNavigate } from "react-router-dom";

interface Tab2Props {
  taskList: any;
}

const Tab2: React.FC<Tab2Props> = ({ taskList }) => {
  const navigate = useNavigate();
  const junpAttempt = (tt: any) => {
    if (tt.is_success) {
      console.log(tt.extend);
    } else {
      if (tt.extend === "profile") navigate("/profile");
      if (tt.extend === "invite-home") navigate("/share");
      if (tt.extend === "home") navigate("/");
      if (tt.logo === "lottery") navigate("/game");
    }
  };

  console.log(taskList);
  return (
    <div className=" flex flex-col gap-[18px]">
      {taskList?.map((tt: any) => (
        <div className=" w-full grid grid-cols-7 pb-[20px] gap-[10px">
          <div className="">
            <img className=" w-[40px] h-[40px]" src={tt?.icon} alt="" />
          </div>
          <div className=" col-span-4">
            <h1 className=" text-white font-[400] text-[16px]">{tt?.title}</h1>
            <span className=" text-white/80 text-[12px] font-[400]">
              {tt.description}
            </span>
          </div>
          <div className=" col-span-2 flex flex-col gap-[4px] justify-center items-center">
            {tt?.reward !== 0 && (
              <span className=" flex justify-center items-center text-[14px] font-[500] text-[#FF6A33]">
                + {tt.reward}{" "}
                <img className=" w-[18px] h-[18px]" src={tt.currency_icon} alt="" />
              </span>
            )}
            {/* <button
              onClick={() => junpAttempt(tt)}
              className={` text-white ${
                !tt.is_success || tt.reward === 0
                  ? "bg-[#FF6A33]"
                  : " bg-white/20"
              }  text-[14px] font-[500] rounded-[100px] w-[90px] px-[12px] py-[6px]`}
            >
              {tt.is_success ? "立即前往" : "去完成"}
            </button> */}
            {tt.reward === 0 ? (
              <button
                onClick={() => junpAttempt(tt)}
                className={` text-white bg-white/20 text-[14px] font-[500] rounded-[100px] w-[90px] px-[12px] py-[6px]`}
              >
                {tt.is_success ? "立即前往" : "去完成"}
              </button>
            ) : (
              <button
                onClick={() => junpAttempt(tt)}
                className={` text-white ${
                  !tt.is_success || tt.reward === 0
                    ? "bg-[#FF6A33]"
                    : " bg-white/20"
                }  text-[14px] font-[500] rounded-[100px] w-[90px] px-[12px] py-[6px]`}
              >
                {tt.is_success ? "已完成" : "去完成"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tab2;
