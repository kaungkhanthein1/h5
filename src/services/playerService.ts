// movieService.ts
import api from "./apiService";
import {
  convertToSecurePayload,
  convertToSecureUrl,
  decryptWithAes,
} from "./newEncryption";

export const getMovieDetail = async (id: string) => {
  try {
    const response = await api.get(
      convertToSecureUrl(`/movie/detail?id=${id}`)
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const getconfigData = async (settings: any) => {
  try {
    const response: any = await api.get(convertToSecureUrl("/app/config"), {
      headers: {
        "X-Client-Version": 3098,
        "X-Client-Setting": JSON.stringify({
          "pure-mode": settings?.filterToggle ? 1 : 0,
        }),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching ads data:", error);
    throw error;
  }
};

export const getAdsData = async () => {
  try {
    const response: any = await api.get(convertToSecureUrl("/advert/config"), {
      headers: {
        "X-Client-Version": 3098,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching ads data:", error);
    throw error;
  }
};

export const fetchCommentData = async (id: string, page: number = 1) => {
  try {
    const response: any = await api.get(
      convertToSecureUrl(
        `${process.env.REACT_APP_API_URL}/movie/comments/index?movie_id=${id}&page=${page}&pageSize=10`
      ),
      {
        headers: {
          "X-Client-Version": 3098,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching ads data:", error);
    throw error;
  }
};

export const getEpisodesBySource = async (
  fromCode: string,
  movieId: string
) => {
  try {
    const response = await api.get(
      convertToSecureUrl(
        `/movie_addr/list?from_code=${fromCode}&movie_id=${movieId}`
      )
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching episodes:", error);
    throw error;
  }
};

const getToken = () => {
  const isLoggedIn = localStorage.getItem("authToken");
  const parsedLoggedIn = isLoggedIn ? JSON.parse(isLoggedIn) : null;
  return parsedLoggedIn?.data?.access_token;
};

export const reportPlaybackProgress = async (
  movieId: string,
  episodeId: string,
  fromCode: string,
  duration: number,
  currentTime: number
) => {
  const token = getToken();
  if (!token) return;
  try {
    const response = await api.post(
      "/movie_play/report",
      convertToSecurePayload({
        movie_id: movieId,
        episode_id: episodeId,
        movie_from: fromCode,
        duration: Math.floor(duration),
        current_time: Math.floor(currentTime),
      })
    );
    return response.data;
  } catch (error) {
    console.error("Error reporting playback progress:", error);
    throw error;
  }
};

export const fetchNextEpisode = async (fromCode: string, movieId: string) => {
  try {
    const response = await api.get(
      convertToSecureUrl(
        `/movie_addr/list?from_code=${fromCode}&movie_id=${movieId}`
      )
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching next episode:", error);
    throw error;
  }
};

export const parsePlaybackUrl = async (
  episode_id: string,
  from_code: string,
  play_url: string,
  refresh: string
) => {
  try {
    const response = await api.get(
      convertToSecureUrl(
        `/movie_addr/parse_url?type=play&episode_id=${episode_id}&from_code=${from_code}&play_url=${play_url}&refresh=${refresh}`
      )
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching next episode:", error);
    throw error;
  }
};
