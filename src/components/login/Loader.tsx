import React from "react";

interface LoaderProps {}

const Loader: React.FC<LoaderProps> = ({}) => {
  return (
    <div className="absolute top-0 z-[9999909] w-screen h-screen bg-black/30 flex justify-center items-center">
      <div className=" w-[100px] h-[100px] bg-black/70 rounded-lg flex justify-center items-center">
        <div className="w-5 h-5 border-[3px] border-t-orange-600 border-r-orange-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;
