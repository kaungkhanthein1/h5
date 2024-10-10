import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Content = ({ notice }: any) => {
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
                  onClick={() => navigate(`/${notice.extend.page_path}`)}
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
              onClick={() => window.open(notice.extend.page_path, "_blank")}
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
