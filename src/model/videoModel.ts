export interface Episode {
    episode_id: number | null;
    episode_name: string;
    play_url: string;  // Ensure this field is present if required
    from_code: string;
    ready_to_play: boolean;
  }
  

 export interface MovieDetail {
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

export interface VideoPlayerProps {
  videoUrl: string;
  onBack: () => void;
  movieDetail: MovieDetail;
  selectedEpisode?: Episode | null;
  resumeTime: number;
  handleVideoError: (videlUrl: string) => void
}

export interface PlayFrom {
  name: string;
  total: number | null;
  tips: string;
  code: string;
}

export interface EpisodeSelectorProps {
  episodes: Episode[];
  selectedEpisode: Episode | null;
  onEpisodeSelect: (episode: Episode) => void;
}

export interface ModalComponentProps {
  onClose: () => void;
  changeSource: (playfrom: PlayFrom) => void;
  source: "episodes" | "sources";
  episodes: Episode[];
  onEpisodeSelect: (episode: Episode) => void;
  playFrom: PlayFrom[];
  defaultEpisodeId: number | null;
  selectedSource: number;
  setSelectedSource: (source: number) => void;
}

export interface DetailSectionProps {
  movieDetail: MovieDetail;
  adsData: AdsData | null;
  id: string;
  activeTab: string;
  setActiveTab: (active: string) => void;
  setCommentCount: (count: number) => void
  commentCount: number;
}

export interface AdsData {
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