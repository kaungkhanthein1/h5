import React, { useState, useEffect } from "react";
import capClose from "../../../../assets/login/capClose.svg";
import { useDispatch } from "react-redux";
import {
  setCaptchaOpen,
  setOtpOpen,
} from "../../../../features/login/ModelSlice";
import { getCaptcha } from "../../../../services/userService"; // Importing service methods
import {
  useCheckCaptchaMutation,
  useLazySendCodeQuery,
} from "../../services/profileApi";
import { showToast } from "../../error/ErrorSlice";

const Captcha: React.FC<{ data: string; type: string }> = ({ data, type }) => {
  const dispatch = useDispatch();
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaImage, setCaptchaImage] = useState<string | null>(null);
  const [keyStatus, setKeyStatus] = useState("");
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [checkCaptcha, { isLoading, isError }] = useCheckCaptchaMutation(); // RTK mutation hook for captcha verification
  const [triggerSendCode, { isLoading: isSendCodeLoading }] =
    useLazySendCodeQuery(); // RTK lazy query for sending code

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
      dispatch(
        showToast({
          message: "无法加载验证码",
          type: "error",
        })
      );
      setError("");
    }
  };

  // Function to handle captcha verification
  const handleVerifyCaptcha = async () => {
    try {
      const captchaResponse = await checkCaptcha({
        code: captchaCode,
        key: keyStatus,
      }).unwrap();

      // Call sendCode after captcha verification
      const sendCodeResponse = await triggerSendCode({
        send_type: type, // Assuming you are sending this for email verification
        to: data, // Email from the parent component
        captcha: captchaResponse?.data?.key, // Captcha key from response
      }).unwrap();

      dispatch(setCaptchaOpen(false));
      // Dispatch action to open OTP component
      dispatch(setOtpOpen(true)); // Assuming you want to show the OTP form now
    } catch (error) {
      dispatch(
        showToast({
          message:
            (error as any)?.data?.msg || "验证码无效或无法发送 OTP。请重试。",
          type: "error",
        })
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-[12px] w-screen h-screen flex justify-center items-center">
      {captchaImage && (
        <div className="bg-[#1C1B20] w-[310px] h-[170px] p-[20px]">
          <div className="flex justify-between items-center pb-[16px]">
            <h1 className="text-white text-[16px] font-[400] text-center">
              核实
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
              type="text"
              placeholder="输入代码"
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
            className={`mt-[16px] w-full rounded-[4px] p-[10px] text-[14px] font-[400] ${
              isButtonDisabled || isLoading || isSendCodeLoading
                ? "bg-[#333237] text-[#777]"
                : "bg-white text-black"
            }`}
            disabled={isButtonDisabled || isLoading || isSendCodeLoading}
            onClick={handleVerifyCaptcha}
          >
            {isLoading || isSendCodeLoading ? "正在验证…" : "当然"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Captcha;
