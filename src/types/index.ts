export interface Story {
  id: number;
  title: string;
  url: string;
  by: string;
  score: number;
  time: number;
  type: string;
}

export interface RawStory {
  id: number;
  title?: string;
  url?: string;
  by?: string;
  score?: number;
  time?: number;
  type?: string;
}

export type SortOrder = 'score' | 'time';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';