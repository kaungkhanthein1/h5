import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { convertToSecureUrl } from "../../services/newEncryption";

const AdsApi = createApi({
  reducerPath: "adsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    //   prepareHeaders: (headers) => {
    //       headers.set("X-Client-Version", "3098");
    //       return headers;
    //     },
  }),
  endpoints: (builder) => ({
    getAdsTotal: builder.query({
      query: () => ({
        url: convertToSecureUrl("/advert/config"),
        method: "GET",
        headers: {
          "X-Client-Version": "3098", // Add your specific header here
        },
      }),
    }),
    getAdsStart: builder.query({
      query: () => ({
        url: convertToSecureUrl("/advert/config"),
        method: "GET",
        headers: {
          "X-Client-Version": "3098", // Add your specific header here
        },
      }),
    }),
  }),
});

export const { useGetAdsTotalQuery, useGetAdsStartQuery } = AdsApi;
export default AdsApi;
