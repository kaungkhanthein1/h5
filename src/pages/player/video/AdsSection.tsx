import { useState } from "react";
  
const AdsSection = (adsData: any) => {
    const adEntries = adsData && adsData.adsData ? Object.values(adsData.adsData) : []; // Extracting all the ads
  const [randomIndex, setRandomIndex] = useState(
    Math.floor(Math.random() * adEntries.length)
  );

  const handleImageError = () => {
    // Attempt to find another working ad by moving to the next one
    let nextIndex = randomIndex + 1;

    if (nextIndex >= adEntries.length) {
      nextIndex = 0; // Wrap around to the beginning if the index exceeds the array length
    }

    setRandomIndex(nextIndex);
  };

  const ad: any = adEntries[randomIndex];

  return (
    <div className="mt-4">
      {ad?.data?.image && ad?.data?.url ? (
        <a
          href={ad?.data?.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={ad?.data?.image}
            alt={`Ad ${randomIndex}`}
            className="w-full h-auto rounded-md"
            onError={handleImageError} // Handle image load errors by showing the next available ad
          />
        </a>
      ) : null}
    </div>
  );
};

export default AdsSection;