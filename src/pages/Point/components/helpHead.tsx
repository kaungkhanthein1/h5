import { FC } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

type HeadProps = {
  title?: string;
  nomore?: boolean
}
const LeftIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.828 10.9997H20V12.9997H7.828L13.192 18.3637L11.778 19.7777L4 11.9997L11.778 4.22168L13.192 5.63568L7.828 10.9997Z" fill="white" />
  </svg>
)

export const HelpHead: FC<HeadProps> = ({
  title,
  nomore
}) => {
  const navigate = useNavigate()
  const location = useLocation();
  const routerLink = () => {
    navigate(-1)
  }

  return (
    <>
      <div className="w-full h-[54px] bg-darkbg flex justify-between items-center px-4 fixed top-0 z-10 text-white text-opacity-90 border-b border-b-white/5">
        {
          nomore ? (
            <button className="w-[60px]">
            </button>
          ) : (
            <button onClick={routerLink} className="w-[60px]">
              {LeftIcon}
            </button>
          )
        }

        <Link className="font-medium text-base " to="/help">
          {title ?? ''}
        </Link>

        <div className="text-sm w-[60px]" ></div>
      </div>
      <div className="w-full h-[54px] flex justify-between items-center px-4">
      </div>
    </>

  )
}
