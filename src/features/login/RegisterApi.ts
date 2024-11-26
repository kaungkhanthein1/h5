import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ConfirmArgs,
  GetCodeArgs,
  GetTCodeResponse,
  GetTokenArgs,
  GetTokenResponse,
  RecoverPassArgs,
  RecoverPassResponse,
  SignUpEmailArgs,
  SignUpPhoneArgs,
  SignUpResponse,
  comfirmResponse,
} from "registerType";
import { convertToSecurePayload } from "../../services/newEncryption";

const RegisterApi = createApi({
  reducerPath: "RegisterSignApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://cc3e497d.qdhgtch.com:2345/api",
    baseUrl: process.env.REACT_APP_API_URL,
  }),
  endpoints: (builder) => ({
    signUpEmail: builder.mutation<SignUpResponse, SignUpEmailArgs>({
      query: ({ email, password, email_code }) => ({
        url: "/user/register/email",
        method: "POST",
        body: convertToSecurePayload({
          email,
          password,
          email_code,
          timestamp: new Date().getTime(),
        }),
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const data = await queryFulfilled;
          console.log(data);
          // const msg = data.msg;
          // console.log("Registration successful:", msg);
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
        url: "/user/register/phone",
        method: "POST",
        body: convertToSecurePayload({
          phone,
          password,
          sms_code,
          timestamp: new Date().getTime(),
        }),
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const msg = data.msg;
          // console.log("Registration successful:", msg);
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
        url: "/user/check_captcha",
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
          // console.log(data)
          // console.log("Verification:", msg);
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
        url: `/user/forget/get_token`,
        method: "GET",
        params: convertToSecurePayload({
          username: email,
          captcha: graphicKey,
          timestamp: new Date().getTime(),
        }),
      }),
    }),
    getCodeForgot: builder.query<GetTCodeResponse, GetCodeArgs>({
      query: ({ send_type, session_token }) => ({
        url: `/user/forget/send_code`,
        method: "GET",
        params: {
          send_type: send_type,
          session_token: session_token,
        },
      }),
    }),
    passwordRecovery: builder.mutation<RecoverPassResponse, RecoverPassArgs>({
      query: ({ password, repassword, session_token, forget_code }) => ({
        url: "/user/forget/set_pass",
        method: "POST",
        body: convertToSecurePayload({
          password: password,
          repassword: repassword,
          session_token: session_token,
          forget_code: forget_code,
        }),
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const msg = data.msg;
          return msg;
          // console.log("set successful:", msg);
        } catch (error: any) {
          if (error.error?.data) {
            if (error.error?.data) {
              const errorMsg = error.error.data.msg; // Extract the error message
              const errorCode = error.error.data.errorCode; // Extract the error code
              console.error("Set failed:", errorMsg, "Error Code:", errorCode);
              return errorMsg;
            }
          } else {
            console.error("set error:", error.message);
          }
        }
      },
    }),
  }),
});

export const {
  useSignUpEmailMutation,
  useSignUpPhoneMutation,
  useConfirmCaptchaForgotMutation,
  useGetTokenForgotQuery,
  useGetCodeForgotQuery,
  usePasswordRecoveryMutation,
} = RegisterApi;

export default RegisterApi;
