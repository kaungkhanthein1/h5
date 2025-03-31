import { FC } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

type HeadProps = {
  title?: string;
  nomore?: boolean
}

export const Head: FC<HeadProps> = ({
  title,
  nomore
}) => {
  const navigate = useNavigate()
  const location = useLocation();
  const routerLink = () => {
    if (location.pathname === '/') {
      try {
        // @ts-ignore
        JsBridge?.openNativePage?.(JSON.stringify({ "pageName": "invite-home" }))
      } catch (e) {
        // @ts-ignore
        dsBridge.call("openNativePage", JSON.stringify({ "pageName": "invite-home" }))
      }
    }
    else {
      navigate(-1)
    }
  }

  return (
    <>
      <div className="w-full h-[54px] bg-white flex justify-between items-center px-4 fixed top-0 z-10">
        <button onClick={routerLink} className="w-[60px] focus:outline-none focus:bg-white">
          <img alt="back" src="/left.png" className="w-6 h-6" />
        </button>
        <Link className="font-medium text-base" to="/">
          {title ?? '积分商城'}
        </Link>

        <Link className="text-sm w-[60px]" to="/list" >
          {nomore ? '' : '订单信息'}
        </Link>
      </div>
      <div className="w-full h-[54px] flex justify-between items-center px-4">
      </div>
    </>

  )
}
