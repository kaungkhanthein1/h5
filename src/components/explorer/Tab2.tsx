import { useEffect, useState } from "react";
import { useGetWeeklyMoviesQuery } from "../../pages/explorer/services/explorerAPi";
import MovieCard from "./MovieCard";
import { Link } from "react-router-dom";

const Tab2 = () => {
  const [currentIndex, setCurrentIndex] = useState<any>(null);
  const [movieData, setMovieData] = useState([]);

  const getMovieData = async (week: any) => {
    const res = await fetch(
      `https://cc3e497d.qdhgtch.com:2345/api/v1/movie/weekly?week_day=${week}`
    );
    const data = await res.json();
    setMovieData(data?.data);
    console.log(data);
  };

  const today = new Date();
  const currentDate = today.getDate(); // Get only the day of the month
  console.log(currentDate);
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

  useEffect(() => {
    let index = -1;
    for (let i = 0; i < currentWeekDates.length; i++) {
      if (currentWeekDates[i] === currentDate) {
        index = i;
        break; // Stop the loop once we find the element
      }
    }
    setCurrentIndex(index + 1);
    getMovieData(index + 1);
  }, [currentDate]);

  useEffect(() => {
    getMovieData(currentIndex);
  }, [currentIndex]);

  console.log(currentIndex, "ci");

  return (
    <div className="pb-32 min-h-screen">
      <nav className="py-4">
        <div className="grid grid-cols-7 mb-2">
          {currentWeekDates?.map((date, index) => (
            <button
              key={date}
              className={`text-white text-[16px] text-center`}
              onClick={() => setCurrentIndex(index + 1)}
            >
              <span
                className={`${
                  currentDate === date && "bg-gray-700 px-1.5 py-1 rounded-full"
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
              onClick={() => setCurrentIndex(index + 1)}
              className={`${
                currentIndex === index + 1 ? "text-white" : "text-[#FFFFFF99]"
              } text-[14px] text-center`}
            >
              {day}
            </button>
          ))}
        </div>
      </nav>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 px-3">
        {movieData?.map((list: any) => (
          <Link
            to={`/player/${list?.id}`}
            key={list?.id}
            // onClick={() => handleMovieClick(list.id)}
            className="mx-auto"
          >
            <MovieCard movie={list} height={"200px"} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Tab2;

const Card = () => {
  return (
    <div className="w-full">
      <div className="relative w-full h-[180px] md:h-[220px] lg:h-[280px]">
        <img
          src="https://i.pinimg.com/236x/f2/c8/88/f2c8885af2052f299015347504ea93d2.jpg"
          alt=""
          className="rounded-[4px] w-full h-full object-cover object-center"
        />
        <div className="w-full flex items-center justify-between text-[10px] text-white absolute bottom-3 px-2">
          <p>37集全</p>
          <p>电视剧</p>
        </div>
      </div>
      <p className="text-[14px] text-white truncate">爱,死亡,机器人</p>
    </div>
  );
};
