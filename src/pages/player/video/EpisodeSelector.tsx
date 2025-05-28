import React, { useEffect, useRef } from 'react';
import { EpisodeSelectorProps } from '../../../model/videoModel';

const EpisodeSelector: React.FC<EpisodeSelectorProps> = ({ episodes, selectedEpisode, onEpisodeSelect }) => {
  const selectedEpisodeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (selectedEpisodeRef.current) {
      selectedEpisodeRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center', // Ensure horizontal centering
        block: 'nearest', // Keep vertical positioning intact
      });
    }
  }, [selectedEpisode]);

  return (
    <div className="overflow-x-auto whitespace-nowrap m-4 bg-background remove-scrollbar"> {/* Horizontal scroll container */}
      <div className="inline-flex space-x-3"> {/* Inline flex for horizontal layout */}
        {episodes.map((episode) => (
          <button
            key={episode.episode_id}
            ref={selectedEpisode?.episode_id === episode.episode_id ? selectedEpisodeRef : null} // Set ref for selected episode
            onClick={() => onEpisodeSelect(episode)}
            className={`py-2 px-4 rounded-lg focus:outline-none relative ${
              selectedEpisode?.episode_id === episode.episode_id
                ? 'bg-episodeSelected text-white'
                : 'bg-source text-white'
            }`}
            style={{ minWidth: '100px' }}  // Adjust width for uniformity
          >
            <span>{episode.episode_name}</span>

            {/* Loader animation under the selected episode */}
            {selectedEpisode?.episode_id === episode.episode_id && (
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[2px] loader">
                <div></div>
                <div></div>
                <div></div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EpisodeSelector;