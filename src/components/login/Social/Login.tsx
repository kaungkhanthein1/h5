import React, { useState } from "react";
import close from "../../../assets/login/close.svg";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCaptchaOpen } from "../../../features/login/ModelSlice";
import { handleSocialLoginCredentials } from "../../../services/userService";

interface LoginProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setShow }) => {
  const { captchaCode, captchaKey, social_id } = useSelector(
    (state: any) => state.model
  );
  const [searchParams] = useSearchParams();

  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFocusedName, setIsFocusedName] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);

  // Password validation: at least 6 characters, should contain at least one number and one letter
  const validatePassword = (password: string) => {
    const lengthValid = password.length >= 6;
    const containsLetters = /[a-zA-Z]/.test(password);
    const containsNumbers = /\d/.test(password);
    return lengthValid && containsLetters && containsNumbers;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const type = searchParams.get("type") ?? "";

    if (captchaCode && captchaKey) {
      const data = await handleSocialLoginCredentials(
        captchaCode,
        captchaKey,
        name,
        password,
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
        <div className="py-[30px] px-[10px] flex justify-between items-center">
          <p
            onClick={() => setShow(false)}
            className="create px-[1px] text-[12px] font-[500] text-[#FF4C00]"
          >
            Create new account
          </p>
          <p className="text-white text-[18px] font-[600]">Link Account</p>
        </div>
        <div className="pt-[40px]">
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
                Set Your Name
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
                Enter Your Password
              </label>
            </div>

            {/* Submit Button */}
            <button
              disabled={!validatePassword(password)}
              type="submit"
              className={`w-full mt-[20px] py-2 px-4 rounded-lg ${
                validatePassword(password) ? "login_button" : "next_button"
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

export default Login;
