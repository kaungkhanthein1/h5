import React, { useRef, useState } from "react";
import "./share.css";
import bg1 from "../../assets/share/bg1.png";
import back from "../../assets/share/back.svg";
import down from "../../assets/share/down.svg";
import friend from "../../assets/share/friend.svg";
import copy from "../../assets/share/copy.svg";
import form from "../../assets/share/form.svg";
import link from "../../assets/share/link.svg";
import linkD from "../../assets/share/linkD.svg";
import fire from "../../assets/share/fire.png";
import dolar from "../../assets/share/dolar.svg";
import go from "../../assets/share/go.svg";
import { Link, useNavigate } from "react-router-dom";
import { useGetShareScanQuery } from "../../features/share/ShareApi";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserQuery } from "../profile/services/profileApi";
import { showToast } from "../profile/error/ErrorSlice";
import { toPng } from "html-to-image";

interface ShareProps {}

const Share: React.FC<ShareProps> = ({}) => {
  const dispatch = useDispatch();
  const { data } = useGetShareScanQuery({ qr_create: "1" });
  console.log(data);
  const [copySuccess, setCopySuccess] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = localStorage.getItem("authToken");
  const parsedLoggedIn = isLoggedIn ? JSON.parse(isLoggedIn) : null;
  const token = parsedLoggedIn?.data?.access_token;

  const { data: userData, error } = useGetUserQuery(token);
  console.log(userData);
  const navigate = useNavigate();
  const handleCopy = () => {
    if (userData) {
      const inviteCode = userData.data.invite_code;
      navigator.clipboard
        .writeText(inviteCode)
        .then(() => {
          dispatch(showToast({ message: "已复制", type: "success" }));
          setCopySuccess(true);
        })
        .catch(() => {
          dispatch(showToast({ message: "复制失败", type: "error" }));
          setCopySuccess(false);
        });
    }
  };

  const handleShareLink = () => {
    if (data) {
      const link = data?.data?.link;
      console.log(link);
      navigator.clipboard
        .writeText(link)
        .then(() => {
          dispatch(showToast({ message: "已复制", type: "success" }));
          setCopySuccess(true);
        })
        .catch(() => {
          dispatch(showToast({ message: "复制失败", type: "error" }));
          setCopySuccess(false);
        });
    }
  };

  const handleSaveAsImage = () => {
    if (imageRef.current) {
      toPng(imageRef.current, { cacheBust: true })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "share-info.png";
          link.click();
          dispatch(showToast({ message: "保存成功", type: "success" }));
        })
        .catch((err) => {
          console.error("Failed to generate image:", err);
        });
    }
  };
  return (
    <div className="">
      <img
        className=" absolute top-0 z-[-1] w-screen h-[350px] object-center object-cover"
        src={bg1}
        alt=""
      />
      {/* header */}
      <div className=" flex justify-between items-center">
        <Link to="/profile">
          <img src={back} className=" p-[20px]" alt="" />
        </Link>
        <div
          // onClick={() => navigate("")}
          className="rule py-[8px] px-[16px] mt-[5px]"
        >
          <a target="_blink" href="https://cc3e497d.qdhgtch.com:1333/help" className=" text-white text-[14px] font-[500]">
            Point Rules
          </a>
        </div>
      </div>
      {/* tab */}
      <div className=" pt-[130px]">
        <div className=" flex justify-center items-center gap-[28px]">
          {/* friend */}
          <div className=" flex flex-col items-center gap-[14px]">
            <img
              className=" tab px-[12px] py-[12px] w-[52px]"
              src={friend}
              alt=""
            />
            <div className=" flex justify-center items-center gap-1">
              <p className=" w-[2px] h-[2px] bg-[#DDD]"></p>
              <span className=" text-[12px] font-[400] text-[#DDD]">
                分享链接给好友
              </span>
            </div>
          </div>
          {/* down */}
          <div className=" flex flex-col items-center gap-[14px]">
            <img
              className=" tab px-[14px] py-[12px] w-[50px]"
              src={down}
              alt=""
            />
            <div className=" flex justify-center items-center gap-1">
              <p className=" w-[2px] h-[2px] bg-[#DDD]"></p>
              <span className=" text-[12px] font-[400] text-[#DDD]">
                下载APP
              </span>
            </div>
          </div>
          <div className=" flex flex-col items-center gap-[14px]">
            <img
              className=" tab px-[12px] py-[12px] w-[52px]"
              src={form}
              alt=""
            />
            <div className=" flex justify-center items-center gap-1">
              <p className=" w-[2px] h-[2px] bg-[#DDD]"></p>
              <span className=" text-[12px] font-[400] text-[#DDD]">
                分享链接给好友
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* scan */}
      {data && (
        <div
          ref={imageRef}
          className=" flex justify-center items-center pt-[30px]"
        >
          <div className="scan py-6 px-10 flex flex-col justify-center items-center gap-[16px]">
            <img
              className=" w-[180px] h-[180px]"
              src={data.data.qrcode.data}
              alt="QR Code"
            />
            {/* data */}
            {userData && (
              <div className="">
                <div className="flex gap-[8px] invite_code px-[16px] py-[8px]">
                  <h1 className=" text-white text-[16px] font-[500] leading-[20px]">
                    我的邀请码 :
                  </h1>
                  <span className=" text-white text-[16px] font-[500] leading-[20px]">
                    {userData.data.invite_code}
                  </span>
                  <img onClick={handleCopy} src={copy} alt="" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* alert */}
      <div className=" flex justify-center items-center pt-[20px]">
        <div className="fire_box w-[320 px-[12px] py-[4px] flex gap-[7px] justify-center items-center">
          <img src={fire} alt="" />
          <h1 className=" poin text-white/70 text-[12px]">
            使用虚幻百褶裙邀请好友即可获得 40 积分
          </h1>
        </div>
      </div>
      {/* invited user */}
      <div className="flex invite_user mx-[20px] justify-around items-center mt-[20px] p-[20px]">
        {/* point */}
        <div className=" flex flex-col items-center justify-center gap-[8px]">
          <img
            className=" w-[30px] h-[30px] dolar p-[8px]"
            src={dolar}
            alt=""
          />
          <div className=" flex justify-center items-center gap-[6px]">
            <div className=" flex flex-col">
              <h1 className=" text-center text-[12px] font-[500] text-[#CCC3B2]">
                积分兑换
              </h1>
              <h1 className=" text-center text-[8px] font-[400] text-[#CCC3B2]">
                兑换价值百元大礼包
              </h1>
            </div>
            <img src={go} alt="" />
          </div>
        </div>
        <p className=" line"></p>
        {/* invited */}
        <div
          onClick={() => navigate("/share/member")}
          className=" flex flex-col items-center justify-center gap-[8px]"
        >
          <h1 className=" text-[18px] font-[600] text-white/70">
            {userData?.data?.invite_user_num}
          </h1>
          <div className=" flex justify-center items-center gap-[6px]">
            <h1 className="text-center text-[12px] font-[500] text-[#CCC3B2]">
              我的邀请
            </h1>

            <img src={go} alt="" />
          </div>
        </div>
      </div>
      {/* two button */}
      <div className="flex justify-center items-center py-[30px] gap-[16px] pb-[30px]">
        {/* copy */}
        <div
          onClick={handleShareLink}
          className=" flex gap-[8px] link_button px-[14px] py-[12px]"
        >
          <img src={link} alt="" />
          <h1 className=" text-white text-[16px] font-[500]">复制分享链接</h1>
        </div>
        {/* down and save qr card */}
        <div
          onClick={handleSaveAsImage}
          className=" flex gap-[8px] link_button px-[14px] py-[12px]"
        >
          <img src={linkD} alt="" />
          <h1 className=" text-white text-[16px] font-[500]">手动截图保存</h1>
        </div>{" "}
      </div>
    </div>
  );
};

export default Share;
