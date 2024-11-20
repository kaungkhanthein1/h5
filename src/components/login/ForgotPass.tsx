import React, { useEffect, useState } from "react";
import back from "../../assets/login/back.svg";
import eye from "../../assets/login/eye.svg";
import Captch from "./Captch";
import Opt from "./Opt";
import eyeClose from "../../assets/login/eyeClose.svg";
import "../../pages/login/login.css";
import { useDispatch, useSelector } from "react-redux";
import { setCaptchaOpen } from "../../features/login/ModelSlice";
import axios from "axios";
import Capt from "./forgot/Capt";
// import { RecoverPassword } from "../../services/userService";
import Panding from "./Panding";
import Verify from "./forgot/Varify";
import { showToast } from "../../pages/profile/error/ErrorSlice";
import ErrorToast from "../../pages/profile/error/ErrorToast";

interface ForgotPassProps {
  setForgot: React.Dispatch<React.SetStateAction<boolean>>;
  forgot: boolean;
}

const ForgotPass: React.FC<ForgotPassProps> = ({ setForgot }) => {
  const dispatch = useDispatch();
  const { openCaptcha, captchaCode, captchaKey } = useSelector(
    (state: any) => state.model
  );
  const [panding, setPanding] = useState(false);
  const [accessToken, setToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [showVerify, setShowVerify] = useState<boolean>(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [isFocusedConfirmPassword, setIsFocusedConfirmPassword] =
    useState(false); // Focus state for confirm password

  const validatePassword = (password: string) => {
    const lengthValid = password.length >= 8 && password.length <= 25;
    const containsLetters = /[a-zA-Z]/.test(password);
    const containsNumbers = /\d/.test(password);
    return lengthValid && containsLetters && containsNumbers;
  };

  const RevalidatePassword = (password: string) => {
    const lengthValid = confirmPassword.length >= 8 && password.length <= 25;
    const containsLetters = /[a-zA-Z]/.test(password);
    const containsNumbers = /\d/.test(password);
    return lengthValid && containsLetters && containsNumbers;
  };

  const show = () => {
    setShowPassword(!showPassword);
  };

  const Reshow = () => {
    setShowRePassword(!showRePassword);
  };

  const passwordsMatch = (password: string, confirmPassword: string) => {
    return password === confirmPassword;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!passwordsMatch(password, confirmPassword)) {
      dispatch(showToast({ message: "密码不匹配", type: "error" }));
      return;
    }
    dispatch(setCaptchaOpen(true));
  };

  return (
    <>
      {panding && <Panding />}

      {isVisible && (
        <div className=" w-screen h-screen bg-[#161619] fixed top-0 z-[99990088]">
          {openCaptcha && (
            <Capt
              password={password}
              confirmPassword={confirmPassword}
              email={email}
            />
          )}
          <div className="p-[20px]">
            {/* head */}
            <div className=" flex justify-center items-center ">
              <img
                className=" absolute top-[20px] left-[20px] z-[9090]"
                onClick={() => setForgot(false)}
                src={back}
                alt="Back"
              />
              <h1 className="text-white text-[16px] font-[600] leading-[20px]">
                找回密码
              </h1>
              {/* <div className=""></div> */}
            </div>
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-[40px] pt-[40px] px-[10px]"
            >
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocusedEmail(true)}
                  onBlur={() => setIsFocusedEmail(email !== "")}
                  className="w-full px- py-2 bg-transparent input_border focus:outline-none text-white placeholder-[#5B5B5B]"
                  required
                  placeholder=" 请输入手机号/邮箱"
                />
                {/* <label
                  htmlFor="email"
                  className={`absolute  text-[14px] left-4 transition-all text-[#5B5B5B] pointer-events-none ${
                    isFocusedEmail || email
                      ? "top-0 text-xs text-blue-500 -translate-y-full"
                      : "top-1/2 transform -translate-y-1/2"
                  }`}
                >
                 请输入手机号/邮箱
                </label> */}
              </div>

              {/* Password input */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocusedPassword(true)}
                  onBlur={() => setIsFocusedPassword(password !== "")}
                  className="w-full px- py-2 bg-transparent input_border focus:outline-none text-white placeholder-[#5B5B5B]"
                  required
                  placeholder="输入新密码"
                />
                {/* <label
                  htmlFor="password"
                  className={`absolute text-[14px] left-4 transition-all text-[#5B5B5B] pointer-events-none ${
                    isFocusedPassword || password
                      ? "top-0 text-xs text-blue-500 -translate-y-full"
                      : "top-1/2 -translate-y-1/2"
                  }`}
                >
                 输入新密码
                </label> */}
                <div
                  onClick={show}
                  className=" w-[50px] flex justify-end items-center absolute right-0 bottom-[15px] h-[10px]"
                >
                  <img
                    className=""
                    src={showPassword ? eye : eyeClose}
                    alt="Show Password"
                  />
                </div>
              </div>

              {/* Confirm Password input */}
              <div className="relative">
                <input
                  type={showRePassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setIsFocusedConfirmPassword(true)}
                  onBlur={() =>
                    setIsFocusedConfirmPassword(confirmPassword !== "")
                  }
                  className="w-full px- py-2 bg-transparent input_border focus:outline-none text-white placeholder-[#5B5B5B]"
                  required
                  placeholder="再次输入新密码"
                />
                {/* <label
                  htmlFor="confirm-password"
                  className={`absolute text-[14px] left-4 transition-all text-[#5B5B5B] pointer-events-none ${
                    isFocusedConfirmPassword || confirmPassword
                      ? "top-0 text-xs text-blue-500 -translate-y-full"
                      : "top-1/2 -translate-y-1/2"
                  }`}
                >
                 再次输入新密码
                </label> */}
                <div
                  onClick={Reshow}
                  className=" w-[50px] flex justify-end items-center absolute right-0 bottom-[15px] h-[10px]"
                >
                  <img
                    className=""
                    src={showRePassword ? eye : eyeClose}
                    alt="Show Password"
                  />
                </div>
              </div>

              {/* Notice */}
              <div
                className={` mt-[-20px] text-[14px] font-[500] leading-[20px] ${
                  validatePassword(password) ? " text-[#00A048]" : "text-[#888]"
                }  `}
              >
                <p>8-25个字符</p>
                <p>必须是以下两者中的至少两种组合：字母，数字</p>{" "}
                {/* <p>letters, numbers.</p> */}
              </div>
              <button
                disabled={!validatePassword(password)}
                type="submit"
                className={`w-full text-[14px] font-[600] leading-[22px]  mt-[20px] py-[10px] px-[16px] rounded-[80px] ${
                  validatePassword(password) &&
                  RevalidatePassword(confirmPassword)
                    ? "login_button text-white"
                    : "next_button text-[#777]"
                } transition duration-300 ease-in-out`}
              >
                下一步
              </button>
            </form>
          </div>
        </div>
      )}
      <ErrorToast />
    </>
  );
};

export default ForgotPass;
