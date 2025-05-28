import React, { useState, useEffect, useRef, startTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useChangeAvatarMutation,
  useGetUserQuery,
} from "../../services/profileApi";

import ImageWithPlaceholder from "./ImageWithPlaceholder";
import { showToast } from "../../error/ErrorSlice";
import { setAuthModel } from "../../../../features/login/ModelSlice";

const Main = () => {
  const dispatch = useDispatch();
  const isLoggedIn = localStorage.getItem("authToken");
  const parsedLoggedIn = isLoggedIn ? JSON.parse(isLoggedIn) : null;
  const token = parsedLoggedIn?.data?.access_token;

  const { data: userData, refetch } = useGetUserQuery(undefined);
  const user = userData?.data;
  // console.log(user)

  const navigate = useNavigate();

  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [changeAvatar] = useChangeAvatarMutation();

  const bottomSheetRef = useRef<HTMLDivElement | null>(null);

  // Check if running on iOS
  // const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // // Request camera and file permissions
  // const requestPermissions = async () => {
  //   try {
  //     if (isIOS) {
  //       // Explicit check for navigator.mediaDevices
  //       if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  //         throw new Error("Camera or file access is not supported on iOS.");
  //       }

  //       // Try accessing camera
  //       const stream = await navigator.mediaDevices.getUserMedia({
  //         video: true,
  //       });

  //       stream.getTracks().forEach((track) => track.stop()); // Close the stream
  //     } else {
  //       console.log("Permissions are not required on non-iOS devices.");
  //     }
  //   } catch (error) {
  //     dispatch(
  //       showToast({
  //         message: "无法获取相机或文件权限。",
  //         type: "error",
  //       })
  //     );
  //   }
  // };

  const handleSubmit = async (file: any) => {
    if (!file) {
      dispatch(
        showToast({
          message: "请选择一张图片。",
          type: "error",
        })
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("avatar_file", file, file.name);

      const response = await changeAvatar(formData).unwrap();
      const url = response?.data?.url;
      refetch();
      dispatch(
        showToast({
          message: "头像更新成功！",
          type: "success",
        })
      );

      closeBottomSheet();
    } catch (err) {
      dispatch(
        showToast({
          message: (err as any)?.data?.msg || "更新头像时出错。",
          type: "error",
        })
      );
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      handleSubmit(file);
    }
    closeBottomSheet();
  };

  const openBottomSheet = async () => {
    // await requestPermissions(); // Request permissions before opening bottom sheet
    setShowBottomSheet(true);

    setTimeout(() => {
      const overlay = document.querySelector(".overlay_image");
      if (overlay) {
        overlay.classList.remove("hidden");
      }
    }, 0);
  };

  const closeBottomSheet = () => {
    const bottomSheet = bottomSheetRef.current;
    const overlay = document.querySelector(".overlay_image");

    if (bottomSheet) {
      bottomSheet.classList.remove("slide-in");
      bottomSheet.classList.add("slide-out");
      overlay?.classList.add("hidden");
      setShowBottomSheet(false);
    }
  };

  const handleInviteClick = () => {
    if (!token) {
      startTransition(() => {
        dispatch(setAuthModel(true));
      });
    } else {
      if (user?.inviter_id !== 0) {
        dispatch(
          showToast({
            message: "已填写邀请码",
            type: "success",
          })
        );
      } else {
        navigate("/invite");
      }
    }
  };

  return (
    <div>
      <div
        onClick={() => closeBottomSheet()}
        className={`fixed bottom-0 left-0 w-full h-full overlay_image hidden`}
      ></div>
      <div className="profile-div mt-[60px]">
        <div className="info-div-main w-full">
          <div className="info-first cursor-pointer" onClick={openBottomSheet}>
            <div className="flex gap-1 max-w-[230px] flex-col ">
              <h1 className="info-text">头像设置</h1>
            </div>
            <div>
              <div className="profile-p">
                {user?.avatar ? (
                  <ImageWithPlaceholder
                    width={58}
                    height={58}
                    src={user?.avatar}
                    alt={user?.username}
                    className="rounded-full"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="60"
                    height="60"
                    viewBox="0 0 60 60"
                    fill="none"
                  >
                    {/* SVG content */}
                    <rect
                      width="60"
                      height="60"
                      rx="30"
                      fill="url(#paint0_linear_160_3151)"
                    />
                    <rect
                      x="0.5"
                      y="0.5"
                      width="59"
                      height="59"
                      rx="29.5"
                      stroke="white"
                      strokeOpacity="0.12"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M30.0605 7.01392C43.2937 7.01392 53.9873 17.7075 53.9873 31.0744C53.9873 38.1588 50.9129 44.575 46.1008 48.9861C42.8927 31.8764 17.2282 31.8764 14.0202 48.9861C9.07439 44.575 6 38.1588 6 31.0744C6 17.7075 16.6935 7.01392 30.0605 7.01392ZM30.0605 19.0441C34.6052 19.0441 38.348 22.7869 38.348 27.3316C38.348 31.8764 34.6052 35.6191 30.0605 35.6191C25.5157 35.6191 21.773 31.8764 21.773 27.3316C21.773 22.7869 25.5157 19.0441 30.0605 19.0441Z"
                      fill="white"
                      fillOpacity="0.8"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_160_3151"
                        x1="9.19355"
                        y1="-1.84958e-06"
                        x2="73.7512"
                        y2="26.4991"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#888888" stopOpacity="0.5" />
                        <stop
                          offset="0.373765"
                          stopColor="#444444"
                          stopOpacity="0.27"
                        />
                        <stop
                          offset="0.602076"
                          stopColor="#5D5A5A"
                          stopOpacity="0.291875"
                        />
                        <stop
                          offset="1"
                          stopColor="#888080"
                          stopOpacity="0.33"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                )}
              </div>
            </div>
          </div>

          <div className="info-main-first mt-3">
            <a
              className="cursor-pointer info-first1"
              onClick={handleInviteClick}
            >
              <div className="flex gap-1 max-w-[230px] ">
                <div className="profile-text">我的推广达人</div>
              </div>
              <div className="flex gap-1 items-center">
                <div className="text-[12px] text-[#d0bc94]">
                  {token && user?.inviter_id !== 0
                    ? user?.inviter_id
                    : "输入邀请码得积分"}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="6"
                  height="8"
                  viewBox="0 0 6 8"
                  fill="none"
                >
                  <path
                    d="M0.778157 0.156564C0.836612 0.106935 0.906056 0.0675604 0.982509 0.0406946C1.05896 0.0138289 1.14092 0 1.2237 0C1.30647 0 1.38843 0.0138289 1.46488 0.0406946C1.54134 0.0675604 1.61078 0.106935 1.66924 0.156564L5.85277 3.69938C5.89944 3.73882 5.93647 3.78567 5.96173 3.83724C5.987 3.88882 6 3.94411 6 3.99994C6 4.05578 5.987 4.11107 5.96173 4.16264C5.93647 4.21422 5.89944 4.26107 5.85277 4.30051L1.66924 7.84332C1.42255 8.05223 1.02484 8.05223 0.778157 7.84332C0.531474 7.63442 0.531474 7.29762 0.778157 7.08872L4.42302 3.99781L0.773123 0.906907C0.531475 0.702268 0.531474 0.361203 0.778157 0.156564Z"
                    fill="white"
                  />
                </svg>
              </div>
            </a>
          </div>
          <div className="info-main-first mt-3">
            <Link to={"/nickname"} className="info-first1">
              <div className="flex gap-1 max-w-[230px] ">
                <h1 className="info-text">昵称</h1>
              </div>
              <div className="flex items-center gap-1">
                <p className="info-main-text">{user?.nickname}</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="6"
                  height="8"
                  viewBox="0 0 6 8"
                  fill="none"
                >
                  <path
                    d="M0.778157 0.156564C0.836612 0.106935 0.906056 0.0675604 0.982509 0.0406946C1.05896 0.0138289 1.14092 0 1.2237 0C1.30647 0 1.38843 0.0138289 1.46488 0.0406946C1.54134 0.0675604 1.61078 0.106935 1.66924 0.156564L5.85277 3.69938C5.89944 3.73882 5.93647 3.78567 5.96173 3.83724C5.987 3.88882 6 3.94411 6 3.99994C6 4.05578 5.987 4.11107 5.96173 4.16264C5.93647 4.21422 5.89944 4.26107 5.85277 4.30051L1.66924 7.84332C1.42255 8.05223 1.02484 8.05223 0.778157 7.84332C0.531474 7.63442 0.531474 7.29762 0.778157 7.08872L4.42302 3.99781L0.773123 0.906907C0.531475 0.702268 0.531474 0.361203 0.778157 0.156564Z"
                    fill="white"
                  />
                </svg>
              </div>
            </Link>

            <Link to={"/username"} className="info-first1">
              <div className="flex gap-1 max-w-[230px] flex-col ">
                <h1 className="info-text">
                  用户名{" "}
                  <span className="text-[#888] text-[12px]"> (可用来登录)</span>{" "}
                </h1>
              </div>
              <div className="flex items-center gap-1">
                <p className="info-main-text">{user?.username}</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="6"
                  height="8"
                  viewBox="0 0 6 8"
                  fill="none"
                >
                  <path
                    d="M0.778157 0.156564C0.836612 0.106935 0.906056 0.0675604 0.982509 0.0406946C1.05896 0.0138289 1.14092 0 1.2237 0C1.30647 0 1.38843 0.0138289 1.46488 0.0406946C1.54134 0.0675604 1.61078 0.106935 1.66924 0.156564L5.85277 3.69938C5.89944 3.73882 5.93647 3.78567 5.96173 3.83724C5.987 3.88882 6 3.94411 6 3.99994C6 4.05578 5.987 4.11107 5.96173 4.16264C5.93647 4.21422 5.89944 4.26107 5.85277 4.30051L1.66924 7.84332C1.42255 8.05223 1.02484 8.05223 0.778157 7.84332C0.531474 7.63442 0.531474 7.29762 0.778157 7.08872L4.42302 3.99781L0.773123 0.906907C0.531475 0.702268 0.531474 0.361203 0.778157 0.156564Z"
                    fill="white"
                  />
                </svg>
              </div>
            </Link>
          </div>
          <div className="info-main-first mt-3">
            <Link to={"/update_email"} className="info-first1">
              <div className="flex gap-1 max-w-[230px] flex-col ">
                <h1 className="info-text">绑定邮箱</h1>
              </div>
              <div className="flex items-center gap-1">
                <p className="info-main-text">
                  {user?.email ? user?.email : "未绑定"}
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="6"
                  height="8"
                  viewBox="0 0 6 8"
                  fill="none"
                >
                  <path
                    d="M0.778157 0.156564C0.836612 0.106935 0.906056 0.0675604 0.982509 0.0406946C1.05896 0.0138289 1.14092 0 1.2237 0C1.30647 0 1.38843 0.0138289 1.46488 0.0406946C1.54134 0.0675604 1.61078 0.106935 1.66924 0.156564L5.85277 3.69938C5.89944 3.73882 5.93647 3.78567 5.96173 3.83724C5.987 3.88882 6 3.94411 6 3.99994C6 4.05578 5.987 4.11107 5.96173 4.16264C5.93647 4.21422 5.89944 4.26107 5.85277 4.30051L1.66924 7.84332C1.42255 8.05223 1.02484 8.05223 0.778157 7.84332C0.531474 7.63442 0.531474 7.29762 0.778157 7.08872L4.42302 3.99781L0.773123 0.906907C0.531475 0.702268 0.531474 0.361203 0.778157 0.156564Z"
                    fill="white"
                  />
                </svg>
              </div>
            </Link>
            <Link to={"/update_phone"} className="info-first1">
              <div className="flex gap-1 max-w-[230px] ">
                <h1 className="info-text">绑定电话号码</h1>
              </div>
              <div className="flex items-center gap-1">
                <p className="info-main-text">
                  {user?.phone
                    ? user?.phone !== "0"
                      ? user?.phone
                      : "未绑定"
                    : "未绑定"}
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="6"
                  height="8"
                  viewBox="0 0 6 8"
                  fill="none"
                >
                  <path
                    d="M0.778157 0.156564C0.836612 0.106935 0.906056 0.0675604 0.982509 0.0406946C1.05896 0.0138289 1.14092 0 1.2237 0C1.30647 0 1.38843 0.0138289 1.46488 0.0406946C1.54134 0.0675604 1.61078 0.106935 1.66924 0.156564L5.85277 3.69938C5.89944 3.73882 5.93647 3.78567 5.96173 3.83724C5.987 3.88882 6 3.94411 6 3.99994C6 4.05578 5.987 4.11107 5.96173 4.16264C5.93647 4.21422 5.89944 4.26107 5.85277 4.30051L1.66924 7.84332C1.42255 8.05223 1.02484 8.05223 0.778157 7.84332C0.531474 7.63442 0.531474 7.29762 0.778157 7.08872L4.42302 3.99781L0.773123 0.906907C0.531475 0.702268 0.531474 0.361203 0.778157 0.156564Z"
                    fill="white"
                  />
                </svg>
              </div>
            </Link>

            {/* <Link to={"/bind"} className="info-first1">
              <div className="flex gap-1 max-w-[230px] flex-col ">
                <h1 className="info-text">绑定快捷登录 </h1>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="6"
                  height="8"
                  viewBox="0 0 6 8"
                  fill="none"
                >
                  <path
                    d="M0.778157 0.156564C0.836612 0.106935 0.906056 0.0675604 0.982509 0.0406946C1.05896 0.0138289 1.14092 0 1.2237 0C1.30647 0 1.38843 0.0138289 1.46488 0.0406946C1.54134 0.0675604 1.61078 0.106935 1.66924 0.156564L5.85277 3.69938C5.89944 3.73882 5.93647 3.78567 5.96173 3.83724C5.987 3.88882 6 3.94411 6 3.99994C6 4.05578 5.987 4.11107 5.96173 4.16264C5.93647 4.21422 5.89944 4.26107 5.85277 4.30051L1.66924 7.84332C1.42255 8.05223 1.02484 8.05223 0.778157 7.84332C0.531474 7.63442 0.531474 7.29762 0.778157 7.08872L4.42302 3.99781L0.773123 0.906907C0.531475 0.702268 0.531474 0.361203 0.778157 0.156564Z"
                    fill="white"
                  />
                </svg>
              </div>
            </Link> */}
          </div>
          <div className="info-main-first mt-3">
            <Link to={"/update_password"} className="info-first1">
              <div className="flex gap-1 max-w-[230px] ">
                <h1 className="info-text">修改密码</h1>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="6"
                  height="8"
                  viewBox="0 0 6 8"
                  fill="none"
                >
                  <path
                    d="M0.778157 0.156564C0.836612 0.106935 0.906056 0.0675604 0.982509 0.0406946C1.05896 0.0138289 1.14092 0 1.2237 0C1.30647 0 1.38843 0.0138289 1.46488 0.0406946C1.54134 0.0675604 1.61078 0.106935 1.66924 0.156564L5.85277 3.69938C5.89944 3.73882 5.93647 3.78567 5.96173 3.83724C5.987 3.88882 6 3.94411 6 3.99994C6 4.05578 5.987 4.11107 5.96173 4.16264C5.93647 4.21422 5.89944 4.26107 5.85277 4.30051L1.66924 7.84332C1.42255 8.05223 1.02484 8.05223 0.778157 7.84332C0.531474 7.63442 0.531474 7.29762 0.778157 7.08872L4.42302 3.99781L0.773123 0.906907C0.531475 0.702268 0.531474 0.361203 0.778157 0.156564Z"
                    fill="white"
                  />
                </svg>
              </div>
            </Link>
          </div>

          <div
            className={`bottom-sheet ${
              showBottomSheet ? "slide-in" : "slide-out"
            }`}
            ref={bottomSheetRef}
          >
            <div className="bottom-sheet-content">
              <div className="flex justify-between items-center">
                <div></div>
                <div className="w-[50px] h-[4px] bg-white my-3 rounded-[4px]"></div>
                <div></div>
              </div>
              <button
                className="bottom-sheet-option"
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                相册选取
              </button>
              <button
                className="bottom-sheet-option"
                onClick={() => document.getElementById("cameraInput")?.click()}
              >
                拍照
              </button>
              <button
                className="bottom-sheet-option text-[#717173]"
                onClick={closeBottomSheet}
              >
                取消
              </button>
            </div>
          </div>

          <input
            id="fileInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileInputChange}
          />
          <input
            id="cameraInput"
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: "none" }}
            onChange={handleFileInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Main;
