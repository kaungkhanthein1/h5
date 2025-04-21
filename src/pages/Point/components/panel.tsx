import { FC, useEffect, useState, Fragment, useMemo } from 'react'
import { Tab } from '@headlessui/react'
import { useRequest, useLocalStorageState } from 'ahooks';
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import InfiniteScroll from "react-infinite-scroll-component";
import numeral from 'numeral'
import '../pages/style.css'

import { getOrderList } from '../api'


const TABS = ['全部', '待处理', '处理中', '已完成', '已取消']

export const STATUS_MAP = {
  pending: {
    text: '待处理',
    clazz: 'text-yellow-secondary',
  },
  processing: {
    text: '处理中',
    clazz: 'text-yellow-secondary',
  },
  completed: {
    text: '已完成',
    clazz: 'text-green-secondary',
  },
  other: {
    text: '已取消',
    clazz: 'text-red-secondary',
  },
}



type PanelProps = {
  status?: string;
}

export const Panel: FC<PanelProps> = ({
  status,
}) => {
  const [message, setMessage] = useLocalStorageState<any | undefined>(
    'num-key',
    {
      defaultValue: 0,
    },
  );
  const [dataList, setData] = useState<any[]>([])
  const [pageConfig, setPageConfig] = useState({
    page: 1,
    pageSize: 5,
  })
  const { data, error, loading } = useRequest<any, any>(() => getOrderList({
    ...pageConfig,
    status: status
  }), {
    refreshDeps: [pageConfig],
    debounceWait: 300,
  });

  const fetchMoreData = () => {
    setPageConfig({
      ...pageConfig,
      page: pageConfig.page + 1
    })
  };


  useEffect(() => {
    if (data?.data?.list?.length) {
      setData([...dataList, ...data.data.list])
    }
  }, [data])

  useEffect(() => {
    if (status === '') {
      setMessage(data?.data?.total ?? 0);
    }
  }, [data?.data?.total])


  return (
    <Tab.Panel className="jf-infinitescroll-panel container  overflow-y-auto" id={`scrollableDiv-${status}`}>
      <InfiniteScroll
        className="flex flex-col gap-y-2"
        dataLength={dataList.length}
        next={fetchMoreData}
        hasMore={dataList.length < (data?.data?.total ?? 1)}
        loader={<h4></h4>}
        scrollableTarget={`scrollableDiv-${status}`}
      >
        {
          dataList.map((i: any, k: any) => (
            <Link className="w-full divide-y divide-black/05 px-4 bg-white" key={i.order_id} to={`/info/${i.order_id}`}>
              <div className="text-black/60 py-1 pt-2 text-base flex justify-between">
                <span>{dayjs(i.order_time * 1000).format('YYYY-MM-DD HH:mm')}</span>
                {/*@ts-ignore*/}
                <span className={`font-medium ${(STATUS_MAP?.[i.order_status] ?? STATUS_MAP.other).clazz}`}>
                  {
                    // @ts-ignore
                    (STATUS_MAP?.[i.order_status] ?? STATUS_MAP.other).text
                  }
                </span>
              </div>
              <div className="w-full py-3 flex gap-2">
                <div className="w-20 h-20 rounded overflow-hidden">
                  <img src={i.goods_image} className="object-cover w-full h-full" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1 items-center">
                    <p className="font-medium text-black text-base">
                      {i.goods_title}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg text-orange-secondary font-semibold">
                      {numeral(i?.order_price ?? 0).format('0,0')}&nbsp;积分
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        }
      </InfiniteScroll>
      {/* <Loader show={loading} /> */}
    </Tab.Panel>
  )
}
