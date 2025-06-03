// import React, { useEffect, useRef, useState } from "react";
// import InfiniteScroll from "react-infinite-scroll-component";
// import nodata from "../../assets/nodata.png";

// import { useGetHeaderTopicsQuery } from "../../services/helperService";

// import Movies from "./Movies";
// import axios from "axios";
// import MovieCard from "./MovieCard";
// import { useDispatch, useSelector } from "react-redux";
// import Loader from "../../pages/search/components/Loader";
// import FilterByTag from "./FilterByTag";
// import {
//   setSort,
//   setClass,
//   setArea,
//   setYear,
//   setSortName,
// } from "../../pages/home/slice/HomeSlice";
// import NewAds from "../NewAds";
// import { convertToSecureUrl } from "../../services/newEncryption";
// import { useGetFilteredDataQuery } from "../../pages/home/services/homeApi";
// import { setIsShowMenu } from "../../features/counter/counterSlice";

// const FilteredByType = () => {
//   const activeTab = useSelector((state: any) => state.home.activeTab);
//   const [movieData, setMovieData] = useState<any>([]);
//   const [totalData, setTotalData] = useState<any>(null);
//   const [hasMore, setHasMore] = useState(true);
//   const [pageSize, setPageSize] = useState(30);
//   const [page, setPage] = useState(1);
//   const [page2, setPage2] = useState(2);
//   // const [isLoading, setIsLoading] = useState(false);
//   const sort = useSelector((state: any) => state.home.sort);
//   const sortName = useSelector((state: any) => state.home.sortName);
//   const classData = useSelector((state: any) => state.home.class);
//   const area = useSelector((state: any) => state.home.area);
//   const year = useSelector((state: any) => state.home.year);
//   const isShowMenu = useSelector((state: any) => state.counter.isShowMenu);

//   const [nomoredata, setNomoredata] = useState(false);
//   const dispatch = useDispatch();

//   const { data, isFetching, isLoading } = useGetFilteredDataQuery({
//     id: activeTab,
//     sort,
//     classData,
//     area,
//     year,
//     page,
//     pageSize,
//   });
//   useEffect(() => {
//     if (data?.data?.list?.length) {
//       setMovieData(data?.data?.list);
//       setTotalData(data?.data?.total);
//     }
//   }, [data]);
//   const settings = JSON.parse(localStorage.getItem("movieAppSettings") || "{}");

//   // Set the X-Client-Setting header dynamically
//   const headers = {
//     "X-Client-Setting": JSON.stringify({
//       "pure-mode": settings.filterToggle ? 1 : 0,
//     }),
//   };

//   const fetchData = async () => {
//     setPage2((prev) => prev + 1);
//     const { data } = await axios.get(
//       convertToSecureUrl(
//         `${process.env.REACT_APP_API_URL}/movie/screen/list?type_id=${activeTab}&&sort=${sort}&&class=${classData}&&area=${area}&&year=${year}&&pageSize=${pageSize}&&page=${page2}`
//       ),
//       { headers }
//     );
//     setMovieData((prev: any) => [...prev, ...data?.data?.list]);
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     setPage(1);
//     setPage2(2);
//   }, [sort, area, year, classData]);

//   useEffect(() => {
//     if (totalData <= movieData?.length) {
//       setHasMore(false);
//     } else {
//       setHasMore(true);
//     }
//   }, [totalData, movieData]);

//   const prevTabRef = useRef(activeTab);

//   // useEffect(() => {
//   //   if (prevTabRef.current !== activeTab) {
//   //     dispatch(setSort("by_default"));
//   //     dispatch(setSortName("综合"));
//   //     dispatch(setClass("类型"));
//   //     dispatch(setArea("地区"));
//   //     dispatch(setYear("年份"));
//   //     prevTabRef.current = activeTab;
//   //   }
//   // }, [activeTab]);

//   return (
//     <>
//       <div className="home-bg"></div>
//       {isShowMenu ? (
//         <div
//           onClick={() => dispatch(setIsShowMenu(false))}
//           className="bg-[#00000080] z-20 fixed top-0 left-0 w-full h-screen"
//         ></div>
//       ) : (
//         <></>
//       )}
//       <div className=" mt-[100px] text-text min-h-screen">
//         <div className="">
//           <FilterByTag paddingTop="pt-5" />
//           <div className="mt-5">
//             <NewAds section="topic_movies_top" />
//           </div>
//           {isFetching || isLoading ? (
//             <div className="mt-10 flex justify-center items-center w-full">
//               <Loader />
//             </div>
//           ) : movieData?.length ? (
//             <>
//               <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 pl-3 lg:grid-cols-8 gap-y-5 gap-2 mt-0 pt-5 pb-20 px-3">
//                 {movieData?.map((movie: any) => (
//                   <div key={movie?.id} className="mx-auto w-full">
//                     <MovieCard movie={movie} height={"200px"} />
//                   </div>
//                 ))}
//               </div>
//               <InfiniteScroll
//                 dataLength={movieData.length}
//                 next={fetchData}
//                 hasMore={hasMore}
//                 endMessage={
//                   <div className="flex bg-background justify-center items-center w-full py-5">
//                     <p style={{ textAlign: "center" }}>
//                       <b>快关注你喜欢的贴子吧！</b>
//                     </p>
//                   </div>
//                 }
//                 loader={
//                   <div className="flex justify-center items-center w-full pb-0">
//                     <Loader />
//                   </div>
//                 }
//               >
//                 <></>
//               </InfiniteScroll>
//             </>
//           ) : (
//             <div className="text-center flex justify-center flex-col items-center w-full pt-32 px-3">
//               <img src={nodata} className="w-[110px]" alt="" />
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default FilteredByType;

import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import nodata from "../../assets/nodata.png";

import { useGetHeaderTopicsQuery } from "../../services/helperService";

import Movies from "./Movies";
import axios from "axios";
import MovieCard from "./MovieCard";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../pages/search/components/Loader";
import FilterByTag from "./FilterByTag";
import {
  setSort,
  setClass,
  setArea,
  setYear,
  setSortName,
} from "../../pages/home/slice/HomeSlice";
import NewAds from "../NewAds";
import { convertToSecureUrl } from "../../services/newEncryption";
import { useGetFilteredDataQuery } from "../../pages/home/services/homeApi";
import { setIsShowMenu } from "../../features/counter/counterSlice";
import { setPage2 } from "../../context/homeMovieSlice";
import { appendMovieData } from "../../context/homeMovieSlice";
import { setScrollPosition } from "../../context/homeMovieSlice";
import { setMovieData } from "../../context/homeMovieSlice";

const FilteredByType = () => {
  const activeTab = useSelector((state: any) => state.home.activeTab);
  // Get state from Redux
  const { movieData, page2, scrollPosition } = useSelector(
    (state: any) => state.homemovie
  );

  // const [isLoading, setIsLoading] = useState(false);
  const sort = useSelector((state: any) => state.home.sort);
  const sortName = useSelector((state: any) => state.home.sortName);
  const classData = useSelector((state: any) => state.home.class);
  const area = useSelector((state: any) => state.home.area);
  const year = useSelector((state: any) => state.home.year);
  const isShowMenu = useSelector((state: any) => state.counter.isShowMenu);

  // Local state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalData, setTotalData] = useState<any>(null);
  const [pageSize] = useState(30);
  const isInitialLoad = useRef(true);
  const isChanged = useRef(false);
  const scrollRef = useRef<number>(0); // Add a ref to track scroll position

  const dispatch = useDispatch();

  const { data, isFetching, isLoading } = useGetFilteredDataQuery({
    id: activeTab,
    sort,
    classData,
    area,
    year,
    page,
    pageSize,
  });

  const settings = JSON.parse(localStorage.getItem("movieAppSettings") || "{}");

  // Set the X-Client-Setting header dynamically
  const headers = {
    "X-Client-Setting": JSON.stringify({
      "pure-mode": settings.filterToggle ? 1 : 0,
    }),
  };
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY !== 0) {
  //       scrollRef.current = window.scrollY; // Update ref on scroll
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll, { passive: true });

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);

  //     // Save the ref value which is always up-to-date
  //     if (!isInitialLoad.current) {
  //       sessionStorage.setItem(
  //         "filterMovieScrollPosition1",
  //         scrollRef.current.toString()
  //       );
  //     }
  //   };
  // }, []); // Only depend on isInitialLoad

  // useEffect(() => {
  //   const savedPosition = sessionStorage.getItem("filterMovieScrollPosition1");

  //   if (savedPosition) {
  //     const position = parseInt(savedPosition);
  //     const restore = () => {
  //       window.scrollTo({
  //         top: position,
  //         behavior: "auto",
  //       });
  //       sessionStorage.removeItem("filterMovieScrollPosition1");
  //       isInitialLoad.current = false; // Update the ref
  //     };

  //     const timer = setTimeout(restore, 10);
  //     return () => clearTimeout(timer);
  //   } else {
  //     isInitialLoad.current = false;
  //   }
  // }, []);

  const prevFilters = useRef({ sort, area, year, classData, activeTab });
  // 1. Handle filter changes and data fetching
  useEffect(() => {
    const filtersChanged =
      sort !== prevFilters.current.sort ||
      area !== prevFilters.current.area ||
      year !== prevFilters.current.year ||
      classData !== prevFilters.current.classData ||
      activeTab !== prevFilters.current.activeTab;

    if (filtersChanged) {
      setPage(1);
      dispatch(setPage2(2));

      window.scrollTo({
        top: 0,
        behavior: "auto",
      });

      isChanged.current = true;

      // Reset movieData immediately when filters change
      dispatch(setMovieData([]));

      prevFilters.current = { sort, area, year, classData, activeTab };
    }
  }, [sort, area, year, classData, activeTab, dispatch]);

  // 2. Handle incoming data separately
  useEffect(() => {
    if (!data?.data?.list.length) return;

    // If page is 1 (meaning fresh data), set the movieData
    if (
      data?.data?.list.length &&
      (movieData.length === 0 || isChanged.current)
    ) {
      dispatch(setMovieData(data.data.list));
      setTotalData(data.data.total);
      isChanged.current = false;
    }

    // If we have existing data and page > 1, this would be for infinite scroll
    // (though your infinite scroll seems to use a different endpoint)
  }, [data, dispatch]);

  const fetchData = async () => {
    const nextPage = page2 + 1;
    dispatch(setPage2(nextPage));

    const { data } = await axios.get(
      convertToSecureUrl(
        `${process.env.REACT_APP_API_URL}/movie/screen/list?type_id=${activeTab}&&sort=${sort}&&class=${classData}&&area=${area}&&year=${year}&&pageSize=${pageSize}&&page=${page2}`
      ),
      { headers }
    );
    dispatch(appendMovieData(data?.data?.list || []));
  };

  useEffect(() => {
    if (totalData !== null && movieData.length >= totalData) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [totalData, movieData]);

  const prevTabRef = useRef(activeTab);

  useEffect(() => {
    if (prevTabRef.current !== activeTab) {
      dispatch(setSort("by_default"));
      dispatch(setSortName("综合"));
      dispatch(setClass("类型"));
      dispatch(setArea("地区"));
      dispatch(setYear("年份"));
      prevTabRef.current = activeTab;
    }
  }, [activeTab]);

  return (
    <>
      <div className="home-bg"></div>
      {isShowMenu ? (
        <div
          onClick={() => dispatch(setIsShowMenu(false))}
          className="bg-[#00000080] z-20 fixed top-0 left-0 w-full h-screen"
        ></div>
      ) : (
        <></>
      )}
      <div className=" mt-[100px] text-text min-h-screen">
        <div className="">
          <FilterByTag paddingTop="pt-5" />
          <div className="mt-5">
            <NewAds section="topic_movies_top" />
          </div>
          {isFetching || isLoading ? (
            <div className="mt-10 flex justify-center items-center w-full">
              <Loader />
            </div>
          ) : movieData?.length ? (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 pl-3 lg:grid-cols-8 gap-y-2 gap-2 mt-0 pt-5 pb-20 px-3">
                {movieData?.map((movie: any, index: any) => (
                  <div key={index} className="mx-auto w-full">
                    <MovieCard movie={movie} height={"200px"} />
                  </div>
                ))}
              </div>
              <InfiniteScroll
                dataLength={movieData.length}
                next={fetchData}
                hasMore={hasMore}
                endMessage={
                  <div className="flex bg-background justify-center items-center w-full py-5">
                    <p style={{ textAlign: "center" }}>
                      <b>快关注你喜欢的贴子吧！</b>
                    </p>
                  </div>
                }
                loader={
                  <div className="flex justify-center items-center w-full pb-0">
                    <Loader />
                  </div>
                }
              >
                <></>
              </InfiniteScroll>
            </>
          ) : (
            <div className="text-center flex justify-center flex-col items-center w-full pt-32 px-3">
              <img src={nodata} className="w-[110px]" alt="" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FilteredByType;
