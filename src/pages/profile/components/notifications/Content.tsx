import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../../error/ErrorSlice";
import { useDispatch } from "react-redux";
import { setActiveNav } from "../../../../pages/home/slice/HomeSlice";

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
    const external = notice?.extend?.page_type;
    // console.log(external);
    if (external === "external") {
      window.open(notice.extend.page_path, "_blank");
    } else if (notice?.extend.page_path === "rankings") {
      dispatch(setActiveNav(3));

      navigate("/explorer");
    } else {
      dispatch(
        showToast({
          // message: "IOS积分系统正在开发中！敬请期待～",
          message: ` ${notice.extend.page_name} 正在开发中！敬请期待~`,
          type: "error",
        })
      );
    }
  };

  return (
    <div className="content p-3">
      <div className="text-card">
        <h3>{notice.title}</h3>
        <p className="mt-3">{notice.content}</p>
        {pageType ? (
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
        )}
      </div>
    </div>
  );
};

export default Content;
