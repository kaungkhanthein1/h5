import { useState } from "react";
import { Link } from "react-router-dom";
  
const AdsSection = (adsDataList: any) => {
console.log('adsDataList is=.', adsDataList);
  return (
      <div className="grid grid-cols-5 justify-between gap-2">
        {adsDataList?.adsDataList?.map((item: any) => (
          <Link to={item?.data?.url} key={item?.data?.url}>
            <img
              src={item?.data?.image}
              className={`w-[58px] h-[58px] object-cover rounded-[4px] mx-auto`}
              alt=""
            />
          </Link>
        ))}
      </div>
  );
};

export default AdsSection;