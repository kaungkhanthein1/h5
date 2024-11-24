import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  convertToSecurePayload,
  convertToSecureUrl,
} from "../../../services/newEncryption";

interface ChangeAvatarResponse {
  data: {
    url: string;
  };
}
export const profileApi = createApi({
  reducerPath: "profileApi",

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
    getNotification: builder.query<any, void>({
      query: () => {
        return convertToSecureUrl(`notice_v2/list`);
      },
    }),
    getUser: builder.query<any, void>({
      query: () => {
        return convertToSecureUrl(`/user/info`);
      },
    }),
    logOutUser: builder.mutation<void, void>({
      query: () => {
        return convertToSecureUrl(`/user/logout`);
      },
    }),
    getList: builder.query<any, { page: number; type_id: number }>({
      query: ({ page, type_id }) => {
        return convertToSecureUrl(
          `/user/movie_collect/list?page=${page}&pageSize=${12}&type_id=${type_id}`
        );
      },
    }),
    collectMovie: builder.mutation<
      void,
      { movie_id: string; is_collect: boolean }
    >({
      query: (movie) => ({
        url: `/movie/collect/action`,
        method: "POST",
        body: JSON.stringify(
          convertToSecurePayload({
            state: movie?.is_collect ? 1 : 0,
            movie_id: movie.movie_id,
          })
        ),
      }),
    }),
    deleteCollect: builder.mutation<void, { ids: string }>({
      query: (data) => ({
        url: `/user/movie_collect/delete`,
        method: "POST",
        body: JSON.stringify(
          convertToSecurePayload({
            ids: data.ids,
          })
        ),
      }),
    }),
    changeNickname: builder.mutation<void, { new_nickname: string }>({
      query: ({ new_nickname }) => ({
        url: `/user/change/nickname`,
        method: "POST",
        body: JSON.stringify(convertToSecurePayload({ new_nickname })),
      }),
    }),
    createInvite: builder.mutation<void, { invite_code: string }>({
      query: ({ invite_code }) => ({
        url: `/user/enter_invitation_code`,
        method: "POST",
        body: JSON.stringify(convertToSecurePayload({ invite_code })),
      }),
    }),
    changeUsername: builder.mutation<void, { new_username: string }>({
      query: ({ new_username }) => ({
        url: `/user/change/username`,
        method: "POST",
        body: JSON.stringify(convertToSecurePayload({ new_username })),
      }),
    }),
    changeEmail: builder.mutation<
      void,
      { new_email: string; email_code: string }
    >({
      query: ({ new_email, email_code }) => ({
        url: `/user/change/email`,
        method: "POST",
        body: JSON.stringify(
          convertToSecurePayload({
            new_email,
            email_code,
          })
        ),
      }),
    }),
    changePhnumber: builder.mutation<
      void,
      { new_phone: string; sms_code: string }
    >({
      query: ({ new_phone, sms_code }) => ({
        url: `/user/change/phone`,
        method: "POST",
        body: JSON.stringify(
          convertToSecurePayload({
            new_phone,
            sms_code,
          })
        ),
      }),
    }),
    sendCode: builder.query<
      any,
      { send_type: string; to: string; captcha: string }
    >({
      query: ({ send_type, to, captcha }) => {
        return convertToSecureUrl(
          `/user/get_code?send_type=${send_type}&to=${to}&captcha=${captcha}`
        );
      },
    }),

    checkCaptcha: builder.mutation<any, { code: string; key: string }>({
      query: ({ code, key }) => ({
        url: `/user/check_captcha`,
        method: "POST",
        body: JSON.stringify(
          convertToSecurePayload({
            code,
            key,
          })
        ),
      }),
    }),
    changePassword: builder.mutation<
      void,
      { password: string; repassword: string }
    >({
      query: ({ password, repassword }) => ({
        url: `/user/change/password`,
        method: "POST",
        body: JSON.stringify(
          convertToSecurePayload({
            password,
            repassword,
          })
        ),
      }),
    }),
    changeAvatar: builder.mutation<ChangeAvatarResponse, FormData>({
      query: (formData) => ({
        url: `/user/change/avatar`,
        method: "POST",
        body: JSON.stringify(convertToSecurePayload(formData)), // Passing the FormData directly
      }),
    }),
    getSocial: builder.query<any, { type: string; action: string }>({
      query: ({ type, action }) => {
        return convertToSecureUrl(
          `/user/get_social_login_url?type=${type}&action=${action}`
        );
      },
    }),
    socialCallback: builder.query<any, { type: string; code: string }>({
      query: ({ type, code }) => ({
        url: `/user/social_login_callback`,
        method: "POST",
        body: JSON.stringify(
          convertToSecurePayload({
            type,
            code,
          })
        ),
      }),
    }),
    getRecord: builder.query<any, void>({
      query: () => {
        return convertToSecureUrl(`/user/playback/list`);
      },
    }),
    deleteRecord: builder.mutation<void, { ids: string }>({
      query: (data) => ({
        url: `/user/playback/delete`,
        method: "POST",
        body: JSON.stringify(
          convertToSecurePayload({
            ids: data.ids,
          })
        ),
      }),
    }),
  }),
});

export const {
  useLazyGetUserQuery,
  useGetRecordQuery,
  useGetNotificationQuery,
  useGetUserQuery,
  useLogOutUserMutation,
  useGetListQuery,
  useCollectMovieMutation,
  useDeleteRecordMutation,
  useDeleteCollectMutation,
  useChangeNicknameMutation,
  useChangeUsernameMutation,
  useChangeEmailMutation,
  useChangePhnumberMutation,
  useChangePasswordMutation,
  useLazyGetSocialQuery,
  useLazySendCodeQuery,
  useCheckCaptchaMutation,
  useChangeAvatarMutation,
  useLazySocialCallbackQuery,
  useCreateInviteMutation,
} = profileApi;
