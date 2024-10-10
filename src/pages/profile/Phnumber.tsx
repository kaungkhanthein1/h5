import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setCaptchaOpen } from "../../features/login/ModelSlice";
import Captcha from "./components/email/Captcha";
import Otp from "./components/email/Otp";

const Phnumber: React.FC = () => {
  const dispatch = useDispatch();
  const { openCaptcha, openOtp } = useSelector((state: any) => state.model); // OpenCaptcha and OpenOtp states
  const user = useSelector((state: any) => state.user.user);
  const [text, setText] = useState(user?.phone); // Email value

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setCaptchaOpen(true)); // Open Captcha component
  };

  return (
    <div>
      <div className="fixed-bg"></div>

      {/* Show email form only if Captcha and OTP components are not open */}
      {!openOtp && (
        <div>
          <div className="flex fixed top-0 w-full z-10 bg-[#161619] justify-between items-center p-5">
            <Link to="/info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="14"
                viewBox="0 0 10 14"
                fill="none"
              >
                <path
                  d="M9.2651 0.490513C9.16609 0.406457 9.04848 0.339768 8.91899 0.294266C8.7895 0.248764 8.65069 0.225342 8.51049 0.225342C8.3703 0.225342 8.23148 0.248764 8.102 0.294266C7.97251 0.339768 7.85489 0.406457 7.75589 0.490513L0.670255 6.49096C0.59121 6.55776 0.528499 6.63711 0.485711 6.72446C0.442923 6.81181 0.420898 6.90545 0.420898 7.00002C0.420898 7.09459 0.442923 7.18823 0.485711 7.27558C0.528499 7.36293 0.59121 7.44228 0.670255 7.50908L7.75589 13.5095C8.17369 13.8633 8.8473 13.8633 9.2651 13.5095C9.68291 13.1557 9.68291 12.5853 9.2651 12.2315L3.09182 6.99641L9.27363 1.76136C9.68291 1.41477 9.68291 0.837109 9.2651 0.490513Z"
                  fill="white"
                />
              </svg>
            </Link>
            <div className="history-title">设置新电话号码</div>
            <div className="edit-title cursor-pointer" onClick={handleSubmit}>
              保存
            </div>
          </div>
          <div className="mt-[60px] p-4">
            <form onSubmit={handleSubmit} className="w-full">
              <input
                type="text"
                className="nickname-input"
                placeholder="输入您的电话号码"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </form>
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
