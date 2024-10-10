import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VideoPlayer from "./video/VideoPlayer4";
import SourceSelector from "./video/SourceSelector";
import DetailSection from "./video/DetailSection";
import EpisodeSelector from "./video/EpisodeSelector";
import Loader from "../search/components/Loader";

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
  const [selectedSource, setSelectedSource] = useState(0); // Track the selected source
  const [activeTab, setActiveTab] = useState("tab-1");
  const [resumeTime, setResumeTime] = useState<number>(0); // For resuming playback
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getMovieDetail();
      getAdsData();
    }
  }, [id]);

  const getAdsData = async () => {
    const res = await fetch(
      "https://cc3e497d.qdhgtch.com:2345/api/v1/advert/config"
    );
    const data = await res.json();
    setAdsData(data);
    console.log("data is=>", data);
  };

  // Fetch the movie details based on the provided id
  const getMovieDetail = async () => {
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
    if (playBackInfo) {
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
        setCurrentEpisode(playFrom[0].list[0]); // Set the first episode as default
        setResumeTime(0);
      }
    } else if (playFrom?.[0]?.list?.[0]) {
      setCurrentEpisode(playFrom[0].list[0]); // Set the first episode as default
      setResumeTime(0);
    }
  };

  const handleSelectedSource = async (ind: number) => {
    const code = movieDetail?.play_from[ind]?.code;
    const res = await fetch(
      `https://cc3e497d.qdhgtch.com:2345/api/v1/movie_addr/list?from_code=${code}&movie_id=${id}`
    );
    const data = await res.json();
    if (data.data[0].ready_to_play) {
      setSelectedSource(ind);
    }
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
      alert("Channel Unavailable");
    }
  };

  const handleEpisodeChange = (episode: Episode) => {
    setCurrentEpisode(episode);
  };

  const handleEpisodeSelect = (episode: Episode) => {
    setSelectedEpisode(episode);
  };

  const navigateBackFunction = () => {
    navigate(-1); // Go back to the previous page
  };

  const changeSource = (playfrom: PlayFrom) => {
    if (movieDetail?.play_from) {
      const ind: number = movieDetail?.play_from.findIndex(
        (x) => x.code === playfrom.code
      );
      if (ind >= 0) {
        getEpisodes(movieDetail?.play_from[ind]?.code || "");
        if (movieDetail?.play_from[ind]?.list?.[0]) {
          setCurrentEpisode(movieDetail.play_from[ind].list[0]); // Set the first episode as default
          setSelectedEpisode(movieDetail.play_from[ind].list[0]); // Set the first episode as default
        }
      }
    }
  };

  return (
    <div className="bg-black min-h-screen">
      {!movieDetail || !currentEpisode ? (
        <div className="flex justify-center items-center mt-52 bg-black">
          <Loader />
        </div>
      ) : (
        <>
          {(selectedEpisode && selectedEpisode.ready_to_play) ||
          (currentEpisode && currentEpisode.ready_to_play) ? (
            <div className="sticky top-0 z-50">
              <VideoPlayer
                key={selectedEpisode?.episode_id || currentEpisode?.episode_id}
                videoUrl={selectedEpisode?.play_url || currentEpisode?.play_url}
                onBack={navigateBackFunction}
                movieDetail={movieDetail}
                selectedEpisode={selectedEpisode || currentEpisode}
                resumeTime={resumeTime}
              />
              <div className="relative flex px-2 justify-between items-center bg-black pb-2">
            <div className="flex">
              <div
                className={`px-4 py-3 bg-black text-gray-400 rounded-t-lg cursor-pointer relative ${
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
                className={`px-4 py-3 bg-black text-gray-400 rounded-t-lg cursor-pointer relative ${
                  activeTab === "tab-2" ? "text-white z-10" : ""
                }`}
                onClick={() => setActiveTab("tab-2")}
              >
                <span>评论</span>
                <span className="text-gray-500">
                  {" "}
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
            <div className="relative flex justify-center items-center w-full min-h-[50vh] my-8">
              <div className="absolute inset-0 bg-black opacity-75"></div>
              <div className="relative z-10 flex flex-col items-center p-8 bg-opacity-90 text-center text-white rounded-lg shadow-lg max-w-md mx-auto">
                <p className="text-2xl font-bold mb-6 tracking-wider">
                  Oops! Video Not Found
                </p>
                <button
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold rounded-full shadow-md hover:from-teal-400 hover:to-blue-500 hover:shadow-lg transition-all duration-300 ease-in-out"
                  onClick={navigateBackFunction}
                >
                  Go Back
                </button>
              </div>
            </div>
          )}
          
          <div className="overflow-y-scroll">
            <DetailSection
              adsData={adsData}
              movieDetail={movieDetail} // Pass movie details to DetailSection
              id={id || ""}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              // activeTab={detailActiveTab}
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
                  movieDetail={movieDetail} // Pass movie details to DetailSection
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
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DetailPage;
