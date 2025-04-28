import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../../error/ErrorSlice";
import { useDispatch } from "react-redux";
import { setActiveNav, setActivePointTab } from "../../../../pages/home/slice/HomeSlice";
import Markdown from 'react-markdown'
// import remarkGfm from 'remark-gfm'
const Content = ({ notice }: any) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pageType, setPageType] = useState(false);

  const type = notice?.extend?.page_type;

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
        break;
      case "points_mall":
        navigate("/point_mall");
        break;
      case "daily_task":
        dispatch(setActivePointTab(2));
        setTimeout(() => {
          navigate("/point_info_redeem");
        }, 300);
        break;
      case "points_lottery":
        navigate("/game");
        break;
      case "invite_home":
        navigate('/share');
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

  return (
    <div className="content p-3">
      <div className="text-card">
        <h3>{notice.title}</h3>
        <p className="mt-3">
          <Markdown>{notice.content}</Markdown>
        </p>
        {/* {pageType ? (
          <>
            {notice.extend.parameters?.video_id && (
              <button
                onClick={() =>
                  navigate(`/player/${notice.extend.parameters?.video_id}`)
                }
                className="noti-btn mt-6"
              >
                {notice.extend.page_name}
              </button>
            )}
            {notice.extend.parameters?.topic_id && (
              <button
                onClick={() =>
                  navigate(`/explorer/${notice.extend.parameters?.topic_id}`)
                }
                className="noti-btn mt-6"
              >
                {notice.extend.page_name}
              </button>
            )}
            {!notice.extend.parameters?.topic_id &&
              !notice.extend.parameters?.video_id && (
                <button
                  onClick={() => JumpAction(notice)}
                  className="noti-btn mt-6"
                >
                  {notice.extend.page_name}
                </button>
              )}
          </>
        ) : (
          notice.extend.page_name && (
            <button
              className="noti-btn mt-6"
              onClick={() => JumpAction(notice)}
            >
              {notice.extend.page_name}
            </button>
          )
        )} */}
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
