import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { convertToSecureUrl } from "../../../services/newEncryption";

export const searchApi = createApi({
  reducerPath: "searchApi",
  tagTypes: ["SearchMovie", "Autocomplete"],

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers) => {
      // Get the auth token from localStorage

      const storedAuth = JSON.parse(localStorage.getItem("authToken") || "{}");
      const accessToken = storedAuth?.data?.access_token;
      const settings = JSON.parse(
        localStorage.getItem("movieAppSettings") || "{}"
      );
      if (settings.filterToggle) {
        headers.set("X-Client-Setting", JSON.stringify({ "pure-mode": 1 }));
      } else {
        headers.set("X-Client-Setting", JSON.stringify({ "pure-mode": 0 }));
      }

      headers.set("Accept-Language", "en");

      // Add Authorization header if access token exists
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }

      return headers;
    },
  }),

  endpoints: (builder) => ({
    getSearchMovie: builder.query<any, any>({
      query: (data) => {
        const { keyword, page, sort, type_id, res_type } = data;
        return {
          url: convertToSecureUrl(`movie/search?keyword=${keyword}&&page=${page}&&sort=${sort}&&type_id=${type_id}&&res_type=${res_type}`),
        };
      },
      providesTags: (result, error, arg): any[] => [
        { type: "SearchMovie", id: arg },
      ],
    }),

    getAutocomplete: builder.query<any, { keyword: string }>({
      query: ({ keyword }) => convertToSecureUrl(`movie/search_complete?keyword=${keyword}`),
      providesTags: ["Autocomplete"],
    }),

    getTags: builder.query<any, void>({
      query: () => {
        return convertToSecureUrl(`/app/config`);
      },
    }),

    getAds: builder.query<any, void>({
      query: () => {
        return convertToSecureUrl(`/advert/config`);
      },
    }),
    getSearchLate: builder.query<any, void>({
      query: () => {
        return convertToSecureUrl("/movie/search_lately_words");
      },
    }),
    getSearchRanking: builder.query<any, void>({
      query: () => {
        return convertToSecureUrl("/movie/search_ranking");
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
