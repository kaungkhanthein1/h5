import { FC, useEffect, useState, Fragment, useMemo } from "react";
import { useRequest, useLockFn } from "ahooks";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Dialog, Transition, TransitionChild } from "@headlessui/react";
import { Head, Loader, Alert, Copy } from "../components";
import { getOrder, cancelOrder, removeOrder, reOrder } from "../api";
import dayjs from "dayjs";
import { STATUS_MAP } from "./List";
import { useForm, useFieldArray } from "react-hook-form";
import numeral from "numeral";
import "./style.css";
import FeedbackComponent from "../../../pages/player/video/Feedback";
import { useGetUserQuery } from "../../../pages/profile/services/profileApi";

export const ItemInfo = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState({
    msg: "",
    show: false,
  });
  let [editmode, setMode] = useState<boolean>(false);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [isCancelLoader, setIsCancelLoader] = useState<boolean>(false);
  const [isRemove, setIsRemove] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false); // For triggering modal

  const { data: userData, refetch } = useGetUserQuery(undefined);
  const [reloading, setReLoading] = useState(false);

  let [deleteMode, setDeleteMode] = useState<boolean>(false);
  let [isOpen, setIsOpen] = useState<boolean>(false);
  let [removeAlert, setRemoveAlert] = useState<boolean>(false);
  const { register, handleSubmit, control, watch } = useForm<any>();
  const { data, error, loading, refresh } = useRequest<any, any>(
    () => getOrder(params.id),
    {
      cacheKey: `cacheKey-${params?.id}`,
    }
  );
  const { fields, append } = useFieldArray({
    control,
    name: "fieldArray",
  });
  const watchFieldArray = watch("fieldArray", { dependencies: [fields] });
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  useEffect(() => {
    switch (data?.data?.status) {
      case "pending":
        setMode(true);
        break;
      case "failed":
        setMode(true);
        break;
      case "cancelled":
        setDeleteMode(true);
        setMode(false);
        break;
      case "completed":
        setDeleteMode(true);
        break;
    }

    if (data?.data?.form_data?.length ?? 0) {
      data.data.form_data.forEach((o: any) => {
        append({
          value: o.value,
          ...o,
        });
      });
    }
  }, [data?.data ?? 0]);

  const res = useMemo<any>(() => {
    // @ts-ignore
    return data?.data ?? {};
  }, [data]);

  const handleReOrder = () => {
    setIsOpen(true);
  };

  const handleFeedback = () => {
    handleFeedbackModel();
    // try {
    //   //@ts-ignore
    //   JsBridge?.openNativePage?.(
    //     JSON.stringify({ pageName: "integral-feedback" })
    //   );
    // } catch (error) {
    //   //@ts-ignore
    //   dsBridge.call(
    //     "openNativePage",
    //     JSON.stringify({ pageName: "integral-feedback" })
    //   );
    //   setMsg({
    //     msg: "请使用APP打开~",
    //     show: true,
    //   });
    // }
  };

  const handleRemoveOrder = () => {
    setRemoveAlert(true);
  };

  const handleCancelOrder = useLockFn(async () => {
    setIsCancelling(true);
    setIsCancelLoader(true);
    setIsOpen(false);
    try {
      const orderid = params?.id ?? "";
      const res = await cancelOrder(orderid);
      // @ts-ignore
      //   if (typeof JsBridge === "undefined") {
      //     // @ts-ignore
      //     dsBridge.call(
      //       "updateUserInfo",
      //       {
      //         name: "integral",
      //         value: res?.data?.surplus_integral,
      //       },
      //       (value: any) => {
      //         refresh();
      //       }
      //     );
      //   } else {
      //     // @ts-ignore
      //     JsBridge?.updateUserInfo?.(
      //       JSON.stringify({
      //         name: "integral",
      //         value: res?.data?.surplus_integral,
      //       })
      //     );
      //   }
      refresh();
      refetch();
    } catch (err) {
    } finally {
      // setIsOpen(false);
      setIsCancelLoader(false);

      setIsCancelling(false);
    }
  });

  const onRemoveOrder = useLockFn(async () => {
    setIsRemove(true);
    try {
      // setIsOpen(true);
      const orderid = params?.id ?? "";
      const res = await removeOrder(orderid);
      return navigate("/list", { replace: true });
    } catch (err) {
    } finally {
      setDeleteMode(false);
      setIsRemove(false);
    }
  });

  const handleFeedbackModel = () => {
    setShowFeedbackModal(!showFeedbackModal);
  };

  const onSubmit = async (data: any) => {
    if(reloading) return
    setReLoading(true);
    try {
      const order = await reOrder(params.id, {
        form_data: JSON.stringify(data.fieldArray),
      });
      if (order?.data?.order_id) {
        setMsg({
          msg: "您已成功重新下单!",
          show: true,
        });
      }
    } catch (err) {
      setMsg({
        msg: "重新下单失败",
        show: true,
      });
    } finally {
      setReLoading(false);
      refresh();
    }
  };

  const handleCopy = () => {
    setMsg({
      msg: res?.message ?? "",
      // @ts-ignore
      isCopy: Boolean((res?.status ?? "") === "completed"),
      show: true,
    });
  };

  return (
    <div className="container min-h-screen bg-white/90">
      <Head title="订单详情" />
      <Alert
        {...msg}
        onClose={() => {
          setMsg({
            show: false,
            msg: "",
          });
        }}
      />
      <Transition show={isOpen} as={Fragment}>
        <Dialog open={true} onClose={() => setIsOpen(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="z-20 fixed inset-0 bg-black/30" />
          </TransitionChild>

          <TransitionChild
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
                    是否取消订单,&nbsp;
                    <span className=" text-[#ff6a33] font-semibold">
                      {numeral(res?.goods?.current_price ?? 0).format("0,0")}
                      &nbsp;积分
                    </span>
                    &nbsp;将退回账户
                  </Dialog.Title>
                  <Dialog.Description className="flex gap-2">
                    <button
                      className=" text-sm py-3 w-full text-black font-medium rounded border border-black/10"
                      onClick={handleCancelOrder}
                      disabled={isCancelling}
                    >
                      取消订单
                    </button>
                    <button
                      className=" bg-[#ff6a33] text-sm py-3 w-full text-white font-medium rounded"
                      onClick={() => setIsOpen(false)}
                    >
                      我在想想
                    </button>
                  </Dialog.Description>
                </Dialog.Panel>
              </div>
            </div>
          </TransitionChild>
        </Dialog>
      </Transition>

      <Transition show={removeAlert} as={Fragment}>
        <Dialog open={true} onClose={() => setDeleteMode(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="z-20 fixed inset-0 bg-black/30" />
          </TransitionChild>

          <TransitionChild
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
                    是否删除该订单?
                  </Dialog.Title>
                  <Dialog.Description className="flex gap-2">
                    <button
                      className=" text-sm py-3 w-full text-black font-medium rounded border border-black/10"
                      onClick={onRemoveOrder}
                      disabled={isRemove}
                    >
                      删除订单
                    </button>
                    <button
                      className=" bg-[#ff6a33] text-sm py-3 w-full text-white font-medium rounded"
                      onClick={() => setRemoveAlert(false)}
                    >
                      我在想想
                    </button>
                  </Dialog.Description>
                </Dialog.Panel>
              </div>
            </div>
          </TransitionChild>
        </Dialog>
      </Transition>
      {/* badge */}
      <div
        className="w-full bg-[#FFDB5B] flex gap-2 truncate items-center p-2"
        onClick={handleCopy}
      >
        <img className="w-6 h-6" src="/Notification.png" />
        <p className="text-[#4D2E00] text-sm truncate">
          {res?.message}{" "}
          {(res?.status ?? "") === "completed" ? (
            <Copy btntype="text" ctx={res?.message} />
          ) : null}
        </p>
        <img className="w-6 h-6" src="/Right.png" />
      </div>

      <div className="flex flex-col divide-y divide-black/05 bg-white mb-2">
        <div className="flex flex-col py-3.5 px-4 gap-1 w-fit">
          <ol className="flex w-fit gap-6">
            {(res?.status ?? "") === "cancelled" ? (
              <li className={`text-base text-[#ff6a33] font-medium`}>已取消</li>
            ) : null}
            {(res?.status ?? "") === "failed" ? (
              <li className={`text-base text-[#ff6a33] font-medium`}>已驳回</li>
            ) : null}

            <li
              className={`text-base ${
                (res?.status ?? "") === "pending"
                  ? "text-[#ff6a33] font-medium"
                  : "text-black/40"
              }`}
            >
              待处理
            </li>
            <li
              className={`text-base ${
                (res?.status ?? "") === "processing"
                  ? "text-[#ff6a33] font-medium"
                  : "text-black/40"
              }`}
            >
              处理中
            </li>
            <li
              className={`text-base ${
                (res?.status ?? "") === "completed"
                  ? "text-[#ff6a33] font-medium"
                  : "text-black/40"
              }`}
            >
              已完成
            </li>
          </ol>
          <ol className="flex w-full divide divide-black/05 items-center gap-1 justify-center">
            {(res?.status ?? "") === "cancelled" ? (
              <li className={`text-base text-[#ff6a33] font-medium`}>已取消</li>
            ) : null}
            {(res?.status ?? "") === "failed" ? (
              <li className={`text-base text-[#ff6a33] font-medium`}>已驳回</li>
            ) : null}

            <li
              className={`text-base ${
                (res?.status ?? "") === "pending"
                  ? "rounded-full w-1.5 h-1.5  bg-[#ff6a33]"
                  : "rounded-full w-1 h-1 bg-black/20"
              }`}
            ></li>
            <li className="h-[1px] w-14 bg-black/10"></li>
            <li
              className={`text-base ${
                (res?.status ?? "") === "processing"
                  ? "rounded-full w-1.5 h-1.5  bg-[#ff6a33]"
                  : "rounded-full w-1 h-1 bg-black/20"
              }`}
            ></li>
            <li className="h-[1px] w-14 bg-black/10"></li>
            <li
              className={`text-base ${
                (res?.status ?? "") === "completed"
                  ? "rounded-full w-1.5 h-1.5  bg-[#ff6a33]"
                  : "rounded-full w-1 h-1 bg-black/20"
              }`}
            ></li>
          </ol>
        </div>

        <div className="w-full py-1 mb-2 ">
          <div className="w-full px-4 py-3 flex gap-2">
            <div className="w-20 h-20 rounded overflow-hidden">
              <img
                referrerPolicy="no-referrer"
                src={res?.goods?.image}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-1 items-center">
                {res?.goods?.label ?? false ? (
                  <span className="text-[12px]  bg-[#ff6a33] font-semibold text-white px-2.5 rounded flex items-center h-5">
                    {res?.goods?.label}
                  </span>
                ) : null}

                <p className="font-medium text-black text-base max-w-[200px]">
                  {res?.goods?.title}
                </p>
              </div>
              <div className="flex flex-col">
                <span className="text-lg text-[#ff6a33] font-semibold">
                  {res?.goods?.require_coupon !== 0 &&
                    `${res?.goods?.require_coupon} 兑换劵 +`}
                  {numeral(res?.goods?.current_price ?? 0).format("0,0")}
                  &nbsp;积分
                </span>
                {(res?.goods?.original_price ?? 0) &&
                res?.goods?.original_price != res?.goods?.current_price ? (
                  <span className="text-[12px] text-black/40 font-semibold line-through decoration-black/40">
                    {numeral(res?.goods?.original_price ?? 0).format("0,0")}
                    &nbsp;积分
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full p-3">
          <div className="flex divide-x divide-black/05 justify-between">
            {deleteMode ? (
              <button
                className="w-full flex gap-0.5 items-center justify-center text-black/40 text-sm"
                onClick={handleRemoveOrder}
              >
                <img className="w-6 h-6" src="/delete.png" />
                删除订单
              </button>
            ) : null}
            {isCancelLoader ? (
              <div className="w-full flex items-center justify-center text-black/40 text-sm">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              </div>
            ) : editmode ? (
              <button
                className="w-full flex gap-0.5 items-center justify-center text-black/40 text-sm"
                onClick={handleReOrder}
              >
                <img className="w-6 h-6" src="/can.png" />
                取消订单
              </button>
            ) : null}

            <button
              className="w-full flex gap-0.5 items-center justify-center text-[#ff6a33] text-sm"
              onClick={handleFeedback}
            >
              <img className="w-6 h-6" src="/kf.png" />
              联系客服
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col px-4 bg-white h-full mb-2">
        <div className="w-full flex justify-between py-5">
          <p className="text-base">订单编号</p>
          <p className="text-base text-black/60 flex items-center gap-1">
            {res?.order_id} <Copy btntype="btn" ctx={res?.order_id} />
          </p>
        </div>
        <div className="w-full flex justify-between py-5">
          <p className="text-base">下单时间</p>
          <p className="text-base text-black/60">
            <span>
              {dayjs(res.create_time * 1000).format("YYYY-MM-DD HH:mm")}
            </span>
          </p>
        </div>
        <div className="w-full flex justify-between py-5">
          <p className="text-base">订单状态</p>
          <p className="text-base text-black/60">
            {/*@ts-ignore*/}
            {(STATUS_MAP[res.status] ?? STATUS_MAP.other).text}
          </p>
        </div>
      </div>

      {res?.form_data?.length && !editmode ? (
        <div className="flex flex-col px-4 bg-white h-full mb-2">
          {res.form_data.map((i: any, k: any) => (
            <div className="w-full flex justify-between py-2.5" key={k}>
              <p className="text-base">{i.name}</p>
              <p className="text-base text-black/60">{i.value}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col px-4 bg-white h-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="divide-y divide-black/05"
          >
            {controlledFields.map((field, index) => {
              return (
                <div
                  className={`w-full flex justify-between py-3 ${
                    field.type === "textarea" ? "flex-col gap-2" : ""
                  }`}
                >
                  <label htmlFor={`form-${field.name}`} className="text-base">
                    {field.name}
                  </label>
                  {field.type === "number" || field.type === "text" ? (
                    <input
                      {...register(`fieldArray.${index}.value` as const, {
                        required: !!(field?.required ?? 0),
                        value: field.value,
                      })}
                      className="outline-none"
                      type="text"
                      placeholder={field.placeholder}
                    />
                  ) : null}
                  {field.type === "textarea" ? (
                    <textarea
                      {...register(`fieldArray.${index}.value` as const, {
                        required: !!(field?.required ?? 0),
                        value: field.value,
                      })}
                      className="outline-none border border-black/05 bg-[#FBFBFB] p-3 rounded"
                      placeholder={field.placeholder}
                    ></textarea>
                  ) : null}
                </div>
              );
            })}

            <div className="jf-foot bg-white fixed w-full z-10 bottom-0 left-0 min-h-min px-4 py-2">
              <div className="flex pb-2 justify-between items-center">
                <button
                  disabled={reloading}
                  type="submit"
                  className={`${
                    reloading ? "bg-white text-black" : "bg-[#ff6a33] text-white"
                  }  text-sm py-[14px] px-[72px] font-medium rounded w-full`}
                >
                  {/* re-order */}
                  {reloading ? "下单中..." : "重新下单"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {editmode ? null : (
        <div className="flex flex-col px-4 bg-white h-full shrink">
          <div className="w-full flex justify-between py-2.5">
            <p className="text-base">商品总价</p>
            <p className="text-base text-black/60">
              {(res?.goods?.require_coupon ?? 0) !== 0 &&
                `${res.goods.require_coupon} 兑换劵 + `}
              {numeral(res?.goods?.original_price ?? 0).format("0,0")}&nbsp;积分
            </p>
          </div>
          {(res?.goods?.original_price ?? 0) &&
          res?.goods?.original_price != res?.goods?.current_price ? (
            <div className="flex justify-end mb-2 items-baseline gap-2">
              <span className="text-[12px] text-black/60">实际花费:</span>
              <span className="text-base text-[#ff6a33]">
                {numeral(res?.order_price ?? 0).format("0,0")}&nbsp;积分
              </span>
            </div>
          ) : null}
        </div>
      )}

      {editmode ? null : (
        <div className="jf-foot bg-white fixed w-full z-10 bottom-0 left-0 min-h-min px-4 py-2">
          <div className="flex pb-2 justify-between items-center">
            <button
              onClick={() => {
                navigate("/point_mall");
              }}
              className=" bg-[#ff6a33] text-sm py-[14px] px-[72px] text-white font-medium rounded w-full"
            >
              返回积分商城
            </button>
          </div>
        </div>
      )}
      {showFeedbackModal && (
        <FeedbackComponent
          movieId={"1"}
          onActionComplete={() => console.log("test")}
          onClose={handleFeedbackModel}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          height={`600px`}
        />
      )}
    </div>
  );
};

export default ItemInfo;
