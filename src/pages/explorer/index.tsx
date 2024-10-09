import React, { useState } from "react";
import Tab1 from "../../components/explorer/Tab1";
import Tab2 from "../../components/explorer/Tab2";
import Tab3 from "../../components/explorer/Tab3";
import Tab4 from "../../components/explorer/Tab4";
// import TopNav from "../../components/explorer/TopNav";
// import { useGetExploreListQuery } from "./services/explorerAPi";

const Explorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { title: "片库", content: <Tab1 /> },
    { title: "追剧周表", content: <Tab2 /> },
    { title: "专题", content: <Tab3 /> },
    { title: "排行榜", content: <Tab4 /> },
  ];
  return (
    <div className="relative">
      <nav className="flex flex-wrap gap-4 items-center py-2 px-3 bg-[#1f1f21] fixed top-0 w-full z-50">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`inline-flex whitespace-nowrap border-b-2 border-transparent font-medium  transition-all duration-200 ease-in-out hover:text-white ${
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
      <div className="bg-background pt-12">
        <div className="text-white">{tabs[activeTab].content}</div>
      </div>
    </div>
  );
};

export default Explorer;
