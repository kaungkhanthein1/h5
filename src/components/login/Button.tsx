import React from "react";
import "../../pages/login/login.css";
import login from "../../assets/login/login.svg";

interface ButtonProps {
  text: string;
  onClick: () => void; 
}

const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <button
      className="login_button text-black text-[14px] font-[600] leading-[22px] w-[320px] px-[16px] py-[8px] flex justify-center items-center gap-[8px]"
      onClick={onClick} 
    >
      {text}
      <img src={login} alt="" />
    </button>
  );
};

export default Button;
