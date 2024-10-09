import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";

interface Episode {
  episode_id: number | null;
  episode_name: string;
  play_url: string;
  from_code: string;
  ready_to_play: boolean;
}

interface PlayFrom {
  name: string;
  total: number | null;
  tips: string;
  code: string;
  list: Episode[];
}

interface ModalComponentProps {
  onClose: () => void;
  changeSource: (playfrom: PlayFrom) => void;
  source: "episodes" | "sources";
  episodes: Episode[];
  onEpisodeSelect: (episode: Episode) => void;
  playFrom: PlayFrom[];
  defaultEpisodeId: number | null;
  selectedSource: number;
  setSelectedSource: (source: number) => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  onClose,
  source,
  episodes,
  onEpisodeSelect,
  changeSource,
  playFrom,
  defaultEpisodeId,
  selectedSource,
  setSelectedSource,
}) => {
  const [activeTab, setActiveTab] = useState<"episodes" | "sources">(
    source || "episodes"
  );
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<number | null>(
    defaultEpisodeId
  );
  const [episodeRange, setEpisodeRange] = useState<[number, number]>([0, 50]);
  const [filteredEpisodes, setFilteredEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    // Combine all episodes from the playFrom list
    const allEpisodes = playFrom.flatMap((source) => source.list);
    setFilteredEpisodes(allEpisodes);
  }, [playFrom]);

  // Handle episode selection and update the state
  const handleEpisodeClick = (episode: Episode) => {
    setSelectedEpisodeId(episode.episode_id);
    onEpisodeSelect(episode);
  };

  // Handle tab switch
  const handleTabClick = (start: number, end: number) => {
    setEpisodeRange([start, end]);
  };

  // Sync default episode selection when the component mounts or when defaultEpisodeId changes
  useEffect(() => {
    setSelectedEpisodeId(defaultEpisodeId);
  }, [defaultEpisodeId]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="bg-black backdrop-blur-md w-full max-w-md h-[65vh] rounded-t-xl p-4 text-white">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-6 overflow-x-auto m-auto">
            {/* Episode Tab */}
            <button
              className={`pb-2 border-b-4 ${
                activeTab === "episodes"
                  ? "border-orange-500"
                  : "border-transparent text-gray-400"
              }`}
              onClick={() => setActiveTab("episodes")}
            >
              Episodes
            </button>
            {/* Source Tab */}
            <button
              className={`pb-2 border-b-4 ${
                activeTab === "sources"
                  ? "border-orange-500"
                  : "border-transparent text-gray-400"
              }`}
              onClick={() => setActiveTab("sources")}
            >
              Sources
            </button>
          </div>
          <button onClick={onClose} className="text-white">
            <FontAwesomeIcon icon={faTimes} className="text-lg" />
          </button>
        </div>

        <div className="h-[calc(100%-60px)] overflow-y-auto">
          {activeTab === "episodes" && (
            <div>
              <div className="flex space-x-4 overflow-x-auto mb-4">
                {/* Episode Range Tabs */}
                {Array.from({ length: Math.ceil(filteredEpisodes.length / 50) }, (_, index) => {
                  const start = index * 50;
                  const end = Math.min(start + 50, filteredEpisodes.length);
                  return (
                    <button
                      key={index}
                      className={`px-4 whitespace-nowrap flex py-2 text-sm text-white ${
                        episodeRange[0] === start
                          ? "border-b-4 border-orange-500"
                          : ""
                      }`}
                      onClick={() => handleTabClick(start, end)}
                    >
                      <span>{start + 1}-{end}集</span>
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {filteredEpisodes
                  .slice(episodeRange[0], episodeRange[1])
                  .map((episode) => (
                    <button
                      key={episode.episode_id}
                      onClick={() => handleEpisodeClick(episode)}
                      className={`py-2 text-center rounded-lg ${
                        episode.episode_id !== selectedEpisodeId
                          ? "bg-gray-800 text-white"
                          : "bg-gray-700 text-white"
                      }`}
                    >
                      {episode.episode_name}
                      {episode?.episode_id === selectedEpisodeId && (
                        <span className="transform -translate-x-1/2 loader ml-5 -mt-1.5">
                          <div></div>
                          <div></div>
                          <div></div>
                        </span>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {activeTab === "sources" && (
            <div>
              {playFrom &&
                playFrom.map((source, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center bg-gray-800 p-3 rounded-lg mb-2 cursor-pointer ${
                      index === selectedSource ? "border border-orange-500" : ""
                    }`}
                    onClick={() => {
                      setSelectedSource(index);
                      changeSource(source);
                    }}
                  >
                    <div>
                      <h4 className="text-white">{source.name}</h4>
                      {/* Display total videos if available */}
                      {source.total && (
                        <p className="text-gray-400 text-xs">{source.total} 个视频</p>
                      )}
                      {/* Display tips if available */}
                      <p className="text-gray-400 text-xs">
                        {source.tips || "No description available"}
                      </p>
                    </div>
                    {index === selectedSource && (
                      <span className="text-orange-500">
                        <FontAwesomeIcon icon={faCheck} className="text-lg" />
                      </span>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;