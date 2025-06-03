import "../utils/polyfills";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../pages/profile/error/ErrorSlice";
import { setActiveNav } from "../pages/home/slice/HomeSlice";
import { setAuthModel } from "../features/login/ModelSlice";
import Markdown from "react-markdown";

const Content = ({ notice, handleAppClose }: any) => {
  const isLoggedIn = localStorage.getItem("authToken");
  const parsedLoggedIn = isLoggedIn ? JSON.parse(isLoggedIn) : null;
  const token = parsedLoggedIn?.data?.access_token;

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [pageType, setPageType] = useState(false);

  const type = notice?.extend?.page_type;
  console.log(type);
  // console.log('type', type)

  useEffect(() => {
    if (type === "internal") {
      setPageType(true);
    } else {
      setPageType(false); // Reset if type changes
    }
  }, [type]);

  if (!notice) {
    return null;
  }

  const JumpAction = (notice: any) => {
    switch (notice?.extend.page_path) {
      case "rankings":
        dispatch(setActiveNav(3));
        setTimeout(() => {
          navigate("/explorer");
        }, 300);
        handleAppClose();
        break;
      case "points_mall":
        if (!token) {
          dispatch(setAuthModel(true));
          handleAppClose();
        } else {
          navigate("/point_mall");
          handleAppClose();
        }
        break;
      case "points_lottery":
        if (!token) {
          dispatch(setAuthModel(true));
          handleAppClose();
        } else {
          navigate("/game");
          handleAppClose();
        }
        break;
      case "daily_task":
        if (!token) {
          dispatch(setAuthModel(true));
          handleAppClose();
        } else {
          dispatch(setActiveNav(3));
          setTimeout(() => {
            navigate("/point_info_redeem");
          }, 300);
          handleAppClose();
        }
        break;
      case "invite_home":
        navigate("/share");
        handleAppClose();
        break;
      default:
        dispatch(
          showToast({
            // message: "IOS积分系统正在开发中！敬请期待～",
            message: ` ${notice.extend.page_name} 正在开发中！敬请期待~`,
            type: "error",
          })
        );
        break;
    }
  };

  console.log(notice);

  return (
    <div className="content p-3">
      <div className="text-card">
        <h3 className=" text-white text-[12px] font-[500] leading-[14px]">
          {notice.title}
        </h3>
        <span className="mt-3" style={{
          fontFamily: 'PingFang SC',
          fontWeight: 500,
          fontSize: '12px',
          lineHeight: '100%',
        }}>
          <Markdown>{notice.content}</Markdown>
        </span>
        {pageType ? (
          <button className="noti-btn mt-6" onClick={() => JumpAction(notice)}>
            {notice.extend.page_name}
          </button>
        ) : (
          <>
            {notice?.extend.page_name ? (
              <a
                target="_blink"
                href={notice?.extend?.page_path}
                className="noti-btn mt-6"
                // onClick={() => JumpAction(notice)}
              >
                {notice.extend.page_name ? notice.extend.page_name : ""}
              </a>
            ) : (
              ""
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Content;
