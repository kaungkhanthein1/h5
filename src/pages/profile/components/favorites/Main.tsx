// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { deleteFavData } from "../../../search/slice/FavoriteSlice"; // Adjust path as necessary
// import { useNavigate } from "react-router-dom";
// import Ads from "../../../search/components/Ads";
// import Loader from "../../../search/components/Loader";
// import ImageWithPlaceholder from "../../../search/components/ImgPlaceholder";

// interface MainProps {
//   isEditMode: boolean;
//   setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
//   movies: any[];
//   advert: any;
//   isLoading: boolean;
//   isFetching: boolean;
// }

// const Main: React.FC<MainProps> = ({
//   isEditMode,
//   setIsEditMode,
//   movies,
//   advert,
//   isLoading,
//   isFetching,
// }) => {
//   const navigate = useNavigate();
//   const [selectedMovies, setSelectedMovies] = useState<string[]>([]);
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const dispatch = useDispatch();

//   const handleDelete = () => {
//     setShowConfirmation(true);
//   };

//   const handleMovieSelect = (movie: string) => {
//     setSelectedMovies((prevSelected) =>
//       prevSelected.includes(movie)
//         ? prevSelected.filter((m) => m !== movie)
//         : [...prevSelected, movie]
//     );
//   };

//   const confirmDelete = () => {
//     dispatch(deleteFavData(selectedMovies)); // Dispatch the deletion to Redux store
//     setSelectedMovies([]);
//     setIsEditMode(false);
//     setShowConfirmation(false);
//   };

//   const cancelDelete = () => {
//     setShowConfirmation(false);
//   };

//   const handleMovieClick = (movieId: string) => {
//     if (isEditMode) {
//       handleMovieSelect(movieId); // Select the movie when in edit mode
//     } else {
//       navigate(`/player/${movieId}`);
//     }
//   };

//   return (
//     <div className="bg-[#161619] pb-[50px] mt-[65px] ">
//       <div className="mt-3">
//         {isLoading || isFetching ? (
//           <div className="flex justify-center items-center h-[126px]">
//             <Loader />
//           </div>
//         ) : (
//           <>
//             <Ads advert={advert} />
//           </>
//         )}
//         <div className="py-3 mt-5 fav grid grid-cols-5 max-sm:grid-cols-3 gap-3 gap-y-5 px-3 max-md:grid-cols-5 md:grid-rows-6 lg:grid-cols-6 xl:grid-cols-9">
//           {/* Movie Cards */}
//           {movies.map((movie, index) => (
//             <div
//               key={index}
//               className="flex flex-col gap-2 transition-all duration-300 ease-in-out"
//               onClick={() => handleMovieClick(movie.id)} // Handle click for redirection or selection
//             >
//               <div className="relative transition-transform duration-500 ease-in-out transform">
//                 <div
//                   className={`custom-checkbox absolute top-[2px] right-[2px] z-10 ${
//                     isEditMode ? "block" : "hidden"
//                   }`}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selectedMovies.includes(movie.id)}
//                     onChange={(e) => {
//                       e.stopPropagation();
//                       handleMovieSelect(movie.id);
//                     }}
//                     className="h-5 w-5 text-[#F54100] border-2 border-gray-600 rounded-full focus:ring-0 focus:outline-none"
//                   />
//                 </div>
//                 <ImageWithPlaceholder
//                   src={movie?.cover}
//                   alt={`Picture of ${movie?.name}`}
//                   width="100%"
//                   height={153}
//                   className="rounded-md w-full h-[153px] object-cover object-center"
//                 />
//               </div>

//               <div>
//                 <h1 className="fav_text truncate">{movie?.name}</h1>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div
//           className={`fixed z-10 bottom-0 gap-3 w-full bg-[#1B1B1F] p-6 flex justify-between items-center  transition-transform duration-300 ease-in-out ${
//             isEditMode ? "translate-y-0" : "translate-y-full"
//           }`}
//         >
//           <button
//             className="w-[50%] cancel-all"
//             onClick={() => setSelectedMovies([])}
//           >
//             Cancel all
//           </button>
//           <button
//             className="delete-all w-[50%]"
//             onClick={handleDelete}
//             disabled={selectedMovies.length === 0}
//           >
//             Delete {selectedMovies.length > 0 && `${selectedMovies.length}`}
//           </button>
//         </div>

//         {/* Confirmation Modal */}
//         {showConfirmation && (
//           <div className="fixed inset-0 z-20 bg-black bg-opacity-80 flex justify-center items-center">
//             <div className="bg-[#242428] confirm rounded-2xl mx-10 text-center shadow-lg">
//               <h2 className="p-5">
//                 Are you sure you want to clear selected Favorites?
//               </h2>
//               <div className="flex justify-between">
//                 <button
//                   className="text-white w-[50%] p-3 border-t-[1px] border-r-[1px] border-gray-500"
//                   onClick={cancelDelete}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="text-[#f54100] w-[50%] p-3 border-t-[1px] border-gray-500"
//                   onClick={confirmDelete}
//                 >
//                   Clear All
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Main;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Ads from "../../../search/components/Ads";
import Loader from "../../../search/components/Loader";
import ImageWithPlaceholder from "../../../search/components/ImgPlaceholder";
import { useDeleteCollectMutation } from "../../services/profileApi"; // Import delete mutation
import { useDispatch } from "react-redux";
import { deleteFavData } from "../../../search/slice/FavoriteSlice";

interface MainProps {
  isEditMode: boolean;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  movies: any[];
  advert: any;
  isLoading: boolean;
  isFetching: boolean;
  refetch: any;
}

const Main: React.FC<MainProps> = ({
  isEditMode,
  setIsEditMode,
  movies,
  advert,
  isLoading,
  isFetching,
  refetch,
}) => {
  const navigate = useNavigate();
  const [selectedMovies, setSelectedMovies] = useState<string[]>([]);
  const [deleteMovies, setDeleteMovies] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteCollect] = useDeleteCollectMutation(); // Use the delete mutation
  const dispatch = useDispatch();

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const handleMovieSelect = (movie: string) => {
    setSelectedMovies((prevSelected) =>
      prevSelected.includes(movie)
        ? prevSelected.filter((m) => m !== movie)
        : [...prevSelected, movie]
    );
  };

  const handleDeleteSelect = (movie: string) => {
    setDeleteMovies((prevSelected) =>
      prevSelected.includes(movie)
        ? prevSelected.filter((m) => m !== movie)
        : [...prevSelected, movie]
    );
  };

  const confirmDelete = async () => {
    try {
      await deleteCollect({ ids: deleteMovies.join(",") }).unwrap(); // Call the delete mutation
      dispatch(deleteFavData(selectedMovies));

      refetch();
      setSelectedMovies([]);
      setIsEditMode(false);
      setShowConfirmation(false);
    } catch (error) {
      console.error("Failed to delete favorites:", error);
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleMovieClick = (movieId: string, id: string) => {
    if (isEditMode) {
      handleDeleteSelect(id);
      handleMovieSelect(movieId); // Select the movie when in edit mode
    } else {
      navigate(`/player/${movieId}`);
    }
  };

  return (
    <div className="bg-[#161619] pb-[50px] mt-[65px] ">
      <div className="mt-3">
        {isLoading || isFetching ? (
          <div className="flex justify-center items-center h-[126px]">
            <Loader />
          </div>
        ) : (
          <>
            <Ads advert={advert} />
          </>
        )}

        <div className="py-3 mt-5 fav grid grid-cols-5 max-sm:grid-cols-3 gap-3 gap-y-5 px-3 max-md:grid-cols-5 md:grid-rows-6 lg:grid-cols-6 xl:grid-cols-9">
          {/* Movie Cards */}
          {movies.map((movie, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 transition-all duration-300 ease-in-out"
              onClick={() => handleMovieClick(movie?.movie_id, movie?.id)} // Handle click for redirection or selection
            >
              <div className="relative transition-transform duration-500 ease-in-out transform">
                <div
                  className={`custom-checkbox absolute top-[2px] right-[2px] z-10 ${
                    isEditMode ? "block" : "hidden"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedMovies.includes(movie.movie_id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleMovieSelect(movie.movie_id);
                    }}
                    className="h-5 w-5 text-[#F54100] border-2 border-gray-600 rounded-full focus:ring-0 focus:outline-none"
                  />
                </div>
                <ImageWithPlaceholder
                  src={movie?.cover}
                  alt={`Picture of ${movie?.movie_name}`}
                  width="100%"
                  height={153}
                  className="rounded-md w-full h-[153px] object-cover object-center"
                />
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent rounded-sm"></div>

                <div className="absolute bottom-[3px] right-[3px] text-[10px]">
                  {movie?.dynamic}
                </div>
              </div>

              <div>
                <h1 className="fav_text truncate">{movie?.movie_name}</h1>
              </div>
            </div>
          ))}
        </div>
        <div
          className={`fixed z-10 bottom-0 gap-3 w-full bg-[#1B1B1F] p-6 flex justify-between items-center  transition-transform duration-300 ease-in-out ${
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
                Are you sure you want to clear selected Favorites?
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
