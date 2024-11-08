import React, { useState, useEffect, startTransition } from "react";
import capClose from "../../assets/login/capClose.svg";
import { useDispatch } from "react-redux";
import {
  setAuthModel,
  setCapCode,
  setCaptchaOpen,
  setLoginOpen,
  setOCapKey,
  setOtpOpen,
  setSignupOpen,
} from "../../features/login/ModelSlice";
import { getCaptcha, login } from "../../services/userService"; // Importing service methods
import { useNavigate } from "react-router-dom";
import { showToast } from "../../pages/profile/error/ErrorSlice";

const Captch: React.FC<{
  username: string;
  setIsVisible: (isVisible: boolean) => void;

  password: string;
  isLogin: boolean;
}> = ({ username, password, isLogin,setIsVisible }) => {
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
      }
      // Set the token in localStorage

      // Close the captcha modal and redirect to home (or the desired route)
      dispatch(setCaptchaOpen(false));

      // Manually redirect to the home page after login
      setTimeout(() => {
        closeAllModals();
      }, 1000);
    } catch (err) {
      setError("Login failed");
      console.error("Login error:", err);
    }
  };

  const closeAllModals = () => {
    startTransition(() => {
      dispatch(setAuthModel(false));
      dispatch(setLoginOpen(false));
      dispatch(setSignupOpen(false));
    });
  };

  const handleOtp = () => {
    dispatch(setCapCode(captchaCode));
    dispatch(setOCapKey(keyStatus));
    dispatch(setCaptchaOpen(false));
    dispatch(setOtpOpen(true));
  };

  const handleClose = () => {
    dispatch(setCaptchaOpen(false))
    setIsVisible(true)
  }

  return (
    <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-[12px] w-screen h-screen flex justify-center items-center">
      {captchaImage && (
        <div className="bg-[#1C1B20] w-[320px] h-[170px] p-[20px]">
          <div className="flex justify-between items-center pb-[16px]">
            <h1 className="text-white text-[16px] font-[400] text-center">
            核实
            </h1>
            <img
              onClick={handleClose}
              className="p-1 bg-white"
              src={capClose}
              alt="Close"
            />
          </div>
          <div className="flex justify-center items-center gap-[4px]">
            <input
              type="text"
              placeholder="输入代码"
              className="bg-[#333237] rounded-[4px] text-white px-[4px] py-[10px] focus:outline-none h-[40px]"
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
                : "bg-white text-black"
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
