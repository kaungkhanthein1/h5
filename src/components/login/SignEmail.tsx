import React, { startTransition, useEffect, useRef, useState } from "react";
import back from "../../assets/login/back.svg";
import close from "../../assets/login/close.svg";
import eye from "../../assets/login/eye.svg";
import { motion, AnimatePresence } from "framer-motion";
import eyeClose from "../../assets/login/eyeClose.svg";
import Opt from "./Opt";
import Captch from "./Captch";
import { useDispatch, useSelector } from "react-redux";
import {
  setAuthModel,
  setCaptchaOpen,
  setLoginOpen,
  setSignupOpen,
} from "../../features/login/ModelSlice";
import axios from "axios";
import UserName from "./UserName";
import "../../pages/login/login.css";
import { useLocation } from "react-router-dom";

interface SignEmailProps {
  handleBack2: () => void; // Accept handleBack as a prop
}

const SignEmail: React.FC<SignEmailProps> = ({ handleBack2 }) => {
  const dispatch = useDispatch();
  const [key, setKey] = useState("");
  const { openCaptcha, openOtp, openSignUpEmailModel, openUserNameForm } =
    useSelector((state: any) => state.model);
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);

  const currentLocation = useLocation(); // Use the `useLocation` hook from react-router-dom
  const previousPathname = useRef(currentLocation.pathname);

  useEffect(() => {
    if (previousPathname.current !== currentLocation.pathname) {
      setIsVisible(false);
      closeAllModals();
    }
    previousPathname.current = currentLocation.pathname;
  }, [currentLocation.pathname]);

  const closeAllModals = () => {
    startTransition(() => {
      dispatch(setAuthModel(false));
      dispatch(setLoginOpen(false));
      dispatch(setSignupOpen(false));
    });
  };

  const show = () => {
    setShowPassword(!showPassword);
  };


  // Password validation function
  const validatePassword = (password: string) => {
    const lengthValid = password.length >= 8 && password.length <= 25;
    const containsLetters = /[a-zA-Z]/.test(password);
    const containsNumbers = /\d/.test(password);
    return lengthValid && containsLetters && containsNumbers;
  };
  const variants = {
    hidden: { y: 300 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
    exit: {
      y: "100%",
      transition: { type: "tween", duration: 0.5 },
    },
  };

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.y > 100) {
      setIsVisible(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(setCaptchaOpen(true));
      // setShowOtp(true);
      // setIsVisible(false);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };
  // console.log(key);
  return (
    <>
      {openOtp && (
        <Opt key={key} setIsVisible={setIsVisible} password={password} email={email} />
      )}
      <div className="min-h-screen flex items-center justify-center overflow-hidde fixed z-[99999]">
        {openCaptcha && (
          <Captch
            key={key}
            setKey={setKey}
            setIsVisible={setIsVisible}
            isLogin={false}
            username={email}
            password={password}
          />
        )}
        {openUserNameForm && <UserName />}

        <AnimatePresence>
          {isVisible && (
            <motion.div
              className="login_box h-[480px] fixed bottom-0 z-[9999] w-screen py-4 px-[20px] bg-gray-800 rounded-t-2xl"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
            >
              <div className="flex flex-col justify-center items-center gap-[16px]">
                <motion.p className="w-[60px] h-[4px] drag_line mt-[8px] cursor-pointer bg-gray-400"></motion.p>
                <div className="flex justify-between items-center w-full pb-[20px]">
                  <img
                    className="p-3 cursor-pointer"
                    src={back}
                    alt="Back"
                    onClick={handleBack2}
                  />
                  <h2 className="text-[18px] font-[600] leading-[20px] text-white">
                    使用邮箱注册
                  </h2>
                  <img
                    className="close_btn p-3 cursor-pointer"
                    src={close}
                    alt="Close"
                    onClick={handleClose}
                  />
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="w-full flex flex-col gap-[40px] px-[10px]"
                >
                  <div className="relative ">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsFocusedEmail(true)}
                      onBlur={() => setIsFocusedEmail(email !== "")}
                      className="w-full px- py-2 bg-[#2B2B2D] input_border focus:outline-none text-white placeholder-[#5B5B5B]"
                      required
                      placeholder="请输入您的电子邮件"
                    />
                    {/* <label
                      htmlFor="email"
                      className={`absolute text-[14px] left-4 text-gray-500 transition-all duration-300 pointer-events-none ${
                        isFocusedEmail || email
                          ? "top-[-8px] text-xs text-blue-500"
                          : "top-1/2 transform -translate-y-1/2"
                      }`}
                    >
                    请输入邮箱地址
                    </label> */}
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setIsFocusedPassword(true)}
                      onBlur={() => setIsFocusedPassword(password !== "")}
                      className="w-full px- py-2 bg-[#2B2B2D] input_border focus:outline-none text-white placeholder-[#5B5B5B]"
                      required
                      placeholder="设置您的密码"
                    />
                    {/* <label
                      htmlFor="password"
                      className={`absolute text-[14px] left-4 transition-all text-[#5B5B5B] pointer-events-none ${
                        isFocusedPassword || password
                          ? "top-0 text-xs text-blue-500 -translate-y-full"
                          : "top-1/2 -translate-y-1/2"
                      }`}
                    >
                     设置密码
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
                  {/* decs */}
                  <div
                    className={` mt-[-20px] text-[14px] font-[500] leading-[20px] ${
                      validatePassword(password)
                        ? " text-[#00A048]"
                        : "text-[#888]"
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
                      validatePassword(password)
                        ? "login_button text-white"
                        : "next_button text-[#777]"
                    } transition duration-300 ease-in-out`}
                  >
                    注册
                  </button>
                </form>

                {/* <button className=" bg-white text-black px-2 py-2" onClick={getOtp}>test</button> */}

                {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default SignEmail;
