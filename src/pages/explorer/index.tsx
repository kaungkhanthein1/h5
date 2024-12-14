import React, { useEffect, useState } from "react";
import Tab1 from "../../components/explorer/Tab1";
import Tab2 from "../../components/explorer/Tab2";
import Tab3 from "../../components/explorer/Tab3";
import Tab4 from "../../components/explorer/Tab4";
import { useDispatch, useSelector } from "react-redux";
import { setActiveNav } from "./slice/ExploreSlice";
// import TopNav from "../../components/explorer/TopNav";
// import { useGetExploreListQuery } from "./services/explorerAPi";

const Explorer: React.FC = () => {
  const activeNav = useSelector((state: any) => state.explore.activeNav);
  const [activeTab, setActiveTab] = useState(!activeNav ? 0 : -1);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true); // State to track header visibility
  const dispatch = useDispatch();

  const tabs = [
    { title: "片库", content: <Tab1 /> },
    { title: "追剧周表", content: <Tab2 /> },
    { title: "专题", content: <Tab3 /> },
    { title: "排行榜", content: <Tab4 /> },
  ];

  // Scroll event listener to detect scroll direction
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        // Scrolling down, hide the header
        setIsHeaderVisible(false);
      } else if (window.scrollY < lastScrollY) {
        // Scrolling up, show the header
        setIsHeaderVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    // bg-[#1f1f21]
    <div className="relative">
      <nav
        // className={`flex flex-wrap gap-4 items-center py-2 px-3  bg-background fixed transition-all duration-300 w-full z-50 ${
        //   isHeaderVisible ? "top-0" : "-top-[135px]"
        // }`}
        className={`flex flex-wrap gap-4 items-center py-2 px-3  bg-background fixed transition-all duration-300 w-full z-50 top-0`}
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            // className={`inline-flex whitespace-nowrap border-b-2 border-transparent font-medium  transition-all duration-200 ease-in-out hover:text-white ${
            //   activeNav === index
            //     ? "text-white text-[18px]"
            //     : "text-gray-600 text-[18px]"
            // } `}
            // transition-all duration-200 ease-in-out
            className={`inline-flex whitespace-nowrap border-b-2 border-transparent font-semibold  ${
              (activeNav && activeNav === index) || activeTab === index
                ? "text-white text-[24px]"
                : // : activeTab === index ? "text-white text-[24px]"
                  "text-unselectedColor text-[18px]"
            }`}
            onClick={() => {
              setActiveTab(index);
              dispatch(setActiveNav(index));
            }}
          >
            {tab.title}
          </button>
        ))}
      </nav>
      <div className="bg-background pt-12">
        <div className="text-white">
          {tabs[activeNav ? activeNav : activeTab]?.content}
        </div>
      </div>
    </div>
  );
};

export default Explorer;
