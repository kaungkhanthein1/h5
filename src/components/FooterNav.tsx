import { FC, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Import SVG files directly
import homeIcon from "../assets/home.png";
import homeSelectedIcon from "../assets/homeSelected.png";
import explorerIcon from "../assets/explorer.png";
import explorerSelectedIcon from "../assets/explorerSelected.png";
import profileIcon from "../assets/profile.png";
import profileSelectedIcon from "../assets/profileSelected.png";
import beforePostIcon from "../assets/socialUnselected.svg";
import afterPostIcon from "../assets/socialSelected.svg";
import beforeShortIcon from "../assets/beforeshort.png";
import afterShortIcon from "../assets/aftershort.png";

const Footer: FC = () => {
  const { t } = useTranslation();
  const location = useLocation(); // Hook to get the current URL
  const [selectedMenu, setSelectedMenu] = useState("home");
  const navigate = useNavigate();
  useEffect(() => {
    // Update the selected menu based on the current location path
    if (location.pathname === "/" || location.pathname === "/home") {
      setSelectedMenu("home");
    } else if (location.pathname === "/explorer") {
      setSelectedMenu("explorer");
    } else if (location.pathname === "/profile") {
      setSelectedMenu("profile");
    } else if (location.pathname === "/social") {
      setSelectedMenu("social");
    } else if (location.pathname === "/short") {
      setSelectedMenu("short");
    }
  }, [location.pathname]);
  // Scroll event listener to detect scroll direction

  const { hideMode } = JSON.parse(
    localStorage.getItem("movieAppSettings") || "{}"
  );

  const isWebClip = (): boolean => {
    return (
      "standalone" in window.navigator && window.navigator.standalone === true
    );
  };
  console.log("render");

  return (
    <footer
      className={`bg-[#1f1f21] fixed  transition-all duration-300 w-full shadow-lg z-[200] bottom-0`}
    >
      <div
        className={`flex pt-4 ${
          isWebClip() && "mb-5"
        } justify-around items-center py-2`}
      >
        {/* Home Icon */}
        <button
          className="flex flex-col items-center"
          onClick={() => {
            if (location.pathname !== "/" || selectedMenu !== "home") {
              setSelectedMenu("home");
              navigate("/");
            }
          }}
        >
          <div className="rounded-full">
            <img
              src={selectedMenu === "home" ? homeSelectedIcon : homeIcon}
              alt="Home"
              className="h-8 w-8" // Adjust size as needed
            />
          </div>
          <span
            className={`${
              selectedMenu === "home" ? "text-white" : "text-white/80"
            } text-[12px]`}
          >
            {t("footer.home")}
          </span>
        </button>

        {/* Explorer Icon */}
        <button
          className="flex flex-col items-center"
          onClick={() => {
            if (
              location.pathname !== "/explorer" ||
              selectedMenu !== "explorer"
            ) {
              setSelectedMenu("explorer");
              navigate("/explorer");
            }
          }}
        >
          <div className="rounded-full">
            <img
              src={
                selectedMenu === "explorer"
                  ? explorerSelectedIcon
                  : explorerIcon
              }
              alt="Explorer"
              className="h-8 w-8"
            />
          </div>
          <span
            className={`${
              selectedMenu === "explorer" ? "text-white" : "text-white/80"
            } text-[12px]`}
          >
            {t("footer.explorer")}
          </span>
        </button>
        {/* Explorer Icon */}
        {!hideMode && (
          <button
            className="flex flex-col items-center"
            onClick={() => {
              if (
                location.pathname !== "/social" ||
                selectedMenu !== "social"
              ) {
                setSelectedMenu("social");
                navigate("/social");
              }
            }}
          >
            <div className="rounded-full">
              <img
                src={selectedMenu === "social" ? afterPostIcon : beforePostIcon}
                alt="Social"
                className="h-[26px] w-[26px] mb-1.5"
                // className="h-8 w-[48px] mb-2 -mt-[10px] "
              />
            </div>
            <span
              className={`${
                selectedMenu === "social" ? "text-white" : "text-white/80"
              } text-[12px]`}
            >
              广场
            </span>
          </button>
        )}

        {/* Explorer Icon */}
        {/* <Link
          to="/short"
          className="flex flex-col items-center"
          onClick={() => setSelectedMenu("short")}
        >
          <div className="rounded-full">
            <img
              src={selectedMenu === "short" ? afterShortIcon : beforeShortIcon}
              alt="Short"
              className="h-6"
            />
          </div>
          <span
            className={`${
              selectedMenu === "short" ? "text-white" : "text-white/80"
            } text-[12px] mt-[6px]`}
          >
            短剧
          </span>
        </Link> */}

        {/* Profile Icon */}
        <button
          className="flex flex-col items-center"
          onClick={() => {
            if (
              location.pathname !== "/profile" ||
              selectedMenu !== "profile"
            ) {
              setSelectedMenu("profile");
              navigate("/profile");
            }
          }}
        >
          <div className="rounded-full">
            <img
              src={
                selectedMenu === "profile" ? profileSelectedIcon : profileIcon
              }
              alt="Profile"
              className="h-8 w-8"
            />
          </div>
          <span
            className={`${
              selectedMenu === "profile" ? "text-white" : "text-white/80"
            } text-[12px]`}
          >
            {t("footer.profile")}
          </span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
