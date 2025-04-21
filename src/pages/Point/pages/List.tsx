import { FC, useState, Fragment, useMemo } from "react";
import { Link } from "react-router-dom";
import { useRequest, useSafeState, useLockFn } from "ahooks";
import { Tab } from "@headlessui/react";
import { useForm, useFieldArray } from "react-hook-form";
import { Head, Loader, Panel } from "../components";
import { getOrderList } from "../api";
import dayjs from "dayjs";
import numeral from "numeral";
import "./style.css";

const TABS = ["全部", "待处理", "处理中", "已完成", "已取消"];

export const STATUS_MAP = {
  pending: {
    text: "待处理",
    clazz: "text-yellow-secondary",
  },
  processing: {
    text: "处理中",
    clazz: "text-yellow-secondary",
  },
  completed: {
    text: "已完成",
    clazz: "text-green-secondary",
  },
  other: {
    text: "已取消",
    clazz: "text-red-secondary",
  },
};

export const List = () => {
  let [isOpen, setIsOpen] = useState<boolean>(!true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeNumber, setActiveNumber] = useSafeState<any>({});
  const tabmap = ["", "pending", "processing", "completed", "cancelled"];

  const handleSelectedIndex = (i: any) => {
    setSelectedIndex(i);
  };

  return (
    <div className="container min-h-screen bg-white/90">
      <Head title="订单列表" />

      <div className="jf-red w-full p-3 flex gap-3 text-white justify-between">
        <div className="flex flex-col font-medium gap-3 justify-center">
          <p className="text-xl">订单信息</p>
          {/* <div className="text-sm flex gap-3">
              <p>
              消费订单: {localStorage?.getItem?.('num-key') ?? 0}
              </p>
              <p>
              总消费 : 6500积分
              </p>
              </div> */}
        </div>
        <img className="w-[60px] h-[60px]" src="redicon.png" />
      </div>

      <div className="flex flex-col gap-y-2">
        <Tab.Group selectedIndex={selectedIndex} onChange={handleSelectedIndex}>
          <Tab.List className="h-12 flex items-center justify-around bg-white">
            {TABS.map((i, k) => (
              <Tab as={Fragment} key={k}>
                {({ selected }) => (
                  <button className="flex flex-col items-center gap-0.5 outline-none focus:outline-none">
                    {i}
                    <span
                      className={`w-4 h-1 rounded ${
                        selected ? "bg-[#ff6a33]" : "bg-transparent"
                      }`}
                    ></span>
                  </button>
                )}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            {tabmap.map((i: string) => (
              <Panel status={i} />
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default List;
