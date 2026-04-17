import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert, Text } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useBookmarkStore } from '../../store/useBookmarkStore';
import { useNewsStore } from '../../store/useNewsStore';
import { Card } from '../../components/shared/Card';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { EmptyState } from '../../components/shared/Empty';
import { Button } from '../../components/shared/Button';
import { colors, spacing, typography } from '../../theme';

const BookmarksScreen = () => {
  const navigation = useNavigation();
  const bookmarks = useBookmarkStore((state) => state.bookmarks);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const loadBookmarks = useBookmarkStore((state) => state.loadBookmarks);
  const { stories } = useNewsStore();
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const load = async () => {
      await loadBookmarks();
      setLoading(false);
    };
    load();
  }, [loadBookmarks]);
  
  const bookmarkedStories = bookmarks
    .map(id => stories[id])
    .filter(Boolean);
  
  const handleStoryPress = (storyId) => {
    navigation.navigate('ArticleDetail', { storyId });
  };
  
  const handleRemoveBookmark = (storyId, storyTitle) => {
    Alert.alert(
      'Remove Bookmark',
      `Remove "${storyTitle}" from your bookmarks?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          onPress: async () => {
            await toggleBookmark(storyId);
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  const renderRightActions = (storyId, storyTitle) => (
    <View style={styles.deleteButtonContainer}>
      <Button
        title="Delete"
        onPress={() => handleRemoveBookmark(storyId, storyTitle)}
        variant="danger"
        size="small"
        style={styles.deleteButton}
      />
    </View>
  );
  
  const renderItem = ({ item }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.id, item.title)}
      overshootRight={false}
    >
      <Card onPress={() => handleStoryPress(item.id)}>
        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.metaInfo}>
            <Text style={styles.author}>By: {item.by || 'Unknown'}</Text>
            <Text style={styles.score}>⭐ {item.score || 0}</Text>
          </View>
          <View style={styles.bookmarkBadge}>
            <Text style={styles.bookmarkIcon}>★</Text>
          </View>
        </View>
      </Card>
    </Swipeable>
  );
  
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }
  
  if (bookmarks.length === 0) {
    return (
      <EmptyState
        icon="⭐"
        title="No bookmarks yet"
        message="Tap the ★ on any article to save it here"
      />
    );
  }
  
  return (
    <FlatList
      data={bookmarkedStories}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: spacing[12],
    backgroundColor: colors.background,
  },
  cardContent: {
    position: 'relative',
  },
  title: {
    ...typography.bodyBold,
    color: colors.gray[800],
    marginBottom: spacing[8],
    paddingRight: spacing[32],
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  author: {
    ...typography.caption,
    color: colors.gray[600],
  },
  score: {
    ...typography.captionBold,
    color: colors.primary,
  },
  bookmarkBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  bookmarkIcon: {
    fontSize: 20,
    color: colors.primary,
  },
  deleteButtonContainer: {
    justifyContent: 'center',
    marginBottom: spacing[12],
  },
  deleteButton: {
    height: '100%',
    minHeight: 80,
    borderRadius: 12,
  },
});

export default BookmarksScreen;