// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const profileApi = createApi({
//   reducerPath: "profileApi",

//   baseQuery: fetchBaseQuery({
//     baseUrl: "https://cc3e497d.qdhgtch.com:2345/api/v1",
//     prepareHeaders: (headers) => {
//       // Get the auth token from localStorage
//       const storedAuth = JSON.parse(localStorage.getItem("authToken") || "{}");
//       const accessToken = storedAuth?.data?.access_token;

//       headers.set("Accept-Language", "en");

//       // Add Authorization header if access token exists
//       if (accessToken) {
//         headers.set("Authorization", `Bearer ${accessToken}`);
//       }

//       return headers;
//     },
//   }),

//   endpoints: (builder) => ({
//     getNotification: builder.query<any, void>({
//       query: () => {
//         return `notice_v2/list`;
//       },
//     }),
//     getUser: builder.query<any, void>({
//       query: () => {
//         return `/user/info`;
//       },
//     }),
//     logOutUser: builder.mutation<void, void>({
//       query: () => ({
//         url: `/user/logout`,
//       }),
//     }),
//     getList: builder.query<any, void>({
//       query: () => {
//         return `/user/movie_collect/list`;
//       },
//     }),
//   }),
// });

// export const {
//   useGetNotificationQuery,
//   useGetUserQuery,
//   useLogOutUserMutation,
//   useGetListQuery,
// } = profileApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const profileApi = createApi({
  reducerPath: "profileApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://cc3e497d.qdhgtch.com:2345/api/v1",
    prepareHeaders: (headers) => {
      // Get the auth token from localStorage
      const storedAuth = JSON.parse(localStorage.getItem("authToken") || "{}");
      const accessToken = storedAuth?.data?.access_token;

      headers.set("Accept-Language", "en");

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
        return `notice_v2/list`;
      },
    }),
    getUser: builder.query<any, void>({
      query: () => {
        return `/user/info`;
      },
    }),
    logOutUser: builder.mutation<void, void>({
      query: () => ({
        url: `/user/logout`,
      }),
    }),
    getList: builder.query<any, { page: number }>({
      query: ({ page }) => {
        return `/user/movie_collect/list?page=${page}&pageSize=${10}`;
      },
    }),
    collectMovie: builder.mutation<
      void,
      { movie_id: string; is_collect: boolean }
    >({
      query: (movie) => ({
        url: `/movie/collect/action`,
        method: "POST",
        body: {
          state: movie?.is_collect ? 1 : 0,
          movie_id: movie.movie_id,
        },
      }),
    }),
    deleteCollect: builder.mutation<void, { ids: string }>({
      query: (data) => ({
        url: `/user/movie_collect/delete`,
        method: "POST",
        body: {
          ids: data.ids,
        },
      }),
    }),
  }),
});

export const {
  useGetNotificationQuery,
  useGetUserQuery,
  useLogOutUserMutation,
  useGetListQuery,
  useCollectMovieMutation,
  useDeleteCollectMutation,
} = profileApi;
