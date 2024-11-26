import React, { startTransition, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import back from "../../../assets/login/back.svg";
// import { setPasswordRecoveryFotgot } from "../../../services/userService";
import {
  setAuthModel,
  setCapCode,
  setCaptchaOpen,
  setLoginOpen,
  setOCapKey,
  setSignupOpen,
} from "../../../features/login/ModelSlice";
import {
  useGetCodeForgotQuery,
  usePasswordRecoveryMutation,
} from "../../../features/login/RegisterApi";
import { showToast } from "../../../pages/profile/error/ErrorSlice";
import { getCodeForgotPass } from "../../../services/userService";

interface OptProps {
  email: string;
  send_type: string;
  password: string;
  confirmPassword: string;
  accessToken: string;
  setShowVerify: (isVisible: boolean) => void;
}

const Verify: React.FC<OptProps> = ({
  password,
  confirmPassword,
  accessToken,
  setShowVerify,
  send_type,
  email,
}) => {
  // console.log(send_type, accessToken);
  // const { data: codeData, refetch: resendOtpApi } = useGetCodeForgotQuery(
  //   { send_type, session_token: accessToken || "" },
  //   { skip: !accessToken }
  // );
  // console.log(codeData);

  const [passwordRecovery, { error }] = usePasswordRecoveryMutation();
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState<number>(59);
  const [buttonText, setButtonText] = useState<string>("59 s");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [panding, setPanding] = useState(false);

  useEffect(() => {
    getCode();
  }, [accessToken]);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (timer > 0) setTimer((prev) => prev - 1);
    }, 1000);

    if (timer === 0) setButtonText("Resend Code");
    else setButtonText(`${timer} s`);

    return () => clearInterval(countdown);
  }, [timer]);

  const getCode = async () => {
    if (accessToken) {
      try {
        const result: any = await getCodeForgotPass({
          send_type,
          session_token: accessToken,
        });
        // console.log(result)
      } catch (error: any) {
        console.log("code err", error);
        const Errormsg = error.response?.data?.msg;
        dispatch(showToast({ message: Errormsg, type: "error" }));
      }
    }
  };

  const closeAllModals = () => {
    startTransition(() => {
      dispatch(setAuthModel(false));
      dispatch(setLoginOpen(false));
      dispatch(setSignupOpen(false));
      dispatch(setCaptchaOpen(false));
    });
  };

  const handleOTPChange = async (index: number, value: string) => {
    const updatedOTP = [...otpDigits];
    updatedOTP[index] = value;
    setOtpDigits(updatedOTP);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle OTP submission when all digits are filled
    if (updatedOTP.every((digit) => digit)) {
      const otpCode = updatedOTP.join("");
      if (otpCode) {
        try {
          setPanding(true);
          const { data, error } = await passwordRecovery({
            password,
            repassword: confirmPassword,
            session_token: accessToken,
            forget_code: otpCode,
          });
          console.log(error);
          if (data) {
            dispatch(showToast({ message: "找回成功", type: "success" }));
            closeAllModals();
            setTimeout(() => {
              dispatch(setAuthModel(true));
            }, 300);
            // navigate("/profile");
            console.log("set success");
          }
          if (error) {
            setPanding(false);
            dispatch(showToast({ message: "验证码错误", type: "error" }));
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const resendOtp = async () => {
    try {
      await getCodeForgotPass({ send_type, session_token: accessToken }); // Triggers the resend OTP API call
      setTimer(59); // Resets the timer to 59 seconds
      dispatch(showToast({ message: "验证码已成功重新发送", type: "success" }));
    } catch (error) {
      dispatch(showToast({ message: "验证码重新发送失败", type: "error" }));
    }
  };

  const handleBack = () => {
    setShowVerify(false);
    dispatch(setCapCode(""));
    dispatch(setOCapKey(""));
  };

  return (
    <div className="w-screen h-screen absolute z-[90909099090] bg-[#161619] p-[20px]">
      <div className=" flex justify-center items-center">
        <img
          className=" absolute top-[20px] left-[20px] z-[9090]"
          onClick={handleBack}
          src={back}
          alt="Back"
        />{" "}
        <h1 className="text-white text-[16px] font-semibold leading-[20px]">
          输入验证码
        </h1>
      </div>

      <div className="py-20 flex flex-col justify-center items-center">
        <div>
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              type="password"
              value={digit}
              maxLength={1}
              onChange={(e) => handleOTPChange(index, e.target.value)}
              className="w-10 h-10 mx-1 text-center rounded-lg bg-[#303030] text-white text-[20px]"
            />
          ))}
        </div>

        <p className="text-[#888] text-[10px] font-light leading-[15px] p-3 text-center">
          验证码已发送 {email}
          。请检查您的邮件，如果没收到，请务必再次检查您的垃圾邮件
        </p>
      </div>

      <div className="w-full flex justify-center items-center">
        {panding ? (
          <button
            disabled
            className="next_button text-[#777] w-[320px] text-[14px] font-[600] leading-[22px]  mt-[20px] py-[10px] px-[16px] rounded-[80px]"
          >
            加载中..
          </button>
        ) : (
          <button
            disabled={timer > 0}
            onClick={resendOtp}
            className={`w-[320px] text-[14px] font-[600] leading-[22px]  mt-[20px] py-[10px] px-[16px] rounded-[80px] ${
              timer > 0 ? "next_button text-[#777]" : "login_button text-white"
            }`}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Verify;
