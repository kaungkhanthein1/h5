// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useGetHeaderTopicsQuery } from "../../services/helperService";
// import MovieCard from "../home/MovieCard";
// import Loader from "../../pages/search/components/Loader";
// import FilterTag from "./FilterTag";
// import { Link } from "react-router-dom";
// import InfiniteScroll from "react-infinite-scroll-component";
// import nodata from "../../assets/nodata.png";
// import {
//   setActiveTab,
//   setArea,
//   setClass,
//   setSort,
//   setSortName,
//   setYear,
// } from "../../pages/explorer/slice/ExploreSlice";
// import { convertToSecureUrl } from "../../services/newEncryption";
// import { useGetFilteredDataQuery } from "../../pages/home/services/homeApi";
// import NewAds from "../NewAds";
// import { setShowMenu } from "../../features/counter/counterSlice";
// const FilterMovie = () => {
//   // const [isLoading, setIsLoading] = useState(false);
//   const [movieData, setMovieData] = useState<any>([]);
//   const dispatch = useDispatch();
//   const activeTab = useSelector((state: any) => state.explore.activeTab);
//   const sort = useSelector((state: any) => state.explore.sort);
//   const classData = useSelector((state: any) => state.explore.class);
//   const area = useSelector((state: any) => state.explore.area);
//   const year = useSelector((state: any) => state.explore.year);
//   const [page, setPage] = useState(1);
//   const [page2, setPage2] = useState(2);
//   const [hasMore, setHasMore] = useState(true);
//   const [totalData, setTotalData] = useState<any>(null);
//   const [nomoredata, setNomoredata] = useState(false);
//   const [pageSize, setPageSize] = useState(30);
//   const showMenu = useSelector((state: any) => state?.counter?.showMenu);

//   const {
//     data: configData,
//     isLoading: isloader,
//     isFetching,
//   } = useGetHeaderTopicsQuery();
//   const filteredTags: any = configData?.data?.movie_screen?.filter?.filter(
//     (data: any) => data?.id === activeTab
//   );

//   const {
//     data,
//     isFetching: dataFetching,
//     isLoading,
//   } = useGetFilteredDataQuery({
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
//     // if (data?.data?.list?.length >= 0) {
//     //   setIsLoading(false);
//     // }
//     // setMovieData(movieData.concat(data?.data?.list));
//     setMovieData((prev: any) => [...prev, ...data?.data?.list]);
//   };
//   useEffect(() => {
//     // getMoviesByType(activeTab);
//     window.scrollTo(0, 0);
//     setPage(1);
//     setPage2(2);
//     // setHasMore(true);
//   }, [sort, area, year, classData]);
//   useEffect(() => {
//     if (totalData <= movieData?.length) {
//       setHasMore(false);
//     } else {
//       setHasMore(true);
//     }
//   }, [totalData, movieData]);
//   useEffect(() => {
//     dispatch(setSort("by_default"));
//     dispatch(setSortName("综合"));
//     dispatch(setClass("类型"));
//     dispatch(setArea("地区"));
//     dispatch(setYear("年份"));
//   }, [activeTab]);

//   if (isloader || isFetching) {
//     return null; // Ensure you return null instead of undefined
//   }

//   return (
//     <div className="bg-background text-text min-h-screen relative">
//       {showMenu ? (
//         <div
//           onClick={() => dispatch(setShowMenu(false))}
//           className="bg-[#00000080] z-20 fixed top-0 left-0 w-full h-screen"
//         ></div>
//       ) : (
//         <></>
//       )}
//       <div className="">
//         <FilterTag />
//         <div className="mb-5 -mt-3">
//           <NewAds section="topic_movies_top" />
//         </div>
//         {isLoading || dataFetching ? (
//           <div className="mt-10 flex justify-center items-center w-full">
//             <Loader />
//           </div>
//         ) : movieData?.length ? (
//           <>
//             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 pl-3 lg:grid-cols-8 gap-y-5 gap-2 mt-0 pb-10 px-3">
//               {movieData?.map((movie: any) => (
//                 <div key={movie?.id} className="mx-auto w-full">
//                   <MovieCard movie={movie} height={"200px"} />
//                 </div>
//               ))}
//             </div>
//             <InfiniteScroll
//               dataLength={movieData.length} //This is important field to render the next data
//               next={fetchData}
//               hasMore={hasMore}
//               endMessage={
//                 <div className="flex bg-background justify-center items-center w-full py-5">
//                   <p style={{ textAlign: "center" }}>
//                     <b>快关注你喜欢的贴子吧！</b>
//                   </p>
//                 </div>
//               }
//               loader={
//                 <div className="flex justify-center items-center w-full pb-0">
//                   {/* {hasMore ? <Loader /> : "No More data"} */}
//                   <Loader />
//                 </div>
//               }
//             >
//               <></>
//               {/* {item} */}
//             </InfiniteScroll>
//           </>
//         ) : (
//           <div className="text-center flex justify-center flex-col items-center w-full pt-32 px-3">
//             <img src={nodata} className="w-[110px]" alt="" />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FilterMovie;

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetHeaderTopicsQuery } from "../../services/helperService";
import MovieCard from "../home/MovieCard";
import Loader from "../../pages/search/components/Loader";
import FilterTag from "./FilterTag";
import { useLocation } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import nodata from "../../assets/nodata.png";
import {
  setActiveTab,
  setArea,
  setClass,
  setSort,
  setSortName,
  setYear,
} from "../../pages/explorer/slice/ExploreSlice";
import { convertToSecureUrl } from "../../services/newEncryption";
import { useGetFilteredDataQuery } from "../../pages/home/services/homeApi";
import NewAds from "../NewAds";
import { setShowMenu } from "../../features/counter/counterSlice";
import {
  setMovieData,
  setPage2,
  setScrollPosition,
  appendMovieData,
  resetMovieState,
} from "../../context/movieSlice";

const FilterMovie = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // Get state from Redux
  const { movieData, page2, scrollPosition } = useSelector(
    (state: any) => state.movie
  );

  // Other selectors
  const activeTab = useSelector((state: any) => state.explore.activeTab);
  const sort = useSelector((state: any) => state.explore.sort);
  const classData = useSelector((state: any) => state.explore.class);
  const area = useSelector((state: any) => state.explore.area);
  const year = useSelector((state: any) => state.explore.year);
  const showMenu = useSelector((state: any) => state?.counter?.showMenu);

  // Local state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalData, setTotalData] = useState<any>(null);
  const [pageSize] = useState(30);
  const isInitialLoad = useRef(true);
  const isChanged = useRef(false);
  const scrollRef = useRef<number>(0); // Add a ref to track scroll position

  // console.log(window.scrollY, "window.scrollY");

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
  //         "filterMovieScrollPosition",
  //         scrollRef.current.toString()
  //       );
  //     }
  //   };
  // }, []); // Only depend on isInitialLoad

  // useEffect(() => {
  //   const savedPosition = sessionStorage.getItem("filterMovieScrollPosition");

  //   if (savedPosition) {
  //     const position = parseInt(savedPosition);
  //     const restore = () => {
  //       window.scrollTo({
  //         top: position,
  //         behavior: "auto",
  //       });
  //       sessionStorage.removeItem("filterMovieScrollPosition");
  //       isInitialLoad.current = false; // Update the ref
  //     };

  //     const timer = setTimeout(restore, 10);
  //     return () => clearTimeout(timer);
  //   } else {
  //     isInitialLoad.current = false;
  //   }
  // }, []);

  const {
    data: configData,
    isLoading: isloader,
    isFetching,
  } = useGetHeaderTopicsQuery();

  const {
    data,
    isFetching: dataFetching,
    isLoading,
  } = useGetFilteredDataQuery({
    id: activeTab,
    sort,
    classData,
    area,
    year,
    page,
    pageSize,
  });

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
        `${process.env.REACT_APP_API_URL}/movie/screen/list?type_id=${activeTab}&&sort=${sort}&&class=${classData}&&area=${area}&&year=${year}&&pageSize=${pageSize}&&page=${nextPage}`
      ),
      {
        headers: {
          "X-Client-Setting": JSON.stringify({
            "pure-mode": JSON.parse(
              localStorage.getItem("movieAppSettings") || "{}"
            ).filterToggle
              ? 1
              : 0,
          }),
        },
      }
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

  // useEffect(() => {
  //   console.log("winnnn");
  //   dispatch(setSort("by_default"));
  //   dispatch(setSortName("综合"));
  //   dispatch(setClass("类型"));
  //   dispatch(setArea("地区"));
  //   dispatch(setYear("年份"));
  // }, [activeTab, dispatch]);

  const memoizedFilterTag = React.useMemo(() => <FilterTag />, []);
  const memoizedNewAds = React.useMemo(
    () => <NewAds section="topic_movies_top" />,
    []
  );

  if (isloader || isFetching) {
    return null;
  }

  return (
    <div className="bg-background text-text min-h-screen relative">
      {showMenu && (
        <div
          onClick={() => dispatch(setShowMenu(false))}
          className="bg-[#00000080] z-20 fixed top-0 left-0 w-full h-screen"
        />
      )}
      <div>
        {memoizedFilterTag}
        <div className="mb-5 -mt-3">{memoizedNewAds}</div>
        {isLoading || dataFetching ? (
          <div className="mt-10 flex justify-center items-center w-full">
            <Loader />
          </div>
        ) : movieData?.length ? (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 pl-3 lg:grid-cols-8 gap-y-5 gap-2 mt-0 pb-10 px-3">
              {movieData.map((movie: any, index: number) => (
                <div key={index} className="mx-auto w-full">
                  <MovieCard movie={movie} height="200px" />
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
  );
};

export default FilterMovie;
