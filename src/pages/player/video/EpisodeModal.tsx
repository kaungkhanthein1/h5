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

  const sourceScrollRef = useRef<HTMLDivElement>(null);
  const episodeGridRef = useRef<HTMLDivElement>(null);
  const selectedSourceRef = useRef<HTMLDivElement>(null);
  const selectedEpisodeRef = useRef<HTMLButtonElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Combine all episodes from the playFrom list
    // const allEpisodes = playFrom.flatMap((source) => source.list);
    setFilteredEpisodes(episodes);
    
    // Initialize the episode range based on the default episode if available
    if (defaultEpisodeId && episodes.length > 0) {
      const episodeIndex = episodes.findIndex(
        (episode) => episode.episode_id === defaultEpisodeId
      );
      
      if (episodeIndex !== -1) {
        const tabIndex = Math.floor(episodeIndex / 50);
        const start = tabIndex * 50;
        const end = Math.min(start + 50, episodes.length);
        setEpisodeRange([start, end]);
      }
    }
  }, [episodes, defaultEpisodeId]);

  // Auto-select the correct tab based on the selected episode
  useEffect(() => {
    if (selectedEpisodeId && filteredEpisodes.length > 0) {
      // Find the index of the selected episode
      const episodeIndex = filteredEpisodes.findIndex(
        (episode) => episode.episode_id === selectedEpisodeId
      );
      
      if (episodeIndex !== -1) {
        // Calculate which tab this episode should be in
        const tabIndex = Math.floor(episodeIndex / 50);
        const start = tabIndex * 50;
        const end = Math.min(start + 50, filteredEpisodes.length);
        
        // Only update if we're not already in the correct range
        if (episodeRange[0] !== start || episodeRange[1] !== end) {
          setEpisodeRange([start, end]);
        }
      }
    }
  }, [selectedEpisodeId, filteredEpisodes]);

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

  // Auto-scroll to selected source (with delay to ensure proper rendering)
  useEffect(() => {
    const scrollToSource = () => {
      console.log('scrollToSource called, selectedSource:', selectedSource);
      console.log('selectedSourceRef.current:', selectedSourceRef.current);
      console.log('sourceScrollRef.current:', sourceScrollRef.current);
      
      if (selectedSourceRef.current && sourceScrollRef.current) {
        const sourceElement = selectedSourceRef.current;
        const containerElement = sourceScrollRef.current;
        
        console.log('Elements found, checking visibility...');
        console.log('sourceElement.offsetParent:', sourceElement.offsetParent);
        
        // Check if element is actually rendered and visible
        if (sourceElement.offsetParent !== null) {
          console.log('Element is visible, calculating scroll...');
          
          // Try scrollIntoView as an alternative
          sourceElement.scrollIntoView({
            behavior: 'auto',
            block: 'nearest',
            inline: 'center'
          });
          
          // Original scroll calculation for comparison
          const sourceLeft = sourceElement.offsetLeft;
          const sourceWidth = sourceElement.offsetWidth;
          const containerScrollLeft = containerElement.scrollLeft;
          const containerWidth = containerElement.offsetWidth;

          console.log('Scroll calculation:', {
            sourceLeft,
            sourceWidth,
            containerScrollLeft,
            containerWidth
          });

          if (sourceLeft < containerScrollLeft) {
            console.log('Scrolling left to:', sourceLeft - 20);
            containerElement.scrollTo({
              left: sourceLeft - 20,
              behavior: 'auto'
            });
          } else if (sourceLeft + sourceWidth > containerScrollLeft + containerWidth) {
            console.log('Scrolling right to:', sourceLeft + sourceWidth - containerWidth + 20);
            containerElement.scrollTo({
              left: sourceLeft + sourceWidth - containerWidth + 20,
              behavior: 'auto'
            });
          } else {
            console.log('Element is already in view, no scroll needed');
          }
        } else {
          console.log('Element is not visible yet');
        }
      } else {
        console.log('Refs not available yet');
      }
    };

    // Add a small delay to ensure elements are properly rendered
    const timeoutId = setTimeout(scrollToSource, 50);
    
    return () => clearTimeout(timeoutId);
  }, [selectedSource]);

  // Auto-scroll to selected episode (with delay to avoid conflict)
  useEffect(() => {
    const scrollToEpisode = () => {
      if (selectedEpisodeRef.current && episodeGridRef.current) {
        const episodeElement = selectedEpisodeRef.current;
        const containerElement = episodeGridRef.current;
        
        // Check if element is actually rendered and visible
        if (episodeElement.offsetParent !== null) {
          episodeElement.scrollIntoView({
            behavior: 'auto',
            block: 'nearest',
            inline: 'nearest'
          });
        }
      }
    };

    // Add a small delay to prevent conflict with source scroll
    const timeoutId = setTimeout(scrollToEpisode, 100);
    
    return () => clearTimeout(timeoutId);
  }, [selectedEpisodeId, episodeRange]);

  // Auto-scroll to active episode tab
  useEffect(() => {
    const scrollToActiveTab = () => {
      if (activeTabRef.current) {
        const tabElement = activeTabRef.current;
        const containerElement = tabElement.parentElement;
        
        if (containerElement && tabElement.offsetParent !== null) {
          tabElement.scrollIntoView({
            behavior: 'auto',
            block: 'nearest',
            inline: 'center'
          });
        }
      }
    };

    // Add a small delay to ensure elements are rendered
    const timeoutId = setTimeout(scrollToActiveTab, 150);
    
    return () => clearTimeout(timeoutId);
  }, [episodeRange]);

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
          <div className="flex space-x-6 overflow-x-auto scrollbar-hide m-auto">
            {/* <button
              className={`pb-2 text-gray-400`}
              onClick={() => setActiveTab("episodes")}
            > */}
              {/* 选集 */}
              {/* {activeTab === "episodes" && <div className="absolute w-[32px] h-1 bg-mainColor rounded-md mt-1"></div>} */}
            {/* </button> */}
            {/* <button
              className={`pb-2 text-gray-400`}
              onClick={() => setActiveTab("sources")}
            > */}
              {activeTab === "sources" ? <span>播放源</span> : <span>播放与选集</span>}
              {/* {activeTab === "sources" && <div className="absolute w-[32px] h-1 bg-mainColor rounded-md mt-1 ml-2"></div>} */}
            {/* </button> */}
          </div>
          <button onClick={onClose} className="text-white">
            <FontAwesomeIcon icon={faTimes} className="text-lg" />
          </button>
        </div>

        <div className="h-[calc(100%-60px)] overflow-y-auto scrollbar-hide">
          {activeTab === "episodes" && (
            <div className="h-full flex flex-col">
              <div className="flex space-x-3 pb-2 overflow-x-auto scrollbar-hide" ref={sourceScrollRef}>
              {playFrom &&
                playFrom.map((source, index) => (
                  <div
                    key={index}
                    ref={index === selectedSource ? selectedSourceRef : null}
                    className={`relative flex flex-col justify-between p-3 rounded-lg cursor-pointer min-w-[200px] flex-shrink-0
                      ${index === selectedSource ? 'bg-episodeSelected' : 'bg-source'}`}
                    onClick={() => {
                      setSelectedSource(index);
                      changeSource(source);
                      onClose();
                    }}
                  >
                    {index === selectedSource && (
                      <div className="absolute top-3 right-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="9" fill="#F54100"/>
                        <path d="M10.5 13.6032L16.0152 8.0874L16.8642 8.9358L10.5 15.3L6.68158 11.4816L7.52998 10.6332L10.5 13.6032Z" fill="white"/>
                        </svg>
                      </div>
                    )}
                    <div>
                      <div className="flex flex-col">
                        <h4 className="text-white mb-2 pr-6">{source.name}</h4>
                      </div>
                      {/* Display total videos if available */}
                      <div className="flex flex-row">
                      {source.total && (
                        <p className="bg-source text-white text-[12px] px-3 py-1.5 rounded-md mr-2">{source.total} 个视频</p>
                      )}
                      {/* Display tips if available */}
                      <p className="bg-source text-white text-[12px] px-3 py-1.5 rounded-md">
                        {source.tips || "No description available"}
                      </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex space-x-4 overflow-x-auto scrollbar-hide mb-4">
                {/* Episode Range Tabs */}
                {Array.from({ length: Math.ceil(filteredEpisodes.length / 50) }, (_, index) => {
                  const start = index * 50;
                  const end = Math.min(start + 50, filteredEpisodes.length);
                  const isActive = episodeRange[0] === start;
                  return (
                    <button
                      key={index}
                      ref={isActive ? activeTabRef : null}
                      className={`px-1 whitespace-nowrap py-2 text-sm`}
                      onClick={() => handleTabClick(start, end)}
                    >
                      <div className="mb-2">{start + 1}-{end}集</div>
                      {episodeRange[0] === start && <div className="w-full h-1 bg-mainColor rounded-md"></div>}
                    </button>
                  );
                })}
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-2 gap-2" ref={episodeGridRef}>
                  {filteredEpisodes
                    .slice(episodeRange[0], episodeRange[1])
                    .map((episode) => (
                      <button
                        key={episode.episode_id}
                        ref={episode.episode_id === selectedEpisodeId ? selectedEpisodeRef : null}
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
            </div>
          )}

          {activeTab === "sources" && (
            <div ref={sourceScrollRef}>
              {playFrom &&
                playFrom.map((source, index) => (
                  <div
                    key={index}
                    ref={index === selectedSource ? selectedSourceRef : null}
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