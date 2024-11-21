import React from "react";

const ExplorerTags = ({
  configData,
  dispatch,
  setSort,
  setSortName,
  sort,
  filteredTags,
  classData,
  selectedClassRef,
  setActiveClass,
  setClass,
  activeClass,
  area,
  selectedAreaRef,
  setActiveArea,
  setArea,
  activeArea,
  year,
  selectedYearRef,
  setActiveYear,
  setYear,
  activeYear,
}: any) => {
  return (
    <>
      <div className="flex overflow-x-scroll px-3 gap-5 remove-scrollbar items-center">
        {configData?.data?.movie_search_screen?.sort?.map(
          (item: any, index: any) => (
            <div className="relative" key={index}>
              <p
                onClick={() => {
                  dispatch(setSort(item?.value));
                  dispatch(setSortName(item?.name));
                }}
                className={`${
                  sort === item?.value
                    ? "bg-gray-500/35 px-4 py-1 text-[14px]"
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
        {filteredTags?.map(
          (data: any) =>
            data?.class &&
            data?.class?.map((item: any, index: any) => (
              <div
                className="relative"
                key={item}
                ref={classData === item ? selectedClassRef : null}
              >
                <p
                  onClick={() => {
                    setActiveClass(index);
                    dispatch(setClass(item));
                  }}
                  className={`${
                    classData
                      ? classData === item
                        ? "bg-gray-500/35 px-4 py-1 text-[14px]"
                        : "text-[14px]"
                      : activeClass === index
                      ? "bg-gray-500/35 px-4 py-1 text-[14px]"
                      : "text-[14px]"
                  } whitespace-nowrap py-1 rounded-full hover:text-white transition-colors`}
                >
                  {item}
                </p>
              </div>
            ))
        )}
      </div>
      <div className="flex overflow-x-scroll px-3 gap-5 remove-scrollbar items-center">
        {filteredTags?.map(
          (data: any) =>
            data?.area &&
            data?.area?.map((item: any, index: any) => (
              <div
                className="relative"
                key={item}
                ref={area === item ? selectedAreaRef : null}
              >
                <p
                  onClick={() => {
                    setActiveArea(index);
                    dispatch(setArea(item));
                  }}
                  className={`${
                    area
                      ? area === item
                        ? "bg-gray-500/35 px-4 py-1 text-[14px]"
                        : "text-[14px]"
                      : activeArea === index
                      ? "bg-gray-500/35 px-4 py-1 text-[14px]"
                      : "text-[14px]"
                  } whitespace-nowrap py-1 rounded-full hover:text-white transition-colors`}
                >
                  {item}
                </p>
              </div>
            ))
        )}
      </div>
      <div className="flex overflow-x-scroll px-3 gap-5 remove-scrollbar items-center">
        {filteredTags?.map(
          (data: any) =>
            data?.year &&
            data?.year?.map((item: any, index: any) => (
              <div
                className="relative"
                key={item}
                ref={year === item ? selectedYearRef : null}
              >
                <p
                  onClick={() => {
                    setActiveYear(index);
                    dispatch(setYear(item));
                  }}
                  className={`${
                    year
                      ? year === item
                        ? "bg-gray-500/35 px-4 py-1 text-[14px]"
                        : "text-[14px]"
                      : activeYear === index
                      ? "bg-gray-500/35 px-4 py-1 text-[14px]"
                      : "text-[14px]"
                  } whitespace-nowrap py-1 rounded-full hover:text-white transition-colors`}
                >
                  {item}
                </p>
              </div>
            ))
        )}
      </div>
    </>
  );
};

export default ExplorerTags;
