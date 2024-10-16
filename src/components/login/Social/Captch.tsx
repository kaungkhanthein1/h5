import React, { useState, useEffect } from "react";
import capClose from "../../../assets/login/capClose.svg";

import { useDispatch } from "react-redux";
import {
  setCapCode,
  setCaptchaOpen,
  setOCapKey,
} from "../../../features/login/ModelSlice";
import { useNavigate } from "react-router-dom";
import { getCaptcha } from "../../../services/userService";

const Captch: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaImage, setCaptchaImage] = useState<string | null>(null);
  const [keyStatus, setKeyStatus] = useState("");
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const navigate = useNavigate();

  // Fetch captcha when the component loads
  useEffect(() => {
    fetchCaptcha();
  }, []);

  // Update button state based on captcha input
  useEffect(() => {
    setIsButtonDisabled(captchaCode.length !== 4);
  }, [captchaCode]);

  // Function to fetch captcha using userService
  const fetchCaptcha = async () => {
    try {
      const { captchaImage, keyStatus } = await getCaptcha();

      setCaptchaImage(captchaImage);
      setKeyStatus(keyStatus);
    } catch (err) {
      setError("Failed to load captcha");
      console.error("Captcha error:", err);
    }
  };

  const handleSubmit = () => {
    dispatch(setCapCode(captchaCode));
    dispatch(setOCapKey(keyStatus));
    dispatch(setCaptchaOpen(false));
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-[12px] w-screen h-screen flex justify-center items-center">
      {captchaImage && (
        <div className="bg-[#1C1B20] w-[310px] h-[170px] p-[20px]">
          <div className="flex justify-between items-center pb-[16px]">
            <h1 className="text-white text-[16px] font-[400] text-center">
              Verify
            </h1>
            <img
              onClick={() => dispatch(setCaptchaOpen(false))}
              className="p-1 bg-white"
              src={capClose}
              alt="Close"
            />
          </div>
          <div className="flex justify-center items-center gap-[4px]">
            <input
              type="number"
              placeholder="Enter Code"
              className="bg-[#333237] rounded-[4px] text-white p-[10px] focus:outline-none h-[40px]"
              value={captchaCode}
              onChange={(e) => setCaptchaCode(e.target.value)}
            />
            <img
              className="w-[87px] h-[40px]"
              src={captchaImage}
              alt="Captcha"
            />
          </div>
          <button
            onClick={handleSubmit}
            className={`mt-[16px] w-full rounded-[4px] p-[10px] text-[14px] font-[400] ${
              isButtonDisabled
                ? "bg-[#333237] text-[#777]"
                : "bg-white text-black"
            }`}
            disabled={isButtonDisabled}
            // onClick={handleFunction}
          >
            Sure
          </button>
          {/* {error && (
            <div className="text-red-500 mt-2 text-center">{error}</div>
          )} */}
        </div>
      )}
    </div>
  );
};

export default Captch;
