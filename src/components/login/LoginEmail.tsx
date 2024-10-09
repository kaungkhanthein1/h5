import React, { useState } from "react";
import back from "../../assets/login/back.svg";
import close from "../../assets/login/close.svg";
import eye from "../../assets/login/eye.svg";
import { motion, AnimatePresence } from "framer-motion";
import ForgotPass from "./ForgotPass";
import { useDispatch, useSelector } from "react-redux";
import {
  setAuthModel,
  setCaptchaOpen,
  setLoginOpen,
  setSignupOpen,
} from "../../features/login/ModelSlice";
import Captch from "./Captch";
import { useNavigate } from "react-router-dom";

interface LoginEmailProps {
  handleBack: () => void; // Accept handleBack as a prop
}

const LoginEmail: React.FC<LoginEmailProps> = ({ handleBack }) => {
  const dispatch = useDispatch();
  const { openCaptcha } = useSelector((state: any) => state.model);
  const [forgot, setForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    const lengthValid = password.length >= 8 && password.length <= 25;
    const containsLetters = /[a-zA-Z]/.test(password);
    const containsNumbers = /\d/.test(password);
    return lengthValid && (containsLetters || containsNumbers);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(setCaptchaOpen(true));
      setIsVisible(false)
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

  const show = () => {
    console.log("show");
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center overflow-hidden">
      {/* Conditionally render the ForgotPass component if `forgot` is true */}
      {openCaptcha && <Captch isLogin={true} username={email} password={password} />}
      {forgot ? (
        <ForgotPass forgot={forgot} setForgot={setForgot} />
      ) : (
        <AnimatePresence>
          {isVisible && (
            <motion.div
              className="login_box h-[480px] absolute bottom-0 z-[9999] w-screen  py-4 px-[20px] bg-gray-800 rounded-t-2xl"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              // drag="y"
              // dragConstraints={{ top: 0 }}
              // dragElastic={0.2}
              // onDragEnd={handleDragEnd}
            >
              <div className="flex flex-col justify-center items-center gap-[16px]">
                <motion.p className="w-[60px] h-[4px] drag_line mt-[12px] cursor-pointer bg-gray-400"></motion.p>
                <div className="flex justify-between items-center w-full pb-[20px]">
                  <img
                    className="p-3 cursor-pointer"
                    src={back}
                    alt="Back"
                    onClick={handleBack}
                  />
                  <h2 className="text-[18px] font-[600] leading-[20px] text-white">
                    Login
                  </h2>
                  <img
                    className="close_btn p-3 cursor-pointer"
                    src={close}
                    alt="Close"
                    onClick={handleClose}
                  />
                </div>

                <form
                  onSubmit={handleLogin}
                  className="w-full flex flex-col gap-[40px] px-[10px]"
                >
                  <div className="relative ">
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsFocusedEmail(true)}
                      onBlur={() => setIsFocusedEmail(email !== "")}
                      className="w-full px-4 py-2 bg-[#161619] input_border focus:outline-none text-white placeholder-transparent"
                      required
                      placeholder=""
                    />
                    <label
                      htmlFor="email"
                      className={`absolute text-[12px] left-4 text-[#5B5B5B] transition-all duration-300 pointer-events-none ${
                        isFocusedEmail || email
                          ? "top-[-8px] text-xs text-blue-500"
                          : "top-1/2 transform -translate-y-1/2"
                      }`}
                    >
                      Enter Account Name, Phone Number, Email
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setIsFocusedPassword(true)}
                      onBlur={() => setIsFocusedPassword(password !== "")}
                      className="w-full px-4 py-2 bg-[#161619] input_border focus:outline-none text-white placeholder-transparent"
                      required
                      placeholder="Please Enter Your Password"
                    />
                    <label
                      htmlFor="password"
                      className={`absolute text-[12px] left-4 transition-all text-[#5B5B5B] pointer-events-none ${
                        isFocusedPassword || password
                          ? "top-0 text-xs text-blue-500 -translate-y-full"
                          : "top-1/2 -translate-y-1/2"
                      }`}
                    >
                      Please Enter Your Password
                    </label>
                    <img
                      onClick={show}
                      className="absolute right-0 bottom-[15px]"
                      src={eye}
                      alt="Show Password"
                    />
                  </div>

                  <div
                    onClick={() => setForgot(true)} // When clicked, set `forgot` to true to show the ForgotPass component
                    className="text-left mt-[-10px] text-blue-500 text-sm cursor-pointer"
                  >
                    Forgot Your Password?
                  </div>

                  <button
                    disabled={!validatePassword(password)}
                    type="submit"
                    className={`w-full  mt-[20px] py-2 px-4 rounded-lg ${
                      validatePassword(password)
                        ? "login_button"
                        : "next_button"
                    } transition duration-300 ease-in-out`}
                  >
                    Next
                  </button>
                </form>

                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default LoginEmail;
