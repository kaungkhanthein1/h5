import React from "react";
import back from "../../assets/login/back.svg";
import { useNavigate } from "react-router-dom";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = ({}) => {
  const navigate = useNavigate();

  return (
    <div className=" flex justify-between items-center px-[20px] py-[10px]">
      <div onClick={() => navigate(-1)}>
        <img src={back} className=" p-[20px" alt="" />
      </div>
      <h1 className=" text-white text-[18px] pl-[16px] font-[600]">我的积分</h1>
      <a
        // target="_blink"
        href="/point_mall"
        className=" py-[8px] px-[10px mt-[5px"
      >
        <span className=" text-white text-[14px] font-[500]">积分商城</span>
      </a>
    </div>
  );
};

export default Header;
