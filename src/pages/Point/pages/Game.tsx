import { FC, useState, Fragment, useMemo, useRef, useEffect } from "react";
import { useRequest, useSafeState, useLockFn } from "ahooks";
import { useSpring, animated } from "@react-spring/web";
import { GameHead, Loader, Panel, Alert } from "../components";
import { getLotteryItems, sendSpin } from "../api";
import { sortWith, ascend, prop } from "ramda";
import dayjs from "dayjs";
import numeral from "numeral";
// @ts-ignore
import { LuckyWheel } from "@lucky-canvas/react";
import { useWatch } from "react-hook-form";

export const Game = () => {
  const myLucky = useRef<any>();
  const { data, error, loading, refresh } = useRequest<any, any>(() =>
    getLotteryItems()
  );
console.log(data)
  const [prizeItem, setPrizeItem] = useState<any>(); //中奖物品
  const [hasNext, setHasNext] = useState<boolean>(true); //是否可以抽奖
  const [lockid, setLockid] = useState<boolean>(false); //防抖
  const [msg, setMsg] = useState<any>({
    show: false,
    msg: "",
  });
  const smallWidthRatio = window.innerWidth < 390;
  const [blocks] = useState([{ padding: "0px", background: "#E51D17" }]);
  const [prizes, setPrizes] = useState<any[]>([]);

  const [buttons] = useState([
    {
      radius: "40%",
      pointer: true,
      imgs: [
        {
          src: "./pointer.png",
          top: -60,
          width: 100,
          height: 115,
        },
      ],
    },
  ]);

  useEffect(() => {
    const list: any[] = [];
    // @ts-ignore
    const sortList = sortWith([ascend(prop("id"))])(data?.data?.prizes ?? []);
    sortList.forEach((prize: any) => {
      list.push({
        background: "#FFF7DF",
        fonts: [
          {
            text: prize.name,
            fontColor: "#E1281E",
            fontSize: 16,
            fontWeight: 500,
            top: 10,
            fontStyle: "PingFang SC",
          },
        ],
        imgs: [
          {
            src: prize.image,
            top: 40,
            width: 24,
            height: 24,
          },
        ],
      });
    });

    setPrizes(list);
  }, [data?.data?.prizes?.length]);

  const handleEnd = () => {
    setLockid(false);
    refresh()
    if (prizeItem?.win_status) {
      setMsg({
        show: true,
        msg: `恭喜您获得${prizeItem.prize.name}`,
      });
    } else {
      setMsg({
        show: true,
        msg: `谢谢参与,您未中奖`,
      });
    }
  };

  const handleStart = useLockFn(async () => {
    const obj = data?.data;
    if (!obj.open_now) {
      setMsg({
        show: true,
        msg: obj.open_hours_text,
      });
      return;
    }
    if (!hasNext || lockid) {
      return;
    }

    if (!loading) {
      setLockid(true);
      setPrizeItem(undefined);
      let index = 0;

      try {
        const res = await sendSpin();
        myLucky.current.play();
        // @ts-ignore
        const sortList = sortWith([ascend(prop("id"))])(
          data?.data?.prizes ?? []
        );
        sortList?.forEach?.((i: any, k: number) => {
          if (i.id === res.data.prize.id) {
            index = k;
          }
        });

        // @ts-ignore
        setHasNext(res?.data?.has_next);
        setPrizeItem(res.data);
        refresh();
      } catch (e) {
        setLockid(!true);
        setMsg({
          show: true,
          msg: e,
        });
      }
      myLucky.current.stop(index);
    }
  });

  return (
    <div className="container min-h-screen ">
      <Alert
        {...msg}
        onClose={() => {
          setMsg({ msg: "", show: false });
        }}
      />
      <img alt="" src="./gamebg.png" className="fixed w-full h-screen z-0" />
      <GameHead />
      <div className="flex flex-col  py-6 justify-center items-center relative">
        <div className="px-6 h-[150px]">
          <img alt="" src="./gamehead.png" className="" />
        </div>
        <div className="relative w-full h-[468px]">
          <img
            alt=""
            src="./zp.png"
            className={`absolute z-[1]  left-[50%] ${
              smallWidthRatio
                ? "ml-[-160px]  w-[320px]"
                : "ml-[-195px] w-[390px] "
            }`}
          />
          <div
            className={`absolute z-[2] flex justify-center items-center w-full h-[408px] ${
              smallWidthRatio ? "mt-[-37px]" : ""
            }`}
          >
            <LuckyWheel
              ref={myLucky}
              width={smallWidthRatio ? "220px" : "270px"}
              height={smallWidthRatio ? "220px" : "270px"}
              defaultConfig={{
                gutter: 6,
              }}
              blocks={blocks}
              prizes={prizes}
              buttons={buttons}
              onStart={handleStart}
              onEnd={handleEnd}
            />
          </div>
          <div
            className={`h-[20px] w-[128px] absolute z-[3] ${
              smallWidthRatio ? "bottom-[148px]" : "bottom-[80px]"
            } left-[50%] ml-[-58px] text-[12px] text-white truncate`}
          >
          
            {data?.data?.open_now ? (
              <span>
                今日免费抽奖次数{data?.data?.today_available_free_num}/
                {data?.data?.free_draws_per_day}
              </span>
            ) : (
              <span>{data?.data?.open_hours_text}</span>
            )}
          </div>
        </div>

        {loading ? (
           <button
          //  onTouchEnd={handleStart}
            //  onClick={handleStart}
            className="w-11/12 h-12 px-[100px] py-3 bg-zinc-300 rounded-[49px] shadow shadow-inner border border-zinc-300 justify-center items-center inline-flex fixed bottom-[50px] z-[99]"
           >
             <div className="text-center text-orange-900 text-base font-medium leading-normal">
             加载中。。。
              
             </div>
           </button>
        ) : (
          
       <>
        {data?.data?.open_now ? (
          <button
          onTouchEnd={handleStart}
            onClick={handleStart}
            className="w-11/12 h-12 py-3 bg-amber-400 rounded-[49px] shadow-inner border border-orange-200 justify-center items-center inline-flex fixed bottom-[50px]"
          >
            <div className="text-center text-orange-900 text-base font-medium leading-normal">
              开始抽奖{" "}
              {data?.data?.today_available_free_num >= 1
                ? ``
                : `(消耗${data?.data?.points_per_draw}积分)`}
            </div>
          </button>
        ) : (
          <button
          onTouchEnd={handleStart}
            onClick={handleStart}
            className="w-11/12 h-12 px-[100px] py-3 bg-zinc-300 rounded-[49px] shadow shadow-inner border border-zinc-300 justify-center items-center inline-flex fixed bottom-[50px] z-[99]"
          >
            <div className="text-center text-neutral-400 text-base font-medium leading-normal">
              活动暂未开放
            </div>
          </button>
        )}
       </>
        )}

      </div>
    </div>
  );
};

export default Game
