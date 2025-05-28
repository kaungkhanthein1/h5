import { FC } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useBoolean } from 'ahooks';
import { Record } from './record';

type HeadProps = {
  title?: string;
}

export const GameHead = ({
}) => {
  const [state, { toggle, setTrue, setFalse }] = useBoolean(false);

  const navigate = useNavigate()
  const location = useLocation();
  const routerLink = () => {
    navigate(-1)
    // try {
    //   // @ts-ignore
    //   JsBridge?.openNativePage?.(JSON.stringify({ "pageName": "invite-home" }))
    // } catch (e) {
    //   // @ts-ignore
    //   dsBridge.call("openNativePage", JSON.stringify({ "pageName": "invite-home" }))
    // }
  }

  return (
    <>
      <div className="w-full h-[54px] bg-white flex justify-between items-center px-4 fixed top-0 z-10">
        <button onClick={routerLink} className="w-[60px] focus:outline-none focus:bg-white">
          <img alt="back" src="/left.png" className="w-6 h-6" />
        </button>
        <p className="font-medium text-base">
          幸运大转盘
        </p>
        <button className="min-w-[60px] text-sm focus:outline-none focus:bg-white" onClick={toggle}>
          中奖记录
        </button>
      </div>
      <div className="w-full h-[54px] flex justify-between items-center px-4 ">
      </div>
      <Record show={state} onClose={setFalse} />
    </>

  )
}
