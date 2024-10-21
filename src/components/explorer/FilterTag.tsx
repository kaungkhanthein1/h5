import { useEffect, useState } from "react";
import {
  setActiveTab,
  setArea,
  setClass,
  setSort,
  setYear,
} from "../../pages/explorer/slice/ExploreSlice";
import { useGetHeaderTopicsQuery } from "../../pages/home/services/homeApi";
import { useDispatch, useSelector } from "react-redux";

const FilterTag = () => {
  const [activeClass, setActiveClass] = useState(0);
  const [activeArea, setActiveArea] = useState(0);
  const [activeYear, setActiveYear] = useState(0);
  const activeTab = useSelector((state: any) => state?.explore?.activeTab);
  const sort = useSelector((state: any) => state?.explore?.sort);
  // console.log(sort, "sort");
  const classData = useSelector((state: any) => state?.explore?.class);
  const area = useSelector((state: any) => state?.explore?.area);
  const year = useSelector((state: any) => state?.explore?.year);
  const { data: configData } = useGetHeaderTopicsQuery();
  const filteredTags = configData?.data?.movie_screen?.filter?.filter(
    (data: any) => {
      if (data?.id == activeTab) {
        return data;
      }
    }
  );
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col gap-3 py-5">
      <div className="flex overflow-x-scroll px-3 gap-6 remove-scrollbar items-center">
        {configData?.data?.movie_search_screen?.type
          ?.filter((data: any) => data?.id !== 0)
          ?.map((item: any, index: any) => (
            <div className="relative" key={index}>
              <p
                onClick={() => dispatch(setActiveTab(item?.id))}
                className={`${
                  activeTab === item?.id
                    ? "text-[16px] text-white"
                    : "text-[16px] text-unselectedColor"
                } whitespace-nowrap hover:text-white transition-colors`}
              >
                {item?.name}
              </p>
              <div
                className={`py-[1px] rounded-full ${
                  activeTab === item?.id && "bg-orange-600"
                } w-full`}
              ></div>
            </div>
          ))}
      </div>
      <div className="flex overflow-x-scroll px-3 gap-6 remove-scrollbar items-center">
        {configData?.data?.movie_search_screen?.sort?.map(
          (item: any, index: any) => (
            <div className="relative" key={index}>
              <p
                onClick={() => dispatch(setSort(item?.value))}
                className={`${
                  sort === item?.value
                    ? "bg-gray-500/35 px-4 py-1 text-[14px]"
                    : "text-[14px]  px-4 py-1"
                } whitespace-nowrap py-2 rounded-full hover:text-white transition-colors`}
              >
                {item?.name}
              </p>
            </div>
          )
        )}
      </div>

      <div className="flex overflow-x-scroll px-3 gap-6 remove-scrollbar items-center">
        {filteredTags?.map(
          (data: any) =>
            data?.class &&
            data?.class?.map((item: any, index: any) => (
              <div className="relative" key={index}>
                <p
                  onClick={() => {
                    setActiveClass(index);
                    dispatch(setClass(item));
                  }}
                  className={`${
                    classData
                      ? classData === item
                        ? "bg-gray-500/35 px-4 py-1 text-[14px]"
                        : "text-[14px]  px-4 py-1"
                      : activeClass === index
                      ? "bg-gray-500/35 px-4 py-1 text-[14px]"
                      : "text-[14px]  px-4 py-1"
                  } whitespace-nowrap py-2 rounded-full hover:text-white transition-colors`}
                >
                  {item}
                </p>
              </div>
            ))
        )}
      </div>
      <div className="flex overflow-x-scroll px-3 gap-6 remove-scrollbar items-center">
        {filteredTags?.map(
          (data: any) =>
            data?.area &&
            data?.area?.map((item: any, index: any) => (
              <div className="relative" key={index}>
                <p
                  onClick={() => {
                    setActiveArea(index);
                    dispatch(setArea(item));
                  }}
                  className={`${
                    area
                      ? area === item
                        ? "bg-gray-500/35 px-4 py-1 text-[14px]"
                        : "text-[14px]  px-4 py-1"
                      : activeArea === index
                      ? "bg-gray-500/35 px-4 py-1 text-[14px]"
                      : "text-[14px]  px-4 py-1"
                  } whitespace-nowrap py-2 rounded-full hover:text-white transition-colors`}
                >
                  {item}
                </p>
              </div>
            ))
        )}
      </div>

      <div className="flex overflow-x-scroll px-3 gap-6 remove-scrollbar items-center">
        {filteredTags?.map(
          (data: any) =>
            data?.year &&
            data?.year?.map((item: any, index: any) => (
              <div className="relative" key={index}>
                <p
                  onClick={() => {
                    setActiveYear(index);
                    dispatch(setYear(item));
                  }}
                  className={`${
                    year
                      ? year === item
                        ? "bg-gray-500/35 px-4 py-1 text-[14px]"
                        : "text-[14px]  px-4 py-1"
                      : activeYear === index
                      ? "bg-gray-500/35 px-4 py-1 text-[14px]"
                      : "text-[14px]  px-4 py-1"
                  } whitespace-nowrap py-2 rounded-full hover:text-white transition-colors`}
                >
                  {item}
                </p>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default FilterTag;
