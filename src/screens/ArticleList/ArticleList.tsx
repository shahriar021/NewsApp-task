import React, { useEffect, useMemo } from 'react';
import {
  View,
  FlatList,
  TextInput,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useNewsStore } from '../../store/useNewsStore';
import { useUIStore } from '../../store/uiStore';
import { StoryItem } from '../../components/shared/StoryItem';
import { colors, spacing, typography, layout } from '../../theme';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { EmptyState } from '../../components/shared/Empty';
import { Button } from '../../components/shared/Button';

const ArticleList = () => {
  const navigation = useNavigation();
  const { storyIds, stories, fetchTopStories, isLoading, error } = useNewsStore();
  const { searchQuery, setSearchQuery, sortOrder, setSortOrder } = useUIStore();

  useEffect(() => {
    fetchTopStories();
  }, []);

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

  const handleStoryPress = (storyId) => {
    navigation.navigate('ArticleDetail', { storyId });
  };

  if (isLoading && storyIds.length === 0) {
    return <LoadingSpinner fullScreen message="Loading top stories..." />;
  }

  if (error && storyIds.length === 0) {
    return (
      <EmptyState
        icon="⚠️"
        title="Oops!"
        message={error}
        buttonText="Try Again"
        onButtonPress={fetchTopStories}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          placeholder="Search stories..."
          placeholderTextColor={colors.gray[400]}
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        <View style={styles.sortContainer}>
          <Button
            title={`Sort by: ${sortOrder === 'score' ? '⭐ Top' : '🕒 New'}`}
            onPress={() => setSortOrder(sortOrder === 'score' ? 'time' : 'score')}
            variant="secondary"
            size="small"
          />
        </View>
      </View>

      <FlatList
        data={filteredAndSortedStories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <StoryItem story={item} onPress={() => handleStoryPress(item.id)} />
        )}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={fetchTopStories}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon="🔍"
              title="No stories found"
              message={searchQuery ? `No results for "${searchQuery}"` : "No stories available"}
            />
          ) : null
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.white,
    padding: spacing[12],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  searchInput: {
    height: 44,
    backgroundColor: colors.gray[100],
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: spacing[16],
    fontSize: 16,
    marginBottom: spacing[8],
  },
  sortContainer: {
    alignItems: 'flex-end',
  },
  listContent: {
    padding: spacing[12],
    paddingBottom: spacing[20],
  },
});

export default ArticleList;