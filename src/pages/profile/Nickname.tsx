import { useDispatch, useSelector } from "react-redux";
import "./profile.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useChangeNicknameMutation } from "../profile/services/profileApi"; // import the hook
import { setUser } from "./components/slice/UserSlice";
import { showToast } from "./error/ErrorSlice";

const Nickname = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: any) => state.user.user);
  const [text, setText] = useState(user?.nickname);
  const [changeNickname, { isLoading, isError, isSuccess }] =
    useChangeNicknameMutation(); // use the mutation hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await changeNickname({ new_nickname: text }).unwrap();
      dispatch(
        setUser({
          ...user,
          nickname: text, // Update the nickname
        })
      );
      dispatch(
        showToast({
          message: "昵称修改成功！",
          type: "success",
        })
      );
      navigate("/info");
    } catch (error) {
      dispatch(
        showToast({
          message: (error as any)?.data?.msg || "修改昵称失败",
          type: "error",
        })
      );
    }
  };

  return (
    <div>
      <div className="fixed-bg"></div>
      <div>
        <div className="flex fixed top-0 w-full z-10 bg-[#161619] justify-between items-center p-5">
          <Link to="/info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="14"
              viewBox="0 0 10 14"
              fill="none"
            >
              <path
                d="M9.2651 0.490513C9.16609 0.406457 9.04848 0.339768 8.91899 0.294266C8.7895 0.248764 8.65069 0.225342 8.51049 0.225342C8.3703 0.225342 8.23148 0.248764 8.102 0.294266C7.97251 0.339768 7.85489 0.406457 7.75589 0.490513L0.670255 6.49096C0.59121 6.55776 0.528499 6.63711 0.485711 6.72446C0.442923 6.81181 0.420898 6.90545 0.420898 7.00002C0.420898 7.09459 0.442923 7.18823 0.485711 7.27558C0.528499 7.36293 0.59121 7.44228 0.670255 7.50908L7.75589 13.5095C8.17369 13.8633 8.8473 13.8633 9.2651 13.5095C9.68291 13.1557 9.68291 12.5853 9.2651 12.2315L3.09182 6.99641L9.27363 1.76136C9.68291 1.41477 9.68291 0.837109 9.2651 0.490513Z"
                fill="white"
              />
            </svg>
          </Link>
          <div className="history-title">昵称</div>
          <div className="edit-title cursor-pointer" onClick={handleSubmit}>
            保存
          </div>{" "}
          {/* Trigger form submit */}
        </div>
        <div className="mt-[60px] p-4">
          <form onSubmit={handleSubmit} className="w-full">
            <input
              type="text"
              className="nickname-input"
              placeholder="输入你的昵称"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading} // Disable input during submission
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Nickname;
