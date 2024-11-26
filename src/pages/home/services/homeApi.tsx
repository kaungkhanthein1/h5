import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  convertToSecureUrl,
  decryptWithAes,
} from "../../../services/newEncryption";

const myFun = async (args: any, api: any, extraOptions: any) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers) => {
      headers.set("X-Client-Version", "3098");
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
    }),
    getRecommendedMovies: builder.query<any, void>({
      query: () => {
        return convertToSecureUrl(`/movie/index_recommend`);
      },
    }),
    getFilteredMovieByTopic: builder.query<any, void>({
      query: (id) => {
        return convertToSecureUrl(`/movie/${id}/recommend`);
      },
    }),
    getFilterByMoviesByTypeId: builder.query<any, any>({
      query: (id) =>
        convertToSecureUrl(`/api/v1/movie/screen/list?type_id=${id}`),
    }),
    getFilteredData: builder.query<any, any>({
      query: ({ id, sort, classData, area, year, page, pageSize }: any) =>
        convertToSecureUrl(
          `/movie/screen/list?type_id=${id}&&sort=${sort}&&class=${classData}&&area=${area}&&year=${year}&&pageSize=${pageSize}&&page=${page}`
        ),
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
