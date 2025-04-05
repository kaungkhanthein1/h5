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
        url: convertToSecureUrl("/activities/rules/integral"),
      }),
    }),
  }),
});

export const { useGetUserQuery, useGetDailyTesksQuery } = pointApi;
