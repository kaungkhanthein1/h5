import { FC } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useBoolean } from "ahooks";
import { Record } from "./record";
import '../point.css'

type HeadProps = {
  title?: string;
};

export const GameHead = ({}) => {
  const [state, { toggle, setTrue, setFalse }] = useBoolean(false);

  const navigate = useNavigate();
  const location = useLocation();
  const routerLink = () => {
    navigate(-1);
    // try {
    //   // @ts-ignore
    //   JsBridge?.openNativePage?.(JSON.stringify({ "pageName": "invite-home" }))
    // } catch (e) {
    //   // @ts-ignore
    //   dsBridge.call("openNativePage", JSON.stringify({ "pageName": "invite-home" }))
    // }
  };

  return (
    <>
      <div className="w-full h-[54px] bg-transparent flex justify-between items-center px-4 fixed top-0 z-10">
        <button
          onClick={routerLink}
          className="w-[60px] focus:outline-none focus:bg-white"
        >
          {/* <img alt="back" src="/left.png" className="w-6 h-6" /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M7.828 10.9999H20V12.9999H7.828L13.192 18.3639L11.778 19.7779L4 11.9999L11.778 4.22192L13.192 5.63592L7.828 10.9999Z"
              fill="white"
            />
          </svg>
        </button>
        {/* <p className="font-medium text-base">幸运大转盘</p> */}
        <button
          className="min-w-[60px] px-[12px] py-[4px] text-sm text-white focus:outline-none new_record_btn_head"
          onClick={toggle}
        >
          中奖记录
        </button>
      </div>
      <div className="w-full h-[54px] flex justify-between items-center px-4 "></div>
      <Record show={state} onClose={setFalse} />
    </>
  );
};
