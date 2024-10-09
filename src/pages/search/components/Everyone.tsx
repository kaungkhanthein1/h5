import { useNavigate } from "react-router-dom";
import "../search.css";
import { useDispatch } from "react-redux";
import { setHistoryData } from "../slice/HistorySlice";

const Everyone = ({
  lists,
  Loading,
  Fetching,
  refetch,
}: {
  lists: any;
  refetch: any;
  Loading: any;
  Fetching: any;
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClick = (query: any) => {
    if (query.trim()) {
      dispatch(setHistoryData({ data: query.trim() }));
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };
  return (
    <div className="px-3 mt-5">
      <div className="flex justify-between items-center">
        <h1 className="history-title">大家都在搜</h1>
        <a
          className="cursor-pointer "
          onClick={() => {
            refetch();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M4.55252 3.69401C6.06465 2.38373 7.99918 1.66372 10 1.66651C14.6025 1.66651 18.3334 5.39735 18.3334 9.99984C18.3334 11.7798 17.775 13.4298 16.825 14.7832L14.1667 9.99984H16.6667C16.6668 8.69286 16.2827 7.41468 15.5622 6.32422C14.8418 5.23377 13.8166 4.37914 12.6143 3.86662C11.412 3.35409 10.0856 3.20626 8.79998 3.44153C7.51435 3.67679 6.32623 4.28476 5.38335 5.18985L4.55252 3.69401ZM15.4475 16.3057C13.9354 17.616 12.0009 18.336 10 18.3332C5.39752 18.3332 1.66669 14.6023 1.66669 9.99984C1.66669 8.21984 2.22502 6.56984 3.17502 5.21651L5.83335 9.99984H3.33335C3.33325 11.3068 3.71731 12.585 4.4378 13.6755C5.15829 14.7659 6.18341 15.6205 7.3857 16.1331C8.588 16.6456 9.91442 16.7934 11.2001 16.5582C12.4857 16.3229 13.6738 15.7149 14.6167 14.8098L15.4475 16.3057Z"
              fill="white"
              fill-opacity="0.6"
            />
          </svg>
        </a>
      </div>
      {Loading || Fetching ? (
        <div className="text-white text-center pt-12"></div>
      ) : (
        <div className="flex flex-wrap gap-3 py-3">
          {lists?.map((list: any, index: any) => (
            <button
              className="everyone-tab cursor-pointer"
              key={index}
              onClick={() => handleClick(list?.word)}
            >
              {list?.word}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Everyone;
