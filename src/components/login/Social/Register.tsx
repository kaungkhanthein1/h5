import React, { useState } from "react";
import close from "../../../assets/login/close.svg";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  handleSocialLoginCredentials,
  handleSocialSignUpCredentials,
} from "../../../services/userService";
import { setCaptchaOpen } from "../../../features/login/ModelSlice";

interface RegisterProp {}

const Register: React.FC<RegisterProp> = ({}) => {
  const { captchaCode, captchaKey, social_id } = useSelector(
    (state: any) => state.model
  );
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isFocusedName, setIsFocusedName] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [isFocusedConfirmPassword, setIsFocusedConfirmPassword] =
    useState(false);

  // Password validation: at least 6 characters, should contain at least one number and one letter
  const validatePassword = (password: string) => {
    const lengthValid = password.length >= 6;
    const containsLetters = /[a-zA-Z]/.test(password);
    const containsNumbers = /\d/.test(password);
    return lengthValid && containsLetters && containsNumbers;
  };

  // Check if password and confirmPassword match
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const type = searchParams.get("type") ?? "";

    if (captchaCode && captchaKey) {
      const data = handleSocialSignUpCredentials(
        captchaCode,
        captchaKey,
        name,
        password,
        confirmPassword,
        type,
        social_id
      );
    } else {
      dispatch(setCaptchaOpen(true));
    }
  };
  return (
    <div className="">
      <div className="">
        <img
          onClick={() => navigate("/profile")}
          className="close p-3"
          src={close}
          alt="Close"
        />
      </div>
      <div className="">
        {/* Header */}
        <div className="py-[30px] px-[10px] flex flex-col ">
          <p className="text-white text-[18px] font-[600]">
            Create new account
          </p>
          <p className=" text-[12px] font-[400] text-white/60 py-[10px] pr-[20px]">
            After successful registration, the quick login will be automatically
            bound.
          </p>
        </div>
        <div className="pt-[0px]">
          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="relative py-[20px]">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setIsFocusedName(true)}
                onBlur={() => setIsFocusedName(name !== "")}
                className="w-full px-4 py-2 bg-[#161619] input_border focus:outline-none text-white placeholder-transparent"
                required
                placeholder=""
              />
              <label
                htmlFor="name"
                className={`absolute text-[14px] left-4 text-gray-500 transition-all duration-300 pointer-events-none ${
                  isFocusedName || name
                    ? "top-[-8px] text-xs text-blue-500"
                    : "top-1/2 transform -translate-y-1/2"
                }`}
              >
                Please Enter Username
              </label>
            </div>

            {/* Password Input with validation */}
            <div className="relative py-[20px]">
              <input
                type="password"
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
                className={`absolute text-[14px] left-4 text-gray-500 transition-all duration-300 pointer-events-none ${
                  isFocusedPassword || password
                    ? "top-[-8px] text-xs text-blue-500"
                    : "top-1/2 transform -translate-y-1/2"
                }`}
              >
                Please Set a Password
              </label>
            </div>

            {/* Confirm Password Input */}
            <div className="relative py-[20px]">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setIsFocusedConfirmPassword(true)}
                onBlur={() =>
                  setIsFocusedConfirmPassword(confirmPassword !== "")
                }
                className="w-full px-4 py-2 bg-[#161619] input_border focus:outline-none text-white placeholder-transparent"
                required
                placeholder=""
              />
              <label
                htmlFor="confirmPassword"
                className={`absolute text-[14px] left-4 text-gray-500 transition-all duration-300 pointer-events-none ${
                  isFocusedConfirmPassword || confirmPassword
                    ? "top-[-8px] text-xs text-blue-500"
                    : "top-1/2 transform -translate-y-1/2"
                }`}
              >
                Please Confirm Your Password
              </label>
            </div>

            {/* Submit Button */}
            <button
              disabled={!validatePassword(password) || !passwordsMatch}
              type="submit"
              className={`w-full mt-[20px] py-2 px-4 rounded-lg ${
                validatePassword(password) && passwordsMatch
                  ? "login_button"
                  : "next_button"
              } transition duration-300 ease-in-out`}
            >
              Next
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
