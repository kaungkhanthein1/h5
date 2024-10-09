import { useState } from "react";

const FilterByTag = ({ data }: any) => {
  const [activeClass, setActiveClass] = useState(0);
  const [activeYear, setActiveYear] = useState(0);
  const [activeArea, setActiveArea] = useState(0);
  return (
    <div className="w-full gradient-bg-home pt-5 pb-2 flex flex-col gap-3">
      <div className="flex overflow-x-scroll px-3 gap-10 remove-scrollbar items-center">
        {data[0]?.class?.map((item: any, index: any) => (
          <div className="relative" key={index}>
            <p
              onClick={() => setActiveClass(index)}
              className={`${
                activeClass === index
                  ? "bg-black/15 px-3 py-1 text-xs"
                  : "text-[14px]"
              } whitespace-nowrap py-2 rounded-lg hover:text-white transition-colors`}
            >
              {item}
            </p>
          </div>
        ))}
      </div>
      <div className="flex overflow-x-scroll px-3 gap-10 remove-scrollbar items-center">
        {data[0]?.area?.map((item: any, index: any) => (
          <div className="relative" key={index}>
            <p
              onClick={() => setActiveArea(index)}
              className={`${
                activeArea === index
                  ? "bg-black/15 px-3 py-1 text-xs"
                  : "text-[14px]"
              } whitespace-nowrap py-2 rounded-lg hover:text-white transition-colors`}
            >
              {item}
            </p>
          </div>
        ))}
      </div>
      <div className="flex overflow-x-scroll px-3 gap-10 remove-scrollbar items-center">
        {data[0]?.year?.map((item: any, index: any) => (
          <div className="relative" key={index}>
            <p
              onClick={() => setActiveYear(index)}
              className={`${
                activeYear === index
                  ? "bg-black/15 px-3 py-1 text-xs"
                  : "text-[14px]"
              } whitespace-nowrap py-2 rounded-lg hover:text-white transition-colors`}
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
