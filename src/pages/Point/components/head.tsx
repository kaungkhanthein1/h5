import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";

type HeadProps = {
  title?: string;
  nomore?: boolean;
};

export const Head: FC<HeadProps> = ({ title, nomore }) => {
  const { pointMall } = useSelector((state: any) => state.model);
  console.log(pointMall);
  const [count, setcount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const routerLink = () => {
    if (location.pathname === "/point_mall") {
      navigate(pointMall);
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <div className="w-full h-[54px] bg-white flex justify-between items-center px-4 fixed top-0 z-10">
        <button
          onClick={routerLink}
          className="w-[60px] focus:outline-none focus:bg-white"
        >
          <img alt="back" src="/left.png" className="w-6 h-6" />
        </button>
        <button
          className="font-medium text-base focus:outline-none bg-transparent"
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (location.pathname !== "/point_mall") {
              navigate("/point_mall", { replace: true });
            }
            // If already on /point_mall, do nothing
          }}
        >
          {title ?? "积分商城"}
        </button>

        <button
          className="text-sm w-[60px] focus:outline-none bg-transparent"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/list")}
        >
          {nomore ? "" : "订单信息"}
        </button>
      </div>
      <div className="w-full h-[54px] flex justify-between items-center px-4"></div>
    </>
  );
};
