import { FC, useState, Fragment, useMemo, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { DetailData, CustomForm } from "../types/goods";
import { useRequest, useSafeState } from "ahooks";
import { Head, Card, Alert } from "../components";
import { itemDetail, sendOrder } from "../api";
import numeral from "numeral";
import Toast from "../components/Toast";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./style.css";

export const ItemDetail = () => {
  const [err, setErr] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  const params = useParams();
  const navigate = useNavigate();
  let [isOpen, setIsOpen] = useState<boolean>(!true);
  let [msg, setMsg] = useState<any>({
    show: false,
    msg: "",
    navBtn: false,
  });

  // useEffect(() => {
  //   setShowToast(true);
  // }, []);

  const [alertConfig, setAlert] = useState({
    title: "",
    cancel: "取消兑换",
    ok: "确认兑换",
  });

  const { data, error, loading } = useRequest<any, any>(
    () => {
      if (!params?.id) {
        return false;
      }
      return itemDetail(params.id);
    },
    {
      refreshDeps: [params?.id ?? 0],
      cacheKey: `cacheKey-${params?.id}`,
    }
  );

  const res = useMemo<DetailData>(() => {
    if (data?.data?.id) {
      return data?.data;
    }
    return {};
  }, [data]);

  const handleBuy = () => {
    // setErr(true);
    // setShowToast(true);
    const jf = numeral(res?.current_price ?? 0).format("0,0");
    setAlert({
      ...alertConfig,
      title: `确认使用 ${jf} 积分兑换该物品？`,
    });
    setIsOpen(true);
  };

  const update = (jf: any) => {
    console.log("it is come");
    // @ts-ignore
    // if (typeof JsBridge === "undefined") {
    //   // @ts-ignore
    //   dsBridge.call(
    //     "updateUserInfo",
    //     {
    //       name: "integral",
    //       value: jf,
    //     },
    //     (value: any) => {}
    //   );
    // } else {
    //   // @ts-ignore
    //   JsBridge?.updateUserInfo?.(
    //     JSON.stringify({ name: "integral", value: res?.data?.jf })
    //   );
    // }
  };

  const handleOrder = async () => {
    try {
      if ((res?.custom_form?.length ?? 0) === 0) {
        const order = await sendOrder(params.id, {
          form_data: "[]",
        });
        console.log(order)
        if (order?.data?.order_id) {
          console.log("updating",order)
          update(order.data.surplus_integral);
          return navigate(`/info/${order.data.order_id}`);
        }
      }
      return navigate(`/shop/${params.id}`);
    } catch (err) {
      console.log("debug: errerrerr", err);
      setIsOpen(false);
      setMsg({
        show: true,
        msg: err,
        navBtn: true,
        center: true,
        btnText: err === "你还没有登录，请先登录" ? "立即登陆" : null,
      });
    }
  };

  return (
    <div className="container min-h-screen bg-white/90">
      <Head />
      <Alert
        {...msg}
        onClose={() => {
          setMsg({ msg: "", show: false, navBtn: false });
        }}
      />
      {showToast && (
        <Toast
          message="Some devices not support."
          duration={2000}
          onClose={() => setShowToast(false)}
        />
      )}
      <Transition show={isOpen} as={Fragment}>
        <Dialog open={true} onClose={() => setIsOpen(false)}>
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
                <Dialog.Panel className="w-80 max-w-sm rounded bg-white p-6 flex gap-8 flex-col">
                  <Dialog.Title className="text-base font-medium">
                    {alertConfig.title}
                  </Dialog.Title>
                  <Dialog.Description className="flex gap-2">
                    <button
                      className=" text-sm py-3 w-full text-black font-medium rounded border border-black/10"
                      onClick={() => {
                        setIsOpen(false);
                        setErr(false);
                      }}
                    >
                      {alertConfig.cancel}
                    </button>
                    <button
                      className="bg-[#ff6a33] text-sm py-3 w-full text-white font-medium rounded"
                      onClick={handleOrder}
                    >
                      {alertConfig.ok}
                    </button>
                  </Dialog.Description>
                </Dialog.Panel>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>

      {loading ? (
        <SkeletonTheme
          direction="ltr"
          baseColor="#E1E1E1"
          highlightColor="#00000030"
        >
          <div className="px-4">
            <Skeleton className="rounded-lg w-full h-[200px] xl:w-[600px]" />
          </div>
        </SkeletonTheme>
      ) : (
        <div className="w-full px-4 my-2">
          <div className="w-full rounded-lg bg-white h-[200px] relative overflow-hidden p-2 ">
            {res?.label ?? "" ? (
              <div className="absolute bg-[#ff6a33] text-white text-[12px] right-0 top-0 rounded-bl-lg px-3 h-[21px] flex items-center font-semibold">
                {res.label}
              </div>
            ) : null}
            <img
              alt=""
              src={res?.image}
              className="object-cover w-full h-full rounded"
            />
          </div>
        </div>
      )}

      {loading ? (
        <SkeletonTheme
          direction="ltr"
          baseColor="#E1E1E1"
          highlightColor="#00000030"
        >
          <div className="flex flex-col py-5 gap-2 px-4 bg-white rounded-lg h-full">
            <Skeleton width={150} className="rounded-lg h-[40px]" />
            <Skeleton width={130} className="rounded-lg h-[40px]" />
            <Skeleton className="rounded-lg h-[150px]" />
          </div>
        </SkeletonTheme>
      ) : (
        <div className="flex flex-col py-5 px-4 bg-white rounded-lg h-full">
          <p className="font-medium text-lg text-black mb-6">
            {res?.title ?? ""}
          </p>
          <div className="font-medium text-base text-black flex items-center gap-1 mb-4">
            <div className="w-[3px] h-[14px] rounded-full bg-[#ff6a33]"></div>
            商品详情
          </div>

          <div className="flex flex-col text-sm text-black/60 pb-[100px]">
            <div
              dangerouslySetInnerHTML={{ __html: res?.introduction ?? "" }}
            ></div>
          </div>
        </div>
      )}

      {err && (
        <div className=" absolute bottom-[20px]">
          <h1 className=" text-xl text-red-700 font-bold">
            Some devices do not currently support this process.
          </h1>
        </div>
      )}

      <div className="jf-foot bg-white fixed w-full z-10 bottom-0 left-0 min-h-min px-4 py-2 py-4">
        <div className="flex pb-2 justify-between items-center">
          <div className="flex flex-col">
            {typeof res?.current_price === "number" && (
              <span className="text-md text-[#ff6a33] font-semibold">
                {res?.require_coupon > 0 && `${res.require_coupon} 兑换劵 + `}
                {numeral(res.current_price).format("0,0")}&nbsp;积分
              </span>
            )}

            {res?.original_price ?? 0 ? (
              <span className="text-[12px] text-black/40 font-semibold line-through decoration-black/40">
                {numeral(res?.original_price ?? 0).format("0,0")}&nbsp;积分
              </span>
            ) : null}
          </div>
          {(res?.stock ?? 0) > 0 ? (
            <button
              // onTouchStart={handleBuy}
              onTouchEnd={handleBuy}
              onClick={handleBuy}
              className="bg-[#ff6a33] text-sm py-[14px] px-[72px] text-white font-medium rounded "
            >
              立即兑换
            </button>
          ) : (
            <p className="bg-[#bfbfbf] text-sm py-[14px] px-[72px] text-white font-medium rounded ">
              已售罄
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
