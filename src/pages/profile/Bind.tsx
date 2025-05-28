import "./profile.css";
import { Link, useNavigate } from "react-router-dom"; // Add useNavigate for navigation
import {
  useLazyGetSocialQuery,
  useLazySocialCallbackQuery,
} from "./services/profileApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "./error/ErrorSlice";
import Loader from "../search/components/Loader";

const Bind = () => {
  const [triggerGetSocial, { isLoading }] = useLazyGetSocialQuery(); // RTK lazy query for sending code
  const [triggerCallback] = useLazySocialCallbackQuery();
  const navigate = useNavigate(); // React Router's navigation function
  const dispatch = useDispatch();

  const handleBind = async (type: string, action: string) => {
    try {
      const getSocialResponse = await triggerGetSocial({
        type: type,
        action: action,
      }).unwrap();

      const { url } = getSocialResponse?.data;

      if (url) {
        // Redirect the user to the returned URL (deep link or external)
        window.location.href = url;
      }
    } catch (error) {
      const errorMessage = (error as any)?.data?.msg || "An error occurred";
      dispatch(showToast({ message: errorMessage, type: "error" }));
    }
  };

  // This is where you handle the deep link and its parameters after redirection
  useEffect(() => {
    const handleDeepLink = async () => {
      const currentUrl = window.location.href;

      const params = new URLSearchParams(new URL(currentUrl).search);
      // Only proceed if there are query parameters
      if (Array.from(params).length === 0) return;

      const type = params.get("type");
      const callbackStatus = params.get("callback_status");
      const message = decodeURIComponent(params.get("message") || "");
      const boundStatus = params.get("bound_status");
      const socialId = params.get("social_id");

      // Handle the parameters and navigate accordingly
      if (callbackStatus === "true") {
        if (boundStatus && boundStatus === "bound") {
          dispatch(
            showToast({
              message: "already bound",
              type: "error",
            })
          );
        } else {
          try {
            const getSocialResponse = await triggerCallback({
              type: type || "",
              code: socialId || "",
            }).unwrap();
            console.log("Social response:", getSocialResponse);
          } catch (error) {
            console.error("Error in social callback:", error);
            dispatch(
              showToast({
                message: "Error handling social callback",
                type: "error",
              })
            );
          }
        }
      } else {
        dispatch(
          showToast({
            message: message || "An error occurred",
            type: "success",
          })
        );
      }
    };

    handleDeepLink();
  }, [navigate]);

  return (
    <div className="relative">
      <div className="fixed-bg"></div>
      <div>
        <div className="flex fixed top-0 w-full z-10 text-white bg-[#161619] justify-between items-center p-2">
          <Link to="/info" className="back-button">
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
          </Link>
          <div className="history-title pr-10">绑定账号</div>
          <div className="edit-title"></div>
        </div>
        <div className="mt-[60px] p-4">
          <div>
            <button
              className="bind_div w-full"
              onClick={() => handleBind("wx", "bind")}
            >
              <h1>微信登录</h1>
              <div className="flex items-center gap-2">
                <span>暂未绑定</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="6"
                  height="8"
                  viewBox="0 0 6 8"
                  fill="none"
                >
                  <path
                    d="M0.778157 0.156564C0.836612 0.106935 0.906056 0.0675604 0.982509 0.0406946C1.05896 0.0138289 1.14092 0 1.2237 0C1.30647 0 1.38843 0.0138289 1.46488 0.0406946C1.54134 0.0675604 1.61078 0.106935 1.66924 0.156564L5.85277 3.69938C5.89944 3.73882 5.93647 3.78567 5.96173 3.83724C5.987 3.88882 6 3.94411 6 3.99994C6 4.05578 5.987 4.11107 5.96173 4.16264C5.93647 4.21422 5.89944 4.26107 5.85277 4.30051L1.66924 7.84332C1.42255 8.05223 1.02484 8.05223 0.778157 7.84332C0.531474 7.63442 0.531474 7.29762 0.778157 7.08872L4.42302 3.99781L0.773123 0.906907C0.531475 0.702268 0.531474 0.361203 0.778157 0.156564Z"
                    fill="white"
                  />
                </svg>
              </div>
            </button>
            <button
              className="bind_div mt-3 w-full"
              onClick={() => handleBind("qq", "bind")}
            >
              <h1>QQ登录</h1>
              <div className="flex items-center gap-2">
                <span>暂未绑定</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="6"
                  height="8"
                  viewBox="0 0 6 8"
                  fill="none"
                >
                  <path
                    d="M0.778157 0.156564C0.836612 0.106935 0.906056 0.0675604 0.982509 0.0406946C1.05896 0.0138289 1.14092 0 1.2237 0C1.30647 0 1.38843 0.0138289 1.46488 0.0406946C1.54134 0.0675604 1.61078 0.106935 1.66924 0.156564L5.85277 3.69938C5.89944 3.73882 5.93647 3.78567 5.96173 3.83724C5.987 3.88882 6 3.94411 6 3.99994C6 4.05578 5.987 4.11107 5.96173 4.16264C5.93647 4.21422 5.89944 4.26107 5.85277 4.30051L1.66924 7.84332C1.42255 8.05223 1.02484 8.05223 0.778157 7.84332C0.531474 7.63442 0.531474 7.29762 0.778157 7.08872L4.42302 3.99781L0.773123 0.906907C0.531475 0.702268 0.531474 0.361203 0.778157 0.156564Z"
                    fill="white"
                  />
                </svg>
              </div>
            </button>
            <button
              className="bind_div mt-3 w-full"
              onClick={() => handleBind("sina", "bind")}
            >
              <h1>微博登录</h1>
              <div className="flex items-center gap-2">
                <span>暂未绑定</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="6"
                  height="8"
                  viewBox="0 0 6 8"
                  fill="none"
                >
                  <path
                    d="M0.778157 0.156564C0.836612 0.106935 0.906056 0.0675604 0.982509 0.0406946C1.05896 0.0138289 1.14092 0 1.2237 0C1.30647 0 1.38843 0.0138289 1.46488 0.0406946C1.54134 0.0675604 1.61078 0.106935 1.66924 0.156564L5.85277 3.69938C5.89944 3.73882 5.93647 3.78567 5.96173 3.83724C5.987 3.88882 6 3.94411 6 3.99994C6 4.05578 5.987 4.11107 5.96173 4.16264C5.93647 4.21422 5.89944 4.26107 5.85277 4.30051L1.66924 7.84332C1.42255 8.05223 1.02484 8.05223 0.778157 7.84332C0.531474 7.63442 0.531474 7.29762 0.778157 7.08872L4.42302 3.99781L0.773123 0.906907C0.531475 0.702268 0.531474 0.361203 0.778157 0.156564Z"
                    fill="white"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 flex justify-center items-center">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Bind;
