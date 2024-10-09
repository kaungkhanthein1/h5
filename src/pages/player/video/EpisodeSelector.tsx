import React from 'react';
import { Episode } from '../../../model/videoModel';

interface EpisodeSelectorProps {
  episodes: Episode[];
  selectedEpisode: Episode | null;
  onEpisodeSelect: (episode: Episode) => void;
}

const EpisodeSelector: React.FC<EpisodeSelectorProps> = ({ episodes, selectedEpisode, onEpisodeSelect }) => {
  return (
    <div className="overflow-x-auto whitespace-nowrap m-4 bg-black"> {/* Horizontal scroll container */}
      <div className="inline-flex space-x-3"> {/* Inline flex for horizontal layout */}
        {episodes.map((episode) => (
          <button
            key={episode.episode_id}
            onClick={() => onEpisodeSelect(episode)}
            className={`py-2 px-4 rounded-lg focus:outline-none relative ${
              selectedEpisode?.episode_id === episode.episode_id
                ? 'bg-gray-800 text-white'
                : 'bg-gray-700 text-gray-300'
            }`}
            style={{ minWidth: '100px', maxWidth: '120px' }}  // Adjust width for uniformity
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