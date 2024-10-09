import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageWithPlaceholder from "../../../search/components/ImgPlaceholder";

interface Movie {
  id: string;
  name: string;
  last_episodeid: string;
  episode_name: string;
  progress_time: number;
  playedTime: string;
  duration: any;
  cover: string;
}

interface MainProps {
  isEditMode: boolean;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}

const Main: React.FC<MainProps> = ({
  isEditMode,
  setIsEditMode,
  movies,
  setMovies,
}) => {
  const [selectedMovies, setSelectedMovies] = useState<any[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const handleMovieSelect = (movieId: string) => {
    setSelectedMovies((prevSelected) =>
      prevSelected.includes(movieId)
        ? prevSelected.filter((id) => id !== movieId)
        : [...prevSelected, movieId]
    );
  };

  const updateLocalStorageAfterDelete = (updatedMovies: any[]) => {
    const watchHistory = localStorage.getItem("lastWatchHistory");
    if (watchHistory) {
      const parsedData = JSON.parse(watchHistory);
      updatedMovies.forEach((movieId) => {
        Object.keys(parsedData).forEach((key) => {
          if (parsedData[key].movieId === movieId) {
            delete parsedData[key]; // Delete the entry if the movieId matches
          }
        });
      });

      // Save the updated data back to localStorage
      localStorage.setItem("lastWatchHistory", JSON.stringify(parsedData));
    }
  };

  const confirmDelete = () => {
    const updatedMovies = movies.filter(
      (movie) => !selectedMovies.includes(movie.id)
    );
    setMovies(updatedMovies);
    setSelectedMovies([]);
    setIsEditMode(false);
    setShowConfirmation(false);

    // Update localStorage after movies are deleted
    updateLocalStorageAfterDelete(selectedMovies);
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  // Calculate view percentage
  const calculateViewPercentage = (progress_time: number, duration: number) => {
    if (duration && progress_time) {
      return ((progress_time / duration) * 100).toFixed(2); // Display up to 2 decimal points
    }
    return "0";
  };

  return (
    <div className="bg-[#161619] mt-[60px]  pb-[50px]">
      <div className="">
        {/* <div className="flex items-center justify-between bg-[#1B1B1F] px-5 py-1">
          <div className="history-text">Today</div>
          <div className="flex gap-2 items-center">
            <p className="filter-text">Filter the watched videos</p>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filterToggle}
                onChange={handleToggle}
                className="sr-only peer"
              />
              <div
                className={`w-9 h-5 bg-[#606060] hover:bg-[#606060] peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${
                  filterToggle
                    ? "peer-checked:bg-[#F54100] hover:peer-checked:bg-[#F54100]"
                    : "peer-checked:bg-[#606060]"
                }`}
              ></div>
            </label>
          </div>
        </div> */}

        <div className="py-3">
          {/* Movie Cards */}
          {movies.map((movie, index) => (
            <div
              key={index}
              className="history-card transition-all duration-300 ease-in-out"
              onClick={(e) => {
                if (isEditMode) {
                  // In edit mode, allow selection
                  if (!(e.target as HTMLElement).closest("input")) {
                    handleMovieSelect(movie.id);
                  }
                } else {
                  // Not in edit mode, redirect to player
                  navigate(`/player/${movie.id}`);
                }
              }}
            >
              {/* Checkbox for Edit Mode */}
              <div
                className={`custom-checkbox transition-transform duration-300 ease-in-out transform ${
                  isEditMode ? "translate-x-3" : "-translate-x-[50px]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedMovies.includes(movie.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleMovieSelect(movie.id);
                  }}
                  className="h-5 w-5 text-[#F54100] border-2 border-gray-600 rounded-full focus:ring-0 focus:outline-none"
                />
              </div>

              <div
                className={` transition-transform flex items-center justify-between  duration-300 ease-in-out transform ${
                  isEditMode ? "translate-x-[25px]" : "translate-x-0"
                } `}
              >
                <div className="relative">
                  <ImageWithPlaceholder
                    src={movie?.cover}
                    alt={`Picture of ${movie?.name}`}
                    width={116}
                    height={80}
                    className="rounded-md w-[116px] h-[80px] object-cover object-center"
                  />

                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent rounded-sm"></div>

                  <div className="absolute bottom-1 text-[10px] left-1 z-10">
                    {movie?.episode_name}
                  </div>
                </div>

                <div className="flex justify-between w-full ml-5">
                  <div>
                    <h1 className="text-[16px] font-semibold">{movie.name}</h1>
                    <p className="text-sm text-gray-400 mt-1">
                      ep {movie.episode_name}, Viewed
                      <span>
                        {" "}
                        {calculateViewPercentage(
                          movie.progress_time,
                          movie.duration
                        )}
                        %
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`fixed z-10 bottom-0 gap-3 w-full bg-[#1B1B1F] p-6 flex justify-between items-center transition-transform duration-300 ease-in-out ${
            isEditMode ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <button
            className="w-[50%] cancel-all"
            onClick={() => setSelectedMovies([])}
          >
            Cancel all
          </button>
          <button
            className="delete-all w-[50%]"
            onClick={handleDelete}
            disabled={selectedMovies.length === 0}
          >
            Delete {selectedMovies.length > 0 && `${selectedMovies.length}`}
          </button>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 z-20 bg-black bg-opacity-80 flex justify-center items-center">
            <div className="bg-[#242428] confirm rounded-2xl mx-10 text-center shadow-lg">
              <h2 className="p-5">
                Are you sure you want to clear all History?
              </h2>
              <div className="flex justify-between">
                <button
                  className="text-white w-[50%] p-3 border-t-[1px] border-r-[1px] border-gray-500"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
                <button
                  className="text-[#f54100] w-[50%] p-3 border-t-[1px] border-gray-500"
                  onClick={confirmDelete}
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
