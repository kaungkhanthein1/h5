import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VideoPlayer from "./video/VideoPlayer5";
import SourceSelector from "./video/SourceSelector";
import DetailSection from "./video/DetailSection";
import EpisodeSelector from "./video/EpisodeSelector";
import Loader from "../search/components/Loader";
import noPlayImage from "../../assets/noplay.svg";
import RecommendedList from "./video/RecommendedList";
import AdsSection from "./video/AdsSection";
import NetworkError from "./video/NetworkError";

interface Episode {
  episode_id: number | null;
  episode_name: string;
  play_url: string;
  from_code: string;
  ready_to_play: boolean;
}

interface MovieDetail {
  code: string;
  name: string;
  area: string;
  year: string;
  score: string;
  is_collect: boolean;
  content: string;
  cover: string;
  id: string;
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
  last_playback: {
    current_time: number;
    duration: number;
    episode_id: number;
    id: string;
    movie_from: string;
  };
  members: { name: string; type: number }[];
}

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [adsData, setAdsData] = useState(null);
  const [selectedSource, setSelectedSource] = useState(0);
  const [activeTab, setActiveTab] = useState("tab-1");
  const [resumeTime, setResumeTime] = useState(0);
  const [autoSwitch, setAutoSwitch] = useState<number | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [wholePageError, setWholePageError] = useState(false);
  const [errorVideoUrl, setErrorVideoUrl] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);
  const activeRequestIdRef = useRef<string | null>(null);
  const [episodes, setEpisodes] = useState<any>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (autoSwitch !== null) {
      const interval = setInterval(() => {
        setAutoSwitch((prevCount) => {
          if (prevCount && prevCount > 0) {
            return prevCount - 1;
          } else {
            clearInterval(interval);
            autoPlayNextEpisode();
            return null;
          }
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [autoSwitch]);

  const autoPlayNextEpisode = async () => {
    if (!movieDetail?.play_from) return;
    for (let i = selectedSource + 1; i < movieDetail.play_from.length; i++) {
      const nextSource = movieDetail.play_from[i];
      try {
        const res = await fetch(
          `https://cc3e497d.qdhgtch.com:2345/api/v1/movie_addr/list?from_code=${nextSource.code}&movie_id=${id}`);
        const data = await res.json();
          setCurrentEpisode(data.data[0]);
          console.log('111', data)
          setEpisodes(data.data);
          setSelectedSource(i);
        if (data.data?.[0]?.ready_to_play) {
          setAutoSwitch(null);
          setVideoError(false);
        } else {
          setAutoSwitch(6);
          setVideoError(true);
          setErrorVideoUrl(data.data?.[0]?.play_url);
        }
        return;
      } catch (error) {
        console.error("Error auto-playing next episode:", error);
      }
    }
    setWholePageError(true);
  };

  useEffect(() => {
    if (id) {
      setAutoSwitch(null);
      setVideoError(false);
      getMovieDetail();
      getAdsData();
    }
  }, [id]);

  const getAdsData = async () => {
    try {
      const res = await fetch(
        "https://cc3e497d.qdhgtch.com:2345/api/v1/advert/config"
      );
      const data = await res.json();
      setAdsData(data);
    } catch (error) {
      console.error("Error fetching ads data:", error);
    }
  };

  const getMovieDetail = async () => {
    try {
      const loginResponse = await localStorage.getItem("authToken");
      const loginInfo = loginResponse ? JSON.parse(loginResponse) : null;
      const authorization =
        loginInfo?.data?.token_type && loginInfo?.data?.access_token
          ? `${loginInfo.data.token_type} ${loginInfo.data.access_token}`
          : "";

      if (!authorization) {
        localStorage.removeItem("authToken");
      }

      const header = authorization
        ? {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: authorization,
            },
          }
        : { method: "GET" };

      const res = await fetch(
        `https://cc3e497d.qdhgtch.com:2345/api/v1/movie/detail?id=${id}`,
        header
      );
      const data = await res.json();
      console.log("data.data is=>", data.data);
      setMovieDetail(data?.data);
      setInitialEpisode(data?.data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const setInitialEpisode = (mvDetail: any) => {
    console.log("movieDetail,playFrom =>", mvDetail);
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
            (x: any) => x.episode_id === playBackInfo.episode_id
          );
          if (episodeIndex > -1) {
            setCurrentEpisode(
              mvDetail?.play_from[sourceIndex]?.list[episodeIndex]
            );
            console.log('205', mvDetail)
            setEpisodes(mvDetail?.play_from[sourceIndex]?.list);
            setResumeTime(playBackInfo.current_time);
            return;
          }
        }
        if(!playBackInfo.ready_to_play) {
          setAutoSwitch(6);
          setVideoError(true);
          setErrorVideoUrl(playBackInfo?.play_url);
        }
      } else {
        // Fallback to the first available episode
        if (mvDetail?.play_from?.[0]?.list?.[0]) {
          setCurrentEpisode(mvDetail?.play_from[0].list[0]);
          setResumeTime(0);
        } 
        if (mvDetail?.play_from?.[0]?.list?.[0] && !mvDetail?.play_from?.[0]?.list?.[0].ready_to_play) {
          setAutoSwitch(6);
          setVideoError(true);
          setErrorVideoUrl(mvDetail?.play_from?.[0]?.list?.[0].play_url);
        }
      }
    }
  };

  const handleEpisodeSelect = (episode: Episode) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setCurrentEpisode(episode);
    setResumeTime(0);
  };

  const navigateBackFunction = () => {
    if (currentEpisode) {
      reportProgress(currentEpisode);
    }
    navigate("/home");
  };

  const reportProgress = async (episode: Episode) => {
    const token = getToken();
    if (!token || !currentEpisode) return;
    try {
      await fetch(
        "https://cc3e497d.qdhgtch.com:2345/api/v1/movie_play/report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            movie_id: movieDetail?.id,
            episode_id: episode.episode_id,
            movie_from: episode.from_code,
            duration: Math.floor(movieDetail?.last_playback?.duration || 0),
            current_time: Math.floor(resumeTime || 0),
          }),
        }
      );
    } catch (error) {
      console.error("Error reporting playback progress:", error);
    }
  };

  const getToken = (): string | null => {
    const isLoggedIn = localStorage.getItem("authToken");
    const parsedLoggedIn = isLoggedIn ? JSON.parse(isLoggedIn) : null;
    return parsedLoggedIn?.data?.access_token || null;
  };

  const switchNow = () => {
    setAutoSwitch(null);
    setVideoError(false);
    autoPlayNextEpisode();
  };

  const handleVideoError = (errorUrl: string) => {
    console.log('errorVideoUrl , errorUrl', errorVideoUrl, errorUrl);
    if((errorVideoUrl !== errorUrl) && errorUrl) {
      setAutoSwitch(6);
      setVideoError(true);
      setErrorVideoUrl(errorUrl);
    }
  }

  return (
    <div className="bg-background min-h-screen">
      {!wholePageError ? (
        !movieDetail || !currentEpisode ? (
          <div className="flex justify-center items-center pt-52 bg-background">
            <Loader />
          </div>
        ) : (
          <>
            {currentEpisode.ready_to_play && !videoError ? (
              <div className="sticky top-0 z-50">
                <VideoPlayer
                  key={currentEpisode.episode_id}
                  videoUrl={currentEpisode.play_url}
                  onBack={navigateBackFunction}
                  movieDetail={movieDetail}
                  selectedEpisode={currentEpisode}
                  resumeTime={resumeTime}
                  handleVideoError={handleVideoError}
                />
                <div className="relative flex px-2 justify-between items-center bg-background pb-2">
                  <div className="flex">
                    <div
                      className={`px-4 py-3 bg-background text-gray-400 rounded-t-lg cursor-pointer relative ${
                        activeTab === "tab-1" ? "text-white z-10" : ""
                      }`}
                      onClick={() => setActiveTab("tab-1")}
                    >
                      <span className="text-white">详情</span>
                      {activeTab === "tab-1" && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500"></div>
                      )}
                    </div>
                    <div
                      className={`px-4 py-3 bg-background text-gray-400 rounded-t-lg cursor-pointer relative ${
                        activeTab === "tab-2" ? "text-white z-10" : ""
                      }`}
                      onClick={() => setActiveTab("tab-2")}
                    >
                      <span>评论</span>
                      <span className="text-gray-500">
                        {movieDetail.comments_count || "0"}
                      </span>
                      {activeTab === "tab-2" && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="sticky top-0 z-50 flex justify-center items-center w-full min-h-[40vh] bg-background"
                style={{
                  backgroundImage: `url(${noPlayImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                      {/* Back Arrow */}
                <div className="absolute top-4 left-4 z-50">
                  <button className="text-white text-2xl" onClick={()=>navigate('/home')}>
                    ← {/* Replace with your actual back arrow component or icon */}
                  </button>
                </div>

                <div className="relative z-10 flex flex-col items-center p-8 text-center text-white max-w-md mx-auto">
                  <p className="text-sm mb-4 tracking-wide text-gray-400">
                    Playback Error Or Connection Issue? We'll Automatically
                    Switch To The Next Available Line
                  </p>
                  <div className="flex space-x-4">
                    <button
                      className="px-6 py-2 bg-gray-700 text-white font-semibold rounded-full shadow-md hover:bg-gray-600 transition-all duration-300 ease-in-out"
                      onClick={navigateBackFunction}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={switchNow}
                      className="px-6 py-2 bg-gradient-to-r from-gray-400 to-gray-700 text-white font-semibold rounded-full shadow-md transition-all duration-300 ease-in-out"
                    >
                      Switch in {autoSwitch || 0}s
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className={`${activeTab === "tab-1" && "overflow-y-scroll"}`}>
              <DetailSection
                adsData={adsData}
                movieDetail={movieDetail}
                id={id || ""}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              {activeTab === "tab-1" && (
                <>
                  <SourceSelector
                    changeSource={setInitialEpisode}
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
                    {adsData && <AdsSection adsData={adsData} />}
                  </div>
                  <RecommendedList data={movieDetail} />
                </>
              )}
            </div>
          </>
        )
      ) : (
        <NetworkError onBack={navigateBackFunction} />
      )}
    </div>
  );
};

export default DetailPage;
