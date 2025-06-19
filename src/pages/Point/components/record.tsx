import { FC, Fragment, useEffect, useState } from "react";
import { useRequest } from "ahooks";
import { Dialog, Transition } from "@headlessui/react";
import { getRecords } from "../api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import InfiniteScroll from "react-infinite-scroll-component";
import "dayjs/locale/zh-cn";
import reload from "../imgs/reload.svg";
import spinLoad from "../imgs/spinLoad.svg";
import "../point.css";
import noList from "../test3.png";

dayjs.locale("zh-cn");
dayjs.extend(relativeTime);

type RecordProps = {
  show: boolean;
  onClose: () => void;
};

export const Record: FC<RecordProps> = ({ show, onClose }) => {
  const [pageConfig, setPageConfig] = useState({ page: 1, pageSize: 10 });
  const [dataList, setData] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { run, loading } = useRequest(getRecords, {
    manual: true,
    onSuccess: (res: any) => {
      const list = res?.data?.list ?? [];
      const total = res?.data?.total ?? 0;

      if (pageConfig.page === 1) {
        setData(list);
      } else {
        setData((prev) => [...prev, ...list]);
      }

      if (dataList.length + list.length >= total) {
        setHasMore(false);
      }
    },
  });

  const fetchMoreData = () => {
    const nextPage = pageConfig.page + 1;
    setPageConfig({ ...pageConfig, page: nextPage });
    run({ page: nextPage, pageSize: pageConfig.pageSize });
  };

  const handleRefresh = () => {
    setData([]);
    setPageConfig({ page: 1, pageSize: 10 });
    setHasMore(true);
    run({ page: 1, pageSize: 10 });
  };

  useEffect(() => {
    if (show) {
      setData([]);
      setPageConfig({ page: 1, pageSize: 10 });
      setHasMore(true);
      run({ page: 1, pageSize: 10 });
    }
  }, [show]);

  return (
    <Transition show={show} as={Fragment}>
      <Dialog open={true} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="z-20 fixed inset-0 bg-black/70" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed z-30 inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-80 max-w-sm rounded-[12px] bg-white p-6 flex gap-4 flex-col">
                <Dialog.Title className="text-black text-base font-medium leading-snug text-center">
                  <div className="flex justify-between w-full">
                    <span>中奖记录</span>
                    <img onClick={handleRefresh} src={reload} alt="reload" />
                  </div>
                </Dialog.Title>
                <Dialog.Description className="flex gap-2 flex-col">
                  {loading && dataList.length === 0 ? (
                    <div className="w-full h-[280px] flex flex-col justify-center items-center">
                      <img src={spinLoad} className="animate-spin" alt="" />
                      <span className="text-[#D20065] text-[14px] font-[400]">
                        加载中…
                      </span>
                    </div>
                  ) : dataList.length === 0 ? (
                    <div className="w-full h-[280px] flex flex-col justify-center items-center">
                      <img src={noList} alt="empty" />
                      <span className="text-black/40 text-[14px] font-[400]">
                        暂无抽奖记录
                      </span>
                    </div>
                  ) : (
                    <div
                      className="h-[280px] overflow-y-auto"
                      id="scrollableDiv-record"
                    >
                      <InfiniteScroll
                        className="w-full flex-col justify-start items-start"
                        dataLength={dataList.length}
                        next={fetchMoreData}
                        hasMore={hasMore}
                        loader={
                          <div className="w-full text-center py-2 text-gray-400 text-sm">
                            刷新中...
                          </div>
                        }
                        scrollableTarget="scrollableDiv-record"
                      >
                        {dataList.map((item: any, key: number) => (
                          <div
                            key={key}
                            className="w-full py-3 border-b border-black border-opacity-5 justify-between items-center inline-flex"
                          >
                            <div className="text-center text-red-700 text-base font-medium leading-tight">
                              {item.content}
                            </div>
                            <div className="self-stretch flex-col justify-center items-end gap-1 inline-flex">
                              <div className="text-center text-black text-opacity-80 text-[12px] font-normal leading-[14.40px]">
                                {dayjs.unix(item.create_time).fromNow()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </InfiniteScroll>
                    </div>
                  )}
                  <button
                    className="text-sm py-3 w-full text-white font-medium rounded-lg new_record_btn"
                    onClick={onClose}
                  >
                    确定
                  </button>
                </Dialog.Description>
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};
