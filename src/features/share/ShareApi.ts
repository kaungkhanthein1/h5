import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
        params: {
          qr_create: qr_create,
        },
      }),
    }),
    getInvitedDetails: builder.query({
      query: ({ act, page, pageSize }) => ({
        url: "/user/invite_details",
        method: "GET",
        params: {
          act: act,
          page: page,
          pageSize: pageSize,
        },
      }),
    }),
  }),
});

export const { useGetShareScanQuery, useGetInvitedDetailsQuery } = ShareApi;

export default ShareApi;
