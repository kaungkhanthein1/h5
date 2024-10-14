import React, { useState } from 'react';
import { animated } from 'react-spring';

const EpisodeList: React.FC = () => {
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

  const episodes = Array.from({ length: 50 }, (_, i) => `第${i + 1}集`);

  const handleSelectEpisode = (index: number) => {
    setSelectedEpisode(index);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {episodes.map((episode, index) => (
        <animated.button
          key={index}
          className={`px-4 py-2 text-white bg-gray-700 hover:bg-gray-600 rounded ${
            selectedEpisode === index ? 'bg-orange-500' : ''
          }`}
          onClick={() => handleSelectEpisode(index)}
        >
          {episode}
        </animated.button>
      ))}
    </div>
  );
};

export default EpisodeList;
