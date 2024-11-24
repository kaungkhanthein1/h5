import { useEffect, useRef, useState } from "react";
import {
  setActiveTab,
  setArea,
  setClass,
  setSort,
  setSortName,
  setYear,
} from "../../pages/explorer/slice/ExploreSlice";
import { useGetHeaderTopicsQuery } from "../../services/helperService";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import downh from "../../assets/downh.svg";
import ExplorerTags from "./ExplorerTags";

const FilterTag = () => {
  const location = useLocation();
  // const []
  const selectedClassRef = useRef<any>(null);
  const selectedYearRef = useRef<any>(null);
  const selectedAreaRef = useRef<any>(null);
  const [activeClass, setActiveClass] = useState(0);
  const [activeArea, setActiveArea] = useState(0);
  const [activeYear, setActiveYear] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const activeTab = useSelector((state: any) => state?.explore?.activeTab);
  const sort = useSelector((state: any) => state?.explore?.sort);
  const sortName = useSelector((state: any) => state?.explore?.sortName);
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

  const filterTagRef = useRef<any>(null);
  // console.log(filterTagRef?.current.getBoundingClientRect())
  const [show, setShow] = useState(false);
  const filterTagHandler = () => {
    setShowMenu(true);
    setShow(true);
    // window.scrollTo(0, 0);
  };
  useEffect(() => {
    const handleScroll = () => {
      if (filterTagRef.current) {
        const rect = filterTagRef.current.getBoundingClientRect();
        console.log(rect);

        if (rect.top < 100) {
          // dispatch(setShowExploreFilterTag(true));
          setShow(true);
          setShowMenu(false);
        } else {
          // dispatch(setShowExploreFilterTag(false));
          setShow(false);
          // setShowMenu();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Clean up on unmount
    };
  }, []);

  useEffect(() => {
    if (selectedYearRef.current) {
      selectedYearRef.current?.scrollIntoView({
        behavior: "smooth",
        inline: "center", // Ensure horizontal centering
        block: "nearest", // Keep vertical positioning intact
      });
    }
  }, [year]);
  useEffect(() => {
    if (selectedClassRef.current) {
      selectedClassRef.current?.scrollIntoView({
        behavior: "smooth",
        inline: "center", // Ensure horizontal centering
        block: "nearest", // Keep vertical positioning intact
      });
    }
  }, [classData]);

  useEffect(() => {
    if (selectedAreaRef.current) {
      selectedAreaRef.current?.scrollIntoView({
        behavior: "smooth",
        inline: "center", // Ensure horizontal centering
        block: "nearest", // Keep vertical positioning intact
      });
    }
  }, [area]);

  useEffect(() => {
    // if (!show) setShowMenu(!showMenu);
  }, [show]);

  useEffect(() => {
    setShow(false);
    window.scrollTo(0, 0);
  }, [classData, area, year, activeTab, sort, sortName]);

  useEffect(() => {
    dispatch(setSort("by_default"));
    dispatch(setSortName("综合"));
    dispatch(setClass("类型"));
    dispatch(setArea("地区"));
    dispatch(setYear("年份"));
  }, [activeTab]);

  // console.log(show)

  return (
    <>
      <div className="flex flex-col gap-3 py-5">
        <div className="fixed top-[53px] py-3 w-full z-50 bg-background">
          <div className="flex  overflow-x-scroll px-3 gap-6 remove-scrollbar items-center  w-full">
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
          {show ? (
            <>
              <div
                onClick={filterTagHandler}
                className={`mt-3 text-white text-[14px] ${
                  showMenu ? "hidden" : "flex"
                } items-center justify-center gap-1 transition`}
              >
                <span>
                  {sortName} . {classData} . {area} . {year}
                </span>
                <img src={downh} alt="" />
              </div>
            </>
          ) : (
            <></>
          )}
          {showMenu ? (
            <div className="flex flex-col gap-3 py-3">
              <ExplorerTags
                configData={configData}
                dispatch={dispatch}
                setSort={setSort}
                setSortName={setSortName}
                sort={sort}
                filteredTags={filteredTags}
                classData={classData}
                selectedClassRef={selectedClassRef}
                setActiveClass={setActiveClass}
                setClass={setClass}
                activeClass={activeClass}
                area={area}
                selectedAreaRef={selectedAreaRef}
                setActiveArea={setActiveArea}
                setArea={setArea}
                activeArea={activeArea}
                year={year}
                selectedYearRef={selectedYearRef}
                setActiveYear={setActiveYear}
                setYear={setYear}
                activeYear={activeYear}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
        {/* {!showMenu && ( */}

        <div className="mt-5 flex flex-col gap-3 py-5">
          <ExplorerTags
            configData={configData}
            dispatch={dispatch}
            setSort={setSort}
            setSortName={setSortName}
            sort={sort}
            filteredTags={filteredTags}
            classData={classData}
            selectedClassRef={selectedClassRef}
            setActiveClass={setActiveClass}
            setClass={setClass}
            activeClass={activeClass}
            area={area}
            selectedAreaRef={selectedAreaRef}
            setActiveArea={setActiveArea}
            setArea={setArea}
            activeArea={activeArea}
            year={year}
            selectedYearRef={selectedYearRef}
            setActiveYear={setActiveYear}
            setYear={setYear}
            activeYear={activeYear}
          />
        </div>
        {/* )} */}
      </div>
      <div ref={filterTagRef} className="sticky top-0"></div>
    </>
  );
};

export default FilterTag;
