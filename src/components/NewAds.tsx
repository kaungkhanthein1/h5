import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useGetAdsQuery } from "../services/helperService";
import useCachedImage from "./../utils/useCachedImage";

interface AdItem {
  data?: {
    url?: string;
    image?: string;
  };
  remarks?: string;
  sort?: number;
}

interface NewAdsProps {
  section: string;
  fromMovie?: boolean;
}

// Memoize the individual ad component to prevent unnecessary re-renders
const AdItemComponent = React.memo(({ item }: { item: AdItem }) => {
  const imageUrl = item.data?.image || "";
  const { imgSrc, isLoading: imageLoading } = useCachedImage(imageUrl);

  return (
    <Link
      target="_blank"
      className="flex flex-col justify-center items-center gap-[4px] min-w-[60px]"
      to={item.data?.url || "#"}
    >
      {/* Use consistent dimensions for both loading and loaded states */}
      <div className="w-[60px] h-[60px] rounded-[8px] mx-auto relative overflow-hidden">
        {imageLoading ? (
          <div className="w-full h-full bg-white/15 animate-pulse flex justify-center items-center">
            <p className="text-[13px] font-[500] text-[#888] text-center px-1 leading-tight">
              {item?.remarks}
            </p>
          </div>
        ) : (
          imgSrc && (
            <img
              src={imgSrc}
              className="w-full h-full object-cover"
              alt="ad"
              loading="lazy"
            />
          )
        )}
      </div>
      <p className="text-[13px] font-[500] text-[#888] text-center min-h-[20px] w-[60px] leading-tight">
        {item?.remarks || " "}
      </p>
    </Link>
  );
});

// Set display name for debugging
AdItemComponent.displayName = 'AdItemComponent';

// Memoize the skeleton loader component
const SkeletonLoader = React.memo(({ fromMovie }: { fromMovie: boolean }) => (
  <div className={`${fromMovie ? "" : "max-md:px-3 px-10"} py-1`}>
    <div className="grid w-full grid-cols-5 md:grid-cols-10 gap-2">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="flex flex-col items-center gap-[4px]">
          <div className="w-[60px] h-[60px] bg-white/30 rounded-[4px] animate-pulse" />
          <div className="w-[60px] h-[20px] bg-transparent" />
        </div>
      ))}
    </div>
  </div>
));

SkeletonLoader.displayName = 'SkeletonLoader';

const NewAds: React.FC<NewAdsProps> = ({ section, fromMovie = false }) => {
  const { data, isLoading, isFetching } = useGetAdsQuery();
  const [hasRendered, setHasRendered] = useState(false);

  // Memoize the sorted ads data to prevent unnecessary recalculations
  const sortedAds = useMemo(() => {
    if (!data?.data?.[section]) return [];
    
    const ads = data.data[section];
    return [...ads].sort((a, b) => (b.sort || 0) - (a.sort || 0)) as AdItem[];
  }, [data, section]);

  // Memoize the content structure
  const gridContent = useMemo(() => {
    if (sortedAds.length === 0) return null;

    return sortedAds.map((item, index) => (
      <AdItemComponent key={`${section}-${index}-${item.data?.image || ''}`} item={item} />
    ));
  }, [sortedAds, section]);

  // Track when we have meaningful data to render
  useEffect(() => {
    if (sortedAds.length > 0 && !isLoading) {
      setHasRendered(true);
    }
  }, [sortedAds.length, isLoading]);

  // Show skeleton while loading and we haven't rendered before, 
  // or when fetching fresh data but have no cached data
  if ((isLoading || isFetching) && (!hasRendered || sortedAds.length === 0)) {
    return <SkeletonLoader fromMovie={fromMovie} />;
  }

  // If we have no ads data and we're not loading, render empty space with same dimensions
  if (sortedAds.length === 0 && !isLoading && !isFetching) {
    return <SkeletonLoader fromMovie={fromMovie} />;
  }

  return (
    <div className={`${fromMovie ? "" : "max-md:px-3 px-10"} py-1`}>
      <div className="grid w-full grid-cols-5 md:grid-cols-10 gap-2">
        {gridContent}
      </div>
    </div>
  );
};

export default React.memo(NewAds);
