// import { FC, useEffect, useState } from "react";
// import downh from "../assets/downh.svg";
// import { useNavigate } from "react-router-dom";
// import { useGetHeaderTopicsQuery } from "../../src/services/helperService";
// import { useDispatch, useSelector } from "react-redux";
// import { setActiveTab } from "../../src/pages/home/slice/HomeSlice";
// import { setShowFilterTag } from "../../src/features/counter/counterSlice";
// import FilterByTag from "./home/FilterByTag";

// const Header: FC = () => {
//   const { data } = useGetHeaderTopicsQuery();
//   const [isShowMenu, setIsShowMenu] = useState(false);
//   const configData = data?.data?.index_top_nav;
//   const activeTab = useSelector((state: any) => state.home.activeTab);
//   const sortData = useSelector((state: any) => state.home.sort);
//   const sortName = useSelector((state: any) => state.home.sortName);
//   const classData = useSelector((state: any) => state.home.class);
//   const area = useSelector((state: any) => state.home.area);
//   const year = useSelector((state: any) => state.home.year);
//   const showFilterTag = useSelector(
//     (state: any) => state.counter.showFilterTag
//   );
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const filterTagHandler = () => {
//     // dispatch(setShowFilterTag(false));
//     setIsShowMenu(true);
//     // window.scrollTo(0, 0);
//   };

//   useEffect(() => {
//     if (!showFilterTag) {
//       setIsShowMenu(false);
//     }
//   }, [showFilterTag]);

//   useEffect(() => {
//     dispatch(setShowFilterTag(false));
//     window.scrollTo(0, 0);
//   }, [classData, area, year, activeTab, sortData, sortName]);

//   return (
//     <header
//       className={`w-full z-[99999] fixed top-0 gradient-bg-home pt-4 pb-2`}
//     >
//       <div className="flex items-center px-3 gap-3">
//         {/* <div className="flex items-center gap-1"> */}
//         {/* <img src={logo} alt="" />{" "} */}
//         {/* <span style={{ color: "white", fontWeight: "bold" }}>电影猪手</span> */}
//         {/* </div> */}
//         <div className="flex-1 relative">
//           <input
//             onFocus={() => navigate("/search_overlay")}
//             placeholder="觉醒年代"
//             type="text"
//             className="rounded-[18.138px] home-input py-[8.062px] px-[16.123px] w-full text-white outline-none"
//           />
//           <div className="absolute top-2 right-2">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="21"
//               height="22"
//               viewBox="0 0 21 22"
//               fill="none"
//             >
//               <path
//                 d="M14.0482 14.0737L17 17.0248L16.0248 18L13.0737 15.0482C11.9757 15.9285 10.6099 16.4072 9.20262 16.4052C5.77877 16.4052 3 13.6265 3 10.2026C3 6.77877 5.77877 4 9.20262 4C12.6265 4 15.4052 6.77877 15.4052 10.2026C15.4072 11.6099 14.9285 12.9757 14.0482 14.0737ZM12.6657 13.5624C13.5404 12.6629 14.0289 11.4572 14.0269 10.2026C14.0269 7.53687 11.8677 5.37836 9.20262 5.37836C6.53687 5.37836 4.37836 7.53687 4.37836 10.2026C4.37836 12.8677 6.53687 15.0269 9.20262 15.0269C10.4572 15.0289 11.6629 14.5404 12.5624 13.6657L12.6657 13.5624Z"
//                 fill="white"
//                 fillOpacity="0.6"
//               />
//             </svg>
//           </div>
//         </div>
//       </div>

//       <div className="w-full">
//         <nav className="flex overflow-x-scroll px-3 gap-3 remove-scrollbar items-center md:justify-between">
//           {configData?.map((item: any, index: any) => (
//             <div
//               className="relative"
//               onClick={() => dispatch(setActiveTab(item?.id))}
//               key={item.id}
//             >
//               <p
//                 className={`${
//                   activeTab === item?.id
//                     ? "text-white font-bold text-[24px]"
//                     : "text-white/80 text-[16px]"
//                 } whitespace-nowrap py-2 rounded-lg hover:text-white transition-colors`}
//               >
//                 {item?.name}
//               </p>
//             </div>
//           ))}
//         </nav>
//       </div>

//       <>
//         {/* <FilterByTag
//           data={filteredTags}
//           sort={data?.data?.movie_screen?.sort}
//         /> */}
//       </>
//       <div className="w-full flex items-center justify-center text-white">
//         {activeTab !== 0 ? (
//           <>
//             {showFilterTag && (
//               <div
//                 className={`text-white text-[14px] ${
//                   isShowMenu ? "hidden" : "flex"
//                 } items-center gap-1 transition`}
//                 onClick={filterTagHandler}
//               >
//                 <span>
//                   {sortName} . {classData} . {area} . {year}
//                   {/* {showFilterTag ? '1111' : '0000'} */}
//                 </span>
//                 <img src={downh} alt="" />
//               </div>
//             )}
//             {isShowMenu ? <FilterByTag /> : <></>}
//           </>
//         ) : (
//           <></>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;

import { FC, useEffect, useState } from "react";
import downh from "../assets/downh.svg";
import { useNavigate } from "react-router-dom";
import { useGetHeaderTopicsQuery } from "../../src/services/helperService";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../../src/pages/home/slice/HomeSlice";
import {
  setIsShowMenu,
  setShowFilterTag,
} from "../../src/features/counter/counterSlice";
import FilterByTag from "./home/FilterByTag";

const Header: FC = () => {
  const { data } = useGetHeaderTopicsQuery();
  // const [isShowMenu, setIsShowMenu] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true); // State to track header visibility

  const configData = data?.data?.index_top_nav;

  const activeTab = useSelector((state: any) => state.home.activeTab);
  const sortData = useSelector((state: any) => state.home.sort);
  const sortName = useSelector((state: any) => state.home.sortName);
  const classData = useSelector((state: any) => state.home.class);
  const area = useSelector((state: any) => state.home.area);
  const year = useSelector((state: any) => state.home.year);
  const isShowMenu = useSelector((state: any) => state.counter.isShowMenu);
  const showFilterTag = useSelector(
    (state: any) => state.counter.showFilterTag
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const filterTagHandler = () => {
    dispatch(setIsShowMenu(true));
  };

  useEffect(() => {
    if (!showFilterTag) {
      dispatch(setIsShowMenu(false));
    }
  }, [showFilterTag]);

  useEffect(() => {
    dispatch(setShowFilterTag(false));
    window.scrollTo(0, 0);
  }, [classData, area, year, activeTab, sortData, sortName]);

  // Scroll event listener to detect scroll direction
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        // Scrolling down, hide the header
        setIsHeaderVisible(false);
      } else if (window.scrollY < lastScrollY) {
        // Scrolling up, show the header
        setIsHeaderVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header
      // className={`w-full z-[99999] fixed  gradient-bg-home pt-4 pb-2 transition-all duration-300 ${
      //   isHeaderVisible ? "top-0" : "-top-[135px]"
      // }`}
      className={`w-full z-[99999] fixed  gradient-bg-home pt-4 pb-2 transition-all duration-300 top-0`}
    >
      <div className="flex items-center px-3 gap-3">
        <div className="flex-1 relative">
          <input
            onFocus={() => navigate("/search_overlay")}
            placeholder="觉醒年代"
            type="text"
            className="rounded-[18.138px] home-input py-[8.062px] px-[16.123px] w-full text-white outline-none"
          />
          <div className="absolute top-2 right-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="22"
              viewBox="0 0 21 22"
              fill="none"
            >
              <path
                d="M14.0482 14.0737L17 17.0248L16.0248 18L13.0737 15.0482C11.9757 15.9285 10.6099 16.4072 9.20262 16.4052C5.77877 16.4052 3 13.6265 3 10.2026C3 6.77877 5.77877 4 9.20262 4C12.6265 4 15.4052 6.77877 15.4052 10.2026C15.4072 11.6099 14.9285 12.9757 14.0482 14.0737ZM12.6657 13.5624C13.5404 12.6629 14.0289 11.4572 14.0269 10.2026C14.0269 7.53687 11.8677 5.37836 9.20262 5.37836C6.53687 5.37836 4.37836 7.53687 4.37836 10.2026C4.37836 12.8677 6.53687 15.0269 9.20262 15.0269C10.4572 15.0289 11.6629 14.5404 12.5624 13.6657L12.6657 13.5624Z"
                fill="white"
                fillOpacity="0.6"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="w-full">
        <nav className="flex overflow-x-scroll px-3 gap-3 remove-scrollbar items-center md:justify-between">
          {configData?.map((item: any, index: any) => (
            <div
              className="relative"
              onClick={() => dispatch(setActiveTab(item?.id))}
              key={item.id}
            >
              <p
                className={`${
                  activeTab === item?.id
                    ? "text-white font-bold text-[24px]"
                    : "text-white/80 text-[16px]"
                } whitespace-nowrap py-2 rounded-lg hover:text-white transition-colors`}
              >
                {item?.name}
              </p>
            </div>
          ))}
        </nav>
      </div>

      <div className="w-full flex items-center justify-center text-white">
        {activeTab !== 0 ? (
          <>
            {showFilterTag && (
              <div
                className={`text-white text-[14px] ${
                  isShowMenu ? "hidden" : "flex"
                } items-center gap-1 transition`}
                onClick={filterTagHandler}
              >
                <span>
                  {sortName} . {classData} . {area} . {year}
                </span>
                <img src={downh} alt="" />
              </div>
            )}
            {isShowMenu ? <FilterByTag /> : <></>}
          </>
        ) : (
          <></>
        )}
      </div>
    </header>
  );
};

export default Header;
