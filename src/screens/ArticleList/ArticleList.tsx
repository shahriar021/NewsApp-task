import React, { useEffect, useMemo } from 'react';
import {
  View,
  FlatList,
  TextInput,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useNewsStore } from '../../store/useNewsStore';
import { useUIStore } from '../../store/uiStore';
import { StoryItem } from '../../components/shared/StoryItem';
import { colors, spacing, layout } from '../../theme';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { EmptyState } from '../../components/shared/Empty';
import { useArticleList } from '../../hooks/useArticleList';

const ArticleList = () => {

  useEffect(() => { fetchTopStories(); }, []);

 const {
    filteredAndSortedStories,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    fetchTopStories,
    handleStoryPress,
  } = useArticleList();

  if (isLoading && filteredAndSortedStories.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  if (error && filteredAndSortedStories.length === 0) {
    return (
      <EmptyState
        icon="⚠️"
        title="Something went wrong"
        message={error}
        buttonText="Try Again"
        onButtonPress={fetchTopStories}
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.headerLabel}>HACKER NEWS</Text>
            <Text style={styles.headerTitle}>Top Stories</Text>
          </View>
          <View style={styles.liveTag}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search stories..."
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>

        {/* Sort pills */}
        <View style={styles.sortRow}>
          <TouchableOpacity
            style={[styles.sortPill, sortOrder === 'score' && styles.sortPillActive]}
            onPress={() => setSortOrder('score')}
          >
            <Text style={[styles.sortPillText, sortOrder === 'score' && styles.sortPillTextActive]}>
              ▲ Top
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortPill, sortOrder === 'time' && styles.sortPillActive]}
            onPress={() => setSortOrder('time')}
          >
            <Text style={[styles.sortPillText, sortOrder === 'time' && styles.sortPillTextActive]}>
              🕒 New
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── List ── */}
      <FlatList
        data={filteredAndSortedStories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <StoryItem
            story={item}
            onPress={() => handleStoryPress(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchTopStories}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon="🔍"
              title="No stories found"
              message={searchQuery ? `No results for "${searchQuery}"` : 'Nothing available'}
            />
          ) : null
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // header
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing[16],
    paddingTop: spacing[16],
    paddingBottom: spacing[16],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing[12],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.error + '20',
    paddingHorizontal: spacing[10],
    paddingVertical: spacing[4],
    borderRadius: layout.borderRadius.round,
    borderWidth: 1,
    borderColor: colors.error + '40',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.error,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.error,
    letterSpacing: 1,
  },

  // search
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.round,
    paddingHorizontal: spacing[16],
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing[8],
  },
  searchIcon: { fontSize: 14 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },

  // sort
  sortRow: {
    flexDirection: 'row',
    gap: spacing[8],
  },
  sortPill: {
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[8],
    borderRadius: layout.borderRadius.round,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  sortPillTextActive: {
    color: colors.white,
  },

  listContent: {
    padding: spacing[16],
    paddingBottom: spacing[32],
  },
});

export default ArticleList;