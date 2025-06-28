import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  convertToSecureUrl,
  decryptWithAes,
} from "../../../services/newEncryption";

const myFun = async (args: any, api: any, extraOptions: any) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers) => {
      headers.set("X-Client-Version", "3100");
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
  });

  const result: any = await baseQuery(args, api, extraOptions);

  // Check if the response contains the encryption header
  // const dataIsEncrypt =
  //   result?.meta?.response?.headers?.get("x-app-data-encrypt");

  // // Decrypt data if encryption header is present
  // if (dataIsEncrypt) {
  //   try {
  //     if (result.data) {
  //       result.data = decryptWithAes(result.data);
  //     }
  //   } catch (error) {
  //     console.error("Error during decryption:", error);
  //   }
  // }

  return result;
};

export const homeApi = createApi({
  reducerPath: "homeApi",
  keepUnusedDataFor: 300, // 1 minute

  // baseQuery: fetchBaseQuery({
  //   baseUrl: process.env.REACT_APP_API_URL,
  //   prepareHeaders: (headers) => {
  //     headers.set("X-Client-Version", "3098");
  //     const settings = JSON.parse(
  //       localStorage.getItem("movieAppSettings") || "{}"
  //     );
  //     if (settings.filterToggle) {
  //       headers.set("X-Client-Setting", JSON.stringify({ "pure-mode": 1 }));
  //     } else {
  //       headers.set("X-Client-Setting", JSON.stringify({ "pure-mode": 0 }));
  //     }
  //     headers.set("Accept-Language", "en");
  //     return headers;
  //   },
  // }),
  tagTypes: ["Config", "Recommendations", "Movies", "Topic", "TypeMovies"],

  baseQuery: myFun,
  endpoints: (builder) => ({
    getHeaderTopics: builder.query<any, void>({
      query: () => {
        return convertToSecureUrl(`/app/config`);
      },
      transformResponse: (response) => {
        console.log(response);
        return response;
      },
      providesTags: ["Config"],
      keepUnusedDataFor: 300, // 1 minute
    }),
    getRecommendedMovies: builder.query<any, void>({
      query: () => {
        return convertToSecureUrl(`/movie/index_recommend`);
      },
      providesTags: ["Recommendations"],
      keepUnusedDataFor: 300, // 1 minute
    }),
    getFilteredMovieByTopic: builder.query<any, void>({
      query: (id) => {
        return convertToSecureUrl(`/movie/${id}/recommend`);
      },

      providesTags: ["Topic"],
      keepUnusedDataFor: 300, // 1 minute
    }),
    getFilterByMoviesByTypeId: builder.query<any, any>({
      query: (id) =>
        convertToSecureUrl(`/api/v1/movie/screen/list?type_id=${id}`),

      providesTags: ["TypeMovies"],
      keepUnusedDataFor: 300, // 1 minute
    }),
    getFilteredData: builder.query<any, any>({
      query: ({ id, sort, classData, area, year, page, pageSize }: any) =>
        convertToSecureUrl(
          `/movie/screen/list?type_id=${id}&&sort=${sort}&&class=${classData}&&area=${area}&&year=${year}&&pageSize=${pageSize}&&page=${page}`
        ),

      providesTags: ["Movies"],
      keepUnusedDataFor: 300, // 1 minute
    }),
  }),
});

export const {
  useGetRecommendedMoviesQuery,
  useGetFilteredMovieByTopicQuery,
  useGetHeaderTopicsQuery,
  useGetFilterByMoviesByTypeIdQuery,
  useGetFilteredDataQuery,
} = homeApi;
