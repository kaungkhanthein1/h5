import { FC, useEffect, useState, Fragment, useMemo, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useRequest } from "ahooks";
import { Dialog, Transition } from "@headlessui/react";
import { useForm, useFieldArray } from "react-hook-form";
import { Head, Card, Alert } from "../components";
import { itemDetail, sendOrder } from "../api";
import { DetailData, CustomForm } from "../types/goods";
import numeral from "numeral";
import "./style.css";
import { useGetUserQuery } from "../../../pages/profile/services/profileApi";

export const Shop = () => {
  let [isOpen, setIsOpen] = useState<boolean>(!true);
  const { data: userData, refetch } = useGetUserQuery(undefined);
  const form = useRef(null);
  const params = useParams();
  const navigate = useNavigate();
  let [msg, setMsg] = useState<any>({
    show: false,
    msg: "",
    navBtn: false,
  });
  const { register, handleSubmit, control, watch } = useForm<any>();
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

  useEffect(() => {
    if (data?.data?.custom_form?.length ?? 0) {
      data.data.custom_form.forEach((o: any) => {
        append({
          value: o.value,
          ...o,
        });
      });
    }
  }, [data?.data?.custom_form?.length ?? 0]);

  const res = useMemo<DetailData>(() => {
    if (data?.data?.id) {
      return data?.data;
    }
    return {};
  }, [data]);

  const onSubmit = async (data: any) => {
    if ((res?.custom_form?.length ?? 0) === 0) {
      return navigate(`/info/${params.id}`);
    } else {
      try {
        const order = await sendOrder(params.id, {
          form_data: JSON.stringify(data.fieldArray),
        });
        if (order?.data?.order_id) {
          refetch()
          return navigate(`/info/${order.data.order_id}`);
        }
      } catch (err) {
        setIsOpen(false);
        setMsg({
          show: true,
          msg: err,
          navBtn: true,
        });
      }
    }
  };

  const renderForm = (params: any, key: any) => {
    // res.custom_form
    if (params.type === "number") {
      return (
        <div className="w-full flex justify-between py-3" key={key}>
          <label htmlFor={`form-${params.name}`} className="text-base">
            {params.name}
          </label>
          <input
            className="outline-none"
            name={`form-${params.name}`}
            type="text"
            placeholder={params.placeholder}
            maxLength={15}
            required={params?.required ?? false}
          />
        </div>
      );
    }
    if (1) {
      return (
        <div className="w-full flex justify-between py-3 " key={key}>
          <label htmlFor="id1" className="text-base">
            收货邮箱
          </label>
          <textarea
            className="outline-none border border-black/05 bg-[#FBFBFB] p-3 rounded"
            name="id1"
            placeholder="请填写您的收获邮箱，便于及时发货！(推荐使用QQ邮箱)"
          ></textarea>
        </div>
      );
    }
  };

  return (
    <div className="container min-h-screen bg-white/90">
      <Head title="商品详情" />
      <Alert
        {...msg}
        onClose={() => {
          setMsg({ msg: "", show: false, navBtn: false });
        }}
      />

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
                    确认使用 9320 积分兑换该物品？
                  </Dialog.Title>
                  <Dialog.Description className="flex gap-2">
                    <button className=" text-sm py-3 w-full text-black font-medium rounded border border-black/10">
                      取消兑换
                    </button>
                    <button className="bg-[#ff6a33] text-sm py-3 w-full text-white font-medium rounded ">
                      立即兑换
                    </button>
                  </Dialog.Description>
                </Dialog.Panel>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>

      <div className="w-full py-1 mb-2 bg-white">
        <div className="w-full px-4 py-3 flex gap-2">
          <div className="w-20 h-20 rounded overflow-hidden">
            <img
              alt=""
              src={res?.image ?? ""}
              className="object-contain w-full h-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-1 items-center">
              {res?.label ?? "" ? (
                <span className="text-[12px] bg-[#ff6a33] font-semibold text-white px-2.5 rounded flex items-center h-5 min-w-fit">
                  {res.label}
                </span>
              ) : null}
              <p className="font-medium text-black text-base max-w-[200px]">
                {res?.title ?? ""}
              </p>
            </div>
            <div className="flex flex-col">
              <span className="text-lg text-[#ff6a33] font-semibold">
                {numeral(res?.current_price ?? 0).format("0,0")}&nbsp;积分
              </span>
              {(res?.original_price ?? 0) &&
              res?.current_price != res?.original_price ? (
                <span className="text-[12px] text-black/40 font-semibold line-through decoration-black/40">
                  {numeral(res?.original_price ?? 0).format("0,0")}&nbsp;积分
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {(res?.custom_form?.length ?? 0) === 0 ? null : (
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
                <div className="flex flex-col">
                  <span className="text-lg text-[#ff6a33] font-semibold">
                    {numeral(res?.current_price ?? 0).format("0,0")}&nbsp;积分
                  </span>
                  {(res?.original_price ?? 0) &&
                  res?.current_price != res?.original_price ? (
                    <span className="text-[12px] text-black/40 font-semibold line-through decoration-black/40">
                      {numeral(res?.original_price ?? 0).format("0,0")}
                      &nbsp;积分
                    </span>
                  ) : null}
                </div>
                {(res?.stock ?? 0) > 0 ? (
                  <button
                    type="submit"
                    className="bg-[#ff6a33] text-sm py-[14px] px-[72px] text-white font-medium rounded "
                  >
                    立即兑换
                  </button>
                ) : (
                  <button className="bg-[#bfbfbf] text-sm py-[14px] px-[72px] text-white font-medium rounded ">
                    已售罄
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Shop;
