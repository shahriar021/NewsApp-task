import { create } from 'zustand';

interface Story {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
}

interface NewsState {
  storyIds: number[];
  stories: Record<number, Story>; // Cache stories by ID
  isLoading: boolean;
  error: string | null;
  
  fetchTopStories: () => Promise<void>;
  fetchStoryDetails: (id: number) => Promise<void>;
}

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

export const useNewsStore = create<NewsState>((set, get) => ({
  storyIds: [],
  stories: {},
  isLoading: false,
  error: null,

  fetchTopStories: async () => {
  set({ isLoading: true, error: null });
  try {
    // 1. Get the list of IDs
    const response = await fetch(`${BASE_URL}/topstories.json`);
    const allIds = await response.json();
    
    // 2. Slice to the first 20 as per instructions
    const top20Ids = allIds.slice(0, 20);

    // 3. The Parallel Fetching (Promise.all)
    // This creates 20 fetch requests that all run at the same time
    const storyPromises = top20Ids.map(id => 
      fetch(`${BASE_URL}/item/${id}.json`).then(res => res.json())
    );

    const storyResults = await Promise.all(storyPromises);

    // 4. Filter: Must be a 'story' AND must have a 'url'
    const validStories = storyResults.filter(
      (item) => item && item.type === 'story' && item.url
    );

    // 5. Convert array to a Record (Map) for easy lookup
    const storyMap = validStories.reduce((acc, story) => {
      acc[story.id] = story;
      return acc;
    }, {} as Record<number, Story>);

    set({ 
      storyIds: validStories.map(s => s.id), 
      stories: storyMap, 
      isLoading: false 
    });
  } catch (err) {
    set({ error: 'Failed to load stories', isLoading: false });
  }
},

  fetchStoryDetails: async (id: number) => {
    // If we already have the story, don't fetch it again
    if (get().stories[id]) return;

    try {
      const response = await fetch(`${BASE_URL}/item/${id}.json`);
      const data = await response.json();
      set((state) => ({
        stories: { ...state.stories, [id]: data },
      }));
    } catch (err) {
      console.error(`Error fetching story ${id}:`, err);
    }
  },
}));