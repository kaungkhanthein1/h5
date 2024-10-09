import React, { useState } from "react";
import back from "../../assets/login/back.svg";
import close from "../../assets/login/close.svg";
import eye from "../../assets/login/eye.svg";
import { motion, AnimatePresence } from "framer-motion";
import Opt from "./Opt";
import Captch from "./Captch";
import { useDispatch, useSelector } from "react-redux";
import { setCaptchaOpen } from "../../features/login/ModelSlice";
import axios from "axios";
import UserName from "./UserName";
interface SignEmailProps {
  handleBack2: () => void; // Accept handleBack as a prop
}

const SignEmail: React.FC<SignEmailProps> = ({ handleBack2 }) => {
  const dispatch = useDispatch();
  const { openCaptcha, openOtp, openSignUpEmailModel , openUserNameForm } = useSelector(
    (state: any) => state.model
  );
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const show = () => {
    setShowPassword(!showPassword);
  };

  // Password validation function
  const validatePassword = (password: string) => {
    const lengthValid = password.length >= 8 && password.length <= 25;
    const containsLetters = /[a-zA-Z]/.test(password);
    const containsNumbers = /\d/.test(password);
    return lengthValid && (containsLetters || containsNumbers);
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
      setIsVisible(false);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const getOtp = () => {
    axios
      .get("https://cc3e497d.qdhgtch.com:2345/api/v1/user/get_code", {
        params: {
          send_type: "email",
          to: "devaung25@gmail.com",
          captcha: "3656",
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      {openCaptcha && (
        <Captch isLogin={false} username={email} password={password} />
      )}
    {openUserNameForm && <UserName />}
      {openOtp && <Opt setIsVisible={setIsVisible} password={password} email={email} />}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="login_box h-[480px] absolute bottom-0 z-[9999] w-full max-w-md py-4 px-[20px] bg-gray-800 rounded-t-2xl"
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
                  Sign up with E-mail
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
                    className="w-full px-4 py-2 bg-[#161619] input_border focus:outline-none text-white placeholder-transparen"
                    required
                    placeholder=""
                  />
                  <label
                    htmlFor="email"
                    className={`absolute text-[14px] left-4 text-gray-500 transition-all duration-300 pointer-events-none ${
                      isFocusedEmail || email
                        ? "top-[-8px] text-xs text-blue-500"
                        : "top-1/2 transform -translate-y-1/2"
                    }`}
                  >
                    Please Enter Your E-mail
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
                    placeholder=""
                  />
                  <label
                    htmlFor="password"
                    className={`absolute text-[14px] left-4 transition-all text-[#5B5B5B] pointer-events-none ${
                      isFocusedPassword || password
                        ? "top-0 text-xs text-blue-500 -translate-y-full"
                        : "top-1/2 -translate-y-1/2"
                    }`}
                  >
                    Set Your Passwords
                  </label>
                  <img
                    onClick={show}
                    className="absolute right-0 bottom-[15px]"
                    src={eye}
                    alt="Show Password"
                  />
                </div>
                {/* decs */}
                <div className=" mt-[-20px] text-[12px] font-[500] leading-[20px] text-[#888]">
                  <p>8-25 characters</p>
                  <p>Must be a combination of at least two of the following:</p>
                  <p>letters, numbers.</p>
                </div>

                <button
                  disabled={!validatePassword(password)}
                  type="submit"
                  className={`w-full  mt-[20px] py-2 px-4 rounded-lg ${
                    validatePassword(password) ? "login_button" : "next_button"
                  } transition duration-300 ease-in-out`}
                >
                  Sign Up
                </button>
              </form>

              {/* <button className=" bg-white text-black px-2 py-2" onClick={getOtp}>test</button> */}

              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SignEmail;
