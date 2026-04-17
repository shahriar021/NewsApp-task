import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const hackerNewsApi = createApi({
  reducerPath: 'hackerNewsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://hacker-news.firebaseio.com/v0/',
  }),
  endpoints: builder => ({
    getTopStories: builder.query<number[], void>({
      query: () => 'topstories.json',
    }),
    getItem: builder.query<any, number>({
      query: id => `item/${id}.json`,
    }),
  }),
});

export const { useGetTopStoriesQuery, useGetItemQuery } = hackerNewsApi;
