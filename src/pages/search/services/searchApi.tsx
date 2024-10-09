// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const searchApi = createApi({
//   reducerPath: "searchApi",
//   tagTypes: ["SearchMovie"] as const,

//   baseQuery: fetchBaseQuery({
//     baseUrl: "https://cc3e497d.qdhgtch.com:2345/api/v1",
//     prepareHeaders: (headers) => {
//       headers.set("Accept-Language", "en");
//       return headers;
//     },
//   }),

//   endpoints: (builder) => ({
//     getSearchMovie: builder.query<any, any>({
//       query: (data) => {
//         const { keyword, page, sort, type_id, res_type } = data;
//         return {
//           url: `movie/search?keyword=${keyword}&&page=${page}&&sort=${sort}&&type_id=${type_id}&&res_type=${res_type}`,
//         };
//       },
//       providesTags: (result, error, arg): any[] => [
//         { type: "SearchMovie", id: arg },
//       ],
//     }),

//     getTags: builder.query<any, void>({
//       query: () => {
//         return `/app/config`;
//       },
//     }),

//     getAds: builder.query<any, void>({
//       query: () => {
//         return `/advert/config`;
//       },
//     }),
//     getSearchLate: builder.query<any, void>({
//       query: () => {
//         return `/movie/search_lately_words`;
//       },
//     }),
//     getSearchRanking: builder.query<any, void>({
//       query: () => {
//         return `/movie/search_ranking`;
//       },
//     }),
//   }),
// });

// export const {
//   useGetSearchMovieQuery,
//   useGetTagsQuery,
//   useGetAdsQuery,
//   useGetSearchLateQuery,
//   useGetSearchRankingQuery,
// } = searchApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const searchApi = createApi({
  reducerPath: "searchApi",
  tagTypes: ["SearchMovie", "Autocomplete"],

  baseQuery: fetchBaseQuery({
    baseUrl: "https://cc3e497d.qdhgtch.com:2345/api/v1",
    prepareHeaders: (headers) => {
      headers.set("Accept-Language", "en");
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getSearchMovie: builder.query<any, any>({
      query: (data) => {
        const { keyword, page, sort, type_id, res_type } = data;
        return {
          url: `movie/search?keyword=${keyword}&&page=${page}&&sort=${sort}&&type_id=${type_id}&&res_type=${res_type}`,
        };
      },
      providesTags: (result, error, arg): any[] => [
        { type: "SearchMovie", id: arg },
      ],
    }),

    getAutocomplete: builder.query<any, { keyword: string }>({
      query: ({ keyword }) => `movie/search_complete?keyword=${keyword}`,
      providesTags: ["Autocomplete"],
    }),

    getTags: builder.query<any, void>({
      query: () => {
        return `/app/config`;
      },
    }),

    getAds: builder.query<any, void>({
      query: () => {
        return `/advert/config`;
      },
    }),
    getSearchLate: builder.query<any, void>({
      query: () => {
        return "/movie/search_lately_words";
      },
    }),
    getSearchRanking: builder.query<any, void>({
      query: () => {
        return "/movie/search_ranking";
      },
    }),
  }),
});

export const {
  useGetSearchMovieQuery,
  useLazyGetSearchMovieQuery,
  useLazyGetAutocompleteQuery,
  useGetTagsQuery,
  useGetAdsQuery,
  useGetSearchRankingQuery,
  useGetSearchLateQuery,
} = searchApi;
