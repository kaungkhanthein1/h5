import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Episode, ModalComponentProps } from '../../../model/videoModel';

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
  const [lowerDivHeight, setLowerDivHeight] = useState(0);

  useEffect(() => {
    // Combine all episodes from the playFrom list
    // const allEpisodes = playFrom.flatMap((source) => source.list);
    setFilteredEpisodes(episodes);
    }, [episodes]);

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

  const customHeight = () => {
    const upperDiv = document.getElementById('upper-div');
    const upperDivHeight = upperDiv?.offsetHeight || 0;
    const remainingHeight = window.innerHeight - upperDivHeight;
    return remainingHeight;
  };

  useEffect(() => {
    const updateHeight = () => {
      setLowerDivHeight(customHeight());
    };

    updateHeight(); // Set initial height
    window.addEventListener('resize', updateHeight); // Update height on window resize

    return () => {
      window.removeEventListener('resize', updateHeight); // Cleanup event listener
    };
  }, []);

  const modalRef = useRef<any>(null);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="bg-sourceBack backdrop-blur-md w-full max-w-md rounded-t-xl p-4 text-white" ref={modalRef}
        style={{ height: `${lowerDivHeight}px` }}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-6 overflow-x-auto m-auto">
            {/* Episode Tab */}
            <button
              className={`pb-2 text-gray-400`}
              onClick={() => setActiveTab("episodes")}
            >
              选集
              {activeTab === "episodes" && <div className="absolute w-[32px] h-1 bg-mainColor rounded-md mt-1"></div>}
            </button>
            {/* Source Tab */}
            <button
              className={`pb-2 text-gray-400`}
              onClick={() => setActiveTab("sources")}
            >
              播放源
              {activeTab === "sources" && <div className="absolute w-[32px] h-1 bg-mainColor rounded-md mt-1 ml-2"></div>}
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
                    <>
                    <button
                      key={index}
                      className={`px-4 whitespace-nowrap py-2 text-sm`}
                      onClick={() => handleTabClick(start, end)}
                    >
                      <div className="mb-2">{start + 1}-{end}集</div>
                      {episodeRange[0] === start && <div className="w-full h-1 bg-mainColor rounded-md"></div>}
                    </button>
                    </>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {filteredEpisodes
                  .slice(episodeRange[0], episodeRange[1])
                  .map((episode) => (
                    <button
                      key={episode.episode_id}
                      onClick={() => {handleEpisodeClick(episode); onClose();}}
                      className={`py-2 text-center rounded-lg ${
                        episode.episode_id !== selectedEpisodeId
                          ? "bg-source text-white"
                          : "bg-episodeSelected  text-white"
                      }`}
                    > 
                      {episode.episode_name.length > 7 ? `${episode.episode_name.substring(0, 100)}...` : episode.episode_name}
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
                    className={`flex justify-between items-center p-3 rounded-lg mb-2 cursor-pointer 
                      ${index === selectedSource ? 'bg-episodeSelected' : 'bg-source'}`}
                    onClick={() => {
                      setSelectedSource(index);
                      changeSource(source);
                      onClose();
                    }}
                  >
                    <div>
                      <h4 className="text-white">{source.name}</h4>
                      {/* Display total videos if available */}
                      <div className="flex justify-between items-center">
                      {source.total && (
                        <p className="bg-source text-white text-[12px] px-3 py-1.5 my-2 mr-3 rounded-md">{source.total} 个视频</p>
                      )}
                      {/* Display tips if available */}
                      <p className="bg-source text-white text-[12px] px-3 py-1.5 my-2 rounded-md">
                        {source.tips || "No description available"}
                      </p>
                      </div>
                    </div>
                    {index === selectedSource && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="9" fill="#F54100"/>
                      <path d="M10.5 13.6032L16.0152 8.0874L16.8642 8.9358L10.5 15.3L6.68158 11.4816L7.52998 10.6332L10.5 13.6032Z" fill="white"/>
                      </svg>
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