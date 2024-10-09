import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const explorerAPi = createApi({
  reducerPath: "explorerAPi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://cc3e497d.qdhgtch.com:2345/api/v1",
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
    getExploreList: builder.query<any, void>({
      query: () => {
        return `/movie/explore/list`;
      },
    }),
    getMovieTopicList: builder.query<any, void>({
      query: () => {
        return `/movie/topic`;
      },
    }),
    getMovieRankingList: builder.query<any, void>({
      query: () => {
        return `/movie/ranking/list`;
      },
    }),
    getMovieRankingById: builder.query<any, void>({
      query: (id) => {
        return `/movie/ranking/list?id=${id}`;
      },
    }),
    getWeeklyMovies: builder.query({
      query: (week: any) => {
        return `/movie/weekly?week_day=${week}`;
      },
    }),
  }),
});

export const {
  useGetExploreListQuery,
  useGetMovieTopicListQuery,
  useGetMovieRankingListQuery,
  useGetWeeklyMoviesQuery,
  useGetMovieRankingByIdQuery,
} = explorerAPi;
