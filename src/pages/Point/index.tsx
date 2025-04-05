import React, { useState } from "react";
import BG from "../../assets/share/BG.png";
import Header from "./Header";
import Top from "./Top";
import { useGetUserQuery } from "../profile/services/profileApi";
import Tabs from "./Tabs";

const Index = () => {
  const [activeTab, setActiveTab] = useState(1); // Default to first tab
  const tabs = [
    { title: "片库", content: "1" },
    { title: "追剧周表", content: "2" },
    { title: "专题", content: "3" },
  ];

  return (
    <div className=" ">
      <img className=" fixed top-0 z-[-1] w-screen h-screen" src={BG} alt="" />
      {/* header */}
      <Header />
      <Top />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className=" text-white">
        {tabs[activeTab ? activeTab - 1 : activeTab - 1]?.content}
      </div>
    </div>
  );
};

export default Index;
