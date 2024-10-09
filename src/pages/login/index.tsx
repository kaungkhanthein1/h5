import React, { startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./login.css";
import logo from "../../assets/login/logo.png";
import Button from "../../components/login/Button";
import blue from "../../assets/login/blue.png";
import eye from "../../assets/login/eye.png";
import weChat from "../../assets/login/weChat.png";
import { useDispatch } from "react-redux";
import {
  setLoginOpen,
  setSignupOpen,
  setAuthModel,
} from "../../features/login/ModelSlice";

const Login: React.FC = () => {
  const dispatch = useDispatch();

  const toggleVisibility = (login: boolean, signup: boolean) => {
    startTransition(() => {
      dispatch(setAuthModel(false));
      dispatch(setLoginOpen(login));
      dispatch(setSignupOpen(signup));
    });
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

  // const handleDragEnd = (event: any, info: any) => {
  //   if (info.offset.y > 100) closeAllModals();
  // };

  return (
    <div className="h-scree flex items-center justify-center overflow-hidde">
      <AnimatePresence>
        <motion.div
          className="login_box h-[410px] absolute bottom-0 z-[999] w-screen"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
        >
          <div className="flex flex-col justify-center items-center gap-[32px]">
            <motion.p className="w-[60px] h-[4px] drag_line mt-[12px] cursor-pointer" />
            <img src={logo} className="w-[168px] h-[60px]" alt="Logo" />
            <div className="flex flex-col gap-[10px]">
              <Button
                onClick={() => toggleVisibility(true, false)}
                text={"Login"}
              />
              <Button
                onClick={() => toggleVisibility(false, true)}
                text={"Sign Up"}
              />
            </div>
            <p className="text-[#888] text-[12px] font-[500] leading-[18px]">
              Link account with
            </p>
            <div className="flex gap-[22px]">
              <img className="w-[50px] h-[50px]" src={weChat} alt="WeChat" />
              <img className="w-[50px] h-[50px]" src={blue} alt="Blue" />
              <img className="w-[50px] h-[50px]" src={eye} alt="Eye" />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Login;
