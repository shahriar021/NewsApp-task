import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert, Text } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useBookmarkStore } from '../../store/useBookmarkStore';
import { useNewsStore } from '../../store/useNewsStore';
import { Card } from '../../components/shared/Card';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { EmptyState } from '../../components/shared/Empty';
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
          onPress: async () => { await toggleBookmark(storyId); },
          style: 'destructive'
        }
      ]
    );
  };

  const renderRightActions = (storyId, storyTitle) => (
    <View style={styles.swipeAction}>
      <View
        style={styles.deleteBtn}
        onTouchEnd={() => handleRemoveBookmark(storyId, storyTitle)}
      >
        <Text style={styles.deleteIcon}>🗑</Text>
        <Text style={styles.deleteText}>Remove</Text>
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.id, item.title)}
      overshootRight={false}
    >
      <Card onPress={() => handleStoryPress(item.id)}>
        <View style={styles.card}>

          {/* Top row */}
          <View style={styles.topRow}>
            <View style={styles.bookmarkBadge}>
              <Text style={styles.bookmarkIcon}>★</Text>
            </View>
            <Text style={styles.score}>▲ {item.score || 0}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Author row */}
          <View style={styles.authorRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.by?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.author}>{item.by || 'Unknown'}</Text>
            <Text style={styles.swipeHint}>← swipe to remove</Text>
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
      <View style={styles.screen}>
        <EmptyState
          icon="🔖"
          title="No bookmarks yet"
          message="Tap the ★ on any article to save it here"
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>SAVED</Text>
        <Text style={styles.headerTitle}>Bookmarks</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{bookmarks.length}</Text>
        </View>
      </View>

      <FlatList
        data={bookmarkedStories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0C0C0F',
  },

  // header
  header: {
    backgroundColor: '#16161D',
    paddingHorizontal: spacing[16],
    paddingTop: spacing[16],
    paddingBottom: spacing[16],
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A36',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF4D00',
    letterSpacing: 2,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: '#F0F0F5',
    letterSpacing: -0.4,
  },
  countBadge: {
    backgroundColor: '#FF4D0020',
    borderWidth: 1,
    borderColor: '#FF4D0040',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF4D00',
  },

  // list
  listContainer: {
    padding: spacing[16],
    paddingBottom: spacing[32],
  },

  // card
  card: {
    backgroundColor: '#1E1E28',
    borderRadius: 16,
    padding: spacing[16],
    marginBottom: spacing[12],
    borderWidth: 1,
    borderColor: '#2A2A36',
    gap: spacing[10],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookmarkBadge: {
    backgroundColor: '#FFB80020',
    borderWidth: 1,
    borderColor: '#FFB80040',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  bookmarkIcon: {
    fontSize: 13,
    color: '#FFB800',
  },
  score: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF4D00',
    backgroundColor: '#FF4D0018',
    borderWidth: 1,
    borderColor: '#FF4D0030',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F0F0F5',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A36',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: '#FF4D0025',
    borderWidth: 1,
    borderColor: '#FF4D0050',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FF4D00',
  },
  author: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9090A8',
    flex: 1,
  },
  swipeHint: {
    fontSize: 11,
    color: '#55556A',
    fontWeight: '500',
  },

  // swipe delete
  swipeAction: {
    justifyContent: 'center',
    marginBottom: spacing[12],
  },
  deleteBtn: {
    backgroundColor: '#FF456015',
    borderWidth: 1,
    borderColor: '#FF456030',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[20],
    height: '100%',
    gap: 4,
  },
  deleteIcon: {
    fontSize: 20,
  },
  deleteText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF4560',
  },
});

export default BookmarksScreen;