import "./profile.css";
import { useNavigate } from "react-router-dom";
import { useLogOutUserMutation } from "./services/profileApi";
import Navbar from "./components/settings/Navbar";
import SettingFirst from "./components/settings/SettinngFirst";
import Versions from "./components/settings/Versions";
import { useEffect, useState } from "react";

const Settings = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [logOutUser] = useLogOutUserMutation();

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

      navigate("/profile");
    } catch (error) {
      console.error("Failed to log out:", error);
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
          <Versions />
        </div>
        {isLoggedIn && (
          <div className="setting-profile-div bg-[#161619] flex">
            <button className="logout-div gap-2" onClick={handleLogOut}>
              <h1>Log Out</h1>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
