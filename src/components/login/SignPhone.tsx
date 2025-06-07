import React, { startTransition, useEffect, useRef, useState } from "react";
import back from "../../assets/login/back.svg";
import close from "../../assets/login/close.svg";
import eye from "../../assets/login/eye.svg";
import eyeClose from "../../assets/login/eyeClose.svg";
import "../../pages/login/login.css";
import { motion, AnimatePresence } from "framer-motion";
import Opt from "./Opt";
import Captch from "./Captch";
import { useDispatch, useSelector } from "react-redux";
import {
  setAuthModel,
  setCaptchaOpen,
  setLoginOpen,
  setOtpOpen,
  setSignupOpen,
} from "../../features/login/ModelSlice";
import { showToast } from "../../pages/profile/error/ErrorSlice";
import { useLocation } from "react-router-dom";
import { getOtp } from "../../services/userService";

interface SignPhoneProps {
  handleBack2: () => void; // Accept handleBack as a prop
}

const SignPhone: React.FC<SignPhoneProps> = ({ handleBack2 }) => {
  const [key, setKey] = useState("");

  const dispatch = useDispatch();
  const { openCaptcha, openOtp, GraphicKey } = useSelector(
    (state: any) => state.model
  );
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [box, setBox] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  const show = () => {
    setShowPassword(!showPassword);
  };

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

  // Password validation function
  const validatePassword = (password: string) => {
    const lengthValid = password.length >= 6 && password.length <= 25;
    const containsLetters = /[a-zA-Z]/.test(password);
    const containsNumbers = /\d/.test(password);
    return lengthValid && containsLetters && containsNumbers;
  };
  const variants = {
    hidden: { y: 300 },
    visible: {
      // opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
    exit: {
      y: "100%",
      transition: { type: "tween", duration: 0.2 },
    },
  };

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.y > 100) {
      setIsVisible(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const phoneRegex = /^(13|14|15|16|17|18|19)\d{9}$/;

    if (!phoneRegex.test(phone)) {
      setError("手机号格式不正确"); // Invalid phone number format
      dispatch(showToast({ message: "手机号格式不正确", type: "error" }));
      return;
    }
    try {
      dispatch(setCaptchaOpen(true));
      setShowOtp(true);
      // setIsVisible(false);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleClose = () => {
    dispatch(setLoginOpen(false));
    dispatch(setSignupOpen(false));
    dispatch(setAuthModel(false));
    setIsVisible(false);
  };

  useEffect(() => {
    const fetchOtp = async () => {
      try {
        if (phone) {
          await getOtp(GraphicKey, phone, "phone");
          setBox(true);
          dispatch(setOtpOpen(false));
        }
      } catch (error: any) {
        // console.error("Error fetching OTP:", error);
        const msg = error.response.data.msg;
        dispatch(showToast({ message: msg, type: "error" }));
        dispatch(setOtpOpen(false));

        // Show error message to the user, e.g., using state or toast notification
      }
    };

    if (openOtp) {
      fetchOtp();
    }
  }, [openOtp]);

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      {box && (
        <Opt
          setIsVisible={setIsVisible}
          phone={phone}
          password={password}
          setBox={setBox}
          invite_code={inviteCode}
        />
      )}
      {openCaptcha && (
        <Captch
          key={key}
          setKey={setKey}
          setIsVisible={setIsVisible}
          isLogin={false}
          username={phone}
          password={password}
        />
      )}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="login_box h-[580px] fixed bottom-0 z-[99999] w-screen py-4 px-[20px] bg-gray-800 rounded-t-2xl"
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
              <motion.p className="w-[60px] h-[4px] drag_line mt-[12px] cursor-pointer bg-gray-400"></motion.p>
              <div className="flex justify-between items-center w-full pb-[20px]">
                <img
                  className="p-3 cursor-pointer"
                  src={back}
                  alt="Back"
                  onClick={handleBack2}
                />
                <h2 className="text-[18px] font-[600] leading-[20px] text-white">
                  使用手机号码注册
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
                // className="w-full flex flex-col gap-[40px] px-[10px]"
                className="w-full grid gap-[40px] px-[10px]"
              >
                <div className="relative ">
                  <input
                    type="number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onFocus={() => setIsFocusedEmail(true)}
                    onBlur={() => setIsFocusedEmail(phone !== "")}
                    className="w-full px- py-2 bg-[#2B2B2D] input_border focus:outline-none text-white placeholder-[#5B5B5B]"
                    required
                    placeholder="请输入您的电话号码"
                  />
                  {/* <label
                    htmlFor="text"
                    className={`absolute text-[14px] left-4 text-gray-500 transition-all duration-300 pointer-events-none ${
                      isFocusedEmail || phone
                        ? "top-[-8px] text-[12px] text-blue-500"
                        : "top-1/2 transform -translate-y-1/2"
                    }`}
                  >
                   请输入手机号
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
                    minLength={6}
                    maxLength={25}
                  />
                  {/* <label
                    htmlFor="password"
                    className={`absolute text-[14px] left-4 transition-all text-[#5B5B5B] pointer-events-none ${
                      isFocusedPassword || password
                        ? "top-0 text-[12px] text-blue-500 -translate-y-full"
                        : "top-1/2 -translate-y-1/2"
                    }`}
                  >
                    设置密码
                  </label> */}
                  <div
                    onClick={show}
                    className=" w-[50px] flex justify-end items-center absolute right-0 bottom-[15px] h-[20px]"
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
                  <p>6-25个字符</p>
                  <p>必须是以下两者中的至少两种组合：字母，数字</p>{" "}
                  {/* <p>letters, numbers.</p> */}
                </div>

                <div className="invite_code w-full flex justify-center items-center py-[14px]">
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="w-[150px] bg-transparent focus:outline-none text-white placeholder-[#5B5B5B]"
                    placeholder="输入促销代码（可选）"
                  />
                </div>

                <button
                  disabled={!validatePassword(password)}
                  type="submit"
                  className={`w-full text-[14px] font-[600] leading-[22px]  mt-[20px] py-[10px] px-[16px] rounded-[80px]  ${
                    validatePassword(password)
                      ? "login_button text-white"
                      : "next_button text-[#777]"
                  } transition duration-300 ease-in-out`}
                >
                  注册
                </button>
              </form>

              {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SignPhone;
