import { useEffect, useLayoutEffect, useState } from 'react';
import { Share, Alert, Linking } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useNewsStore } from '../store/useNewsStore';
import { useBookmarkStore } from '../store/useBookmarkStore';

export const useArticleDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const storyId = route.params?.storyId;

  const { stories, fetchStoryDetails } = useNewsStore();
  const story = storyId ? stories[storyId] : null;

  const [loading, setLoading] = useState(!story);
  const [error, setError] = useState<string | null>(null);

  const bookmarks = useBookmarkStore((state) => state.bookmarks);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const isBookmarked = bookmarks.includes(storyId);

  useEffect(() => {
    if (storyId && !story) {
      fetchStoryDetails(storyId)
        .then(() => setLoading(false))
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [storyId, story, fetchStoryDetails]);

  const handleShare = async () => {
    if (!story) return;
    try {
      await Share.share({
        message: `${story.title || ''}\n${story.url || ''}`,
        title: story.title,
      });
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  const openLink = async () => {
    if (!story?.url) {
      Alert.alert('No Link', 'This article has no external link.');
      return;
    }
    try {
      const supported = await Linking.canOpenURL(story.url);
      if (supported) {
        await Linking.openURL(story.url);
      } else {
        Alert.alert('Error', 'Cannot open this URL');
      }
    } catch (err) {
      console.log('Error opening link:', err);
      Alert.alert('Error', 'Failed to open the link');
    }
  };

  const handleBookmark = async () => {
    if (storyId) {
      await toggleBookmark(storyId);
      Alert.alert(
        isBookmarked ? 'Removed' : 'Bookmarked',
        isBookmarked ? 'Story removed from bookmarks' : 'Story added to bookmarks'
      );
    }
  };

  return {
    story,
    loading,
    error,
    isBookmarked,
    navigation,
    handleShare,
    openLink,
    handleBookmark,
  };
};