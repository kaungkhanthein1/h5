import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setArea,
  setClass,
  setSort,
  setYear,
} from "../../pages/home/slice/HomeSlice";

const FilterByTag = ({ data, sort }: any) => {
  const sortData = useSelector((state: any) => state.home.sort);
  const classData = useSelector((state: any) => state.home.class);
  const area = useSelector((state: any) => state.home.area);
  const year = useSelector((state: any) => state.home.year);

  const dispatch = useDispatch();
  return (
    <div className="w-full pt-5 pb-2 flex flex-col gap-3">
      <div className="flex overflow-x-scroll px-3 gap-5 remove-scrollbar items-center">
        {sort?.map((item: any, index: any) => (
          <div className="relative" key={index}>
            <p
              onClick={() => {
                // setActiveSort(item?.value);
                dispatch(setSort(item?.value));
              }}
              className={`${
                sortData === item?.value
                  ? "bg-gray-500/35 px-4 py-1 text-xs"
                  : "text-[14px]"
              } whitespace-nowrap py-1 rounded-full hover:text-white transition-colors`}
            >
              {item?.name}
            </p>
          </div>
        ))}
      </div>
      <div className="flex overflow-x-scroll px-3 gap-5 remove-scrollbar items-center">
        {data && data.length > 0 && data[0]?.class?.map((item: any, index: any) => (
          <div className="relative" key={index}>
            <p
              onClick={() => dispatch(setClass(item))}
              className={`${
                classData === item
                  ? "bg-gray-500/35 px-4 py-1 text-xs"
                  : "text-[14px]"
              } whitespace-nowrap py-1 rounded-full hover:text-white transition-colors`}
            >
              {item}
            </p>
          </div>
        ))}
      </div>
      <div className="flex overflow-x-scroll px-3 gap-5 remove-scrollbar items-center">
        {data[0]?.area?.map((item: any, index: any) => (
          <div className="relative" key={index}>
            <p
              onClick={() => dispatch(setArea(item))}
              className={`${
                area === item
                  ? "bg-gray-500/35 px-4 py-1 text-xs"
                  : "text-[14px]"
              } whitespace-nowrap py-1 rounded-full hover:text-white transition-colors`}
            >
              {item}
            </p>
          </div>
        ))}
      </div>
      <div className="flex overflow-x-scroll px-3 gap-5 remove-scrollbar items-center">
        {data[0]?.year?.map((item: any, index: any) => (
          <div className="relative" key={index}>
            <p
              onClick={() => dispatch(setYear(item))}
              className={`${
                year === item
                  ? "bg-gray-500/35 px-4 py-1 text-xs"
                  : "text-[14px]"
              } whitespace-nowrap py-1 rounded-full hover:text-white transition-colors`}
            >
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterByTag;

// import { useEffect, useState, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setArea,
//   setClass,
//   setSort,
//   setYear,
// } from "../../pages/home/slice/HomeSlice";

// const FilterByTag = ({ data, sort }: any) => {
//   const sortData = useSelector((state: any) => state.home.sort);
//   const classData = useSelector((state: any) => state.home.class);
//   const area = useSelector((state: any) => state.home.area);
//   const year = useSelector((state: any) => state.home.year);

//   const dispatch = useDispatch();

//   // State to control the visibility of the tags
//   const [showTags, setShowTags] = useState(true); // Keeps the tags visible
//   const [isFixed, setIsFixed] = useState(false); // Controls if the tags should be fixed or relative
//   const [showFilterButton, setShowFilterButton] = useState(false); // To show/hide the "Show Filters" button
//   const tagRef = useRef<HTMLDivElement | null>(null); // Ref for the tag container

//   // Function to toggle tags visibility and position
//   const toggleShowTags = () => {
//     setIsFixed((prevState) => !prevState); // Toggle between fixed and relative
//     setShowTags(true); // Always show the tags when the button is clicked
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollPosition = window.scrollY;

//       // Show the "Show Filters" button when scrolled down
//       if (scrollPosition > 180) {
//         setShowFilterButton(true);
//       } else {
//         setShowFilterButton(false);
//         setIsFixed(false); // If we scroll back to the top, reset to relative
//         setShowTags(true); // Always show the tags at the top when scrolled to the top
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   // Close the tags when clicking outside (only if the tags are fixed)
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (tagRef.current && !tagRef.current.contains(event.target as Node)) {
//         // If clicked outside the tag container, close the tags only if fixed
//         setIsFixed(false);
//         setShowTags(true); // Ensure tags are always visible at the top
//       }
//     };

//     if (showTags && isFixed) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [showTags, isFixed]);

//   return (
//     <div className="w-full pt-0 pb-2 flex flex-col gap-3">
//       {/* Show the "Show Filters" button when not at the top */}
//       {showFilterButton && !isFixed && (
//         <div className="flex justify-center fixed top-[90px] bg-filter text-center w-full z-[200] p-1">
//           <button onClick={toggleShowTags} className="text-white rounded-md">
//             Show Filters
//           </button>
//         </div>
//       )}

//       {/* Tags Container with animation and position toggle */}
//       <div
//         ref={tagRef} // Attach ref to tag container
//         className={`overflow-hidden max-h-0 flex flex-col gap-3 py-3 transition-all duration-500 ease-in-out bg-filter rounded-lg ${
//           showTags
//             ? isFixed
//               ? "fixed top-[100px] max-h-60 left-0 w-full z-20" // Make fixed when the button is clicked
//               : "relative z-0 max-h-60" // Otherwise, keep relative
//             : "max-h-0 py-0" // Hide the tags when needed
//         }`}
//       >
//         {/* Sort Tags */}
//         <div className="flex overflow-x-scroll px-3 gap-5 remove-scrollbar items-center">
//           {sort?.map((item: any, index: any) => (
//             <div className="relative" key={index}>
//               <p
//                 onClick={() => dispatch(setSort(item?.value))}
//                 className={`${
//                   sortData === item?.value
//                     ? "bg-gray-500/35 px-4 py-1 text-xs"
//                     : "text-[14px]"
//                 } whitespace-nowrap py-1 rounded-full hover:text-white transition-colors`}
//               >
//                 {item?.name}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* Class Tags */}
//         <div className="flex overflow-x-scroll px-3 gap-5 remove-scrollbar items-center">
//           {data[0]?.class?.map((item: any, index: any) => (
//             <div className="relative" key={index}>
//               <p
//                 onClick={() => dispatch(setClass(item))}
//                 className={`${
//                   classData === item
//                     ? "bg-gray-500/35 px-4 py-1 text-xs"
//                     : "text-[14px]"
//                 } whitespace-nowrap py-1 rounded-full hover:text-white transition-colors`}
//               >
//                 {item}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* Area Tags */}
//         <div className="flex overflow-x-scroll px-3 gap-5 remove-scrollbar items-center">
//           {data[0]?.area?.map((item: any, index: any) => (
//             <div className="relative" key={index}>
//               <p
//                 onClick={() => dispatch(setArea(item))}
//                 className={`${
//                   area === item
//                     ? "bg-gray-500/35 px-4 py-1 text-xs"
//                     : "text-[14px]"
//                 } whitespace-nowrap py-1 rounded-full hover:text-white transition-colors`}
//               >
//                 {item}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* Year Tags */}
//         <div className="flex overflow-x-scroll px-3 gap-5 remove-scrollbar items-center">
//           {data[0]?.year?.map((item: any, index: any) => (
//             <div className="relative" key={index}>
//               <p
//                 onClick={() => dispatch(setYear(item))}
//                 className={`${
//                   year === item
//                     ? "bg-gray-500/35 px-4 py-1 text-xs"
//                     : "text-[14px]"
//                 } whitespace-nowrap py-1 rounded-full hover:text-white transition-colors`}
//               >
//                 {item}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FilterByTag;
