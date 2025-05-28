import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setArea,
  setClass,
  setSort,
  setYear,
  setSortName,
} from "../../pages/home/slice/HomeSlice";
import withFilterTag from "./withFilterTag";
import { setShowFilterTag } from "../../features/counter/counterSlice";
import { useGetHeaderTopicsQuery } from "../../services/helperService";

const FilterByTag = ({
  secondDivRef,
  setIsSecondDivAtTop,
  paddingTop,
}: any) => {
  const selectedClassRef1 = useRef<any>(null);
  const selectedYearRef1 = useRef<any>(null);
  const selectedAreaRef1 = useRef<any>(null);
  const activeTab = useSelector((state: any) => state.home.activeTab);
  const sortData = useSelector((state: any) => state.home.sort);
  const classData = useSelector((state: any) => state.home.class);
  const area = useSelector((state: any) => state.home.area);
  const year = useSelector((state: any) => state.home.year);
  const dispatch = useDispatch();
  const { data: configData, isLoading, isFetching } = useGetHeaderTopicsQuery();
  const filteredTags: any = configData?.data?.movie_screen?.filter?.filter(
    (data: any) => data?.id === activeTab
  );

  useEffect(() => {
    const handleScroll = () => {
      if (secondDivRef.current) {
        const rect = secondDivRef.current.getBoundingClientRect();

        if (rect.top < 121) {
          setIsSecondDivAtTop(true);
          dispatch(setShowFilterTag(true));
        } else {
          setIsSecondDivAtTop(false);
          dispatch(setShowFilterTag(false));
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Clean up on unmount
    };
  }, []);
  useEffect(() => {
    if (selectedYearRef1.current) {
      setTimeout(() => {
        selectedYearRef1.current?.scrollIntoView({
          behavior: "smooth",
          inline: "center", // Ensure horizontal centering
          block: "nearest", // Keep vertical positioning intact
        });
      }, 1);
    }
  }, [year]);
  useEffect(() => {
    if (selectedClassRef1.current) {
      setTimeout(() => {
        selectedClassRef1.current?.scrollIntoView({
          behavior: "smooth",
          inline: "center", // Ensure horizontal centering
          block: "nearest", // Keep vertical positioning intact
        });
      });
    }
  }, [classData]);

  useEffect(() => {
    if (selectedAreaRef1.current) {
      setTimeout(() => {
        selectedAreaRef1.current?.scrollIntoView({
          behavior: "smooth",
          inline: "center", // Ensure horizontal centering
          block: "nearest", // Keep vertical positioning intact
        });
      });
    }
  }, [area]);

  if (isLoading || isFetching) {
    return null; // Ensure you return null instead of undefined
  }

  return (
    <>
      <div
        className={`w-full ${
          paddingTop?.length ? paddingTop : ""
        } pb-2 flex flex-col gap-3`}
      >
        <div className="flex overflow-x-scroll px-3 gap-5 remove-scrollbar items-center pt-2">
          {configData?.data?.movie_screen?.sort?.map(
            (item: any, index: any) => (
              <div className="relative" key={index}>
                <p
                  onClick={() => {
                    // setActiveSort(item?.value);
                    dispatch(setSort(item?.value));
                    dispatch(setSortName(item?.name));
                  }}
                  className={`${
                    sortData === item?.value
                      ? "bg-gray-500/35 px-4 py-1 text-[12px]"
                      : "text-[14px]"
                  } whitespace-nowrap py-1 rounded-full hover:text-white transition-colors`}
                >
                  {item?.name}
                </p>
              </div>
            )
          )}
        </div>
        <div className="flex overflow-x-scroll px-3 gap-5 remove-scrollbar items-center">
          {filteredTags &&
            filteredTags.length > 0 &&
            filteredTags[0]?.class?.map((item: any, index: any) => (
              <div
                className="relative"
                key={item}
                ref={classData === item ? selectedClassRef1 : null}
              >
                <p
                  onClick={() => dispatch(setClass(item))}
                  className={`${
                    classData === item
                      ? "bg-gray-500/35 px-4 py-1 text-[12px]"
                      : "text-[14px]"
                  } whitespace-nowrap py-1 rounded-full hover:text-white transition-colors`}
                >
                  {item}
                </p>
              </div>
            ))}
        </div>
        <div className="flex overflow-x-scroll px-3 gap-5 remove-scrollbar items-center">
          {filteredTags &&
            filteredTags.length &&
            filteredTags[0]?.area?.map((item: any, index: any) => (
              <div
                className="relative"
                key={item}
                ref={area === item ? selectedAreaRef1 : null}
              >
                <p
                  onClick={() => dispatch(setArea(item))}
                  className={`${
                    area === item
                      ? "bg-gray-500/35 px-4 py-1 text-[12px]"
                      : "text-[14px]"
                  } whitespace-nowrap py-1 rounded-full hover:text-white transition-colors`}
                >
                  {item}
                </p>
              </div>
            ))}
        </div>
        <div className="flex overflow-x-scroll px-3 gap-5 remove-scrollbar items-center">
          {filteredTags &&
            filteredTags.length &&
            filteredTags[0]?.year?.map((item: any, index: any) => (
              <div
                className="relative"
                key={item}
                ref={year === item ? selectedYearRef1 : null}
              >
                <p
                  onClick={() => dispatch(setYear(item))}
                  className={`${
                    year === item
                      ? "bg-gray-500/35 px-4 py-1 text-[12px]"
                      : "text-[14px]"
                  } whitespace-nowrap py-1 rounded-full hover:text-white transition-colors`}
                >
                  {item}
                </p>
              </div>
            ))}
        </div>
      </div>
      <div ref={secondDivRef} className="sticky top-0"></div>
    </>
  );
};

export default withFilterTag(FilterByTag);
