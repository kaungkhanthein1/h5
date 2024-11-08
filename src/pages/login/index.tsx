import React, { startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./login.css";
import logo from "../../assets/login/logo.png";
import Button from "../../components/login/Button";
import { useDispatch } from "react-redux";
import {
  setLoginOpen,
  setSignupOpen,
  setAuthModel,
} from "../../features/login/ModelSlice";
import WeChatLogin from "../../components/login/WeChatLogin";
import QQLogin from "../../components/login/QQlogin";
import WelboLogin from "../../components/login/WelboLogin";

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
    hidden: { y: "100%" },
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
  const closeAllModals = () => {
    startTransition(() => {
      dispatch(setAuthModel(false));
      dispatch(setLoginOpen(false));
      dispatch(setSignupOpen(false));
    });
  };
  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.y > 100) closeAllModals();
  };

  return (
    <div className="h-screen  z-[998999] flex items-center justify-center overflow-hidden">
      <AnimatePresence>
        <motion.div
          className="login_box fixed h-[380px] bottom-0 z-[99999] w-screen"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          drag="y"
          dragConstraints={{ top: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-col justify-center items-center gap-[32px]">
            <motion.p className="w-[60px] h-[4px] drag_line mt-[12px] cursor-pointer" />
            <img src={logo} className="w-[168px] h-[60px]" alt="Logo" />
            <div className="flex flex-col gap-[10px]">
              <Button
                onClick={() => toggleVisibility(true, false)}
                text={"登录"} //login
              />
              <Button
                onClick={() => toggleVisibility(false, true)}
                text={"注册"} //sign up
              />
            </div>
            {/* <p className="text-[#888] text-[12px] font-[500] leading-[18px]">
              Link account with
            </p> */}
            {/* <div className="flex gap-[22px]">
              <WeChatLogin />
              <QQLogin />
              <WelboLogin />
            </div> */}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Login;
