import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import ModalComponent from "./EpisodeModal";
import { Episode, MovieDetail } from '../../../model/videoModel';


interface SourceSelectorProps {
  episodes: Episode[]; // Episodes list
  // onEpisodeChange: (episode: Episode) => void; // Callback to change the current episode
  onEpisodeSelect: (episode: Episode) => void;
  changeSource: (playfrom: any) => void;
  selectedEpisode: Episode | null;
  movieDetail: MovieDetail;
  selectedSource: number;
  setSelectedSource: (source: number) => void; 
}

const SourceSelector: React.FC<SourceSelectorProps> = ({
  episodes,
  // onEpisodeChange,
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
    <div className="bg-background p-4 mb-4">
      {/* Section header with title and expand all */}
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-white text-base font-bold">选集</h4>

        {/* Expand All (展开全部) button triggers the modal */}
        <div className="flex items-center text-gray-400 text-sm">
          <button
            onClick={() => {
              openModal();
              setSource("episodes");
            }}
            className="flex items-center"
          >
            <span>展开全部</span>
            <FontAwesomeIcon icon={faChevronRight} className="ml-1 text-xs" />
          </button>
        </div>
      </div>

      {/* Source Selector Area */}
      {/* Source Selector Area */}
      {movieDetail && movieDetail.play_from && <div className="p-4 flex justify-between items-center rounded-lg shadow-sm mt-5" style={{background: "linear-gradient(100deg, #FEE4B3 0%, #FFD993 100%)"}}>
        <div className="text-channel leading-tight">
          {/* Display current playFrom source and number of videos */}
          <span className="text-sm">
            <span className="font-bold">
              {movieDetail.play_from[selectedSource]?.name || "未选择来源"}
            </span>{" "}
            <span className="text-channelSecondary">{movieDetail?.play_from[selectedSource]?.total || 0} 个视频</span>
          </span>
        </div>

        {/* Right Side: Switch resource (切换资源) button triggers the modal */}
        <button
          className="text-channel flex items-center"
          onClick={() => {
            openModal();
            setSource("sources");
          }}
        >          
          {/* <FontAwesomeIcon icon={faArrowsRotate} className="mr-2 text-lg" /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M4.55252 3.69401C6.06465 2.38373 7.99918 1.66372 10 1.66651C14.6025 1.66651 18.3334 5.39735 18.3334 9.99984C18.3334 11.7798 17.775 13.4298 16.825 14.7832L14.1667 9.99984H16.6667C16.6668 8.69286 16.2827 7.41468 15.5622 6.32422C14.8418 5.23377 13.8166 4.37914 12.6143 3.86662C11.412 3.35409 10.0856 3.20626 8.79998 3.44153C7.51435 3.67679 6.32623 4.28476 5.38335 5.18985L4.55252 3.69401ZM15.4475 16.3057C13.9354 17.616 12.0009 18.336 10 18.3332C5.39752 18.3332 1.66669 14.6023 1.66669 9.99984C1.66669 8.21984 2.22502 6.56984 3.17502 5.21651L5.83335 9.99984H3.33335C3.33325 11.3068 3.71731 12.585 4.4378 13.6755C5.15829 14.7659 6.18341 15.6205 7.3857 16.1331C8.588 16.6456 9.91442 16.7934 11.2001 16.5582C12.4857 16.3229 13.6738 15.7149 14.6167 14.8098L15.4475 16.3057Z"
              fill="#522B0F"
              fill-opacity="0.6"
            />
          </svg>
          <span className="font-semibold text-sm ml-1">切换资源</span>
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
