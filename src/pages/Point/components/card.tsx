import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GoodsData, List, ApiData } from "../types/goods";
import numeral from "numeral";

type CardProps = {
  data: List;
  key?: any;
};

export const Card: FC<CardProps> = ({ data, key = "" }) => {
  const navigate = useNavigate();
  const link = useCallback(() => {
    navigate(`/itemDetail/${data.id}`);
  }, [data]);

  return (
    <div
      className="w-full flex flex-col bg-white rounded-lg overflow-hidden relative"
      key={key ?? ""}
    >
      {data?.discount === 0 ? null : (
        <div className="absolute bg-[#ff6a33] text-white text-xs right-0 rounded-bl-lg px-3 h-[21px] flex items-center font-semibold">
          {data?.label}
        </div>
      )}

      <button className="h-[126px] w-full px-2 py-3" onClick={link}>
        <img alt="" src={`${data?.image}`} />
      </button>
      <p className="mt-2 mb-1 px-2 text-sm">{data?.title}</p>
      <div className="w-full relative h-3">
        <div className="w-3 h-3 bg-graybg rounded-full absolute top-0 left-[-6px]"></div>
        <div className="border border-dashed border-graybg absolute top-[6px] left-0 w-full"></div>
        <div className="w-3 h-3 bg-graybg rounded-full absolute top-0 right-[-6px]"></div>
      </div>

      <div className="flex px-2 pb-3 pt-2 justify-between items-center">
        <div className="flex flex-col">
          {/* new line */}
          {data?.require_coupon !== 0 && (
            <span className="text-sm text-[#ff6a33] font-semibold">
              {data?.require_coupon} 兑换劵 +
            </span>
          )}
          {data?.current_price ? (
            <span className="text-sm text-[#ff6a33] font-semibold">
              {numeral(data.current_price ?? 0).format("0,0")}&nbsp;积分
            </span>
          ) : null}

          {data?.original_price ? (
            <span className="text-xs text-black/40 font-semibold line-through decoration-black/40">
              {numeral(data.original_price ?? 0).format("0,0")}&nbsp;积分
            </span>
          ) : null}
        </div>
        {data?.stock !== 0 ? (
          <button
            className="py px-4 bg-[#ff6a33] text-xs h-[26px] leading-[26px] text-white font-medium rounded-full "
            onClick={link}
          >
            兑换
          </button>
        ) : (
          <button className="py px-4 bg-[#bfbfbf] text-xs h-[26px] leading-[26px] text-white font-medium rounded-full">
            已售罄
          </button>
        )}
      </div>
    </div>
  );
};
