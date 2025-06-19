import { FC, useCallback, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import winbg from "../imgs/reward.webp";
import "../point.css";

interface WinAlertProps {
  onClose: () => void;
  msg: string;
  show: boolean;
  img: string;
  btnText: string;
}

const WinAlert: React.FC<WinAlertProps> = ({
  onClose,
  msg,
  show,
  img,
  btnText,
}) => {
  const navigate = useNavigate();

  // console.log(msg, show);

  return (
    <Transition show={show} as={Fragment}>
      <Dialog open={true} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="z-20 fixed inset-0 bg-black/60" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed z-30 inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className=" relative h-[400px] flex justify-center items-center w-full">
                <img className=" w-[290px] h-[400px]" src={winbg} alt="" />
                <div className=" absolute w-[260px] py-5 flex flex-col justify-between items-center rounded-2xl h-[250px] top-[30px] ">
                  <h1 className="congrat_text flex justify-center gap-[10px] items-center text-[24px] font-[500]">
                    <span className=" test_congrat_line1"></span> 恭喜获得{" "}
                    <span className="test_congrat_line2 rotate-180"></span>
                  </h1>
                  <img className=" w-[80px] h-[80px]" src={img} alt="" />
                  <h1 className="congrat_text text-[20px] font-[600]">{msg}</h1>
                </div>
                <button
                  className="congrat_accept_btn text-[18px] font-[700] py-[9px] px-[40px] rounded-[12px] absolute bottom-5 text-[#4E2A00]"
                  onClick={onClose}
                >
                  {btnText}
                </button>
              </div>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default WinAlert;
