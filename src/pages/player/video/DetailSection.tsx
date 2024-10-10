import React, { useState } from "react";
import share from "../../../assets/share.png";
import star from "../../../assets/star.png";
import info from "../../../assets/info.png";
import selectedStar from "../../../assets/selectedStar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faTimes,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import CommentComponent from "./CommentSection";
import { useDispatch, useSelector } from "react-redux";
import { setAuthModel } from "../../../features/login/ModelSlice";
import FeedbackComponent from "./Feedback";
interface DetailSectionProps {
  movieDetail: {
    code: string;
    name: string;
    area: string;
    year: string;
    score: string;
    content: string;
    cover: string;
    type_name: string;
    is_collect: boolean;
    tags: { name: string }[];
    comments_count: string;
    popularity_score: number;
    members: { name: string; type: number }[];
  };
  adsData: {
    [key: string]: {
      type: number;
      location_id: number;
      channel: string;
      remarks: string;
      data: {
        image: string;
        url: string;
      };
    };
  } | null;
  id: string;
  activeTab: string;
  setActiveTab: (active: string) => void;
}

const DetailSection: React.FC<DetailSectionProps> = ({
  movieDetail,
  adsData,
  id,
  activeTab,
  setActiveTab
}) => {
  const adEntries = adsData && adsData.data ? Object.values(adsData.data) : []; // Extracting all the ads
  const [showModal, setShowModal] = useState(false); // For triggering modal
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStarred, setIsStarred] = useState<boolean>(movieDetail && movieDetail.is_collect ? true : false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false); // For triggering modal
  const [visible, setVisible] = useState(false);

  const handleCopy = () => {
    setVisible(true);
    setTimeout(() => setVisible(false), 2000); // Hide after 2 seconds
  };
  
  const handleDetailClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFeedbackModel = () => {
    setShowFeedbackModal(!showFeedbackModal);
  }
    const handleTabClick = async(tab: string) => {
      const loginResponse = await localStorage.getItem("authToken");
      const loginInfo = loginResponse ? JSON.parse(loginResponse || '') : null;

      if(loginInfo && loginInfo.data && loginInfo.data.access_token) {
        const authorization = `${loginInfo.data.token_type} ${loginInfo.data.access_token}`;
          if(tab === 'star') {
            handleStarToggle(authorization);
          } else if (tab === 'share') {
            handleShare(authorization);
          } else {
            handleFeedbackModel();
          }
      } else {
        dispatch(setAuthModel(true));
      }
    }

  const handleStarToggle = async (authorization: string) => {
    setIsLoading(true);
    try {
      // Toggle collection API call
      const response = await fetch('https://cc3e497d.qdhgtch.com:2345/api/v1/movie/collect/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorization,
        },
        body: JSON.stringify({
          movie_id: id,
          state: isStarred ? 0 : 1,
        }),
      });
      if (response.ok) {
        setIsStarred(!isStarred);
      } else {
        alert('收藏操作失败，请稍后重试');
      }
    } catch (error) {
      console.error('Error toggling star:', error);
      alert('收藏操作失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    // Create a textarea element to hold the text
    const textArea = document.createElement("textarea");
    textArea.value = text;
  
    // Position off-screen and make it invisible
    textArea.style.position = "fixed";
    textArea.style.top = "-1000px";
    textArea.style.opacity = "0";
  
    document.body.appendChild(textArea);
    textArea.select();
  
    try {
      document.execCommand('copy'); // This works on most browsers, including iOS Safari
      handleCopy(); // Show the "Link Copied" message
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  
    // Remove the textarea after copying
    document.body.removeChild(textArea);
  };

  const handleShare = async (authorization: string) => {
    setIsLoading(true);
    try {
      // Fetch share content API call
      const response = await fetch('https://cc3e497d.qdhgtch.com:2345/api/v1/user/get_share', {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorization,
        },
      });
      
      const data = await response.json();
      if (data && data.data && data.data.content) {
        copyToClipboard(data.data.content);
      } else {
        alert('获取分享内容失败，请稍后重试');
      }
    } catch (error) {
      console.error('Error fetching share content:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col w-full bg-black">
      {/* Tabs */}
      

      {/* Tab content */}
      <div className="bg-black p-5 rounded-b-lg">
        {activeTab === "tab-1" && (
          <div id="tab-1" className="block">
            {/* Movie Title and Info */}
            <div className="movie-info mb-4 flex-auto overflow-x-scroll">
              <h2 className="text-2xl font-bold text-white">
                {movieDetail.name || "暂无标题"}
              </h2>
              <div className="info text-gray-400 text-sm flex justify-between items-start overflow-x-auto space-x-2 mt-2">
                {/* Left Section: Flames, year, area, and tags */}
                <div className="left-section flex items-start flex-wrap space-x-2 max-w-[80%]">
                  <div className="rating flex items-center">
                    <div className="flames flex">
                      {Array(Math.max(1, movieDetail.popularity_score))
                        .fill("🔥")
                        .map((flame, index) => (
                          <span key={index} className="text-xl mr-1">
                            {flame}
                          </span>
                        ))}
                    </div>
                  </div>
                  <span>{movieDetail.year}</span>
                  <span>/</span>
                  <span>{movieDetail.area}</span>
                  <span>/</span>
                  <span>{movieDetail.type_name}</span>
                  {movieDetail.tags && movieDetail.tags.length > 0 && (
                    <>
                      {movieDetail.tags.map((tag, index) => (
                        <React.Fragment key={index}>
                          <span>/</span>
                          <span>{tag.name || "暂无标签"}</span>
                        </React.Fragment>
                      ))}
                    </>
                  )}
                </div>

                {/* Right Section: 简介 and Chevron Icon */}
                <div
                  className="right-section flex items-center"
                  onClick={handleDetailClick}
                >
                  <span className="font-semibold text-sm">简介</span>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="text-md ml-1"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="actions flex justify-between my-4">
              <button onClick={()=>handleTabClick('star')} className="action-btn flex flex-col items-center px-4 py-2 rounded-md">
                <img src={isStarred ? selectedStar : star} alt="" className={`${isStarred ? 'w-12 h-auto -mt-2' : 'h-7 mb-2'}`} />
                <span className="text-gray-200">收藏</span>
              </button>

              <button onClick={()=>handleTabClick('feedback')} className="flex flex-col items-center px-4 py-2 rounded-md">
                <img src={info} alt="" className="h-7 mb-2" />
                <span className="text-gray-200">反馈/求片</span>
              </button>

              <button onClick={()=>handleTabClick('share')} className="action-btn flex flex-col items-center px-4 py-2 rounded-md">
                <img src={share} alt="" className="h-7 mb-2" />
                <span className="text-gray-200">分享</span>
              </button>
            </div>
            {/* Warning Message */}
            <div className="warning p-2 bg-gray-800 rounded-md text-sm text-white text-center">
              切勿相信视频中的任何广告，谨防上当受骗！
            </div>
          </div>
        )}

              {visible && <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white text-lg font-medium px-4 py-2 rounded-lg shadow-md">
                  Link Copied
               </div>}

        {activeTab === "tab-2" ? (
          <div id="tab-2" className="block">
            {/* Comment section or other content */}
            <CommentComponent movieId={id} />
          </div>
        ) :
        <div className="mt-4">
          {adEntries.length > 0
            ? (() => {
                const randomIndex = Math.floor(
                  Math.random() * adEntries.length
                );
                const ad: any = adEntries[randomIndex % adEntries.length];
                return ad && ad.data && ad.data.image && ad.data.url ? (
                  <a
                    href={ad.data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={ad.data.image}
                      alt={`Ad ${randomIndex}`}
                      className="w-full h-auto rounded-md"
                    />
                  </a>
                ) : null;
              })()
            : null}{" "}
          {/* Don't render if no ad data */}
        </div>
}
      </div>

      {/* Modal for sharing */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="bg-black backdrop-blur-md w-full max-w-md h-[60vh] bottom-0 rounded-lg p-6 text-white overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Introduction</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-300 hover:text-white"
              >
                <FontAwesomeIcon icon={faTimes} className="text-lg" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="modal-content">
              {/* Movie Title and Information */}
              <h2 className="text-2xl font-bold mb-2">
                {movieDetail.name || "Unknown Title"}
              </h2>
              <div className="flex items-center text-sm text-gray-400 mb-4">
                <span className="text-orange-500 flex items-center">
                  <FontAwesomeIcon icon={faFire} className="mr-1" />
                  {movieDetail.popularity_score || 0}
                </span>
                <span className="mx-2">|</span>
                <span>{movieDetail.type_name || "Unknown Type"}</span>
                <span className="mx-2">/</span>
                <span>{movieDetail.year || "Unknown Year"}</span>
                <span className="mx-2">/</span>
                <span>{movieDetail.area || "Unknown Area"}</span>
              </div>

              {/* Cast Section */}
              <h3 className="text-lg font-semibold mt-4">Cast</h3>
              <div className="text-gray-400 text-sm mt-2">
                <div className="flex space-x-4">
                  {/* Director */}
                  <span>
                    Director:{" "}
                    <span className="text-white">
                      {movieDetail?.members?.find((member) => member.type === 3)
                        ?.name || "Unknown"}
                    </span>
                  </span>
                  {/* Screenwriter */}
                  <span>
                    Screenwriter:{" "}
                    <span className="text-white">
                      {movieDetail?.members?.find((member) => member.type === 2)
                        ?.name || "Unknown"}
                    </span>
                  </span>
                </div>
                {/* Actors */}
                <div className="mt-2">
                  <span>Actor(s): </span>
                  {movieDetail?.members
                    ?.filter((member) => member.type === 1)
                    .map((actor, index) => (
                      <span key={index} className="text-white">
                        {actor.name || "Unknown"}
                        {index <
                        movieDetail.members.filter(
                          (member) => member.type === 1
                        ).length -
                          1
                          ? ", "
                          : ""}
                      </span>
                    )) || <span className="text-white">Unknown</span>}
                </div>
              </div>

              {/* Introduction Section */}
              <h3 className="text-lg font-semibold mt-6">Introduction</h3>
              <p className="text-gray-300 mt-2 leading-relaxed">
                {movieDetail.content || "No description available."}
              </p>
            </div>
          </div>
        </div>
      )}
      {showFeedbackModal && <FeedbackComponent movieId={id} onActionComplete={handleTabClick} onClose={handleFeedbackModel} setIsLoading={setIsLoading}
            isLoading={isLoading}/>}
    </div>
  );
};

export default DetailSection;
