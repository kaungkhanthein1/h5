import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  convertToSecurePayload,
  convertToSecureUrl,
  decryptWithAes,
} from "../../../services/newEncryption";

interface ChangeAvatarResponse {
  data: {
    url: string;
  };
}
export const pointApi = createApi({
  reducerPath: "pointApi",

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
    getUser: builder.query<any, void>({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchBaseQuery) => {
        // Use fetchBaseQuery directly for this endpoint with custom responseHandler
        const result = await fetchBaseQuery({
          url: convertToSecureUrl(`/user/info`),
          responseHandler: "text", // Only this endpoint will use raw text
        });

        if (result.error) {
          return { error: result.error };
        }

        try {
          // Decrypt the response
          const decryptedData = decryptWithAes(result.data as string);
          if (!decryptedData) {
            throw new Error("Decryption failed for user info");
          }
          return { data: decryptedData };
        } catch (error) {
          console.error("Decryption error:", error);
          return { error: { status: 500, data: "Decryption failed" } };
        }
      },
    }),
    getDailyTesks: builder.query<any, any>({
      query: () => ({
        url: convertToSecureUrl("/user/daily_tasks"),
      }),
    }),
    getActivity: builder.query<any, any>({
      query: () => ({
        url: convertToSecureUrl("/user/integral_details?act=count"),
      }),
    }),
    getActivityList: builder.query<any, any>({
      query: ({ act }) => ({
        url: convertToSecureUrl(
          `/user/integral_details?act=${act}&page=1&pageSize=10`
        ),
      }),
    }),
    getInvitaionMember: builder.query<any, any>({
      query: () => ({
        url: convertToSecureUrl("/user/invite_details?act=count"),
      }),
    }),
    getInvitaionMemberList: builder.query<any, any>({
      query: () => ({
        url: convertToSecureUrl("/user/invite_details?act=list"),
      }),
    }),
    getInviteNotice: builder.query({
      query: () => ({
        url: convertToSecureUrl("/activities/invite/notices"),
        method: "GET",
        // params: convertToSecurePayload({
        //   qr_create: qr_create,
        // }),
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetDailyTesksQuery,
  useGetActivityQuery,
  useGetInvitaionMemberQuery,
  useGetActivityListQuery,
  useGetInvitaionMemberListQuery,
  useGetInviteNoticeQuery
} = pointApi;
