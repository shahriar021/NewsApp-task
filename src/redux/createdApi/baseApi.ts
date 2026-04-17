import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://hacker-news.firebaseio.com/v0/',
  }),
  endpoints: builder => ({
    getTopStories: builder.query<number[], void>({
      query: () => 'topstories.json',
    }),
  }),
});

export const { useGetTopStoriesQuery } = baseApi;
