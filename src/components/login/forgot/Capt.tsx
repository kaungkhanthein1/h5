import React, { useState, useEffect } from "react";
import capClose from "../../../assets/login/capClose.svg";

import { useDispatch } from "react-redux";
import {
  setCapCode,
  setCaptchaOpen,
  setOCapKey,
} from "../../../features/login/ModelSlice";
import { useNavigate } from "react-router-dom";
import {
  check_captchaRegister,
  getCaptcha,
  getTokenPass,
} from "../../../services/userService";
import {
  useConfirmCaptchaForgotMutation,
  useGetTokenForgotQuery,
} from "../../../features/login/RegisterApi";
import Verify from "./Varify";
import { showToast } from "../../../pages/profile/error/ErrorSlice";
import ErrorToast from "../../../pages/profile/error/ErrorToast";

interface CaptProp {
  email: string;
  password: string;
  confirmPassword: string;
}

const Capt: React.FC<CaptProp> = ({ email, password, confirmPassword }) => {
  const [confirmCaptchaForgot] = useConfirmCaptchaForgotMutation();
  const [showVerify, setShowVerify] = useState<boolean>(false);
  const [panding, setPanding] = useState(false);
  const [graphicKey, setGraphicKey] = useState<string | null>(null);
  const { data: tokenData } = useGetTokenForgotQuery(
    { email, graphicKey: graphicKey || "" },
    { skip: !graphicKey }
  );
  const dispatch = useDispatch();
  const [captchaCode, setCaptchaCode] = useState("");
  const [accessToken, setToken] = useState("");
  const [isemail, setIsemail] = useState<string>("");
  const [captchaImage, setCaptchaImage] = useState<string | null>(null);
  const [keyStatus, setKeyStatus] = useState("");
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const navigate = useNavigate();

  // Fetch captcha when the component loads
  useEffect(() => {
    fetchCaptcha();
  }, []);

  useEffect(() => {
    getToken();
  }, [graphicKey]);

  const getToken = async () => {
    if (graphicKey) {
      try {
        setPanding(true);
        const result: any = await getTokenPass({ email, graphicKey });
        // console.log(result);
        const { data } = result;
        const { email : mail, phone, session_token } = data;
          if (mail) {
          setIsemail("email");
        } else {
          setIsemail("phone");
        }
        setToken(session_token);
        setShowVerify(true);
        // dispatch(setCaptchaOpen(false))
        console.log(data);
      } catch (error: any) {
        const Errormsg = error.response?.data?.msg;
        dispatch(setCaptchaOpen(false));
        dispatch(showToast({ message: Errormsg, type: "error" }));
      }
    }
    setPanding(false);
  };

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

  const handleSubmit = async () => {
    try {
      // const { data } = await confirmCaptchaForgot({ captchaCode, keyStatus });
      const data = await check_captchaRegister(captchaCode, keyStatus);

      // console.log(data);
      if (!data.code) {
        setGraphicKey(data);
      } else {
        dispatch(showToast({ message: "图形验证码错误", type: "error" }));
      }
      // console.log(tokenData)

      // if (tokenData) {
      //   const { data } = tokenData;
      //   const { email, phone, session_token } = data;
      //   if (email) {
      //     setIsemail("email");
      //   } else {
      //     setIsemail("phone");
      //   }
      //   setToken(session_token);
      //   setShowVerify(true);
      // } else if (!tokenData && graphicKey) {
      //   // console.log("user not exist");
      //   dispatch(setCaptchaOpen(false));
      //   dispatch(showToast({ message: "找不到用户", type: "error" }));
      // }
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <>
      <ErrorToast />
      {showVerify && (
        <Verify
          setShowVerify={setShowVerify}
          password={password}
          confirmPassword={confirmPassword}
          accessToken={accessToken}
          send_type={isemail}
          email={email}
        />
      )}
      <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-[12px] w-screen h-screen flex justify-center items-center">
        {captchaImage && (
          <div className="bg-[#1C1B20] w-[310px] h-[170px] p-[20px]">
            <div className="flex justify-center items-center pb-[16px] relative">
              <h1 className="text-white text-[16px] font-[400] text-center">
                核实
              </h1>
              <img
                onClick={() => dispatch(setCaptchaOpen(false))}
                className="p-1 bg-white absolute right-0"
                src={capClose}
                alt="Close"
              />
            </div>
            <div className="flex w-full justify-center items-center gap-[4px]">
              <input
                type="number"
                placeholder="请输入验证码"
                className="bg-[#333237] w-full rounded-[4px] text-white p-[10px] focus:outline-none h-[40px]"
                value={captchaCode}
                onChange={(e) => setCaptchaCode(e.target.value)}
              />
              <img
                className="w-[87px] h-[40px]"
                src={captchaImage}
                alt="Captcha"
              />
            </div>
            {panding ? (
              <button
                disabled
                className="bg-[#333237] text-[#777] mt-[16px] w-full rounded-[4px] p-[10px] text-[14px] font-[400]"
              >
                加载中..
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className={`mt-[16px] w-full rounded-[4px] p-[10px] text-[14px] font-[400] ${
                  isButtonDisabled
                    ? "bg-[#333237] text-[#777]"
                    : "bg-[#F54100] text-white"
                }`}
                disabled={isButtonDisabled}
                // onClick={handleFunction}
              >
                确定
              </button>
            )}
            {/* {error && (
              <div className="text-red-500 mt-2 text-center">{error}</div>
            )} */}
          </div>
        )}
      </div>
    </>
  );
};

export default Capt;
