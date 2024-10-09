import React, { useState } from "react";
import back from "../../assets/login/back.svg";
import eye from "../../assets/login/eye.svg";
import Captch from "./Captch";
import Opt from "./Opt";
import { useDispatch, useSelector } from "react-redux";
import { setCaptchaOpen } from "../../features/login/ModelSlice";

interface ForgotPassProps {
  setForgot: React.Dispatch<React.SetStateAction<boolean>>;
  forgot: boolean;
}

const ForgotPass: React.FC<ForgotPassProps> = ({ setForgot }) => {
  const dispatch = useDispatch();
  const { openCaptcha } = useSelector((state: any) => state.model);
  const [showCapt, setShowCapt] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [isFocusedConfirmPassword, setIsFocusedConfirmPassword] =
    useState(false); // Focus state for confirm password

    const validatePassword = (password: string) => {
      const lengthValid = password.length >= 8 && password.length <= 25;
      const containsLetters = /[a-zA-Z]/.test(password);
      const containsNumbers = /\d/.test(password);
      return lengthValid && (containsLetters || containsNumbers);
    };
  

  const show = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(setCaptchaOpen(true));
      console.log("Login successful");
      setShowOtp(true);
      setIsVisible(false);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className=" w-screen h-screen bg-[#161619]">
      {/* {showOtp && <Opt showOtp={showOtp} setShowOtp={setShowOtp} />} */}
      {openCaptcha && <Captch isLogin={false} username={email} password={password} />}

      <div className="p-[20px]">
        {/* head */}
        <div className="flex justify-between w-2/3">
          <img onClick={() => setForgot(false)} src={back} alt="Back" />
          <h1 className="text-white text-[16px] font-[600] leading-[20px]">
            Forgot Password
          </h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-[40px] pt-[40px] px-[10px]"
        >
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsFocusedEmail(true)}
              onBlur={() => setIsFocusedEmail(email !== "")}
              className="w-full px-4 py-2 bg-transparent input_border focus:outline-none text-white placeholder-transparent"
              required
              placeholder="Enter Account Name, Phone Number, Email"
            />
            <label
              htmlFor="email"
              className={`absolute  text-[14px] left-4 transition-all text-[#5B5B5B] pointer-events-none ${
                isFocusedEmail || email
                  ? "top-0 text-xs text-blue-500 -translate-y-full"
                  : "top-1/2 transform -translate-y-1/2"
              }`}
            >
              Enter Your Mail or Phone Number
            </label>
          </div>

          {/* Password input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsFocusedPassword(true)}
              onBlur={() => setIsFocusedPassword(password !== "")}
              className="w-full px-4 py-2 bg-transparent input_border focus:outline-none text-white placeholder-transparent"
              required
              placeholder="Please Enter Your Password"
            />
            <label
              htmlFor="password"
              className={`absolute text-[14px] left-4 transition-all text-[#5B5B5B] pointer-events-none ${
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

          {/* Confirm Password input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setIsFocusedConfirmPassword(true)}
              onBlur={() => setIsFocusedConfirmPassword(confirmPassword !== "")}
              className="w-full px-4 py-2 bg-transparent input_border focus:outline-none text-white placeholder-transparent"
              required
              placeholder="Please Confirm Your Password"
            />
            <label
              htmlFor="confirm-password"
              className={`absolute text-[14px] left-4 transition-all text-[#5B5B5B] pointer-events-none ${
                isFocusedConfirmPassword || confirmPassword
                  ? "top-0 text-xs text-blue-500 -translate-y-full"
                  : "top-1/2 -translate-y-1/2"
              }`}
            >
              Please Confirm Your Password
            </label>
            <img
              onClick={show}
              className="absolute right-0 bottom-[15px]"
              src={eye}
              alt="Show Password"
            />
          </div>

          {/* Notice */}
          <div className="mt-[-20px] text-[12px] font-[500] leading-[20px] text-[#888]">
            <p>8-25 characters</p>
            <p>
              Must be a combination of at least two of the following: letters,
              numbers.
            </p>
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
      </div>
    </div>
  );
};

export default ForgotPass;
