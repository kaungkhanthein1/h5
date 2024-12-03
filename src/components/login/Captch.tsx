import React, { useState, useEffect, startTransition } from "react";
import capClose from "../../assets/login/capClose.svg";
import { useDispatch } from "react-redux";
import {
  setAuthModel,
  setCapCode,
  setCaptchaOpen,
  setGraphicKey,
  setLoginOpen,
  setOCapKey,
  setOtpOpen,
  setSignupOpen,
} from "../../features/login/ModelSlice";
import {
  check_captchaRegister,
  getCaptcha,
  login,
} from "../../services/userService"; // Importing service methods
import { useNavigate } from "react-router-dom";
import { showToast } from "../../pages/profile/error/ErrorSlice";
import Loader from "./Loader";

const Captch: React.FC<{
  username: string;
  setIsVisible: (isVisible: boolean) => void;
  key: string;
  setKey: (key: string) => void;
  password: string;
  isLogin: boolean;
}> = ({ username, password, isLogin, setIsVisible, key, setKey }) => {
  const dispatch = useDispatch();
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaImage, setCaptchaImage] = useState<string | null>(null);
  const [keyStatus, setKeyStatus] = useState("");
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const navigate = useNavigate();
  const [panding,setPanding] = useState(false)

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
      // console.log(keyStatus)
      setCaptchaImage(captchaImage);
      setKeyStatus(keyStatus);
    } catch (err) {
      setError("Failed to load captcha");
      console.error("Captcha error:", err);
    }
  };

  const handleFunction = () => {
    if (isLogin) {
      handleLogin();
    } else {
      handleOtp();
    }
  };

  // Handle login after verifying the captcha
  const handleLogin = async () => {
    setPanding(true)
    try {
      // Call login from userService with captcha verification
      const loginResponse = await login(
        username,
        password,
        captchaCode,
        keyStatus
      );
      if (loginResponse.errorCode) {
        dispatch(showToast({ message: loginResponse.msg, type: "error" }));
      } else {
        localStorage.setItem("authToken", JSON.stringify(loginResponse));
        setTimeout(() => {
          closeAllModals();
        }, 700);
      }
      // Set the token in localStorage

      // Close the captcha modal and redirect to home (or the desired route)
      dispatch(setCaptchaOpen(false));

      // Manually redirect to the home page after login
    } catch (err: any) {
      const Errmessage = err.response.data.msg;
      dispatch(showToast({ message: Errmessage, type: "error" }));
      dispatch(setCaptchaOpen(false));
    }
    setPanding(false)
  };

  const closeAllModals = () => {
    startTransition(() => {
      dispatch(setAuthModel(false));
      dispatch(setLoginOpen(false));
      dispatch(setSignupOpen(false));
    });
  };

  const handleOtp = async () => {
    setPanding(true)
    try {
      const data = await check_captchaRegister(captchaCode, keyStatus);
      if (!data.code) {
        setKey(data);
        dispatch(setGraphicKey(data))
        dispatch(setCaptchaOpen(false));
        dispatch(setOtpOpen(true));
        // console.log(data);
      } else {
        dispatch(showToast({ message: "图形验证码错误", type: "error" }));
      }
    } catch (error: any) {
      const Errmessage = error.response.data.msg;
      console.log("err", Errmessage);
    }
    setPanding(false)
    // dispatch(setCapCode(captchaCode));
    // dispatch(setOCapKey(keyStatus));
    // dispatch(setCaptchaOpen(false));
    // dispatch(setOtpOpen(true));
  };

  const handleClose = () => {
    dispatch(setCaptchaOpen(false));
    setIsVisible(true);
  };

  return (
    <div className="fixed inset-0 z-[999998] bg-black/50 backdrop-blur-[12px] w-screen h-screen flex justify-center items-center">
      {panding && <Loader /> }
      {captchaImage && (
        <div className="bg-[#1C1B20] w-[320px] h-[170px] p-[20px]">
          <div className="flex justify-center items-center pb-[16px] relative">
            <h1 className="text-white text-[16px] font-[400] text-center">
              验证
            </h1>
            <img
              onClick={handleClose}
              className="p-1 bg-white absolute right-0"
              src={capClose}
              alt="Close"
            />
          </div>
          <div className="flex justify-center w-full items-center gap-[4px]">
            <input
              type="number"
              placeholder="请输入验证码"
              className="bg-[#333237] w-full rounded-[4px] text-white px-[4px] py-[10px] focus:outline-none h-[40px]"
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
            className={`mt-[16px] w-full rounded-[4px] p-[10px] text-[14px] font-[400] ${
              isButtonDisabled
                ? "bg-[#333237] text-[#777]"
                : "bg-[#F54100] text-white"
            }`}
            disabled={isButtonDisabled}
            onClick={handleFunction}
          >
            确定
          </button>
          {error && (
            <div className="text-red-500 mt-2 text-center">{error}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Captch;
