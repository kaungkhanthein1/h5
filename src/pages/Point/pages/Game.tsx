import { FC, useState, Fragment, useMemo, useRef, useEffect } from "react";
import { useRequest, useSafeState, useLockFn } from "ahooks";
import { useSpring, animated } from "@react-spring/web";
import { GameHead, Loader, Panel, Alert } from "../components";
import { getLotteryItems, sendSpin } from "../api";
import { sortWith, ascend, prop } from "ramda";
import dayjs from "dayjs";
import fakeUser from "../imgs/avat.svg";
import numeral from "numeral";
// @ts-ignore
import { LuckyWheel } from "@lucky-canvas/react";
import { useWatch } from "react-hook-form";
import newBg from "../imgs/newBg.jpg";
import newHead from "../imgs/newHead.png";
import crowd from "../imgs/crowd.png";
import btnbg from "../imgs/btnbg.png";
import diamond from "../imgs/diamond.svg";
import left from "../imgs/left.svg";
import right from "../imgs/right.svg";
import { useGetUserQuery } from "../../../pages/profile/services/profileApi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import lock from "../imgs/lock.png";
import cc from "../../Point/coupon.png";
import TextVirtual from "./TextVirtual";
import { useNavigate } from "react-router-dom";
import WinAlert from "../components/WinAlert";
import { setAuthModel } from "../../../features/login/ModelSlice";
import { useDispatch } from "react-redux";
import ImageWithPlaceholder from "../../../pages/profile/components/info/ImageWithPlaceholder";

export const Game = () => {
  const myLucky = useRef<any>();
  const isLoggedIn = localStorage.getItem("authToken");
  const parsedLoggedIn = isLoggedIn ? JSON.parse(isLoggedIn) : null;
  const [spinLoad, setSpinLoad] = useState(false);
  const { data, error, loading, refresh } = useRequest<any, any>(() =>
    getLotteryItems()
  );
  const token = parsedLoggedIn?.data?.access_token;
  const { data: userData, refetch } = useGetUserQuery(undefined, {
    skip: !token,
  });
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);

  // staging
  // const parsedUserData = JSON.parse(userData || "{}");

  // prod
  const parsedUserData = userData;

  // console.log(parsedUserData);

  const [prizeItem, setPrizeItem] = useState<any>(); //中奖物品
  const [hasNext, setHasNext] = useState<boolean>(true); //是否可以抽奖
  const [lockid, setLockid] = useState<boolean>(false); //防抖
  const dispatch = useDispatch();
  const [msg, setMsg] = useState<any>({
    show: false,
    msg: "",
  });
  const [win, setWin] = useState<any>({
    show: false,
    msg: "",
    img: "",
  });
  const smallWidthRatio = window.innerWidth < 390;
  const [blocks] = useState([{ padding: "0px", background: "#E51D17" }]);
  const [prizes, setPrizes] = useState<any[]>([]);
  const [swiperInstance, setSwiperInstance] = useState(null);

  const [canSlidePrev, setCanSlidePrev] = useState(false);
  const [canSlideNext, setCanSlideNext] = useState(true);
  const [spinGroups, setSpinGroups] = useState<any[]>([]);
  const myLuckyRefs = useRef<any[]>([]);
  const currentGroup = spinGroups[activeIndex];
  const isLocked = !currentGroup?.is_unlocked;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Add this new function to determine image dimensions
  const getPrizeImageDimensions = (prizeType: string) => {
    if (prizeType === "item") {
      return {
        width: 50,
        height: 50,
        top: 35,
      };
    }
    // Default dimensions for coins and other prizes
    return {
      width: 24,
      height: 24,
      top: 40,
    };
  };

  const handleLogin = () => {
    dispatch(setAuthModel(true));
  };

  useEffect(() => {
    refresh();
  }, [token]);

  useEffect(() => {
    if (spinGroups.length > 0) {
      setCanSlidePrev(currentIndex > 0);
      setCanSlideNext(currentIndex < spinGroups.length - 1);
    }
  }, [spinGroups, currentIndex]);

  const handleSlideChange = (swiper: any) => {
    setCurrentIndex(swiper.activeIndex);
    setActiveIndex(swiper.activeIndex);
    setCanSlidePrev(swiper.activeIndex > 0);
    setCanSlideNext(swiper.activeIndex < spinGroups.length - 1);
  };

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

  // console.log(userData);

  // useEffect(() => {
  //   const list: any[] = [];
  //   console.log(data?.data)
  //   // @ts-ignore
  //   const sortList = sortWith([ascend(prop("id"))])(data?.data?.prizes ?? []);
  //   sortList.forEach((prize: any) => {
  //     list.push({
  //       background: "#FFF7DF",
  //       fonts: [
  //         {
  //           text: prize.name,
  //           fontColor: "#E1281E",
  //           fontSize: 16,
  //           fontWeight: 500,
  //           top: 10,
  //           fontStyle: "PingFang SC",
  //         },
  //       ],
  //       imgs: [
  //         {
  //           src: prize.image,
  //           top: 40,
  //           width: 24,
  //           height: 24,
  //         },
  //       ],
  //     });
  //   });

  //   setPrizes(list);
  // }, [data?.data]);

  const getButtonConfig = (group: any) => {
    const defaultImg = {
      src: "./pointer.png",
      top: -60,
      width: 100,
      height: 115,
    };

    return [
      {
        radius: "40%",
        pointer: true,
        imgs: group?.spinwheel_image
          ? [
              {
                src: group.spinwheel_image,
                top: -50,
                width: 73,
                height: 88,
              },
            ]
          : [defaultImg],
      },
    ];
  };

  const buttonConfigs = data?.data?.prize_groups?.map((group: any) =>
    getButtonConfig(group)
  );

  useEffect(() => {
    if (!data?.data?.prize_groups) return;

    const formattedGroups = data.data.prize_groups.map((group: any) => {
      const sorted = group.prizes.sort((a: any, b: any) => a.id - b.id);

      const formattedPrizes = sorted.map((prize: any) => {
        const dimensions = getPrizeImageDimensions(prize.prize_type);
        return {
          id: prize.id,
          background: "#FFF7DF",
          fonts: [
            {
              text: prize.name,
              fontColor: "#E1281E",
              fontSize: 14,
              fontWeight: 900,
              top: 10,
              fontStyle: "PingFang SC",
              padding: "20px",
            },
          ],
          imgs: [
            {
              src: prize.image,
              top: dimensions.top,
              width: dimensions.width,
              height: dimensions.height,
            },
          ],
        };
      });

      return {
        group_id: group.group_id,
        name: group.name,
        prizes: formattedPrizes,
        free_draws_per_day: group.free_draws_per_day,
        is_unlocked: group.is_unlocked,
        activity_max: group.activity_max,
        button_state: group.button_state,
      };
    });

    setSpinGroups(formattedGroups);
  }, [data?.data]);

  const handleEnd = () => {
    setLockid(false);
    refresh();
    refetch();
    setSpinLoad(false);
    if (prizeItem?.win_status) {
      // setMsg({
      //   show: true,
      //   msg: `恭喜您获得${prizeItem.prize.name}`,
      // });
      setWin({
        show: true,
        msg: `${prizeItem.prize.name}`,
        img: `${prizeItem.prize.image}`,
        btnText: "开心收下",
      });
    } else {
      // setMsg({
      //   show: true,
      //   msg: `谢谢参与,您未中奖`,
      // });
      setWin({
        show: true,
        msg: `${prizeItem.prize.name}`,
        img: `${prizeItem.prize.image}`,
        btnText: "我知道了",
      });
    }
  };

  // const handleStart = useLockFn(async () => {
  //   const obj = data?.data;
  //   if (!obj.open_now) {
  //     setMsg({
  //       show: true,
  //       msg: obj.open_hours_text,
  //     });
  //     return;
  //   }
  //   if (!hasNext || lockid) {
  //     return;
  //   }

  //   if (!loading) {
  //     setLockid(true);
  //     setPrizeItem(undefined);
  //     let index = 0;

  //     try {
  //       const res = await sendSpin();
  //       myLucky.current.play();
  //       // @ts-ignore
  //       const sortList = sortWith([ascend(prop("id"))])(
  //         data?.data?.prizes ?? []
  //       );
  //       sortList?.forEach?.((i: any, k: number) => {
  //         if (i.id === res.data.prize.id) {
  //           index = k;
  //         }
  //       });

  //       // @ts-ignore
  //       setHasNext(res?.data?.has_next);
  //       setPrizeItem(res.data);
  //       refresh();
  //     } catch (e) {
  //       setLockid(!true);
  //       setMsg({
  //         show: true,
  //         msg: e,
  //       });
  //     }
  //     myLucky.current.stop(index);
  //   }
  // });

  const handleStart = useLockFn(async () => {
    if (!token) {
      handleLogin();
      return;
    }
    const obj = data?.data;
    const currentGroup = spinGroups[activeIndex];

    if (data?.data?.user_tickets === 0) {
      setMsg({
        show: true,
        msg: "抽奖劵不足，请通过邀请好友获取",
        navBtn: "获取抽奖劵",
      });
      return;
    }

    if (!currentGroup?.is_unlocked && data?.data?.progress_percent < 50) {
      setMsg({
        show: true,
        msg: "少侠，您的等级过低没有资格参加此活动",
        navBtn: true,
      });
      return;
    } else if (
      !currentGroup?.is_unlocked &&
      data?.data?.progress_percent > 50
    ) {
      setMsg({
        show: true,
        msg: "少侠，您的武学境界已超凡脱俗，此轮盘不再适用于您",
        navBtn: true,
        btnText: "前往更高级转盘",
        opentask: false,
      });
      swiperRef.current.slideTo(3);

      return;
    }

    if (!hasNext || lockid || !currentGroup) return;

    const luckyRef = myLuckyRefs.current[activeIndex];
    if (!luckyRef) return;

    if (!loading) {
      setSpinLoad(true);
      setLockid(true);
      setPrizeItem(undefined);
      console.log(currentGroup.group_id);

      try {
        // You may need to pass group_id to the API here:
        const res = await sendSpin(currentGroup.group_id);

        luckyRef.play();

        let index = 0;
        console.log(currentGroup);
        const sorted = [...currentGroup.prizes].sort((a, b) => a.id - b.id);
        sorted.forEach((p, i) => {
          if (p.id === res.data.prize.id) {
            index = i;
          }
        });
        luckyRef.stop(index);

        setHasNext(res?.data?.has_next);
        setPrizeItem(res.data);
        refresh();
      } catch (e) {
        setMsg({ show: true, msg: e });
        setSpinLoad(false);
      }

      // luckyRef.stop(index);
      setLockid(false);
    }
  });

  const groupImages = data?.data?.prize_groups?.map((group: any) => ({
    id: group.group_id,
    src: group.image,
    isUnlocked: group.is_unlocked,
    name: group.name,
  }));

  const userIntegral = parsedUserData?.data?.active;

  // // Determine current level and level bounds
  // const levelThresholds = [0, 2000, 4000, 9000];
  // let levelMin = 0;
  // let levelMax = levelThresholds[levelThresholds.length - 1];

  // for (let i = 1; i < levelThresholds.length; i++) {
  //   if (userIntegral < levelThresholds[i]) {
  //     levelMin = levelThresholds[i - 1];
  //     levelMax = levelThresholds[i];
  //     break;
  //   }
  // }

  // const levelRange = levelMax - levelMin;
  // const progressPercent = Math.min(
  //   ((userIntegral - levelMin) / levelRange) * 100,
  //   100
  // );

  // console.log(progressPercent, levelRange);

  // const progressPercent =
  //   userIntegral < 100
  //     ? 10
  //     : userIntegral / 100 > 100
  //     ? 100
  //     : Math.max(userIntegral / 100, 5);
  const progressPercent = data?.data?.progress_percent;
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    window.scrollTo(0,100)
  },[])

  // Set active index when spinGroups is ready
  useEffect(() => {
    if (swiperRef.current && spinGroups.length > 0) {
      const unlockedIndex = spinGroups.findIndex((group) => group.is_unlocked);
      if (unlockedIndex >= 0) {
        swiperRef.current.slideTo(unlockedIndex, 0); // Slide without animation
      }
    }
  }, [spinGroups]);

  // console.log(currentGroup);

  return (
    <div className="container ">
      <Alert
        {...msg}
        onClose={() => {
          setMsg({ msg: "", show: false });
        }}
      />
      <WinAlert
        {...win}
        onClose={() => {
          setWin({ msg: "", show: false, img: "" });
        }}
      />
      <img alt="" src={newBg} className="fixed w-full h-screen z-0" />
      <GameHead />
      {/* event */}
        <div className="px-6 pb-1 flex justify-center absolute top-[-10px]">
          <img alt="" src={newHead} className="" />
          <span className="new_date_head_text text-[14px] font-[700] absolute bottom-[35px]">
            {/* 2025-06-15-16:30 */}
            {data?.data?.end_date ?? "2025-06-15-16:30"}
          </span>
        </div>
      <div className="flex flex-col py-[1px] justify-cente items-center relative">
        {/* userBox */}
        <div className="new_user_box mt-[110px] p-[12px] w-[350px] flex justify-between items-center">
          {/* user */}
          <div className=" flex justify-center items-center gap-[8px]">
            {/* <img
              className=" w-[48px] h-[48px] rounded-full"
              src={
                parsedUserData?.data?.avatar
                  ? parsedUserData?.data?.avata
                  : fakeUser
              }
              alt=""
            /> */}
            <ImageWithPlaceholder
              width={48}
              height={48}
              src={
                parsedUserData?.data?.avatar
                  ? parsedUserData?.data?.avatar
                  : fakeUser
              }
              alt="user"
              className="rounded-full"
            />
            <div className="">
              <h1 className=" text-[#512D00] text-[16px] font-[700]">
                {parsedUserData?.data?.nickname ?? "登录或注册账号"}
              </h1>
              {parsedUserData?.data?.level ? (
                <img
                  className=" w-[72px] h-[24px]"
                  src={parsedUserData?.data?.level}
                  alt=""
                />
              ) : (
                <span className=" text-[#64421A] text=[16px] font-[600]">
                  解锁更多精彩奖励
                </span>
              )}
            </div>
          </div>
          {/* btn */}
          <button className=" relative w-[130px] overflow-hidden flex justify-center items-center py-[18px] gap-[4px] rounded-[14px]">
            <img src={btnbg} className=" absolute z-[1]" alt="" />
            {token ? (
              <div
                onClick={() => navigate("/point_info")}
                className=" absolute flex gap-1 justify-center items-center z-[2]"
              >
                <span className=" text-white text-[14px] font-[700]">
                  获取抽奖劵
                </span>
                <img src={diamond} alt="" />
              </div>
            ) : (
              <div
                onClick={handleLogin}
                className=" absolute flex gap-1 justify-center items-center z-[2]"
              >
                <span className=" text-white text-[14px] font-[700]">
                  点击登录
                </span>
              </div>
            )}
          </button>
        </div>

        {/* progress */}
        <div className="relative w-[350px] overflow-hidden max-w-4xl mx-auto py-5">
          {/* Background Line (incomplete section) */}
          <div className="absolute top-1/2 left-0 right-0 h-3 bg-white/40 rounded-full transform -translate-y-1/2 z-0" />

          {/* Progress Line (completed section, use actual percent if needed) */}
          <div
            className="absolute top-1/2 left-0 h-3 bg-white rounded-full transform -translate-y-1/2 z-0"
            style={{
              // width: `${((currentIndex + 1) / groupImages?.length) * 100}%`,
              width: `${progressPercent}%`,
            }}
          />

          {/* Step Images */}
          <div className="relative flex justify-between items-center z-10 px-2">
            {groupImages?.map((img: any, idx: any) => (
              <div
                key={img.id}
                className="relative w-[54px] flex flex-col items-center h-[38px] cursor-pointer"
                onClick={() => {
                  if (swiperRef.current) {
                    swiperRef.current.slideTo(idx);
                  }
                }}
              >
                <img
                  src={img.src || crowd}
                  alt={`Step ${idx + 1}`}
                  className={`w-full h-full object-cover ${
                    currentIndex === idx ? " scale-125" : ""
                  }`}
                />
                <h1
                  className={`  font-[700] ${
                    currentIndex === idx
                      ? "active_progress_text text-[13px]"
                      : "text-white/60 text-[12px]"
                  }`}
                >
                  {img.name}
                </h1>
              </div>
            ))}
          </div>
        </div>

        {/* spin */}
        <div className="relative w-full h-[468px] hidden">
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

        {/* newSpin */}
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          onSwiper={(swiper: any) => {
            swiperRef.current = swiper;
            setSwiperInstance(swiper);
          }}
          onSlideChange={handleSlideChange}
          slidesPerView={1}
          spaceBetween={50}
          className=" absolute bottom-10 w-full h-[455px]"
        >
          {spinGroups.map((group, index) => (
            <SwiperSlide key={group.group_id}>
              <div className="relative w-full h-[468px]">
                <img
                  alt=""
                  src="./zp.png"
                  className={`absolute z-[1] left-[50%] ${
                    smallWidthRatio
                      ? "ml-[-160px] w-[320px]"
                      : "ml-[-195px] w-[390px]"
                  }`}
                />
                {/* spin */}
                <div
                  className={`absolute z-[2] flex justify-center items-center w-full h-[408px] ${
                    smallWidthRatio ? "mt-[-37px]" : ""
                  }`}
                >
                  <LuckyWheel
                    ref={(el: any) => (myLuckyRefs.current[index] = el)}
                    // ref={myLucky}
                    width={smallWidthRatio ? "220px" : "270px"}
                    height={smallWidthRatio ? "220px" : "270px"}
                    defaultConfig={{ gutter: 6 }}
                    blocks={blocks}
                    prizes={group.prizes}
                    // buttons={buttons}
                    buttons={buttonConfigs?.[index]}
                    onStart={handleStart}
                    onEnd={handleEnd}
                  />

                  {/* virtual_lottery_winners */}
                  <div className=" absolute w-full flex justify-center bottom-[-50px]">
                    <TextVirtual data={data} />
                  </div>
                </div>

                {/* Optional: group-specific info */}
                <div
                  className={`h-[20px] w-[128px] absolute z-[3] ${
                    smallWidthRatio ? "bottom-[148px]" : "bottom-[80px]"
                  } left-[50%] ml-[-58px] text-[13px] font-[900] text-white truncate`}
                >
                  <span className=" flex justify-center items-center">
                    抽奖劵 x {data?.data?.user_tickets} <img src={cc} alt="" />{" "}
                  </span>

                  {/* {data?.data?.open_now ? (
                    <span>
                      今日免费抽奖次数{data?.data?.today_available_free_num}/
                      {data?.data?.free_draws_per_day}
                    </span>
                  ) : (
                    <span>{data?.data?.open_hours_text}</span>
                  )} */}
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* Navigation Buttons outside of loop */}
          <div
            className={`custom-prev absolute left-0 top-[45%] transform -translate-y-1/2 z-10 cursor-pointer ${
              canSlidePrev ? "" : "hidden"
            }`}
          >
            <button className="w-10 h-10 rounded-full shadow-md flex items-center justify-center">
              <img src={left} alt="prev" />
            </button>
          </div>

          <div
            className={`custom-next absolute right-0 top-[45%] transform -translate-y-1/2 z-10 cursor-pointer ${
              canSlideNext ? "" : "hidden"
            }`}
          >
            <button className="w-10 h-10 rounded-full shadow-md flex items-center justify-center">
              <img src={right} alt="next" className="w-4 h-4" />
            </button>
          </div>
        </Swiper>

        {loading || spinLoad ? (
          <button
            //  onTouchEnd={handleStart}
            //  onClick={handleStart}
            className="w-11/12 h-12 px-[100px] mb-8 py-3 bg-zinc-300 rounded-[49px] shadow shadow-inner border border-zinc-300 justify-center items-center inline-flex  bottom-[50px] z-[999]"
          >
            <div className="text-center text-orange-900 text-base font-medium leading-normal">
              加载中...
            </div>
          </button>
        ) : (
          <>
            {data?.data?.open_now ? (
              <button
                // disabled={isLocked}
                // onTouchEnd={handleStart}
                onClick={handleStart}
                className={`w-11/12 h-12 mb-2 py-3 bg-amber ${
                  isLocked || currentGroup?.button_state === "disabled"
                    ? "new_spin_button_lock"
                    : "new_spin_button"
                } rounded-[49px] shadow-inner border border-orange-200 justify-center items-center inline-flex gap-1  bottom-[50px]`}
              >
                <div className="text-center text-orange-900 text-base font-medium leading-normal">
                  {/* 开始抽奖{" "}
                  {data?.data?.today_available_free_num >= 1
                    ? ``
                    : `(消耗${data?.data?.points_per_draw}积分)`} */}
                  {isLocked && currentGroup?.button_state === "enabled"
                    ? "尚未解锁"
                    : "开始抽奖"}
                </div>
                {isLocked && currentGroup?.button_state === "enabled" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="16"
                    viewBox="0 0 14 16"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M7 0.299805C8.11391 0.299805 9.18207 0.742621 9.96973 1.53027C10.7574 2.31793 11.2002 3.38609 11.2002 4.5V6.59961H11.9004C13.06 6.59971 13.9999 7.54057 14 8.7002V13.5996C14 14.7593 13.0601 15.7001 11.9004 15.7002H2.10059C0.940788 15.7002 0 14.7594 0 13.5996V8.7002C0.000132015 7.54051 0.940869 6.59961 2.10059 6.59961H2.7998V4.5C2.7998 3.38609 3.24262 2.31793 4.03027 1.53027C4.81793 0.742621 5.88609 0.299805 7 0.299805ZM7 1.7002C6.25739 1.7002 5.54561 1.99541 5.02051 2.52051C4.49541 3.04561 4.2002 3.75739 4.2002 4.5V6.59961H9.7998V4.5C9.7998 3.75739 9.50459 3.04561 8.97949 2.52051C8.45439 1.99541 7.74261 1.7002 7 1.7002Z"
                      fill="#64421A"
                    />
                  </svg>
                )}
              </button>
            ) : (
              <button
                onTouchEnd={handleStart}
                onClick={handleStart}
                className="w-11/12 h-12 mb-8 px-[100px] py-3 bg-zinc-300 rounded-[49px] shadow shadow-inner border border-zinc-300 justify-center items-center inline-flex bottom-[50px] z-[99]"
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

export default Game;
