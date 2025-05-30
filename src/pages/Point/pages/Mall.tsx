import { FC, useState, Fragment, useMemo, useRef, useEffect } from "react";
import { useRequest, useSafeState } from "ahooks";
import Loader from "../../../pages/search/components/Loader";
import { useInfiniteScroll } from "ahooks";
import { Head, Card } from "../components";
import { getItems } from "../api"; 
import { GoodsData, List, ApiData } from "../types/goods";
import InfiniteScroll from "react-infinite-scroll-component";
import numeral from "numeral";
import "./style.css";
import { useGetActivityQuery } from "../service/PointApi";
import { useNavigate } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import noListImg from "../test.png";
import { useGetUserQuery } from "../../../pages/profile/services/profileApi";

export const Mall = () => {
  const [t, st] = useState<any>(0);
  const isLoggedIn = localStorage.getItem("authToken");
  const parsedLoggedIn = isLoggedIn ? JSON.parse(isLoggedIn) : null;
  const ref = useRef<HTMLDivElement>(null);
  const token = parsedLoggedIn?.data?.access_token;
  const navigate = useNavigate();

  const { data: userData } = useGetUserQuery(undefined, {
    skip: !token,
  });
  // staging
  // const parsedUserData = JSON.parse(userData || "{}");

  //prod
  const parsedUserData = userData;

  const integralDetails = userData?.data?.integral;
  const coupon = userData?.data?.coupon;
  const [pageConfig, setPageConfig] = useState({
    page: 1,
    pageSize: 6,
  });
  const [dataList, setData] = useState<List[]>([]);
  const { data, error, loading, refresh } = useRequest<ApiData, any>(
    (p) => {
      return getItems(pageConfig);
    },
    {
      refreshDeps: [pageConfig.page],
      cacheKey: `home-${pageConfig.page}`,
      staleTime: -1,
      cacheTime: -1,
    }
  );

  const fetchMoreData = () => {
    setPageConfig({
      ...pageConfig,
      page: pageConfig.page + 1,
    });

    refresh();
  };

  useEffect(() => {
    if (data?.data?.list?.length) {
      setData([...dataList, ...data.data.list]);
    }
  }, [data]);

  //   useEffect(() => {
  //     let f = 0;
  //     try {
  //       // @ts-ignore
  //       f = JSON.parse(JsBridge?.getUserInfo?.())?.integral ?? 0;
  //       st(f);
  //     } catch (e) {
  //       // @ts-ignore
  //       dsBridge.call("getUserInfo", "getUserInfo", function (v) {
  //         st(JSON.stringify(JSON.parse(v)?.integral));
  //       });
  //     }
  //   }, []);
  const handleOpenTask = () => {
    navigate("/point_info");
    // try {
    //   //@ts-ignore
    //   JsBridge?.openNativePage?.(JSON.stringify({ pageName: "get-integral" }));
    // } catch (error) {
    //   //@ts-ignore
    //   dsBridge.call(
    //     "openNativePage",
    //     JSON.stringify({ pageName: "get-integral" })
    //   );
    // }
  };

  const checkLoginStatus = () => {
    let userInfo;
    //@ts-ignore
    const loginStatus = JsBridge?.isLogin?.();
    if (!loginStatus) {
      try {
        //@ts-ignore
        JsBridge?.openNativePage?.(JSON.stringify({ pageName: "login" }));
      } catch (error) {
        //@ts-ignore
        dsBridge?.call?.(
          "openNativePage",
          JSON.stringify({ pageName: "integral-feedback" })
        );
      }
    } else {
      // @ts-ignore
      userInfo = JsBridge?.getUserInfo?.();
      var canCustomerServer = null;
      var option = {
        openUrl: "https://111.173.119.203:45443",
        token: "67aa98823a51c1f53818982058417121",
        kefuid: "",
        isShowTip: false, // Disable auto display of chat button
        mobileIcon: "",
        pcIcon: "",
        windowStyle: "center",
        domId: "customerServerTip",
        insertDomNode: "body", // Append chat window to body
        sendUserData: {
          uid: userInfo.uId,
          nickName: userInfo.nickName,
          phone: "",
          sex: "",
          avatar: userInfo.avatar,
          openid: "",
        },
      };
      // @ts-ignore
      if (!canCustomerServer) {
        // @ts-ignore
        canCustomerServer = new initCustomerServer(option);
        // @ts-ignore
        canCustomerServer.init();
        // @ts-ignore
        canCustomerServer.getCustomeServer(); // Show chat window
      } else {
        // @ts-ignore
        canCustomerServer.getCustomeServer();
        console.log("Chat server already initialized.");
      }
      // @ts-ignore
      //  const name = `DYLS-${userInfo.nic}`
      //  const hrefLink = `https://111.173.119.203:45443/chat/mobile?noCanClose=1&token=67aa98823a51c1f53818982058417121&uid=${userInfo.uId}&nickName=${userInfo.nickName}&avatar=${userInfo.avatar}`
      // window.location.href = hrefLink
    }
  };
  // const noList = data?.data?.list.length === 0
  const noList = data?.data?.list.length === 0;
  return (
    <div className="container bg-white/90" ref={ref}>
      <Head />
      {/* customer service */}
      <div className=" hidden absolute z-30 right-[20px] bottom-[100px]">
        <div onClick={checkLoginStatus} className="">
          <svg
            width="65"
            height="65"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="50" fill="#D9D9D9" />
            <path
              d="M68.5658 36.3516V35.4926C68.5658 25.2863 60.2463 17 49.9992 17C39.752 17 31.4325 25.2863 31.4325 35.4926V36.3516C29.5048 36.8063 28.0337 38.5747 28.0337 40.6463V46.8105C28.0337 49.2358 30.0121 51.2063 32.4471 51.2063H34.9328C37.3677 51.2063 39.3462 49.2358 39.3462 46.8105V40.6463C39.3462 38.5747 37.875 36.8568 35.9473 36.3516V35.4926C35.9473 27.7621 42.2377 21.4968 49.9992 21.4968C57.7606 21.4968 64.051 27.7621 64.051 35.4926V36.3516C62.1233 36.8063 60.6522 38.5747 60.6522 40.6463V46.8105C60.6522 48.9326 62.174 50.7011 64.1524 51.1053C62.8842 55.4 59.2318 58.7347 54.7169 59.4926C54.5647 58.4316 53.6009 57.5726 52.4849 57.5726H47.5642C46.296 57.5726 45.2814 58.5832 45.2814 59.8463V62.7263C45.2814 63.9895 46.296 65 47.5642 65H52.4849C53.6516 65 54.6155 64.0905 54.7169 62.9284C61.058 62.0695 66.1816 57.32 67.602 51.2063C70.0369 51.1558 71.9646 49.1853 71.9646 46.8105V40.6463C72.0154 38.5747 70.5442 36.8063 68.5658 36.3516Z"
              fill="url(#paint0_linear_2175_18687)"
            />
            <path
              d="M26.6962 70.872H37.2082V71.748H26.6962V70.872ZM30.4162 74.676H36.7402V75.516H30.4162V74.676ZM29.9482 78.924H37.2082V79.776H29.9482V78.924ZM33.1282 72.36H34.0282V79.38H33.1282V72.36ZM30.6442 69.012L31.5682 69.24C30.7282 71.988 29.2642 74.784 26.8762 76.5C26.7802 76.26 26.5522 75.876 26.4082 75.672C28.5682 74.148 29.9722 71.484 30.6442 69.012ZM28.2682 73.956H29.1682V80.016H28.2682V73.956Z"
              fill="url(#paint1_linear_2175_18687)"
            />
            <path
              d="M38.8882 76.908C38.8402 76.728 38.7082 76.32 38.6002 76.08C38.8642 76.044 39.1402 75.744 39.5002 75.288C39.9082 74.856 41.1682 73.176 42.0082 71.532L42.7522 72C41.8042 73.632 40.6402 75.264 39.5002 76.428V76.452C39.5002 76.452 38.8882 76.728 38.8882 76.908ZM38.8882 76.908L38.8402 76.188L39.2842 75.876L42.5482 75.288C42.5242 75.516 42.5242 75.864 42.5482 76.044C39.5362 76.656 39.1282 76.764 38.8882 76.908ZM38.8042 74.028C38.7682 73.836 38.6122 73.404 38.5162 73.164C38.7322 73.116 38.9362 72.828 39.2002 72.432C39.4642 72.036 40.3282 70.488 40.8202 69.06L41.6602 69.456C41.0362 70.92 40.1962 72.456 39.3562 73.536V73.56C39.3562 73.56 38.8042 73.836 38.8042 74.028ZM38.8042 74.028L38.7922 73.356L39.2242 73.068L41.4562 72.852C41.4082 73.08 41.3962 73.416 41.3962 73.584C39.3442 73.848 39.0082 73.92 38.8042 74.028ZM38.5882 78.444C39.5842 78.204 41.1082 77.784 42.5962 77.376L42.7162 78.132C41.3362 78.552 39.8842 78.972 38.7802 79.308L38.5882 78.444ZM43.1362 71.904L48.7762 71.064L48.9322 71.856L43.2922 72.72L43.1362 71.904ZM42.8962 74.484L49.1122 73.32L49.2682 74.124L43.0522 75.3L42.8962 74.484ZM44.9602 69H45.8482C45.8122 74.616 46.7482 79.152 48.3202 79.152C48.6562 79.152 48.7762 78.864 48.8242 77.808C49.0162 78 49.2922 78.192 49.4962 78.288C49.3402 79.632 49.0522 80.028 48.2242 80.028C45.8122 80.028 44.9962 74.856 44.9602 69ZM46.4002 69.732L46.9162 69.24C47.5042 69.504 48.2722 69.936 48.6562 70.26L48.1402 70.824C47.7442 70.488 47.0002 70.02 46.4002 69.732ZM48.5962 74.916L49.3402 75.264C48.0202 77.328 45.7042 78.936 43.0882 79.848C42.9682 79.62 42.7282 79.308 42.5242 79.104C45.0802 78.324 47.3722 76.824 48.5962 74.916Z"
              fill="url(#paint2_linear_2175_18687)"
            />
            <path
              d="M54.4642 71.136L55.4362 71.328C54.6082 72.492 53.3962 73.632 51.6322 74.508C51.5002 74.292 51.2242 73.992 51.0202 73.86C52.6882 73.116 53.8522 72.072 54.4642 71.136ZM54.3322 72.036H58.5082V72.756H53.6842L54.3322 72.036ZM58.2562 72.036H58.4242L58.5922 72L59.1922 72.372C57.5842 74.892 54.0442 76.416 50.8162 77.1C50.7322 76.872 50.5402 76.512 50.3722 76.308C53.4562 75.744 56.8882 74.292 58.2562 72.18V72.036ZM53.9842 72.6C55.3882 74.4 58.2922 75.564 61.5082 75.972C61.3042 76.176 61.0642 76.56 60.9322 76.824C57.7042 76.32 54.8002 75.036 53.1922 72.96L53.9842 72.6ZM52.6402 76.356H59.3122V80.028H58.3882V77.124H53.5282V80.04H52.6402V76.356ZM53.0842 78.876H58.8442V79.644H53.0842V78.876ZM55.4602 69.024H56.3842V70.584H55.4602V69.024ZM50.8642 70.104H61.0162V72.372H60.1042V70.932H51.7522V72.372H50.8642V70.104Z"
              fill="url(#paint3_linear_2175_18687)"
            />
            <path
              d="M63.6082 69.456H66.3922V70.296H63.6082V69.456ZM63.6082 72.264H66.4162V73.104H63.6082V72.264ZM68.2882 73.572H72.6442V74.412H68.2882V73.572ZM63.5842 75.144H66.3922V75.996H63.5842V75.144ZM63.2362 69.456H64.0642V73.776C64.0642 75.648 63.9442 78.3 63.0922 80.076C62.9242 79.932 62.5642 79.728 62.3482 79.644C63.1762 77.952 63.2362 75.54 63.2362 73.776V69.456ZM65.8882 69.456H66.7282V78.984C66.7282 79.464 66.6202 79.74 66.3202 79.896C66.0082 80.04 65.5282 80.064 64.7122 80.052C64.6762 79.836 64.5682 79.428 64.4482 79.2C65.0122 79.212 65.5162 79.212 65.6602 79.2C65.8282 79.188 65.8882 79.14 65.8882 78.972V69.456ZM72.0202 69.492H72.8842V71.82C72.8842 72.264 72.7882 72.504 72.4042 72.636C72.0322 72.768 71.4322 72.768 70.5202 72.768C70.4722 72.516 70.3402 72.216 70.2322 72C70.9522 72.012 71.5882 72.012 71.7802 72C71.9722 72 72.0202 71.952 72.0202 71.808V69.492ZM72.4042 73.572H72.5602L72.7042 73.548L73.2322 73.728C72.6322 76.8 71.0962 78.876 69.2242 79.992C69.1162 79.788 68.8762 79.476 68.6962 79.32C70.4002 78.42 71.8882 76.368 72.4042 73.74V73.572ZM69.6322 74.088C70.3162 76.416 71.7082 78.468 73.5922 79.38C73.3882 79.548 73.1362 79.86 73.0042 80.064C71.0602 79.008 69.6682 76.836 68.9122 74.28L69.6322 74.088ZM67.7842 69.492H72.2602V70.332H68.6362V80.052H67.7842V69.492Z"
              fill="url(#paint4_linear_2175_18687)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_2175_18687"
                x1="61.2022"
                y1="21.9165"
                x2="29.9522"
                y2="61.8721"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FF8517" />
                <stop offset="0.500036" stop-color="#F54100" />
                <stop offset="1" stop-color="#FF4E00" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_2175_18687"
                x1="62.0318"
                y1="70.1345"
                x2="59.6034"
                y2="84.586"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FF8517" />
                <stop offset="0.500036" stop-color="#F54100" />
                <stop offset="1" stop-color="#FF4E00" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_2175_18687"
                x1="62.0318"
                y1="70.1345"
                x2="59.6034"
                y2="84.586"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FF8517" />
                <stop offset="0.500036" stop-color="#F54100" />
                <stop offset="1" stop-color="#FF4E00" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_2175_18687"
                x1="62.0318"
                y1="70.1345"
                x2="59.6034"
                y2="84.586"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FF8517" />
                <stop offset="0.500036" stop-color="#F54100" />
                <stop offset="1" stop-color="#FF4E00" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_2175_18687"
                x1="62.0318"
                y1="70.1345"
                x2="59.6034"
                y2="84.586"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FF8517" />
                <stop offset="0.500036" stop-color="#F54100" />
                <stop offset="1" stop-color="#FF4E00" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="w-full relative mt-[-54px]">
        <img alt="" src="head_bg.png" />
        <div className="container px-4 absolute bottom-[-26px]">
          <div className="w-full jf-card flex rounded-xl h-[94px] pl-[26px] pr-[19px] items-center justify-between text-[#ff6a33]">
            {/* add line */}
            <div className=" fles flex-col gap-[10px]">
              <div className="flex items-end leading-[32px] gap-2">
                <span className="text-[32px]">
                  {integralDetails ? integralDetails : 0}
                </span>
                <span className="text-black/60 text-sm">积分</span>
              </div>
              <span className="new_redeem">
                兑换劵 :{" "}
                <span className="new_redeem_num">{coupon ? coupon : 0}</span> 张
              </span>
            </div>
            <button
              onClick={handleOpenTask}
              className="border get_point_btn px-4 py-1.5 rounded-full font-medium text-xs;"
            >
              获取金币和劵
            </button>
          </div>
        </div>
      </div>

      {loading && dataList.length === 0 && (
        <div className="mt-[45px] px-4">
          <SkeletonTheme
            direction="ltr"
            baseColor="#E1E1E1"
            highlightColor="#00000030"
          >
            <div className="grid grid-cols-2 gap-3 pb-3">
              {[...Array(6)].map((_, index) => (
                <Skeleton className="rounded-lg w-[250px] h-[250px] xl:w-[600px]" />
              ))}
            </div>
          </SkeletonTheme>
        </div>
      )}

      {noList ? (
        <div className=" w-screen h-[70vh] flex justify-center items-center">
          <div className=" flex flex-col justify-center items-center">
            <img className=" h-[184px]" src={noListImg} alt="" />
            <h1 className="nolist_head">这里还没有商品</h1>
            <span className=" nolist_des">稍后再试</span>
          </div>
        </div>
      ) : (
        <div
          className="jf-infinitescroll container px-4 mt-[45px] gap-3 pb-3 overflow-y-auto"
          id="scrollableDiv"
        >
          {/* {loading ? (
            <SkeletonTheme
              direction="ltr"
              baseColor="#E1E1E1"
              highlightColor="#00000030"
            >
              <div className="grid grid-cols-2 gap-3 pb-3">
                {[...Array(6)].map((_, index) => (
                  <Skeleton className="rounded-lg w-[250px] h-[250px] xl:w-[600px]" />
                ))}
              </div>
            </SkeletonTheme>
          ) : ( */}
          <InfiniteScroll
            className="grid grid-cols-2 gap-3 pb-3"
            dataLength={dataList.length}
            next={fetchMoreData}
            hasMore={dataList.length < (data?.data?.total ?? 1)}
            loader={
              <div className="flex bg-transparent justify-center items-center w-screen py-5">
                <Loader />
              </div>
            }
            scrollableTarget="scrollableDiv"
          >
            {dataList?.map((i, k) => (
              <Card key={i.id} data={i} />
            ))}
          </InfiniteScroll>
          {/* )} */}
        </div>
      )}
    </div>
  );
};

export default Mall;
