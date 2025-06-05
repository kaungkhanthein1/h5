import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import VideoPlayer from "./video/VideoPlayer";
import SourceSelector from "./video/SourceSelector";
import DetailSection from "./video/DetailSection";
import EpisodeSelector from "./video/EpisodeSelector";
import Loader from "../search/components/Loader";
import noPlayImage from "../../assets/noplay.svg";
import RecommendedList from "./video/RecommendedList";
import AdsSection from "./video/AdsSection";
import NetworkError from "./video/NetworkError";
import { Episode, MovieDetail, AdsData } from "../../model/videoModel";
import {
  getMovieDetail,
  getAdsData,
  getEpisodesBySource,
  reportPlaybackProgress,
  parsePlaybackUrl,
  fetchCommentData,
} from "../../services/playerService";
import NewAds from "../../components/NewAds";
import {
  convertToSecureUrl,
  decryptWithAes,
} from "../../services/newEncryption";
import PlayerLoading from "./video/PlayerLoading";

const useDynamicHeight = () => {
  const [availableHeight, setAvailableHeight] = useState(300);
  const [hasElement, setHasElement] = useState(false);

  useEffect(() => {
    const calculateHeight = () => {
      const upperDiv = document.getElementById("upper-div");
      if (upperDiv) {
        const windowHeight = window.innerHeight;
        const upperDivHeight = upperDiv.offsetHeight;
        const tabsHeight = 60;
        const padding = 20;
        const calculated = windowHeight - upperDivHeight - tabsHeight - padding;
        setAvailableHeight(Math.max(calculated, 300));
        if (!hasElement) setHasElement(true);
      }
    };

    // Try immediately
    calculateHeight();

    if (!hasElement) {
      // Set up MutationObserver if element not found
      const observer = new MutationObserver((mutations) => {
        if (document.getElementById("upper-div")) {
          calculateHeight();
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Also try periodically as fallback
      const interval = setInterval(() => {
        if (document.getElementById("upper-div")) {
          calculateHeight();
          clearInterval(interval);
        }
      }, 100);

      window.addEventListener("resize", calculateHeight);

      return () => {
        observer.disconnect();
        clearInterval(interval);
        window.removeEventListener("resize", calculateHeight);
      };
    } else {
      // Element exists, just listen for resize
      window.addEventListener("resize", calculateHeight);
      return () => window.removeEventListener("resize", calculateHeight);
    }
  }, [hasElement]);

  return availableHeight;
};
// Custom hook for dynamic height calculation
// const useDynamicHeight = () => {
//   const [availableHeight, setAvailableHeight] = useState(300);

//   useEffect(() => {
//     const calculateHeight = () => {
//       const upperDiv = document.getElementById("upper-div");
//       const windowHeight = window.innerHeight;
//       console.log(upperDiv);

//       if (upperDiv) {
//         const upperDivHeight = upperDiv.offsetHeight;
//         const tabsHeight = 60; // Approximate height of tabs section
//         const padding = 20; // Additional padding/margin
//         const calculated = windowHeight - upperDivHeight - tabsHeight - padding;
//         console.log(calculated, "calculated height");
//         setAvailableHeight(Math.max(calculated, 300)); // Minimum 300px
//       }
//     };

//     calculateHeight();
//     window.addEventListener("resize", calculateHeight);

//     return () => window.removeEventListener("resize", calculateHeight);
//   }, []);

//   return availableHeight;
// };

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const availableHeight = useDynamicHeight();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [currentEpisodeNumber, setCurrentEpisodeNumber] = useState<number>(0);
  const [adsData, setAdsData] = useState<AdsData | null>(null);
  const [selectedSource, setSelectedSource] = useState(0);
  const [activeTab, setActiveTab] = useState("tab-1");
  const [resumeTime, setResumeTime] = useState(0);
  const [wholePageError, setWholePageError] = useState(false);
  const [errorVideoUrl, setErrorVideoUrl] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const [episodes, setEpisodes] = useState<any>([]);
  const [forwardedCount, setForwardedCount] = useState(-1);
  const [commentCount, setCommentCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isPlayerLoading, setIsPlayerLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const navigate = useNavigate();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response: any = await fetchCommentData(id || "");
      if (response) {
        const data: any = await decryptWithAes(response);
        setCommentCount(data?.data?.total);
      }
    } catch (err) {
      console.log("err is=>", err);
    }
  };
  const autoPlayNextSource = async () => {
    if (!movieDetail?.play_from) return;
    for (let i = selectedSource + 1; i < movieDetail.play_from.length; i++) {
      const nextSource = movieDetail.play_from[i];
      try {
        const res = await getEpisodesBySource(nextSource.code, id || "");
        setCurrentEpisode(res.data[0]);
        setEpisodes(res.data);
        setSelectedSource(i);
        if (res.data?.[0]) {
          setWholePageError(false);
        }
        return;
      } catch (error) {
        console.error("Error auto-playing next episode:", error);
      }
    }
  };

  const autoPlayNextEpisode = async () => {
    const nextEpisode = currentEpisodeNumber + 1;
    if (episodes?.length > nextEpisode) {
      setCurrentEpisode(episodes[nextEpisode]);
      setCurrentEpisodeNumber(nextEpisode);
    }
  };

  useEffect(() => {
    if (id) {
      setWholePageError(false);
      fetchMovieDetail();
      fetchAdsData();
    }
  }, [id]);

  const fetchAdsData = async () => {
    try {
      const res = await getAdsData();
      setAdsData(res.data);
    } catch (error) {
      console.error("Error fetching ads data:", error);
    }
  };

  const fetchMovieDetail = async (movieId = "") => {
    try {
      const res = await getMovieDetail(movieId || id || "");
      await setInitialEpisode(res?.data);
      await setMovieDetail(res?.data);
      setWholePageError(false);
      setIsPlayerLoading(false);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setIsPlayerLoading(false);
    }
  };

  const setInitialEpisode = async (mvDetail: any) => {
    if (mvDetail) {
      const playBackInfo = mvDetail.last_playback;
      if (playBackInfo && playBackInfo.movie_from) {
        const sourceIndex = mvDetail?.play_from?.findIndex(
          (x: any) => x.code === playBackInfo.movie_from
        );
        if (sourceIndex > -1) {
          const episodeIndex = mvDetail?.play_from[
            sourceIndex
          ]?.list?.findIndex(
            // eslint-disable-next-line eqeqeq
            (x: any) => x.episode_id == playBackInfo.episode_id
          );
          if (episodeIndex > -1) {
            const mvData = mvDetail?.play_from[sourceIndex]?.list[episodeIndex];
            if (!mvData.ready_to_play) {
              const parseData = await parsePlaybackUrl(
                mvData.episode_id,
                mvData.from_code,
                mvData.play_url,
                "1"
              );
              mvData.parseUrl = parseData?.data?.play_url;
            }
            setCurrentEpisode(mvData);
            setCurrentEpisodeNumber(episodeIndex);
            setEpisodes(mvDetail?.play_from[sourceIndex]?.list);
            setResumeTime(playBackInfo.current_time);
            return;
          } else {
            setCurrentEpisode(mvDetail?.play_from[0]);
            setEpisodes(mvDetail?.play_from[0]?.list);
          }
        }
      } else {
        // Fallback to the first available episode
        if (
          mvDetail?.play_from?.[selectedSource]?.list?.[currentEpisodeNumber]
        ) {
          const mvData = mvDetail?.play_from[selectedSource].list[0];
          if (!mvData.ready_to_play) {
            try {
              const parseData = await parsePlaybackUrl(
                mvData.episode_id,
                mvData.from_code,
                mvData.play_url,
                "1"
              );
              mvData.parseUrl = await parseData?.data?.play_url;
              setCurrentEpisode(mvData);
              setResumeTime(0);
            } catch (err) {
              setCurrentEpisode(mvData);
              setWholePageError(true);
            }
          } else {
            setCurrentEpisode(mvData);
            setResumeTime(0);
          }
          setEpisodes(mvDetail?.play_from[selectedSource].list);
        } else {
          setWholePageError(true);
        }
        if (mvDetail?.play_from && mvDetail?.play_from.length === 0) {
          setWholePageError(true);
        }
      }
    }
  };

  const handleEpisodeSelect = (episode: Episode) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const index = episodes.findIndex(
      (x: Episode) => x.episode_id === episode.episode_id
    );
    setCurrentEpisodeNumber(index > 0 ? index : 0);
    setCurrentEpisode(episode);
    setWholePageError(false);
    setResumeTime(0);
  };

  const navigateBackFunction = () => {
    if (currentEpisode) {
      reportProgress(currentEpisode);
    }
    setCurrentEpisode(null);
    navigate(forwardedCount);
    // navigate("/home");
  };

  const reportProgress = async (episode: Episode) => {
    if (!movieDetail || !episode) return;
    try {
      await reportPlaybackProgress(
        movieDetail.id,
        episode?.episode_id?.toString() || "",
        episode.from_code,
        movieDetail.last_playback?.duration || 0,
        resumeTime || 0
      );
    } catch (error) {
      console.error("Error reporting playback progress:", error);
    }
  };

  const switchNow = () => {
    setWholePageError(false);
    autoPlayNextSource();
  };

  useEffect(() => {
    if (currentEpisode) {
      // Removed window.scrollTo as we're controlling container scroll instead
    }
  }, [movieDetail, currentEpisode]);

  // Reset scroll position on initial load and when episode changes
  useEffect(() => {
    if (scrollContainerRef.current && currentEpisode) {
      // Small delay to ensure DOM is fully rendered
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
      }, 100);
    }
  }, [currentEpisode, movieDetail]);

  const handleVideoError = (errorUrl: string) => {
    // if (errorVideoUrl !== errorUrl && errorUrl) {
    //   setErrorVideoUrl(errorUrl);
    //   setWholePageError(true);
    // }
    setWholePageError(true);
  };

  useEffect(() => {
    if (currentEpisode?.play_url) {
      sendMovieDetailEventToNative(movieDetail);
      sendEventToNative(currentEpisode?.play_url);
    }
  }, [currentEpisode, movieDetail]);

  const sendEventToNative = async (url: string) => {
    if (
      (window as any).webkit &&
      (window as any).webkit.messageHandlers &&
      (window as any).webkit.messageHandlers.jsBridge
    ) {
      // Parse a fresh URL specifically for the native player
      if (currentEpisode && !currentEpisode.ready_to_play) {
        try {
          // Get a freshly parsed URL for the native player
          const parseData = await parsePlaybackUrl(
            currentEpisode.episode_id?.toString() || "",
            currentEpisode.from_code,
            currentEpisode.play_url,
            "1"
          );

          // Send the freshly parsed URL to native
          (window as any).webkit.messageHandlers.jsBridge.postMessage({
            eventName: "playUrl",
            value: parseData?.data?.play_url || url,
          });
        } catch (error) {
          console.error("Error parsing playback URL for native player:", error);
          // Fallback to sending the original URL if parsing fails
          (window as any).webkit.messageHandlers.jsBridge.postMessage({
            eventName: "playUrl",
            value: url,
          });
        }
      } else {
        // If ready_to_play or no parsing needed, just send the url as is
        (window as any).webkit.messageHandlers.jsBridge.postMessage({
          eventName: "playUrl",
          value: url,
        });
      }

      // Check if the next episode exists and is ready to play
      const nextEpisode = episodes?.[currentEpisodeNumber + 1];

      if (nextEpisode && !nextEpisode.ready_to_play) {
        try {
          // Always parse a fresh URL for the next episode for native player
          const parseData = await parsePlaybackUrl(
            nextEpisode.episode_id?.toString() || "",
            nextEpisode.from_code,
            nextEpisode.play_url,
            "1"
          );

          // Send the freshly parsed next episode URL to native
          (window as any).webkit.messageHandlers.jsBridge.postMessage({
            eventName: "playUrlForNextEpisode",
            value: parseData?.data?.play_url,
          });
        } catch (error) {
          console.error("Error parsing playback URL for next episode:", error);
        }
      } else if (nextEpisode) {
        // If the next episode is ready to play, send its URL directly
        (window as any).webkit.messageHandlers.jsBridge.postMessage({
          eventName: "playUrlForNextEpisode",
          value: nextEpisode.play_url,
        });
      }
    } else {
      console.warn("JS Bridge is not available in the current environment.");
    }
  };

  const sendMovieDetailEventToNative = (mDetail: any) => {
    if (
      (window as any).webkit &&
      (window as any).webkit.messageHandlers &&
      (window as any).webkit.messageHandlers.jsBridge
    ) {
      (window as any).webkit.messageHandlers.jsBridge.postMessage({
        eventName: "movieDetail",
        value: mDetail,
      });
    }
  };

  const sendEpisodeListEventToNative = (episodeList: any) => {
    if (
      (window as any).webkit &&
      (window as any).webkit.messageHandlers &&
      (window as any).webkit.messageHandlers.jsBridge
    ) {
      (window as any).webkit.messageHandlers.jsBridge.postMessage({
        eventName: "episodeList",
        value: episodeList,
      });
    }
  };

  useEffect(() => {
    if (episodes?.length > 0) {
      sendEpisodeListEventToNative(episodes);
    }
  }, [episodes]);

  // Reset scroll position when switching to tab-1
  useEffect(() => {
    if (activeTab === "tab-1" && scrollContainerRef.current) {
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
      }, 50);
    }
  }, [activeTab]);

  const handleChangeSource = async (nextSource: any) => {
    if (nextSource && nextSource.code && id) {
      setIsPlayerLoading(true);
      try {
        const res = await getEpisodesBySource(nextSource.code, id || "");
        const mvData = res.data?.[0];
        setWholePageError(false);
        if (!mvData?.ready_to_play) {
          const data = mvData;
          const response = await parsePlaybackUrl(
            data.episode_id,
            data.from_code,
            data.play_url,
            "1"
          );
          mvData.parseUrl = response?.data?.play_url;
        }
        if (currentEpisodeNumber > -1) {
          if (res.data?.length > currentEpisodeNumber) {
            setCurrentEpisode(res.data[currentEpisodeNumber]);
          } else {
            setCurrentEpisode(res.data[res.data?.length - 1]);
          }
        } else {
          setCurrentEpisode(res.data[0]);
        }
        setEpisodes(res.data);
      } catch (error) {
        console.error("Error auto-playing next episode:", error);
      } finally {
        setTimeout(() => {
          setIsPlayerLoading(false);
        }, 1500);
      }
    }
  };

  useEffect(() => {
    const handleIosEvent = (event: CustomEvent) => {
      const index = event.detail?.index || 0;
      setSelectedSource(Number(index));
      const nextSource = { code: event.detail.code };
      handleChangeSource(nextSource);
    };

    // Listen for the `iosEvent`
    window.addEventListener(
      "getSourceCode_iOS",
      handleIosEvent as EventListener
    );

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener(
        "getSourceCode_iOS",
        handleIosEvent as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const handleIosEvent = (event: CustomEvent) => {
      if (event?.detail?.episode_id && episodes?.length > 0) {
        const index = episodes.findIndex(
          (x: Episode) => x.episode_id == event.detail.episode_id
        );
        const episode = index >= 0 ? episodes[index] : episodes[0];
        handleEpisodeSelect(episode);
      }
    };

    // Listen for the `iosEvent`
    window.addEventListener(
      "getEpisodeId_iOS",
      handleIosEvent as EventListener
    );

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener(
        "getEpisodeId_iOS",
        handleIosEvent as EventListener
      );
    };
  }, [episodes]);

  const refresh = () => {
    setIsPlayerLoading(true);
    setWholePageError(false);
    fetchMovieDetail(movieDetail?.id);
  };

  const showRecommandMovie = (id: string) => {
    setCurrentEpisode(null);
    setMovieDetail(null);
    setSelectedSource(0);
    setCurrentEpisodeNumber(0);
    fetchMovieDetail(id);
  };
  return (
    <div className="bg-background full-height-fallback overflow-hidden">
      {!movieDetail ? (
        <>
          <PlayerLoading onBack={navigateBackFunction} />
          <div className="flex justify-center items-center pt-52 bg-background">
            <Loader />
          </div>
        </>
      ) : (
        <>
          <div className="sticky top-0 z-50">
            <div id="upper-div">
              {currentEpisode && !wholePageError ? (
                !isPlayerLoading ? (
                  <VideoPlayer
                    key={currentEpisode?.episode_id}
                    videoUrl={
                      !isPlayerLoading
                        ? currentEpisode?.parseUrl ||
                          currentEpisode?.play_url ||
                          ""
                        : ""
                    }
                    onBack={navigateBackFunction}
                    movieDetail={movieDetail}
                    selectedEpisode={currentEpisode}
                    resumeTime={resumeTime}
                    handleVideoError={handleVideoError}
                    autoPlayNextEpisode={autoPlayNextEpisode}
                  />
                ) : (
                  <PlayerLoading onBack={navigateBackFunction} />
                )
              ) : (
                <NetworkError
                  switchNow={switchNow}
                  refresh={refresh}
                  onBack={navigateBackFunction}
                />
              )}
            </div>
            <div
              className="relative flex px-2 justify-between items-center bg-background"
              style={{
                paddingBottom: "10px",
                borderBottom: "2px solid #2a2a2a",
              }}
            >
              <div className="flex">
                <div
                  className={`px-4 py-3 bg-background text-gray-400 rounded-t-lg cursor-pointer relative ${
                    activeTab === "tab-1" ? "text-white z-10" : ""
                  }`}
                  onClick={() => setActiveTab("tab-1")}
                >
                  <span className="text-white text-[16px]">详情</span>
                  {activeTab === "tab-1" && (
                    <div className="absolute bottom-0 left-3 w-4/6 h-1 bg-mainColor rounded-md"></div>
                  )}
                </div>
                <div
                  className={`px-4 py-3 bg-background text-gray-400 rounded-t-lg cursor-pointer relative ${
                    activeTab === "tab-2" ? "text-white z-10" : ""
                  }`}
                  onClick={() => setActiveTab("tab-2")}
                >
                  <span className=" text-[16px]">评论</span>
                  <span className="text-gray-500 ml-1.5 text-sm">
                    {commentCount > 99 ? "99+" : commentCount || 0}
                  </span>
                  {activeTab === "tab-2" && (
                    <div className="absolute bottom-0 left-3.5 w-3/6 h-1 bg-mainColor rounded-md"></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className={`${activeTab === "tab-1" ? "overflow-y-scroll" : ""}`}
            style={{
              height: activeTab === "tab-1" ? `${availableHeight}px` : "auto",
              minHeight: "auto",
            }}
          >
            <DetailSection
              adsData={adsData}
              movieDetail={movieDetail}
              id={id || ""}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setCommentCount={setCommentCount}
              commentCount={commentCount}
              setIsModalOpen={setIsModalOpen}
            />
            {activeTab === "tab-1" && (
              <>
                <SourceSelector
                  changeSource={handleChangeSource}
                  episodes={episodes || []}
                  selectedEpisode={currentEpisode}
                  onEpisodeSelect={handleEpisodeSelect}
                  movieDetail={movieDetail}
                  selectedSource={selectedSource}
                  setSelectedSource={setSelectedSource}
                  setIsModalOpen={setIsModalOpen}
                  isModalOpen={isModalOpen}
                />
                <EpisodeSelector
                  episodes={episodes || []}
                  onEpisodeSelect={handleEpisodeSelect}
                  selectedEpisode={currentEpisode}
                />

                {/* <div className="mt-8 px-4"> */}
                {/* {adsData && <AdsSection adsDataList={adsData?.player_recommend_up} />} */}
                {/* <NewAds section={"player_recommend_up"} fromMovie={true} /> */}
                {/* </div> */}
                <RecommendedList
                  data={movieDetail}
                  showRecommandMovie={showRecommandMovie}
                />
              </>
            )}
          </div>
        </>
      )}
      {visible && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background text-white text-lg font-medium px-4 py-2 rounded-lg shadow-md">
          没有更多资源了
        </div>
      )}
    </div>
  );
};

export default DetailPage;
