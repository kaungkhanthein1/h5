import React, { useEffect, useState } from "react";
import { useGetCommentListQuery } from "../services/socialApi";
import "../social.css";
import heartt from "../Frame.png";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "../../../pages/search/components/Loader";
import nc from "../Vector.png";

const Comment: React.FC<any> = ({ list, isFetching }) => {

//   console.log(list)

  return (
    <div className="py-[12px] bg-[#161619]" >
      <h1 className="text-white text-[16px] font-[400]">评论</h1>
      {list?.length === 0 && !isFetching ? (
        <div className="w-full flex flex-col justify-center items-center py-[40px] gap-[10px]">
          <img src={nc} alt="No Comments" />
          <span>还没有评论</span>
        </div>
      ) : (
        <>
          <div className="pt-[15px] flex flex-col gap-[30px]">
            {list.map((cmt: any, index: any) => (
              <div key={index} className="flex gap-[10px]">
                {/* Avatar */}
                {cmt.user.avatar ? (
                  <img
                    className="w-[40px] h-[40px] rounded-full border border-[#4A4A4A]"
                    src={cmt.user?.avatar}
                    alt=""
                  />
                ) : (
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 56 50"
                      fill="none"
                    >
                      <g filter="url(#filter0_d_1594_11143)">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M28.0605 0.013916C41.2937 0.013916 51.9873 10.7075 51.9873 24.0744C51.9873 31.1588 48.9129 37.575 44.1008 41.9861C40.8927 24.8764 15.2282 24.8764 12.0202 41.9861C7.07439 37.575 4 31.1588 4 24.0744C4 10.7075 14.6935 0.013916 28.0605 0.013916ZM28.0605 12.0441C32.6052 12.0441 36.348 15.7869 36.348 20.3316C36.348 24.8764 32.6052 28.6191 28.0605 28.6191C23.5157 28.6191 19.773 24.8764 19.773 20.3316C19.773 15.7869 23.5157 12.0441 28.0605 12.0441Z"
                          fill="white"
                          fillOpacity="0.8"
                          shapeRendering="crispEdges"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_d_1594_11143"
                          x="0"
                          y="0.013916"
                          width="55.9873"
                          height="49.9722"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset dy="4" />
                          <feGaussianBlur stdDeviation="2" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_1594_11143"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_1594_11143"
                            result="shape"
                          />
                        </filter>
                      </defs>
                    </svg>
                  </div>
                )}
                <div className="w-full flex flex-col gap-[8px]">
                  <div className="flex justify-between items-center">
                    <div className="flex justify-center items-center gap-[5px]">
                      <span className="text-[14px] font-[400] leading-[16px] text-white/60">
                        {cmt.user.nickname}
                      </span>
                      {cmt?.user?.level && (
                        <img
                          src={cmt?.user?.level}
                          alt=""
                          className="h-6 w-auto"
                        />
                      )}
                    </div>
                    <div className="text-[14px] font-[400] text-white/60">
                      {cmt.create_time}
                    </div>
                  </div>
                  <h1 className="text-white text-[14px] font-[400] leading-[20px]">
                    {cmt.content}
                  </h1>
                  <div className="flex justify-between items-center">
                    <button className="px-[12px] py-[8px] bg-[#2B2B2B] rounded-[100px] text-white text-[12px] font-[400]">
                      回复
                    </button>
                    <p className="text-white/40 text-[12px] font-[400] leading-[14px] flex justify-center items-center gap-[2px]">
                      <img className="w-[20px] h-[20px]" src={heartt} alt="" />
                      {cmt.comment_like_count}万
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Comment;
