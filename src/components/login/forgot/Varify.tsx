import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import back from "../../../assets/login/back.svg";
// import { setPasswordRecoveryFotgot } from "../../../services/userService";
import { setCapCode, setOCapKey } from "../../../features/login/ModelSlice";
import {
  useGetCodeForgotQuery,
  usePasswordRecoveryMutation,
} from "../../../features/login/RegisterApi";
import { showToast } from "../../../pages/profile/error/ErrorSlice";

interface OptProps {
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
}) => {
  // console.log(send_type, accessToken);
  const { data: codeData, refetch: resendOtpApi } = useGetCodeForgotQuery(
    { send_type, session_token: accessToken || "" },
    { skip: !accessToken }
  );
  // console.log(codeData);

  const [passwordRecovery, { error }] = usePasswordRecoveryMutation();
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState<number>(59);
  const [buttonText, setButtonText] = useState<string>("59 s");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (codeData) {
      console.log("Code data fetched:", codeData);
    }
  }, [codeData]);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (timer > 0) setTimer((prev) => prev - 1);
    }, 1000);

    if (timer === 0) setButtonText("Resend Code");
    else setButtonText(`${timer} s`);

    return () => clearInterval(countdown);
  }, [timer]);

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
          const { data, error } = await passwordRecovery({
            password,
            repassword: confirmPassword,
            session_token: accessToken,
            forget_code: otpCode,
          });
          console.log(error);
          if (data) {
            navigate("/profile");
            console.log("set success");
          }
          if (error) {
            dispatch(showToast({ message: "验证码错误", type: "error" }));
            // console.log("'", result.error);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const resendOtp = async () => {
    try {
      await resendOtpApi(); // Triggers the resend OTP API call
      setTimer(59); // Resets the timer to 59 seconds
      dispatch(
        showToast({ message: "验证码已成功重新发送", type: "success" })
      );
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
      <div className="flex justify-between w-2/3">
        <img src={back} alt="Back" onClick={handleBack} />
        <h1 className="text-white text-[16px] font-semibold leading-[20px]">
          OTP Verification
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
          Verification code sent ,{""}
          {/* <span className="text-white">DevelopX10@gmail.com</span> /{" "} */}
          {/* <span className="text-white">+868880818.</span> */}
          Please check your messages and spam folder.
        </p>
      </div>

      <div className="w-full">
        <button
          disabled={timer > 0}
          onClick={resendOtp}
          className={`w-full px-[15px] py-[10px] text-[16px] font-semibold leading-[22px] ${
            timer > 0
              ? "otp_button text-white"
              : "bg-white rounded-full text-black"
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Verify;
