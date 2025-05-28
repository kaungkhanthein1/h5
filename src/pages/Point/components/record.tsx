import { FC, Fragment, useEffect, useState } from 'react'
import { useRequest } from 'ahooks';
import { Dialog, Transition } from '@headlessui/react'
import { getRecords } from '../api'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import InfiniteScroll from "react-infinite-scroll-component";
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

type RecordProps = {
  show: boolean;
  onClose: () => void;
}

export const Record: FC<RecordProps> = ({
  show,
  onClose,
}) => {
  const [pageConfig, setPageConfig] = useState({
    page: 1,
    pageSize: 10,
  })
  const [dataList, setData] = useState<any[]>([])

  const { data, error, loading, refresh } = useRequest<any, any>(() => getRecords(pageConfig), {
    debounceWait: 300,
    refreshDeps: [pageConfig],
  });

  const fetchMoreData = () => {
    setPageConfig({
      ...pageConfig,
      page: pageConfig.page + 1
    })
  };

  useEffect(() => {
    if (show) {
      setData([]); // Clear previous data
      setPageConfig({ ...pageConfig, page: 1 }); // Reset page to 1
      refresh(); // Fetch new data
    }
  }, [show]); // Trigger on "show" change

  useEffect(() => {
    if (data?.data?.list?.length) {
      setData((prevData) => [...prevData, ...data.data.list])
    }
  }, [data])

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
          <div className="z-20 fixed inset-0 bg-black/30" />
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
              <Dialog.Panel className="w-80 max-w-sm rounded bg-white p-6 flex gap-4 flex-col">
                <Dialog.Title className="text-black text-base font-medium leading-snug text-center">
                  中奖记录
                </Dialog.Title>
                <Dialog.Description className="flex gap-2 flex-col">
                {
                    !dataList.length && (
                      <div className="w-full h-[68px] py-6 justify-center items-center gap-2.5 inline-flex">
                        <div className="text-center text-black text-opacity-40 text-sm font-normal leading-tight">
                          暂无抽奖记录
                        </div>
                      </div>
                    )
                  }
                  <div className="h-[280px] overflow-y-auto" id={`scrollableDiv-record`}>
                    <InfiniteScroll
                      className="w-full flex-col justify-start items-start"
                      dataLength={dataList.length}
                      next={fetchMoreData}
                      hasMore={dataList.length < (data?.data?.total ?? 1)}
                      loader={<h4></h4>}
                      scrollableTarget={`scrollableDiv-record`}
                    >
                      {
                        dataList.map((item: any, key: number) => (
                          <div className="w-full py-3 border-b border-black border-opacity-5 justify-between items-center inline-flex" key={key}>
                            <div className="text-center text-red-700 text-base font-medium leading-tight">{item.content}</div>
                            <div className="self-stretch flex-col justify-center items-end gap-1 inline-flex">
                              <div className="text-center text-black text-opacity-80 text-[12px] font-normal leading-[14.40px]">
                                {dayjs.unix(item.create_time).fromNow()}
                              </div>
                              <div className="text-center text-black text-opacity-40 text-[12px] font-normal leading-[14.40px]">消耗积分：{item.points_used}</div>
                            </div>
                          </div>
                        ))
                      }
                    </InfiniteScroll>
                  </div>
                  <button className="bg-[#ff6a33] text-sm py-3 w-full text-white font-medium rounded" onClick={onClose}>
                    确定
                  </button>
                </Dialog.Description>
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}
