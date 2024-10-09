// import React from "react";
// import { Link } from "react-router-dom";
// import ImageWithPlaceholder from "./ImgPlaceholder";

// import { useDispatch, useSelector } from "react-redux";
// import { selectFavData, setFavData } from "../slice/FavoriteSlice";

// const MovieCard = ({ movie }: { movie: any }) => {
//   const dispatch = useDispatch();
//   const favorites = useSelector(selectFavData);

//   const isFavorite = favorites.some((favorite) => favorite.id === movie.id);

//   const addFavorite = (e: any) => {
//     e.preventDefault();
//     dispatch(setFavData(movie));
//   };

//   return (
//     <div className="space-y-1.5 p-3">
//       <div className="flex items-stretch gap-5 relative">
//         <Link to={`/`} className="relative">
//           <ImageWithPlaceholder
//             src={movie?.cover}
//             alt={`Picture of ${movie?.name}`}
//             width={92}
//             height={127}
//             className="rounded-md w-[92px] h-[127px] object-cover object-center"
//           />

//           <div className="top-0 right-0 search_card_score z-1 absolute">
//             <span>{movie?.dynamic}</span>
//           </div>
//         </Link>

//         {/* Ensure flex-grow and min-width-0 to handle truncation properly */}
//         <div className="card-content flex-grow min-w-0">
//           <div className="flex flex-col">
//             <div className="flex justify-between items-center"></div>
//             <Link to={`/`}>
//               <h1
//                 className="detail-head-text truncate w-full"
//                 // Apply the highlighted text with color
//                 dangerouslySetInnerHTML={{
//                   __html: movie?.highlight.replace(
//                     /<em>(.*?)<\/em>/g,
//                     '<span style="color: #F54100;">$1</span>'
//                   ),
//                 }}
//               />
//             </Link>

//             {/* Render members */}
//             <div className="detail-text mt-1 truncate w-full">
//               <strong>成员: </strong>
//               {movie?.members?.map((member: any, idx: number) => (
//                 <span key={member.member_id}>
//                   {member.name}
//                   {idx < movie.members.length - 1 && " / "}
//                 </span>
//               ))}
//             </div>

//             {/* Render tags */}
//             <div className="detail-text mt-1 truncate w-full">
//               <strong>标签: </strong>
//               {movie?.tags?.map((tag: any, idx: number) => (
//                 <span key={tag.tag_id}>
//                   {tag.name}
//                   {idx < movie.tags.length - 1 && " / "}
//                 </span>
//               ))}
//             </div>

//             <p className="truncate detail-text mt-1 w-full">{movie.blurb}</p>
//           </div>

//           <div className="watch-main mt-2 flex gap-2">
//             <Link to={`/`} className="watch flex items-center">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="16"
//                 height="17"
//                 viewBox="0 0 16 17"
//                 fill="none"
//               >
//                 <path
//                   d="M12.9174 8.77722L5.85137 13.4879C5.80118 13.5213 5.74286 13.5404 5.68264 13.5433C5.62241 13.5462 5.56253 13.5327 5.50937 13.5042C5.45622 13.4758 5.41178 13.4334 5.38078 13.3817C5.34979 13.33 5.33341 13.2708 5.33337 13.2105V3.78922C5.33341 3.72892 5.34979 3.66976 5.38078 3.61804C5.41178 3.56633 5.45622 3.52398 5.50937 3.49552C5.56253 3.46706 5.62241 3.45355 5.68264 3.45644C5.74286 3.45932 5.80118 3.47848 5.85137 3.51188L12.9174 8.22255C12.963 8.25299 13.0005 8.29423 13.0263 8.34261C13.0522 8.39099 13.0658 8.44501 13.0658 8.49988C13.0658 8.55475 13.0522 8.60878 13.0263 8.65716C13.0005 8.70553 12.963 8.74678 12.9174 8.77722Z"
//                   fill="white"
//                 />
//               </svg>
//               <span>查看详情</span>
//             </Link>
//             <button
//               onClick={addFavorite}
//               className="star_watch flex items-center"
//             >
//               {isFavorite ? (
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="16"
//                   height="17"
//                   viewBox="0 0 16 17"
//                   fill="none"
//                 >
//                   <g clip-path="url(#clip0_4_2182)">
//                     <path
//                       d="M8.00002 12.6735L3.29802 15.3055L4.34802 10.0202L0.391357 6.3615L5.74269 5.72683L8.00002 0.833496L10.2574 5.72683L15.6087 6.3615L11.652 10.0202L12.702 15.3055L8.00002 12.6735Z"
//                       fill="#FF6A33"
//                     />
//                   </g>
//                   <defs>
//                     <clipPath id="clip0_4_2182">
//                       <rect
//                         width="16"
//                         height="16"
//                         fill="white"
//                         transform="translate(0 0.5)"
//                       />
//                     </clipPath>
//                   </defs>
//                 </svg>
//               ) : (
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="16"
//                   height="17"
//                   viewBox="0 0 16 17"
//                   fill="none"
//                 >
//                   <g clip-path="url(#clip0_4_2162)">
//                     <path
//                       d="M8.00002 12.6735L3.29802 15.3055L4.34802 10.0202L0.391357 6.3615L5.74269 5.72683L8.00002 0.833496L10.2574 5.72683L15.6087 6.3615L11.652 10.0202L12.702 15.3055L8.00002 12.6735ZM8.00002 11.1455L10.8314 12.7302L10.1987 9.54816L12.5807 7.34483L9.35869 6.96283L8.00002 4.01683L6.64136 6.9635L3.41936 7.34483L5.80136 9.54816L5.16869 12.7302L8.00002 11.1455Z"
//                       fill="white"
//                     />
//                   </g>
//                   <defs>
//                     <clipPath id="clip0_4_2162">
//                       <rect
//                         width="16"
//                         height="16"
//                         fill="white"
//                         transform="translate(0 0.5)"
//                       />
//                     </clipPath>
//                   </defs>
//                 </svg>
//               )}

//               <span>收藏</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MovieCard;

import React from "react";
import { Link } from "react-router-dom";
import ImageWithPlaceholder from "./ImgPlaceholder";

import { useDispatch, useSelector } from "react-redux";
import { selectFavData, setFavData } from "../slice/FavoriteSlice";
import { useCollectMovieMutation } from "../../profile/services/profileApi";

const MovieCard = ({ movie }: { movie: any }) => {
  const dispatch = useDispatch();
  const [collectMovie] = useCollectMovieMutation();
  const favorites = useSelector(selectFavData);
  // const [deleteCollect] = useDeleteCollectMutation();
  const isFavorite = favorites.some((favorite) => favorite.id === movie.id);

  const handleAddFavorite = async (e: any) => {
    e.preventDefault();
    try {
      await collectMovie({
        movie_id: movie.id,
        is_collect: true,
      }).unwrap();
      dispatch(setFavData(movie));
    } catch (error) {
      console.error("Failed to add favorite:", error);
    }
  };

  const handleRemoveFavorite = async (e: any) => {
    e.preventDefault();
    try {
      await collectMovie({
        movie_id: movie.id,
        is_collect: false,
      }).unwrap();
      // await deleteCollect({ ids: movie.id }).unwrap();
      dispatch(setFavData(movie));
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  return (
    <div className="space-y-1.5 p-3">
      <div className="flex items-stretch gap-5 relative">
        <Link to={`/`} className="relative">
          <ImageWithPlaceholder
            src={movie?.cover}
            alt={`Picture of ${movie?.name}`}
            width={92}
            height={127}
            className="rounded-md w-[92px] h-[127px] object-cover object-center"
          />

          <div className="top-0 right-0 search_card_score z-1 absolute">
            <span>{movie?.dynamic}</span>
          </div>
        </Link>

        {/* Ensure flex-grow and min-width-0 to handle truncation properly */}
        <div className="card-content flex-grow min-w-0">
          <div className="flex flex-col">
            <div className="flex justify-between items-center"></div>
            <Link to={`/player/${movie?.id}`}>
              <h1
                className="detail-head-text truncate w-full"
                // Apply the highlighted text with color
                dangerouslySetInnerHTML={{
                  __html: movie?.highlight.replace(
                    /<em>(.*?)<\/em>/g,
                    '<span style="color: #F54100;">$1</span>'
                  ),
                }}
              />
            </Link>

            {/* Render members */}
            <div className="detail-text mt-1 truncate w-full">
              <strong>成员: </strong>
              {movie?.members?.map((member: any, idx: number) => (
                <span key={member.member_id}>
                  {member.name}
                  {idx < movie.members.length - 1 && " / "}
                </span>
              ))}
            </div>

            {/* Render tags */}
            <div className="detail-text mt-1 truncate w-full">
              <strong>标签: </strong>
              {movie?.tags?.map((tag: any, idx: number) => (
                <span key={tag.tag_id}>
                  {tag.name}
                  {idx < movie.tags.length - 1 && " / "}
                </span>
              ))}
            </div>

            <p className="truncate detail-text mt-1 w-full">{movie.blurb}</p>
          </div>

          <div className="watch-main mt-2 flex gap-2">
            <Link
              to={`/player/${movie?.id}`}
              className="watch flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
              >
                <path
                  d="M12.9174 8.77722L5.85137 13.4879C5.80118 13.5213 5.74286 13.5404 5.68264 13.5433C5.62241 13.5462 5.56253 13.5327 5.50937 13.5042C5.45622 13.4758 5.41178 13.4334 5.38078 13.3817C5.34979 13.33 5.33341 13.2708 5.33337 13.2105V3.78922C5.33341 3.72892 5.34979 3.66976 5.38078 3.61804C5.41178 3.56633 5.45622 3.52398 5.50937 3.49552C5.56253 3.46706 5.62241 3.45355 5.68264 3.45644C5.74286 3.45932 5.80118 3.47848 5.85137 3.51188L12.9174 8.22255C12.963 8.25299 13.0005 8.29423 13.0263 8.34261C13.0522 8.39099 13.0658 8.44501 13.0658 8.49988C13.0658 8.55475 13.0522 8.60878 13.0263 8.65716C13.0005 8.70553 12.963 8.74678 12.9174 8.77722Z"
                  fill="white"
                />
              </svg>
              <span>查看详情</span>
            </Link>
            <button
              onClick={isFavorite ? handleRemoveFavorite : handleAddFavorite}
              className="star_watch flex items-center"
            >
              {isFavorite ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                >
                  <g clip-path="url(#clip0_4_2182)">
                    <path
                      d="M8.00002 12.6735L3.29802 15.3055L4.34802 10.0202L0.391357 6.3615L5.74269 5.72683L8.00002 0.833496L10.2574 5.72683L15.6087 6.3615L11.652 10.0202L12.702 15.3055L8.00002 12.6735Z"
                      fill="#FF6A33"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4_2182">
                      <rect
                        width="16"
                        height="16"
                        fill="white"
                        transform="translate(0 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                >
                  <g clip-path="url(#clip0_4_2162)">
                    <path
                      d="M8.00002 12.6735L3.29802 15.3055L4.34802 10.0202L0.391357 6.3615L5.74269 5.72683L8.00002 0.833496L10.2574 5.72683L15.6087 6.3615L11.652 10.0202L12.702 15.3055L8.00002 12.6735ZM8.00002 11.1455L10.8314 12.7302L10.1987 9.54816L12.5807 7.34483L9.35869 6.96283L8.00002 4.01683L6.64136 6.9635L3.41936 7.34483L5.80136 9.54816L5.16869 12.7302L8.00002 11.1455Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4_2162">
                      <rect
                        width="16"
                        height="16"
                        fill="white"
                        transform="translate(0 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              )}

              <span>收藏</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
