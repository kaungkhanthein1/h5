import "./profile.css";
import { useNavigate } from "react-router-dom";
import {
  useGetIosVersionQuery,
  useLogOutUserMutation,
} from "./services/profileApi";
import Navbar from "./components/settings/Navbar";
import SettingFirst from "./components/settings/SettinngFirst";
import Versions from "./components/settings/Versions";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearUser } from "./components/slice/UserSlice";
import { showToast } from "./error/ErrorSlice";
import { getCurrentVersion } from "../../services/userService";

const Settings = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logOutUser] = useLogOutUserMutation();
  const [vName, setVname] = useState();

  const data = useGetIosVersionQuery({
    type: "ios",
    current: 1,
  });

  // console.log(data)

  const getVV = async () => {
    const { data } = await getCurrentVersion({
      type: "ios",
      current: 0,
    });
    if (data) {
      const name = data?.data?.show_name;
      setVname(name);
    }
  };

  useEffect(() => {
    getVV();
  }, []);

  useEffect(() => {
    const isOkay = localStorage.getItem("authToken");
    if (isOkay) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogOut = async () => {
    try {
      await logOutUser().unwrap();
      localStorage.removeItem("authToken");
      dispatch(clearUser());

      dispatch(
        showToast({
          message: "成功退出",
          type: "success",
        })
      );

      navigate("/profile");
    } catch (error) {
      dispatch(
        showToast({
          message: "退出失败",
          type: "error",
        })
      );
    }
  };

  return (
    <div className="bg-[#161619] text-white w-full h-screen">
      <div className="z-10">
        <div className="bg-[#161619]">
          <Navbar />
        </div>
        <div className="bg-[#161619]">
          <SettingFirst />
        </div>
        <div className="bg-[#161619]">
          <Versions vName={vName} />
        </div>
        {isLoggedIn && (
          <div className="setting-profile-div bg-[#161619] flex">
            <button className="logout-div gap-2" onClick={handleLogOut}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2 12.1211C2 11.7069 2.33579 11.3711 2.75 11.3711H14.791C15.2052 11.3711 15.541 11.7069 15.541 12.1211C15.541 12.5353 15.2052 12.8711 14.791 12.8711H2.75C2.33579 12.8711 2 12.5353 2 12.1211Z"
                  fill="white"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11.3319 8.67584C11.6242 8.38235 12.0991 8.38137 12.3926 8.67366L15.3206 11.5897C15.4619 11.7304 15.5414 11.9217 15.5414 12.1211C15.5414 12.3206 15.4619 12.5118 15.3206 12.6525L12.3926 15.5685C12.0991 15.8608 11.6242 15.8598 11.3319 15.5664C11.0396 15.2729 11.0406 14.798 11.3341 14.5057L13.7285 12.1211L11.3341 9.7365C11.0406 9.44421 11.0396 8.96934 11.3319 8.67584Z"
                  fill="white"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M9.32939 4.45009C8.55268 5.02564 8.16438 5.96655 8.0047 7.69884C7.96668 8.11131 7.60149 8.41485 7.18903 8.37683C6.77656 8.33881 6.47301 7.97362 6.51103 7.56116C6.68135 5.71345 7.12806 4.21436 8.43634 3.24491C9.69065 2.31545 11.5804 2 14.2578 2C17.8077 2 19.9902 2.55654 21.1103 4.37994C21.6441 5.249 21.88 6.3253 21.9947 7.55739C22.1088 8.78465 22.1088 10.259 22.1088 11.9684V12.0316C22.1088 13.741 22.1088 15.2154 21.9947 16.4426C21.88 17.6747 21.6441 18.751 21.1103 19.6201C19.9902 21.4435 17.8077 22 14.2578 22C11.5804 22 9.69065 21.6846 8.43634 20.7551C7.12806 19.7857 6.68135 18.2866 6.51103 16.4389C6.47301 16.0264 6.77656 15.6612 7.18903 15.6232C7.60149 15.5852 7.96668 15.8887 8.0047 16.3012C8.16438 18.0335 8.55268 18.9744 9.32939 19.5499C10.1601 20.1655 11.6053 20.5 14.2578 20.5C17.809 20.5 19.177 19.9016 19.8322 18.835C20.1859 18.259 20.3938 17.4566 20.5011 16.3037C20.6081 15.1535 20.6088 13.7472 20.6088 12C20.6088 10.2528 20.6081 8.84654 20.5011 7.69636C20.3938 6.54345 20.1859 5.741 19.8322 5.16506C19.177 4.09846 17.809 3.5 14.2578 3.5C11.6053 3.5 10.1601 3.83454 9.32939 4.45009Z"
                  fill="white"
                />
              </svg>
              <h1>退出登录</h1>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
