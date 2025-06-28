import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { convertToSecureUrl } from "../../../services/newEncryption";

export const explorerAPi = createApi({
  reducerPath: "explorerAPi",
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
  keepUnusedDataFor: 300, // 1 minute

  endpoints: (builder) => ({
    getExploreList: builder.query<any, any>({
      query: ({ id, sort, classData, area, year }) => {
        return convertToSecureUrl(
          `/movie/screen/list?type_id=${id}&&sort=${sort}&&class=${classData}&&area=${area}&&year=${year}`
        );
      },
      keepUnusedDataFor: 300, // 1 minute
    }),

    getMovieTopicList: builder.query<any, void>({
      query: () => {
        return convertToSecureUrl(`/movie/topic`);
      },
      keepUnusedDataFor: 300, // 1 minute
    }),
    getMovieRankingList: builder.query<any, void>({
      query: () => {
        return convertToSecureUrl(`/movie/ranking/list`);
      },
      keepUnusedDataFor: 300, // 1 minute
    }),
    getMovieRankingById: builder.query<any, void>({
      query: (id) => {
        return convertToSecureUrl(`/movie/ranking/list?id=${id}`);
      },
      keepUnusedDataFor: 300, // 1 minute
    }),
    getWeeklyMovies: builder.query({
      query: (week: any) => {
        return convertToSecureUrl(`/movie/weekly?week_day=${week}`);
      },
      keepUnusedDataFor: 300, // 1 minute
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
