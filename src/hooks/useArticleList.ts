import { useEffect, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useNewsStore } from '../store/useNewsStore';
import { useUIStore } from '../store/uiStore';
import { Story } from '../types';

export const useArticleList = () => {
  const navigation = useNavigation();
  const { storyIds, stories, fetchTopStories, isLoading, error } = useNewsStore();
  const { searchQuery, setSearchQuery, sortOrder, setSortOrder } = useUIStore();

  useEffect(() => {
    fetchTopStories();
  }, []);

  const filteredAndSortedStories = useMemo(() => {
    let data = storyIds.map((id: number) => stories[id]).filter(Boolean) as Story[];
    if (searchQuery) {
      data = data.filter((story: Story) =>
        story.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return data.sort((a: Story, b: Story) =>
      sortOrder === 'score' ? b.score - a.score : b.time - a.time
    );
  }, [storyIds, stories, searchQuery, sortOrder]);

  const handleStoryPress = (storyId: number) => {
    navigation.navigate('ArticleDetail' as never, { storyId } as never);
  };

  return {
    filteredAndSortedStories,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    fetchTopStories,
    handleStoryPress,
  };
};