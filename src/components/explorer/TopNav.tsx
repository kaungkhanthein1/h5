import React, { useState } from "react";
import Tab1 from "./Tab1";
import Tab2 from "./Tab2";
import Tab3 from "./Tab3";
import Tab4 from "./Tab4";

const TopNav = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { title: "片库", content: <Tab1 /> },
    { title: "追剧周表", content: <Tab2 /> },
    { title: "专题", content: <Tab3 /> },
    { title: "排行榜", content: <Tab4 /> },
  ];

  return (
    <div className="">
      <div className="bg-background p-3">
        <nav className="flex flex-wrap gap-4 items-center">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`inline-flex whitespace-nowrap border-b-2 border-transparent font-semibold  transition-all duration-200 ease-in-out hover:text-white ${
                activeTab === index
                  ? "text-white text-[18px]"
                  : "text-gray-600 text-[18px]"
              } `}
              onClick={() => setActiveTab(index)}
            >
              {tab.title}
            </button>
          ))}
        </nav>
        <div className="text-white">{tabs[activeTab].content}</div>
      </div>
    </div>
  );
};

export default TopNav;
