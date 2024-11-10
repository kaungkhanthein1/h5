import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const homeApi = createApi({
  reducerPath: "homeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers) => {
      const settings = JSON.parse(
        localStorage.getItem("movieAppSettings") || "{}"
      );
      if (settings.filterToggle) {
        headers.set("X-Client-Setting", JSON.stringify({ "pure-mode": 1 }));
      } else {
        headers.set("X-Client-Setting", JSON.stringify({ "pure-mode": 0 }));
      }
      headers.set("Accept-Language", "en");
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getHeaderTopics: builder.query<any, void>({
      query: () => {
        return `/app/config`;
      },
    }),
    getRecommendedMovies: builder.query<any, void>({
      query: () => {
        return `/movie/index_recommend`;
      },
    }),
    getFilteredMovieByTopic: builder.query<any, void>({
      query: (id) => {
        return `/movie/${id}/recommend`;
      },
    }),
    getFilterByMoviesByTypeId: builder.query<any, any>({
      query: (id) => `/api/v1/movie/screen/list?type_id=${id}`,
    }),
  }),
});

export const {
  useGetRecommendedMoviesQuery,
  useGetFilteredMovieByTopicQuery,
  useGetHeaderTopicsQuery,
  useGetFilterByMoviesByTypeIdQuery,
} = homeApi;
