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
import { useSelector } from "react-redux";

const Index = ({ showTab = true }) => {
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

  const { data: userData, error } = useGetUserQuery(undefined, {
    skip: !token,
  });
  // staging
  // const parsedUserData = JSON.parse(userData || "{}");

  // prod
  const parsedUserData = userData;


  const actavityList = list?.data;
  const taskList = task?.data;
  const inviteList = invite?.data;
  const inretralDetails = activity?.data;
  const activeTab = useSelector((state: any) => state?.home?.activePointTab);

  const tabs = [
    { title: "积分明细", content: <Tab1 actavityList={actavityList} /> }, //point detail
    { title: "积分任务", content: <Tab2 taskList={taskList} /> }, // point task
    { title: "好友邀请", content: <Tab3 inviteList={member} /> }, // invite
  ];
  return (
    <div className=" ">
      <img className=" fixed top-0 z-[-1] w-screen h-screen" src={BG} alt="" />
      {/* header */}
      <Header />
      <Top
        point={parsedUserData}
        invite={inviteList}
        inretralDetails={inretralDetails}
      />
      {showTab && <Tabs />}
      {ListLoading ? (
        <Loader />
      ) : (
        <div className=" px-[20px]">
          {tabs[activeTab ? activeTab - 1 : 0]?.content}
        </div>
      )}
    </div>
  );
};

export default Index;
