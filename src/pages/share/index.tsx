import React, { useEffect, useRef, useState } from "react";
import "./share.css";
import bg1 from "../../assets/share/bg1.png";
import back from "../../assets/login/back.svg";
import down from "../../assets/share/down1.svg";
import friend from "../../assets/share/friends1.svg";
import copy from "../../assets/share/copy.svg";
import form from "../../assets/share/alert1.svg";
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
import axios from "axios";
import {
  convertToSecureUrl,
  decryptWithAes,
} from "../../services/newEncryption";
import { useGetInviteNoticeQuery } from "../Point/service/PointApi";
import Alert from "./Alert";

interface ShareProps {}

const Share: React.FC<ShareProps> = ({}) => {
  const dispatch = useDispatch();
  const { data } = useGetShareScanQuery({ qr_create: "1" });
  const [invite, setInvite] = useState<any>();
  const [list, setList] = useState<any[]>([]);

  const { data: notice } = useGetInviteNoticeQuery("");

  const getkk = async () => {
    const { data } = await axios.get(
      convertToSecureUrl(
        `${process.env.REACT_APP_API_URL}//user/get_share?qr_create=1`
      )
    );
    const result: any = await decryptWithAes(data);
    setInvite(result);
  };

  useEffect(() => {
    getkk();
  }, []);

  useEffect(() => {
    setList(notice?.data);
  }, [notice]);

  const [copySuccess, setCopySuccess] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = localStorage.getItem("authToken");
  const parsedLoggedIn = isLoggedIn ? JSON.parse(isLoggedIn) : null;
  const token = parsedLoggedIn?.data?.access_token;

  const { data: userData, error } = useGetUserQuery(token);
  // console.log(userData)

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
    if (invite) {
      const link = invite?.data?.content;

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

  const sendEventToNative = (name: string, text: string) => {
    if (
      (window as any).webkit &&
      (window as any).webkit.messageHandlers &&
      (window as any).webkit.messageHandlers.jsBridge
    ) {
      (window as any).webkit.messageHandlers.jsBridge.postMessage({
        eventName: name,
        value: text,
      });
    }
  };

  const isIOSApp = () => {
    return (
      (window as any).webkit &&
      (window as any).webkit.messageHandlers &&
      (window as any).webkit.messageHandlers.jsBridge
    );
  };

  const handleSaveAsImage = () => {
    if (isIOSApp()) {
      sendEventToNative("saveImage", invite?.data?.qrcode.data); // shareUrl should be base64
    } else {
      console.log(invite?.data?.qrcode.data);
      if (!invite?.data?.qrcode.data.startsWith("data:image")) {
        console.error("Invalid image format.");
        return;
      }

      try {
        // Convert data URL to blob
        const response = fetch(invite?.data?.qrcode.data)
          .then((res) => res.blob())
          .then((blob) => {
            // Create a blob URL and initiate download
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = "QRCode.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the blob URL after download
            setTimeout(() => {
              URL.revokeObjectURL(blobUrl);
            }, 100);
          });
      } catch (error) {
        console.error("Error downloading QR code:", error);
      }
    }
  };

  // const handleSaveAsImage = () => {
  //   if (imageRef.current) {
  //     toPng(imageRef.current, { cacheBust: true })
  //       .then((dataUrl) => {
  //         const link = document.createElement("a");
  //         link.href = dataUrl;
  //         link.download = "share-info.png";
  //         link.click();
  //         dispatch(showToast({ message: "保存成功", type: "success" }));
  //       })
  //       .catch((err) => {
  //         console.error("Failed to generate image:", err);
  //       });
  //   }
  // };
  return (
    <div className="bg-background min-h-screen flex flex-col  gap-[10px]">
      {/* header */}
      <img src={bg1} className=" absolute z-[1] top-0 left-0 w-screen" alt="" />
      <div className="flex w-full justify-between items-center pl-[20px] py-4">
        <Link className=" absolute z-[2]" to="/profile">
          <img src={back} className="" alt="" />
        </Link>
        <div className=" pl-10"></div>
        <p className="text-[18px] text-white font-semibold">邀请朋友</p>
        <div
          // onClick={() => navigate("")}
          className="rule py-[8px] px-[16px] mt-[5px]"
        >
          <a
            target="_blink"
            href="https://cc3e497d.qdhgtch.com:1333/help"
            className=" text-white text-[14px] font-[500]"
          >
            积分商城
          </a>
        </div>
      </div>
      <div className=" flex flex-col gap-[20px] pt-[130px]">
        {/* tab */}
        <div className="">
          <div className=" flex justify-around items-center">
            {/* friend */}
            <div className="flex flex-col items-center gap-[14px]">
              <img src={friend} alt="" />
              <div className=" flex justify-center items-center gap-1">
                <div className=" text-[12px] flex justify-center items-center gap-1 font-[400] text-[#fff]">
                  <span className=" w-[2px] h-[2px] bg-white "></span>
                  <span>分享链接给好友</span>
                </div>
              </div>
            </div>
            {/* down */}
            <div className=" flex flex-col items-center gap-[14px]">
              <img src={down} alt="" />
              <div className=" flex justify-center items-center gap-1">
                <div className=" text-[12px] flex justify-center items-center gap-1 font-[400] text-[#fff]">
                  <span className=" w-[2px] h-[2px] bg-white "></span>
                  <span>下载APP</span>
                </div>
              </div>
            </div>
            <div className=" flex flex-col items-center gap-[14px]">
              <img src={form} alt="" />
              <div className=" flex justify-center items-center gap-1">
                <div className=" text-[12px] flex justify-center items-center gap-1 font-[400] text-[#fff]">
                  <span className=" w-[2px] h-[2px] bg-white "></span>
                  <span>注册填写邀请码</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* scan */}
        <div className="">
          {invite ? (
            <div
              ref={imageRef}
              className=" flex justify-center items-center pt-[30px "
            >
              <div className="py-6 px-10 flex flex-col justify-center items-center gap-[16px] scan">
                <img
                  className=" w-[180px] h-[180px] rounded-[10px]"
                  src={invite?.data?.qrcode.data}
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
                        {userData?.data?.invite_code}
                      </span>
                      <img onClick={handleCopy} src={copy} alt="" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className=" flex justify-center items-center pt-[30px]">
              <div className="scan py-6 px-10 flex flex-col justify-center items-center gap-[16px]">
                <div className=" animate-pulse bg-white/30 w-[180px] h-[180px] rounded-[10px]"></div>
                <div className="">
                  <div className="bg-white/30 rounded-[16px] animate-pulse w-[200px] h-[30px] flex gap-[8px]  px-[16px] py-[8px]"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* alert */}
      <Alert list={list} img={fire} />
      {/* invited user */}
      <div className="flex invite_user mx-[20px] justify-around items-center mt-[20px] p-4">
        <Link
          to={"/point_mall"}
          className=" flex flex-col items-center justify-center gap-[8px]"
        >
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
              <h1 className=" text-center text-[12px] font-[400] text-[#CCC3B2]">
                兑换价值百元大礼包
              </h1>
            </div>
            <img src={go} alt="" />
          </div>
        </Link>
        <p className=" line"></p>
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
      <div className="flex justify-center items-center gap-[16px] py-4">
        {/* copy */}
        <div
          onClick={handleShareLink}
          className=" flex gap-[8px] px-[20px] py-[16px] bg-[#FFFFFF0A] rounded-[24px]"
        >
          <img src={link} alt="" />
          <h1 className=" text-white text-[16px] font-[500] ">复制分享链接</h1>
        </div>
        {/* down and save qr card */}
        <div
          onClick={handleSaveAsImage}
          className=" flex gap-[8px] px-[20px] py-[16px] bg-[#FFFFFF0A] rounded-[24px]"
        >
          <img src={linkD} alt="" />
          <h1 className=" text-white text-[16px] font-[500] ">手动截图保存</h1>
        </div>{" "}
      </div>
    </div>
  );
};

export default Share;
