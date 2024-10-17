import { useState } from "react";
  
const AdsSection = (adsData: any) => {
console.log('adsData is=.', adsData);
  return (
    <div className="mt-4">
      {adsData?.adsData?.data?.image && adsData?.adsData?.data?.url ? (
        <a
          href={adsData?.adsData?.data?.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={adsData?.adsData?.data?.image}
            alt={`Ad`}
            className="w-full h-auto rounded-md"
          />
        </a>
      ) : null}
    </div>
  );
};

export default AdsSection;