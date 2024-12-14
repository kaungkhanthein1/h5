import { useEffect, useState } from "react";
import { useGetWeeklyMoviesQuery } from "../../pages/explorer/services/explorerAPi";
import MovieCard from "../home/MovieCard";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setActiveWeek } from "../../pages/explorer/slice/ExploreSlice";
import Loader from "../../pages/search/components/Loader";
import axios from "axios";
import { convertToSecureUrl } from "../../services/newEncryption";
import NewAds from "../NewAds";

const Tab2 = () => {
  const [currentIndex, setCurrentIndex] = useState<any>(null);
  // const [isLoading, setIsLoading] = useState(false);
  const [movieData, setMovieData] = useState([]);
  const activeWeek = useSelector((state: any) => state.explore.activeWeek);
  const dispatch = useDispatch();
  // console.log(activeWeek, "active week");

  // const getMovieData = async (week: any) => {
  //   // Retrieve settings from localStorage
  //   const settings = JSON.parse(
  //     localStorage.getItem("movieAppSettings") || "{}"
  //   );

  //   // Set the X-Client-Setting header dynamically
  //   const headers = {
  //     "X-Client-Setting": JSON.stringify({
  //       "pure-mode": settings.filterToggle ? 1 : 0,
  //     }),
  //   };
  //   setIsLoading(true);
  //   const { data } = await axios.get(
  //     convertToSecureUrl(
  //       `${process.env.REACT_APP_API_URL}/movie/weekly?week_day=${week}`
  //     ),
  //     { headers }
  //   );
  //   setMovieData(data?.data);
  //   setIsLoading(false);
  //   // console.log(data);
  // };

  const today = new Date();
  const currentDate = today.getDate(); // Get only the day of the month
  // console.log(currentDate);
  function getDatesForCurrentWeek() {
    const today = new Date();
    const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)

    const startOfWeek = new Date(today); // Clone today's date
    startOfWeek.setDate(today.getDate() - currentDay); // Set to Sunday (start of the week)

    const dates = [];

    // Loop to get the date of each day of the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek); // Clone the start date
      date.setDate(startOfWeek.getDate() + i); // Increment by i days
      dates.push(date.getDate()); // Get only the day (date)
    }

    return dates;
  }

  // Usage example:
  const currentWeekDates = getDatesForCurrentWeek();

  const weekdays = ["一", "二", "三", "四", "五", "六", "日"];

  const { data, refetch, isFetching, isLoading } =
    useGetWeeklyMoviesQuery(activeWeek);

  console.log("isLoading is+>,", isFetching);
  useEffect(() => {
    let index = -1;
    for (let i = 0; i < currentWeekDates.length; i++) {
      if (currentWeekDates[i] === currentDate) {
        index = i;
        break; // Stop the loop once we find the element
      }
    }
    dispatch(setActiveWeek(index + 1));
    setCurrentIndex(index + 1);
    // getMovieData(index + 1);
    refetch();
  }, [currentDate]);

  // useEffect(() => {
  //   getMovieData(activeWeek);
  // }, [activeWeek]);

  // console.log(currentIndex, "ci");

  return (
    <div className="pb-32 min-h-screen">
      <nav className="py-4 sticky top-[50px] z-50 bg-background">
        <div className="grid grid-cols-7 mb-2">
          {currentWeekDates?.map((date, index) => (
            <button
              key={date}
              className={`text-white text-[16px] text-center`}
              onClick={() => {
                setCurrentIndex(index + 1);
                dispatch(setActiveWeek(index + 1));
                window.scrollTo(0, 0);
              }}
            >
              <span
                className={`${
                  activeWeek
                    ? activeWeek === index + 1
                      ? "bg-orange-600 px-1.5 py-1 rounded-full"
                      : ""
                    : currentDate === date &&
                      "bg-orange-600 px-1.5 py-1 rounded-full"
                }`}
              >
                {currentDate === date ? "今" : date}
              </span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {weekdays?.map((day, index) => (
            <button
              key={day}
              onClick={() => {
                setCurrentIndex(index + 1);
                dispatch(setActiveWeek(index + 1));
                window.scrollTo(0, 0);
              }}
              className={`${
                activeWeek === index + 1 ? "text-white" : "text-[#FFFFFF99]"
              } text-[14px] text-center`}
            >
              {day}
            </button>
          ))}
        </div>
      </nav>
      <div className="my-3">
        <NewAds section="zhuiju_weektable_under" />
      </div>
      {isFetching ? (
        <div className="flex justify-center items-center mt-10">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 px-3">
          {data?.data?.map((list: any) => (
            <Link
              to={`/player/${list?.id}`}
              key={list?.id}
              // onClick={() => handleMovieClick(list.id)}
              className="mx-auto w-full"
            >
              <MovieCard movie={list} height={"200px"} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tab2;
