import React, { useState } from "react";
import BG from "../../assets/share/BG.png";
import Header from "./Header";
import Top from "./Top";
import { useGetUserQuery } from "../profile/services/profileApi";
import Tabs from "./Tabs";
import Tab2 from "./Tabs/Tab2";
import Tab3 from "./Tabs/Tab3";
import Tab1 from "./Tabs/Tab1";
import {
  useGetActivityListQuery,
  useGetActivityQuery,
  useGetDailyTesksQuery,
  useGetInvitaionMemberListQuery,
  useGetInvitaionMemberQuery,
} from "./service/PointApi";
import Loader from "../../components/login/Loader";

const Index = () => {
  const isLoggedIn = localStorage.getItem("authToken");
  const parsedLoggedIn = isLoggedIn ? JSON.parse(isLoggedIn) : null;
  const token = parsedLoggedIn?.data?.access_token;
  
  const { data: task, isLoading } = useGetDailyTesksQuery("", {
    skip: !token,
  });
  const { data: activity } = useGetActivityQuery("", {
    skip: !token,
  });
  // console.log(data);
  const { data: invite } = useGetInvitaionMemberQuery("", {
    skip: !token,
  });
  const { data: list, isLoading: ListLoading } = useGetActivityListQuery(
    { act: "list" },
    {
      skip: !token,
    }
  );
  const { data: member } = useGetInvitaionMemberListQuery(
    { act: "list" },
    {
      skip: !token,
    }
  );
  const actavityList = list?.data;
  const taskList = task?.data;
  const inviteList = invite?.data;
  const inretralDetails = activity?.data;
  const [activeTab, setActiveTab] = useState(1);

  const tabs = [
    { title: "积分明细", content: <Tab1 actavityList={actavityList} /> }, //point detail
    { title: "积分任务", content: <Tab2 taskList={taskList} /> }, // point task
    { title: "好友邀请", content: <Tab3 inviteList={member} /> }, // invite
  ];
  // console.log(activeTab);
  return (
    <div className=" ">
      <img className=" fixed top-0 z-[-1] w-screen h-screen" src={BG} alt="" />
      {/* header */}
      <Header />
      <Top
        invite={inviteList}
        activeTab={activeTab}
        inretralDetails={inretralDetails}
      />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {ListLoading ? (
        <Loader />
      ) : (
        <div className=" px-[20px]">
          {tabs[activeTab ? activeTab - 1 : activeTab - 1]?.content}
        </div>
      )}
    </div>
  );
};

export default Index;
