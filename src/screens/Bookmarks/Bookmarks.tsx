import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBookmarkStore } from '../../store/useBookmarkStore';
import { useNewsStore } from '../../store/useNewsStore';

const BookmarksScreen = () => {
  const navigation = useNavigation();
  const bookmarks = useBookmarkStore((state) => state.bookmarks);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const loadBookmarks = useBookmarkStore((state) => state.loadBookmarks);
  const { stories, fetchStoryDetails } = useNewsStore();
  
  const [loading, setLoading] = React.useState(true);
  
  useEffect(() => {
    // Load bookmarks when screen opens
    const load = async () => {
      await loadBookmarks();
      setLoading(false);
    };
    load();
  }, []);
  
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
  
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6600" />
      </View>
    );
  }
  
  if (bookmarks.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No bookmarks yet</Text>
        <Text style={styles.subText}>Tap the ★ on any article to save it here</Text>
      </View>
    );
  }
  
  return (
    <FlatList
      data={bookmarkedStories}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={styles.storyItem}
          onPress={() => handleStoryPress(item.id)}
          onLongPress={() => handleRemoveBookmark(item.id, item.title)}
          activeOpacity={0.7}
        >
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.metaInfo}>
            <Text style={styles.author}>By: {item.by || 'Unknown'}</Text>
            <Text style={styles.score}>⭐ {item.score || 0}</Text>
          </View>
          <View style={styles.bookmarkIndicator}>
            <Text style={styles.bookmarkIcon}>★</Text>
          </View>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#666',
  },
  subText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  listContainer: {
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  storyItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    position: 'relative',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
    paddingRight: 30,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  author: {
    fontSize: 12,
    color: '#666',
  },
  score: {
    fontSize: 12,
    color: '#FF6600',
    fontWeight: 'bold',
  },
  bookmarkIndicator: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  bookmarkIcon: {
    fontSize: 18,
    color: '#FFD700',
  },
});

export default BookmarksScreen;