import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setCaptchaOpen } from "../../features/login/ModelSlice";
import Captcha from "./components/email/Captcha";
import Otp from "./components/email/Otp";
import { useGetUserQuery } from "./services/profileApi";

const Phnumber: React.FC = () => {
  const dispatch = useDispatch();
  const { openCaptcha, openOtp } = useSelector((state: any) => state.model); // OpenCaptcha and OpenOtp states
  const { data: userData } = useGetUserQuery(undefined);
  const user = userData?.data;
  const initialPhone = user?.phone && user.phone !== '0' ? user.phone : ""; 
  // console.log(initialPhone)
  // const user = useSelector((state: any) => state.user.user);
  const [text, setText] = useState(initialPhone); // Email value
  const [active, setActive] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setCaptchaOpen(true)); // Open Captcha component
  };

  useEffect(() => {
    if (text) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [text]);

  const handleRemove = () => {
    setText("");
  };

  return (
    <div>
      <div className="fixed-bg"></div>

      {/* Show email form only if Captcha and OTP components are not open */}
      {!openOtp && (
        <div>
          <div className="flex fixed top-0 w-full z-10 bg-[#161619] justify-between items-center p-2">
            <Link to="/info" className="back-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M7.828 11H20V13H7.828L13.192 18.364L11.778 19.778L4 12L11.778 4.22198L13.192 5.63598L7.828 11Z"
                  fill="white"
                />
              </svg>
            </Link>
            <div className="history-title pr-10">设置新电话号码</div>
            <div className="edit-title cursor-pointer"></div>
          </div>

          <div className="mt-[80px] p-4 relative">
            <form onSubmit={handleSubmit} className="w-full">
              <input
                type="number"
                className="new-input no-spinner"
                placeholder="请输入手机号"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button
                className={`submit_btn`}
                style={{
                  background: active ? "#F54100" : "rgba(255, 255, 255, 0.04)",
                  color: active ? "white" : "rgba(255, 255, 255, 0.20)",
                }}
              >
                保存
              </button>
            </form>
            <button className="close-btn-input" onClick={handleRemove}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
              >
                <path
                  d="M5 3.88906L8.88906 0L10 1.11094L6.11094 5L10 8.88906L8.88906 10L5 6.11094L1.11094 10L0 8.88906L3.88906 5L0 1.11094L1.11094 0L5 3.88906Z"
                  fill="white"
                  fill-opacity="0.8"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Show Captcha if Captcha is open */}
      {openCaptcha && <Captcha data={text} type="phone" />}

      {/* Show Otp if Otp component is open */}
      {openOtp && <Otp data={text} type="phone" />}
    </div>
  );
};

export default Phnumber;
