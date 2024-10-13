import React, { useEffect, useState } from "react";
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

interface PlayFrom {
  name: string;
  total: number | null;
  tips: string;
  code: string;
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

interface AdsData {
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
}

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [adsData, setAdsData] = useState<AdsData | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedSource, setSelectedSource] = useState(0);
  const [activeTab, setActiveTab] = useState("tab-1");
  const [resumeTime, setResumeTime] = useState<number>(0);
  const [autoSwitch, setAutoSwitch] = useState<number | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [wholePageError, setWholePageError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (autoSwitch !== null) {
      const interval = setInterval(() => {
        setAutoSwitch((prevCount) => {
          if (prevCount !== null && prevCount > 0) {
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
    try {
      if (movieDetail?.play_from) {
        let currentSourceIndex = selectedSource;

        for (
          let i = currentSourceIndex + 1;
          i < movieDetail.play_from.length;
          i++
        ) {
          const nextSource = movieDetail.play_from[i];
          const res = await fetch(
            `https://cc3e497d.qdhgtch.com:2345/api/v1/movie_addr/list?from_code=${nextSource.code}&movie_id=${id}`
          );
          const data = await res.json();
          if (data.data && data.data.length > 0 && data.data[0].ready_to_play) {
            setEpisodes(data.data);
            setCurrentEpisode(data.data[0]);
            setSelectedEpisode(data.data[0]);
            setSelectedSource(i);
            setAutoSwitch(null);
            setVideoError(false);
            return;
          } else {
            setAutoSwitch(null);
            setVideoError(false);
          }
        }
        // navigate('/home');
        setWholePageError(true);
        console.warn("No more playable episodes found.");
      }
    } catch (error) {
      console.error("Error auto-playing next episode:", error);
    }
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
        loginInfo && loginInfo.data && loginInfo.data.token_type
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
      setMovieDetail(data?.data);
      const playBackInfo = data?.data?.last_playback || null;
      const playFrom = data?.data?.play_from || null;
      if (playBackInfo && playBackInfo.code) {
        const ind = playFrom.findIndex(
          (x: any) => x.code === playBackInfo?.movie_from
        );
        if (ind > -1) {
          if (ind === 0) {
            const episodeInd = playFrom[0].list.findIndex(
              (x: any) => x.episode_id === playBackInfo.episode_id
            );
            if (episodeInd > -1) {
              setCurrentEpisode(playFrom[0].list[episodeInd]);
              setResumeTime(playBackInfo.current_time);
            }
          } else {
            const code = playFrom[ind]?.code;
            const res = await fetch(
              `https://cc3e497d.qdhgtch.com:2345/api/v1/movie_addr/list?from_code=${code}&movie_id=${id}`
            );
            const episodes = await res.json();
            const episodeInd = episodes.data.findIndex(
              (x: any) => x.episode_id === playBackInfo.episode_id
            );
            if (episodeInd > -1) {
              setCurrentEpisode(episodes.data[episodeInd]);
              setResumeTime(playBackInfo.current_time);
            }
          }
        } else {
          setCurrentEpisode(playFrom[0]?.list[0]);
          setResumeTime(0);
        }
      } else if (playFrom?.[0]?.list?.[0]) {
        setSelectedEpisode(playFrom[0]?.list[0])
        setCurrentEpisode(playFrom[0]?.list[0]);
        setResumeTime(0);
      }
      if((playBackInfo && playBackInfo.ready_to_play) || (playFrom?.[0]?.list?.[0] && playFrom?.[0]?.list?.[0].ready_to_play)) {
        setVideoError(false);
        setAutoSwitch(null);
      } else {
        setVideoError(true);
        setAutoSwitch(6);
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const handleSelectedSource = async (ind: number) => {
    try {
      const code = movieDetail?.play_from[ind]?.code;
      const res = await fetch(
        `https://cc3e497d.qdhgtch.com:2345/api/v1/movie_addr/list?from_code=${code}&movie_id=${id}`
      );
      const data = await res.json();
      if (data.data[0].ready_to_play) {
        setSelectedSource(ind);
      }
    } catch (error) {
      console.error("Error selecting source:", error);
    }
  };

  const handleEpisodeChange = (episode: Episode) => {
    setCurrentEpisode(episode);
  };

  const handleEpisodeSelect = (episode: Episode) => {
    setSelectedEpisode(episode);
  };

  const navigateBackFunction = () => {
    navigate('/home');
  };

  const getEpisodes = async (code: string) => {
    const res = await fetch(
      `https://cc3e497d.qdhgtch.com:2345/api/v1/movie_addr/list?from_code=${code}&movie_id=${id}`
    );
    const data = await res.json();
    if (data.data[0].ready_to_play) {
      setCurrentEpisode(data.data[0]);
      setEpisodes(data.data);
    } else {
      setSelectedSource(selectedSource);
      // alert("Channel Unavailable");
    }
  };

  const changeSource = (playfrom: PlayFrom) => {
    if (movieDetail?.play_from) {
      const ind: number = movieDetail?.play_from.findIndex(
        (x) => x.code === playfrom.code
      );
      if (ind >= 0) {
        getEpisodes(movieDetail?.play_from[ind]?.code || "");
        if (movieDetail?.play_from[ind]?.list?.[0]) {
          setCurrentEpisode(movieDetail.play_from[ind].list[0]);
          setSelectedEpisode(movieDetail.play_from[ind].list[0]);
        }
      }
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {!wholePageError && 
      <>
      {!movieDetail || !currentEpisode ? (
        <div className="flex justify-center items-center pt-52 bg-background">
          <Loader />
        </div>
      ) : (
        <>
          {((selectedEpisode && selectedEpisode.ready_to_play) ||
            (currentEpisode && currentEpisode.ready_to_play)) &&
          !videoError ? (
            <div className="sticky top-0 z-50">
              <VideoPlayer
                key={selectedEpisode?.episode_id || currentEpisode?.episode_id}
                videoUrl={selectedEpisode?.play_url || currentEpisode?.play_url}
                onBack={navigateBackFunction}
                movieDetail={movieDetail}
                selectedEpisode={selectedEpisode || currentEpisode}
                autoPlayNextEpisode={autoPlayNextEpisode}
                resumeTime={resumeTime}
                setVideoError={setVideoError}
                setAutoSwitch={setAutoSwitch}
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
              <div className="relative z-10 flex flex-col items-center p-8 text-center text-white max-w-md mx-auto">
                <p className="text-sm mb-4 tracking-wide text-gray-400">
                  Playback Error Or Connection Issue? We'll Automatically Switch
                  To The Next Available Line
                </p>
                <div className="flex space-x-4">
                  <button
                    className="px-6 py-2 bg-gray-700 text-white font-semibold rounded-full shadow-md hover:bg-gray-600 transition-all duration-300 ease-in-out"
                    onClick={navigateBackFunction}
                  >
                    Cancel
                  </button>
                  <button className="px-6 py-2 bg-gradient-to-r from-gray-400 to-gray-700 text-white font-semibold rounded-full shadow-md transition-all duration-300 ease-in-out">
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
                  changeSource={changeSource}
                  episodes={
                    episodes && episodes.length > 0
                      ? episodes
                      : movieDetail.play_from[0]?.list || []
                  }
                  onEpisodeChange={handleEpisodeChange}
                  onEpisodeSelect={handleEpisodeSelect}
                  selectedEpisode={selectedEpisode || currentEpisode}
                  movieDetail={movieDetail}
                  selectedSource={selectedSource}
                  setSelectedSource={handleSelectedSource}
                />
                <EpisodeSelector
                  episodes={
                    episodes && episodes.length > 0
                      ? episodes
                      : movieDetail.play_from[0]?.list || []
                  }
                  onEpisodeSelect={handleEpisodeSelect}
                  selectedEpisode={selectedEpisode || currentEpisode}
                />

                <div className="mt-8 px-4">
                  <AdsSection adsData={adsData} />
                </div>
                <RecommendedList data={movieDetail} />
              </>
            )}
          </div>
        </>
      )}
      </>
    }
      {wholePageError && <NetworkError onBack={navigateBackFunction} />}
    </div>
  );
};

export default DetailPage;