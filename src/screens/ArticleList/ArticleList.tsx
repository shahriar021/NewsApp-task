import React, { useEffect, useMemo } from 'react';
import {
  View,
  FlatList,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useNewsStore } from '../../store/useNewsStore';
import { useUIStore } from '../../store/uiStore';
import StoryItem from '../../components/shared/StoryItem';
import useNetworkStatus from '../../hooks/useNetworkStatus';

const ArticleList = () => {
  const navigation = useNavigation();
  const { storyIds, stories, fetchTopStories, isLoading, error } = useNewsStore();
  const { searchQuery, setSearchQuery, sortOrder, setSortOrder } = useUIStore();

  useEffect(() => {
    fetchTopStories();
  }, []);

  const { isConnected } = useNetworkStatus();

// Add this after the header section
{!isConnected && (
  <View style={styles.offlineWarning}>
    <Text style={styles.offlineWarningText}>
      ⚠️ You are offline. Showing cached content.
    </Text>
  </View>
)}


  const filteredAndSortedStories = useMemo(() => {
    let data = storyIds.map(id => stories[id]).filter(Boolean);

    if (searchQuery) {
      data = data.filter(story =>
        story.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return data.sort((a, b) => {
      if (sortOrder === 'score') return b.score - a.score;
      if (sortOrder === 'time') return b.time - a.time;
      return 0;
    });
  }, [storyIds, stories, searchQuery, sortOrder]);

  // IMPORTANT: Pass ONLY the ID
  const handleStoryPress = (storyId) => {
    console.log('Navigating with story ID:', storyId);
    navigation.navigate('ArticleDetail', { storyId: storyId });
  };

  if (isLoading && storyIds.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6600" />
        <Text style={styles.loadingText}>Loading top stories...</Text>
      </View>
    );
  }

  if (error && storyIds.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchTopStories} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          placeholder="Search stories..."
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />

        <TouchableOpacity
          onPress={() => setSortOrder(sortOrder === 'score' ? 'time' : 'score')}
          style={styles.sortButton}
        >
          <Text style={styles.sortText}>
            Sort by: {sortOrder === 'score' ? '⭐ Top Rated' : '🕒 Newest First'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredAndSortedStories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <StoryItem
            story={item}
            onPress={() => handleStoryPress(item.id)} // Pass ONLY the ID
          />
        )}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={fetchTopStories}
            colors={['#FF6600']}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'No stories match your search' : 'No stories available'}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    marginBottom: 15,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FF6600',
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    height: 42,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 8,
    fontSize: 16,
  },
  sortButton: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#FFF3E6',
  },
  sortText: {
    color: '#FF6600',
    fontWeight: '600',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
  },
  offlineWarning: {
  backgroundColor: '#ff4444',
  padding: 10,
  alignItems: 'center',
},
offlineWarningText: {
  color: '#fff',
  fontSize: 12,
},
});

export default ArticleList;