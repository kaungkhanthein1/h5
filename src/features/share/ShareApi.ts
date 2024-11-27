import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  convertToSecurePayload,
  convertToSecureUrl,
} from "../../services/newEncryption";

const convertUrl = convertToSecureUrl(`${process.env.REACT_APP_API_URL}`);

const ShareApi = createApi({
  reducerPath: "shareApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers) => {
      const settings = JSON.parse(
        localStorage.getItem("movieAppSettings") || "{}"
      );
      // Get the auth token from localStorage
      const storedAuth = JSON.parse(localStorage.getItem("authToken") || "{}");
      const accessToken = storedAuth?.data?.access_token;

      headers.set("Accept-Language", "en");

      if (settings.filterToggle) {
        headers.set("X-Client-Setting", JSON.stringify({ "pure-mode": 1 }));
      } else {
        headers.set("X-Client-Setting", JSON.stringify({ "pure-mode": 0 }));
      }
      // Add Authorization header if access token exists
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getShareScan: builder.query({
      query: ({ qr_create }) => ({
        url: "/user/get_share",
        method: "GET",
        params: convertToSecurePayload({
          qr_create: qr_create,
        }),
      }),
    }),
    getInvitedDetails: builder.query({
      // Custom query function
      queryFn: async (
        { act, page, pageSize },
        _queryApi,
        _extraOptions,
        baseQuery
      ) => {
        try {
          // Call the baseQuery for fetchBaseQuery logic
          const result = await baseQuery({
            url: convertToSecureUrl("/user/invite_details"),
            method: "GET",
            params: convertToSecurePayload({
              act: act,
              page: page,
              pageSize: pageSize,
            }),
          });
          // If the result has an error, handle it
          if (result.error) {
            return { error: result.error };
          }

          // Return the response data
          return result;
        } catch (error: any) {
          // Catch unexpected errors
          return {
            error: {
              status: 500,
              data: error.message || "Internal Server Error",
            },
          };
        }
      },
    }),
  }),
});

export const { useGetShareScanQuery, useGetInvitedDetailsQuery } = ShareApi;

export default ShareApi;
