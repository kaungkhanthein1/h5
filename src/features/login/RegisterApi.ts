import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface SignUpEmailArgs {
  email: string;
  password: string;
  email_code: string;
}

interface SignUpPhoneArgs {
  phone: string;
  password: string;
  sms_code	: string;
}

interface SignUpResponse {
  data: any; // Adjust this to the actual expected data structure from the API
  msg: string; // Define msg here
}

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
            // alert(`Error: ${error.message}`);
          }
        }
      },
    }),
    signUpPhone: builder.mutation<SignUpResponse, SignUpPhoneArgs>({
      query: ({ phone, password, sms_code	 }) => ({
        url: "/v1/user/register/phone",
        method: "POST",
        body: {
          phone,
          password,
          sms_code	,
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
            // alert(`Error: ${error.message}`);
          }
        }
      },
    }),
  }),
});

export const { useSignUpEmailMutation, useSignUpPhoneMutation } = RegisterApi;
export default RegisterApi;
