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
  const [movieData, setMovieData] = useState([]);
  const activeWeek = useSelector((state: any) => state.explore.activeWeek);
  const dispatch = useDispatch();
  const today = new Date();
  const currentDate = today.getDate(); // Get only the day of the month
  const getDatesForCurrentWeek = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)

    const startOfWeek = new Date(today); // Clone today's date
    startOfWeek.setDate(
      today.getDate() - (currentDay === 0 ? 6 : currentDay - 1)
    ); // Set to Monday (start of the week)

    const dates = [];

    // Loop to get the date of each day of the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek); // Clone the start date
      date.setDate(startOfWeek.getDate() + i); // Increment by i days
      dates.push({
        date: date.getDate(),
        day: date.toLocaleDateString(undefined, { weekday: "long" }),
      });
    }

    return dates;
  };

  // Usage example:
  const currentWeekDates = getDatesForCurrentWeek();
  const weekdays2 = [
    { title: "一", value: "Monday" },
    { title: "二", value: "Tuesday" },
    { title: "三", value: "Wednesday" },
    { title: "四", value: "Thursday" },
    { title: "五", value: "Friday" },
    { title: "六", value: "Saturday" },
    { title: "日", value: "Sunday" },
  ];

  const { data, refetch, isFetching, isLoading } =
    useGetWeeklyMoviesQuery(activeWeek);

  useEffect(() => {
    let index = -1;
    for (let i = 0; i < currentWeekDates.length; i++) {
      if (currentWeekDates[i]?.date === currentDate) {
        index = i;
        break; // Stop the loop once we find the element
      }
    }
    dispatch(setActiveWeek(index + 1));
    setCurrentIndex(index + 1);
    // getMovieData(index + 1);
    refetch();
  }, [currentDate]);
  let findDay = (day: any) => {
    let setday = weekdays2.find((item) => item.value === day);
    return setday?.title;
  };

  return (
    <div className="pb-32 min-h-screen">
      <nav className="py-4 sticky top-[50px] z-50 bg-background">
        <div className="grid grid-cols-7 mb-2">
          {currentWeekDates?.map((date, index) => (
            <button
              key={date?.date}
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
                    : currentDate === date?.date &&
                      "bg-orange-600 px-1.5 py-1 rounded-full"
                }`}
              >
                {currentDate === date?.date ? "今" : date?.date}{" "}
              </span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {currentWeekDates?.map((day, index) => (
            <button
              key={day.date}
              onClick={() => {
                setCurrentIndex(index + 1);
                dispatch(setActiveWeek(index + 1));
                window.scrollTo(0, 0);
              }}
              className={`${
                activeWeek === index + 1 ? "text-white" : "text-[#FFFFFFCC]"
              } text-[14px] text-center`}
            >
              {findDay(day.day)}
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
