import { useDispatch, useSelector } from "react-redux";
import "./profile.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useCreateInviteMutation,
  useLazyGetUserQuery,
} from "../profile/services/profileApi"; // import the hook
import { showToast } from "./error/ErrorSlice";
import { setUser } from "./components/slice/UserSlice";

const Invite = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [active, setActive] = useState(false);
  const [createInvite, { isLoading, isError, isSuccess }] =
    useCreateInviteMutation(); // use the mutation hook
  const [triggerUser] = useLazyGetUserQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createInvite({ invite_code: text }).unwrap();
      const users = await triggerUser().unwrap();

      if (users?.data) {
        const {
          id,
          username,
          nickname,
          avatar,
          level,
          integral,
          email,
          phone,
          active,
          social_accounts,
          inviter_id,
          invite_code,
          invite_user_num,
        } = users.data;

        dispatch(
          setUser({
            id,
            username,
            nickname,
            avatar,
            level,
            integral,
            social_accounts,
            email,
            phone,
            active,
            inviter_id,
            invite_code,
            invite_user_num,
          })
        );
      }
      dispatch(
        showToast({
          message: "Invited!",
          type: "success",
        })
      );
      navigate("/profile");
    } catch (error) {
      dispatch(
        showToast({
          message: (error as any)?.data?.msg || "修改昵称失败",
          type: "error",
        })
      );
    }
  };

  useEffect(() => {
    if (text) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [text]);

  const handleRemove = () => {
    setText("");
  };

  return (
    <div>
      <div className="fixed-bg"></div>
      <div>
        <div className="flex fixed top-0 w-full z-10 bg-[#161619] justify-between items-center p-2">
          <div onClick={()=>navigate(-1)} className="back-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            > 
              <path
                d="M7.828 11H20V13H7.828L13.192 18.364L11.778 19.778L4 12L11.778 4.22198L13.192 5.63598L7.828 11Z"
                fill="white"
              />
            </svg>
          </div>
          <div className="history-title pr-10">填写邀请码</div>
          <div className="edit-title cursor-pointer"></div>{" "}
          {/* Trigger form submit */}
        </div>
        <div className="mt-[80px] p-4 relative">
          <form onSubmit={handleSubmit} className="w-full">
            <input
              type="text"
              className="new-input"
              placeholder="请输入邀请码"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading} // Disable input during submission
            />
            <button
              className={`submit_btn`}
              style={{
                background: active ? "#F54100" : "rgba(255, 255, 255, 0.04)",
                color: active ? "white" : "rgba(255, 255, 255, 0.20)",
              }}
            >
              保存
            </button>
          </form>
          <button className="close-btn-input" onClick={handleRemove}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
            >
              <path
                d="M5 3.88906L8.88906 0L10 1.11094L6.11094 5L10 8.88906L8.88906 10L5 6.11094L1.11094 10L0 8.88906L3.88906 5L0 1.11094L1.11094 0L5 3.88906Z"
                fill="white"
                fill-opacity="0.8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invite;
