import React from "react";
import "./point.css";
import { useGetDailyTesksQuery, useGetUserQuery } from "./service/PointApi";
import light from "./lignt.png";
import coupon from "./coupon.png";
import { useSelector } from "react-redux";

interface TopProps {
  inretralDetails: any;
  invite: any;
  point: any;
}

const Top: React.FC<TopProps> = ({ inretralDetails, invite, point }) => {
  const activeTab = useSelector((state: any) => state?.home?.activePointTab);

  // console.log(inretralDetails);
  return (
    <div className=" top_box m-[20px]">
      {activeTab === 3 ? (
        <div className=" relative pb-[20px]">
          {/* header */}
          <div className="  top-0 flex justify-center items-center w-full">
            <span className="absolute text-[#CCC] text-[12px] font-[500]">
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
                {invite?.today}
              </span>
              <span className=" text-[#888] font-[500] text-[10px]">
                今日邀请
              </span>
            </div>
            <div className=" flex flex-col gap-[4px] justify-center items-center">
              <span className=" text-white text-[16px] font-[600]">
                {invite?.yesterday}
              </span>
              <span className=" text-[#888] font-[500] text-[10px]">
                昨日邀请{" "}
              </span>
            </div>
            <div className=" flex flex-col gap-[4px] justify-center items-center">
              <span className=" text-white text-[16px] font-[600]">
                {invite?.thisweek}
              </span>
              <span className=" text-[#888] font-[500] text-[10px]">
                本周邀请
              </span>
            </div>
          </div>
          {/* badge */}
          <div className=" flex justify-center items-center">
            <div className="share_badge_box flex justify-center items-center w-fit">
              {invite?.total} 邀请人数
            </div>
          </div>
        </div>
      ) : (
        <div className=" relative overflow-hidd">
          <img
            className=" absolute top-[-25px] h-[50px] w-[168px] right-0"
            src={light}
            alt=""
          />
          <div className=" px-[18px] py-[20px] relative">
            {/* header */}
            <div className=" flex justify-between items-center">
              <span className=" text-[12px] font-[400] text-[#888]">
                积分余额
              </span>
              {/* coupons */}
              <div className=" pr-3">
                <span className=" text-[#BBB] text-[12px] font-[400] flex justify-center items-center gap-[2px]">
                  兑换劵 : {point?.data?.coupon ? point?.data?.coupon : 0}{" "}
                  <img className=" w-[12px] h-[12px]" src={coupon} alt="" />
                </span>
              </div>
            </div>
            <div className=" pt-[10px] flex justify-between items-center">
              <div className=" flex justify-center items-center gap-[8px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="15"
                  viewBox="0 0 14 15"
                  fill="none"
                >
                  <path
                    d="M1.11085 9.07523L1.61592 10.0682C1.26808 10.4049 1.08859 10.7638 1.07746 11.1451C1.12234 11.8631 1.69723 12.4856 2.80215 13.013C3.90708 13.5404 5.30654 13.8151 7.00054 13.8374C8.69454 13.8148 10.094 13.5399 11.1989 13.013C12.3038 12.4861 12.8787 11.8634 12.9236 11.1451C12.9125 10.7635 12.733 10.4045 12.3852 10.0682L12.9069 9.07523C13.2548 9.36708 13.524 9.68674 13.7146 10.0342C13.9052 10.3818 14.0005 10.752 14.0005 11.1451C13.9445 12.2557 13.2546 13.156 11.9307 13.846C10.6068 14.536 8.96341 14.892 7.00054 14.9143C5.03731 14.8917 3.39392 14.5356 2.07038 13.846C0.746846 13.1564 0.0568938 12.2561 0.000538422 11.1451C0.000538422 10.7523 0.0987216 10.3821 0.295077 10.0342C0.491432 9.68638 0.763 9.36672 1.11085 9.07523ZM1.11085 5.84446L1.61592 6.83738C1.26808 7.17411 1.08859 7.53308 1.07746 7.91431C1.12234 8.63226 1.69723 9.25489 2.80215 9.78223C3.90708 10.3096 5.30654 10.5843 7.00054 10.6066C8.69454 10.584 10.094 10.3092 11.1989 9.78223C12.3038 9.25526 12.8787 8.63261 12.9236 7.91431C12.9125 7.53272 12.733 7.17374 12.3852 6.83738L12.9069 5.84446C13.2548 6.13631 13.524 6.45597 13.7146 6.80346C13.9052 7.15095 14.0005 7.52123 14.0005 7.91431C13.9445 9.02497 13.2546 9.92528 11.9307 10.6152C10.6068 11.3052 8.96341 11.6612 7.00054 11.6835C5.03731 11.6609 3.39392 11.3048 2.07038 10.6152C0.746846 9.92564 0.0568938 9.02534 0.000538422 7.91431C0.000538422 7.52159 0.0987216 7.15131 0.295077 6.80346C0.491432 6.45561 0.763 6.13595 1.11085 5.84446ZM7 8.45277C5.03677 8.43015 3.39338 8.07405 2.06985 7.38446C0.746308 6.69487 0.0563554 5.79457 0 4.68354C0.056 3.57287 0.745952 2.67257 2.06985 1.98261C3.39374 1.29266 5.03712 0.936567 7 0.914307C8.96323 0.936922 10.6066 1.29303 11.9302 1.98261C13.2537 2.6722 13.9437 3.57251 14 4.68354C13.944 5.7942 13.254 6.69451 11.9302 7.38446C10.6063 8.07441 8.96287 8.43051 7 8.45277ZM7 7.37585C8.694 7.35323 10.0935 7.07843 11.1984 6.55146C12.3033 6.02449 12.8782 5.40185 12.9231 4.68354C12.8782 3.96559 12.3033 3.34295 11.1984 2.81561C10.0935 2.28828 8.694 2.01349 7 1.99123C5.306 2.01385 3.90654 2.28864 2.80162 2.81561C1.69669 3.34259 1.1218 3.96523 1.07692 4.68354C1.1218 5.40149 1.69669 6.02412 2.80162 6.55146C3.90654 7.0788 5.306 7.35359 7 7.37585Z"
                    fill="url(#paint0_radial_4207_3197)"
                  />
                  <defs>
                    <radialGradient
                      id="paint0_radial_4207_3197"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(7.00027 7.91431) rotate(90) scale(7 7.00027)"
                    >
                      <stop stop-color="#FFC279" />
                      <stop offset="1" stop-color="#FFE5A0" />
                    </radialGradient>
                  </defs>
                </svg>
                <span className="integral_text text-[20px] font-[600]">
                  {/* {inretralDetails?.total}  */}
                  {point?.data?.integral}
                </span>
              </div>
              <div className="progress_box py-[6px] px-[12px] flex justify-center items-center gap-[10px]">
                <span className=" text-white text-[12px] font-[400]">
                  比上周 {inretralDetails?.compare_lastweek_percent.symbol}{" "}
                  {inretralDetails?.compare_lastweek_percent.percentage} %
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="10"
                  viewBox="0 0 12 10"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.19578 1.0782C7.19578 0.950784 7.2464 0.828587 7.33649 0.738491C7.42659 0.648394 7.54879 0.597778 7.6762 0.597778H11.5196C11.647 0.597778 11.7692 0.648394 11.8593 0.738491C11.9494 0.828587 12 0.950784 12 1.0782V4.92157C12 5.04899 11.9494 5.17119 11.8593 5.26128C11.7692 5.35138 11.647 5.402 11.5196 5.402C11.3922 5.402 11.27 5.35138 11.1799 5.26128C11.0898 5.17119 11.0392 5.04899 11.0392 4.92157V2.42338L7.56763 6.66743C7.52513 6.7193 7.47224 6.7617 7.41237 6.7919C7.3525 6.8221 7.28697 6.83943 7.22 6.84278C7.15302 6.84613 7.08609 6.83542 7.0235 6.81134C6.96092 6.78727 6.90406 6.75035 6.8566 6.70298L4.3709 4.21728L0.858057 9.04744C0.781212 9.14515 0.669481 9.20928 0.546344 9.22633C0.423208 9.24339 0.298253 9.21205 0.197739 9.13891C0.0972243 9.06576 0.0289764 8.9565 0.00733667 8.83409C-0.014303 8.71167 0.0123504 8.58563 0.0816959 8.48246L3.92507 3.19782C3.96587 3.14163 4.01836 3.09494 4.07893 3.06099C4.1395 3.02703 4.20672 3.00661 4.27594 3.00113C4.34517 2.99565 4.41476 3.00524 4.47992 3.02924C4.54508 3.05325 4.60426 3.09109 4.65339 3.14017L7.16023 5.64797L10.5059 1.55862H7.6762C7.54879 1.55862 7.42659 1.50801 7.33649 1.41791C7.2464 1.32781 7.19578 1.20562 7.19578 1.0782Z"
                    fill="#00BF6F"
                  />
                </svg>
              </div>
            </div>
            <div className=" flex justify-between items-center pt-[40px]">
              <div className=" flex flex-col justify-center items-center gap-[4px]">
                <span className="integral_text text-[14px] font-[600]">
                  {inretralDetails?.today?.symbol}
                  {inretralDetails?.today?.difference}
                </span>
                <span className=" text-[#888] text-[12px] font-[400]">
                  今日积分
                </span>
              </div>
              <div className=" flex flex-col justify-center items-center gap-[4px]">
                <span
                  className={` ${
                    inretralDetails?.yesterday?.symbol === "-"
                      ? "text-[#EF5252]"
                      : "integral_text"
                  }  text-[14px] font-[600]`}
                >
                  {inretralDetails?.yesterday?.symbol}
                  {inretralDetails?.yesterday?.difference}
                </span>
                <span className=" text-[#888] text-[12px] font-[400]">
                  昨日积分
                </span>
              </div>
              <div className=" flex flex-col justify-center items-center gap-[4px]">
                <span
                  className={` ${
                    inretralDetails?.yesterday?.symbol === "+"
                      ? "text-[#EF5252]"
                      : "integral_text"
                  }  text-[14px] font-[600]`}
                >
                  {inretralDetails?.thisweek?.symbol}
                  {inretralDetails?.thisweek?.difference}
                </span>{" "}
                <span className=" text-[#888] text-[12px] font-[400]">
                  本周积分
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Top;
