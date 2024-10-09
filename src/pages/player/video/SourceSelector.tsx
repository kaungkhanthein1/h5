import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import ModalComponent from "./EpisodeModal";

interface Episode {
  episode_id: number | null;
  episode_name: string;
  play_url: string;
  from_code: string;
  ready_to_play: boolean;
}

interface MovieDetail {
  name: string;
  code: string;
  area: string;
  year: string;
  score: string;
  content: string;
  cover: string;
  type_name: string;
  tags: { name: string }[];
  comments_count: string;
  popularity_score: number;
  play_from: {
    name: string;
    code: string;
    list: Episode[];
    total: number | null;
    tips: string;
  }[];
  members: { name: string; type: number }[];
}

interface PlayFrom {
  name: string;
  total: number | null;
  tips: string;
  code: string;
}

interface SourceSelectorProps {
  episodes: Episode[]; // Episodes list
  onEpisodeChange: (episode: Episode) => void; // Callback to change the current episode
  onEpisodeSelect: (episode: Episode) => void;
  changeSource: (playfrom: PlayFrom) => void;
  selectedEpisode: Episode | null;
  movieDetail: MovieDetail;
  selectedSource: number;
  setSelectedSource: (source: number) => void; 
}

const SourceSelector: React.FC<SourceSelectorProps> = ({
  episodes,
  onEpisodeChange,
  onEpisodeSelect,
  selectedEpisode,
  changeSource,
  movieDetail,
  selectedSource,
  setSelectedSource
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [source, setSource] = useState<"episodes" | "sources">("episodes"); // Modal state

  // Open the modal
  const openModal = () => setIsModalOpen(true);

  // Close the modal
  const closeModal = () => setIsModalOpen(false);
  return (
    <div className="bg-black p-4 mb-4">
      {/* Section header with title and expand all */}
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-white text-base font-bold">Episodes</h4>

        {/* Expand All (展开全部) button triggers the modal */}
        <div className="flex items-center text-gray-400 text-sm">
          <button
            onClick={() => {
              openModal();
              setSource("episodes");
            }}
            className="flex items-center"
          >
            <span>Expand All</span>
            <FontAwesomeIcon icon={faChevronRight} className="ml-1 text-xs" />
          </button>
        </div>
      </div>

      {/* Source Selector Area */}
      {/* Source Selector Area */}
      {movieDetail && movieDetail.play_from && <div className="bg-[#C8A370] p-4 flex justify-between items-center rounded-lg shadow-sm mt-5">
        <div className="text-black leading-tight">
          {/* Display current playFrom source and number of videos */}
          <span className="text-sm">
            <span className="font-bold">
              {movieDetail.play_from.filter(x => x.code === selectedEpisode?.from_code)[0]?.name || "No Source Selected"}
            </span>{" "}
            {movieDetail.play_from.filter(x => x.code === selectedEpisode?.from_code)[0]?.total || 0} videos
          </span>
        </div>

        {/* Right Side: Switch resource (切换资源) button triggers the modal */}
        <button
          className="text-[#4B4B4B] flex items-center"
          onClick={() => {
            openModal();
            setSource("sources");
          }}
        >          
          <FontAwesomeIcon icon={faArrowsRotate} className="mr-2 text-lg" />
          <span className="font-semibold text-sm">Switch Resource</span>
        </button>
      </div>}

      {/* Modal */}
      {isModalOpen && (
        <ModalComponent
          changeSource={changeSource}
          onClose={closeModal}
          source={source}
          episodes={episodes}
          onEpisodeSelect={onEpisodeSelect}
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
          defaultEpisodeId={selectedEpisode?.episode_id || null} // Pass current episode ID as default
          playFrom={movieDetail.play_from} // You can add real sources here if needed
        />
      )}
    </div>
  );
};

export default SourceSelector;
