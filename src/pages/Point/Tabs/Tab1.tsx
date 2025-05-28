import React from "react";
import "../point.css";
interface Tab1Props {
  actavityList: any;
}

const Tab1: React.FC<Tab1Props> = ({ actavityList }) => {
  // console.log(actavityList?.list);
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day} - ${hours}:${minutes}`;
  };

  return (
    <div className=" flex flex-col gap-[16px] pb-[40px]">
      {actavityList?.list.map((aa: any) => (
        <div className="activatyList p-[16px] w-full">
          <div className=" flex justify-between items-center">
            <div className="">
              <h1 className=" text-white text-[13px] font-[400]">
                {aa.type_name}
              </h1>
              <span className=" text-[12px] font-[400] text-white/60">
                {aa.content}
              </span>
            </div>
            <span className="acti_amount_text w-full">
              {" "}
              {aa.action === 1 ? "+" : "-"} {aa.amount}
            </span>
          </div>
          {/* line */}
          <div className=" w-full bg-white/10 my-[12px] h-[1px]"></div>
          <div className=" w-full flex justify-between items-center">
            <span className=" text-[#888] text-[12px] font-[400]">
              {formatTimestamp(aa.create_time)}
            </span>
            <span className=" text-[#888] text-[12px] font-[400]">
              剩余: <span className=" text-[12px]">{aa.surplus}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tab1;
