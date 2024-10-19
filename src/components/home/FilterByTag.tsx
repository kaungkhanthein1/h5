import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setArea,
  setClass,
  setSort,
  setYear,
} from "../../pages/home/slice/HomeSlice";

const FilterByTag = ({ data, sort }: any) => {
  // console.log(data);
  const sortData = useSelector((state: any) => state.home.sort);
  const classData = useSelector((state: any) => state.home.class);
  const area = useSelector((state: any) => state.home.area);
  const year = useSelector((state: any) => state.home.year);

  const dispatch = useDispatch();
  return (
    <div className="w-full pt-5 pb-2 flex flex-col gap-3">
      <div className="flex overflow-x-scroll px-3 gap-5 remove-scrollbar items-center">
        {sort?.map((item: any, index: any) => (
          <div className="relative" key={index}>
            <p
              onClick={() => {
                // setActiveSort(item?.value);
                dispatch(setSort(item?.value));
              }}
              className={`${
                sortData === item?.value
                  ? "bg-gray-500/35 px-4 py-1 text-xs"
                  : "text-[14px]"
              } whitespace-nowrap py-1 rounded-full hover:text-white transition-colors`}
            >
              {item?.name}
            </p>
          </div>
        ))}
      </div>
      <div className="flex overflow-x-scroll px-3 gap-5 remove-scrollbar items-center">
        {data && data.length > 0 && data[0]?.class?.map((item: any, index: any) => (
          <div className="relative" key={index}>
            <p
              onClick={() => dispatch(setClass(item))}
              className={`${
                classData === item
                  ? "bg-gray-500/35 px-4 py-1 text-xs"
                  : "text-[14px]"
              } whitespace-nowrap py-1 rounded-full hover:text-white transition-colors`}
            >
              {item}
            </p>
          </div>
        ))}
      </div>
      <div className="flex overflow-x-scroll px-3 gap-5 remove-scrollbar items-center">
        {data[0]?.area?.map((item: any, index: any) => (
          <div className="relative" key={index}>
            <p
              onClick={() => dispatch(setArea(item))}
              className={`${
                area === item
                  ? "bg-gray-500/35 px-4 py-1 text-xs"
                  : "text-[14px]"
              } whitespace-nowrap py-1 rounded-full hover:text-white transition-colors`}
            >
              {item}
            </p>
          </div>
        ))}
      </div>
      <div className="flex overflow-x-scroll px-3 gap-5 remove-scrollbar items-center">
        {data[0]?.year?.map((item: any, index: any) => (
          <div className="relative" key={index}>
            <p
              onClick={() => dispatch(setYear(item))}
              className={`${
                year === item
                  ? "bg-gray-500/35 px-4 py-1 text-xs"
                  : "text-[14px]"
              } whitespace-nowrap py-1 rounded-full hover:text-white transition-colors`}
            >
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterByTag;
