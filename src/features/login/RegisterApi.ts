import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ConfirmArgs,
  GetCodeArgs,
  GetTCodeResponse,
  GetTokenArgs,
  GetTokenResponse,
  SignUpEmailArgs,
  SignUpPhoneArgs,
  SignUpResponse,
  comfirmResponse,
} from "registerType";

const RegisterApi = createApi({
  reducerPath: "RegisterSignApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://cc3e497d.qdhgtch.com:2345/api",
  }),
  endpoints: (builder) => ({
    signUpEmail: builder.mutation<SignUpResponse, SignUpEmailArgs>({
      query: ({ email, password, email_code }) => ({
        url: "/v1/user/register/email",
        method: "POST",
        body: {
          email,
          password,
          email_code,
        },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const msg = data.msg;
          console.log("Registration successful:", msg);
        } catch (error: any) {
          if (error.error?.data) {
            console.error("Registration failed:", error.error.data);
          } else {
            console.error("Registration error:", error.message);
          }
        }
      },
    }),
    signUpPhone: builder.mutation<SignUpResponse, SignUpPhoneArgs>({
      query: ({ phone, password, sms_code }) => ({
        url: "/v1/user/register/phone",
        method: "POST",
        body: {
          phone,
          password,
          sms_code,
        },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const msg = data.msg;
          console.log("Registration successful:", msg);
        } catch (error: any) {
          if (error.error?.data) {
            console.error("Registration failed:", error.error.data);
          } else {
            console.error("Registration error:", error.message);
          }
        }
      },
    }),
    confirmCaptchaForgot: builder.mutation<comfirmResponse, ConfirmArgs>({
      query: ({ captchaCode, keyStatus }) => ({
        url: "/v1/user/check_captcha",
        method: "POST",
        body: {
          code: captchaCode,
          key: keyStatus,
        },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const msg = data.msg;
          console.log("Verification successful:", msg);
        } catch (error: any) {
          if (error.error?.data) {
            console.error("Verification failed:", error.error.data);
          } else {
            console.error("Verification error:", error.message);
          }
        }
      },
    }),
    getTokenForgot: builder.query<GetTokenResponse, GetTokenArgs>({
      query: ({ email, graphicKey }) => ({
        url: `/v1/user/forget/get_token`,
        method: "GET",
        params: {
          username: email,
          captcha: graphicKey,
        },
      }),
    }),
    getCodeForgot: builder.query<GetTCodeResponse,GetCodeArgs>({
      query: ({ send_type, session_token }) => ({
        url: `/v1/user/forget/send_code`,
        method: "GET",
        params: {
          send_type: send_type,
          session_token: session_token,
        },
      }),
    }),
  }),
});

export const {
  useSignUpEmailMutation,
  useSignUpPhoneMutation,
  useConfirmCaptchaForgotMutation,
  useGetTokenForgotQuery,
  useGetCodeForgotQuery
} = RegisterApi;

export default RegisterApi;
