// SignUp.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../components/login/Button";
import back from "../../assets/login/back.svg";
import close from "../../assets/login/close.svg";
import SignEmail from "./SignEmail";
import SignPhone from "./SignPhone";
import { useDispatch } from "react-redux";
import { setLoginOpen } from "../../features/login/ModelSlice";
import { setSignupOpen } from "../../features/login/ModelSlice";
import { setAuthModel } from "../../features/login/ModelSlice";
interface SignUpProps {
  handleBack: () => void; // Accept handleBack as a prop
}
const SignUp: React.FC<SignUpProps> = ({ handleBack }) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isEmailVisible, setEmailVisible] = useState(false);
  const [isPhoneVisible, setPhoneVisible] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // const result = await registerUser(username, password);
      console.log("Sign-up success:");
    } catch (err) {
      setError("Sign-up failed. Please check your details.");
    }
  };

  const handleClose = () => {
    dispatch(setLoginOpen(false));
    dispatch(setSignupOpen(false));
    dispatch(setAuthModel(false));
    setIsVisible(false);
  };

  const handleShowSignUpEmail = () => {
    setIsVisible(false);
    setEmailVisible(true);
  };

  const handleShowSignUpPhone = () => {
    setIsVisible(false);
    setPhoneVisible(true);
  };

  const handleBack2 = () => {
    setIsVisible(true); // Show the login component
    setEmailVisible(false); // Hide the LoginEmail component
    setPhoneVisible(false); // Hide the LoginEmail component
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

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      {isEmailVisible && <SignEmail handleBack2={handleBack2} />}
      {isPhoneVisible && <SignPhone handleBack2={handleBack2} />}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="login_box h-[410px] absolute bottom-0 z-[999] w-full max-w-md"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            <div className="flex flex-col justify-cente items-center gap-[25px] px-[20px]">
              <motion.p className="w-[60px] h-[4px] drag_line mt-[12px] cursor-pointer"></motion.p>
              {/* header */}
              <div className="flex justify-between items-center w-full pb-[px]">
                <img
                  className="p-3 cursor-pointer"
                  src={back}
                  alt="Back"
                  onClick={handleBack}
                />
                <h2 className="text-[18px] font-[600] leading-[20px] text-white">
                  Sign Up
                </h2>
                <img
                  className="close_btn p-3 cursor-pointer"
                  src={close}
                  alt="Close"
                  onClick={handleClose}
                />
              </div>
              {/* decs */}
              <div className=" w-full">
                <h1 className=" text-white text-[14px] font-[500]">
                  Please select registration{" "}
                </h1>
                <p className=" text-white/60 text-[14px] font-[400]">
                  Overseas users please select your email address to register
                </p>
              </div>
              <div className="flex flex-col gap-[13px]">
                <Button
                  onClick={handleShowSignUpEmail}
                  text={"Sign up with E-mail "}
                />
                <Button
                  onClick={handleShowSignUpPhone}
                  text={"Sign up with Phone number"}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SignUp;
