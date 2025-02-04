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
  fetchCommentData
} from "../../services/playerService";
import NewAds from "../../components/NewAds";
import { convertToSecureUrl, decryptWithAes } from "../../services/newEncryption";
import PlayerLoading from './video/PlayerLoading';

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
  const navigate = useNavigate();

  useEffect(()=>{
    fetchComments();
  },[])

  const fetchComments = async () => {
    try {
      const response: any = await fetchCommentData(id || '');
      if (response) {
        const data: any = await decryptWithAes(response);
        setCommentCount(data?.data?.total);
      }
    } catch (err) {
      console.log('err is=>', err);
    }
  }
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
    if(episodes?.length > nextEpisode) {
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
      setWholePageError(false)
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
            if(!mvData.ready_to_play) {
              const parseData = await parsePlaybackUrl(mvData.episode_id, mvData.from_code, mvData.play_url, '1');
              mvData.play_url = parseData?.data?.play_url;
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
        if (mvDetail?.play_from?.[selectedSource]?.list?.[currentEpisodeNumber]) {
          const mvData = mvDetail?.play_from[selectedSource].list[0];
          if(!mvData.ready_to_play) {
            try {
              const parseData = await parsePlaybackUrl(mvData.episode_id, mvData.from_code, mvData.play_url, '1');
              mvData.play_url = await parseData?.data?.play_url;
              setCurrentEpisode(mvData);
              setResumeTime(0);
            } catch(err) {
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
        if(mvDetail?.play_from && mvDetail?.play_from.length === 0) {
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
    const index = episodes.findIndex((x: Episode)=> x.episode_id === episode.episode_id);
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
    if(currentEpisode) {
      window.scrollTo(0, 0);
    }
  }, [movieDetail, currentEpisode]);
  
  const handleVideoError = (errorUrl: string) => {
    // if (errorVideoUrl !== errorUrl && errorUrl) {
    //   setErrorVideoUrl(errorUrl);
    //   setWholePageError(true);
    // }
    setWholePageError(true);
  };

  useEffect(()=>{
    if(currentEpisode?.play_url) {
      sendMovieDetailEventToNative(movieDetail);
      sendEventToNative(currentEpisode?.play_url)
    }
  },[currentEpisode]);

  const sendEventToNative = async (url: string) => {
    if (
      (window as any).webkit &&
      (window as any).webkit.messageHandlers &&
      (window as any).webkit.messageHandlers.jsBridge
    ) {
      // Send the initial playUrl event
      (window as any).webkit.messageHandlers.jsBridge.postMessage({
        eventName: "playUrl",
        value: url,
      });
  
      // Check if the next episode exists and is ready to play
      const nextEpisode = episodes?.[currentEpisodeNumber + 1];
      
      if (nextEpisode) {
        if (!nextEpisode.ready_to_play) {
          try {
            // Parse the playback URL if the episode is not ready to play
            const parseData = await parsePlaybackUrl(
              nextEpisode.episode_id,
              nextEpisode.from_code,
              nextEpisode.play_url,
              '1'
            );
            
            // Update the play_url with the parsed value
            nextEpisode.play_url = parseData?.data?.play_url;
          } catch (error) {
            console.error("Error parsing playback URL for next episode:", error);
          }
        }
  
        // Send the next episode details to the native bridge
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

  useEffect(()=>{
    if(episodes?.length > 0) {
      sendEpisodeListEventToNative(episodes);
    }
  },[episodes])

  const handleChangeSource = async (nextSource: any) => {
    if (nextSource && nextSource.code && id) {
      setIsPlayerLoading(true);
      try {
        const res = await getEpisodesBySource(nextSource.code, id || "");
        const mvData = res.data?.[0];
        setWholePageError(false);
        if (!mvData?.ready_to_play) {
          const data = mvData;
          const response = await parsePlaybackUrl(data.episode_id, data.from_code, data.play_url, '1');
          mvData.play_url = response?.data?.play_url;
        }
        if(currentEpisodeNumber > -1) {
          if(res.data?.length > currentEpisodeNumber) {
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
        setTimeout(()=>{
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
    window.addEventListener("getSourceCode_iOS", handleIosEvent as EventListener);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("getSourceCode_iOS", handleIosEvent as EventListener);
    };
  }, []);

  useEffect(() => {
    const handleIosEvent = (event: CustomEvent) => {
      if(event?.detail?.episode_id && episodes?.length > 0) {
        const index = episodes.findIndex((x: Episode)=> x.episode_id == event.detail.episode_id);
        const episode = index >= 0 ? episodes[index] : episodes[0];
        handleEpisodeSelect(episode);
      }
    };

    // Listen for the `iosEvent`
    window.addEventListener("getEpisodeId_iOS", handleIosEvent as EventListener);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("getEpisodeId_iOS", handleIosEvent as EventListener);
    };
  }, [episodes]);

  const refresh = () => {
    setIsPlayerLoading(true);
    setWholePageError(false);
    fetchMovieDetail(movieDetail?.id);
  }

  const showRecommandMovie = (id: string) => {
    setCurrentEpisode(null);
    setMovieDetail(null);
    setSelectedSource(0);
    setCurrentEpisodeNumber(0);
    fetchMovieDetail(id);
  }
  return (
    <div className="bg-background min-h-screen">
      {!movieDetail ? (
        <>
          <PlayerLoading onBack={navigateBackFunction}/>
          <div className="flex justify-center items-center pt-52 bg-background">
            <Loader />
          </div>
        </>
      ) : (
        <>
          <div className="sticky top-0 z-50">
            <div id="upper-div">
              {(currentEpisode && !wholePageError) ? (
                !isPlayerLoading ?
              <VideoPlayer
                key={currentEpisode?.episode_id}
                videoUrl={!isPlayerLoading ? currentEpisode?.play_url || '' : ''}
                onBack={navigateBackFunction}
                movieDetail={movieDetail}
                selectedEpisode={currentEpisode}
                resumeTime={resumeTime}
                handleVideoError={handleVideoError}
                autoPlayNextEpisode={autoPlayNextEpisode}
              /> 
              : <PlayerLoading onBack={navigateBackFunction}/>
            ) : (
              <NetworkError switchNow={switchNow} refresh={refresh} onBack={navigateBackFunction}/>
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
                  <span className="text-white">详情</span>
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
                  <span>评论</span>
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

          <div className={`${activeTab === "tab-1" && "overflow-y-scroll"}`}>
            <DetailSection
              adsData={adsData}
              movieDetail={movieDetail}
              id={id || ""}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setCommentCount={setCommentCount}
              commentCount={commentCount}
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
                />
                <EpisodeSelector
                  episodes={episodes || []}
                  onEpisodeSelect={handleEpisodeSelect}
                  selectedEpisode={currentEpisode}
                />

                <div className="mt-8 px-4">
                  {/* {adsData && <AdsSection adsDataList={adsData?.player_recommend_up} />} */}
                  <NewAds section={"player_recommend_up"} fromMovie={true} />
                </div>
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
