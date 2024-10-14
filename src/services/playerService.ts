// movieService.ts
import api from './apiService';

export const getMovieDetail = async (id: string) => {
  try {
    const response = await api.get(`/movie/detail?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export const getAdsData = async () => {
  try {
    const response = await api.get('/advert/config');
    return response.data;
  } catch (error) {
    console.error('Error fetching ads data:', error);
    throw error;
  }
};

export const getEpisodesBySource = async (fromCode: string, movieId: string) => {
  try {
    const response = await api.get(`/movie_addr/list?from_code=${fromCode}&movie_id=${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching episodes:', error);
    throw error;
  }
};

export const reportPlaybackProgress = async (
  movieId: string,
  episodeId: string,
  fromCode: string,
  duration: number,
  currentTime: number
) => {
  try {
    const response = await api.post('/movie_play/report', {
      movie_id: movieId,
      episode_id: episodeId,
      movie_from: fromCode,
      duration: Math.floor(duration),
      current_time: Math.floor(currentTime),
    });
    return response.data;
  } catch (error) {
    console.error('Error reporting playback progress:', error);
    throw error;
  }
};

export const fetchNextEpisode = async (fromCode: string, movieId: string) => {
  try {
    const response = await api.get(`/movie_addr/list?from_code=${fromCode}&movie_id=${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching next episode:', error);
    throw error;
  }
};