// import React, { useEffect, useMemo } from 'react';
// import {
//   View,
//   FlatList,
//   TextInput,
//   RefreshControl,
//   StyleSheet,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { useNewsStore } from '../../store/useNewsStore';
// import { useUIStore } from '../../store/uiStore';
// import { StoryItem } from '../../components/shared/StoryItem';
// import { colors, spacing, typography, layout } from '../../theme';
// import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
// import { EmptyState } from '../../components/shared/Empty';
// import { Button } from '../../components/shared/Button';

// const ArticleList = () => {
//   const navigation = useNavigation();
//   const { storyIds, stories, fetchTopStories, isLoading, error } = useNewsStore();
//   const { searchQuery, setSearchQuery, sortOrder, setSortOrder } = useUIStore();

//   useEffect(() => {
//     fetchTopStories();
//   }, []);

//   const filteredAndSortedStories = useMemo(() => {
//     let data = storyIds.map(id => stories[id]).filter(Boolean);
//     if (searchQuery) {
//       data = data.filter(story =>
//         story.title.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
//     return data.sort((a, b) => {
//       if (sortOrder === 'score') return b.score - a.score;
//       if (sortOrder === 'time') return b.time - a.time;
//       return 0;
//     });
//   }, [storyIds, stories, searchQuery, sortOrder]);

//   const handleStoryPress = (storyId) => {
//     navigation.navigate('ArticleDetail', { storyId });
//   };

//   if (isLoading && storyIds.length === 0) {
//     return <LoadingSpinner fullScreen message="Loading top stories..." />;
//   }

//   if (error && storyIds.length === 0) {
//     return (
//       <EmptyState
//         icon="⚠️"
//         title="Oops!"
//         message={error}
//         buttonText="Try Again"
//         onButtonPress={fetchTopStories}
//       />
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TextInput
//           placeholder="Search stories..."
//           placeholderTextColor={colors.gray[400]}
//           style={styles.searchInput}
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           clearButtonMode="while-editing"
//         />
//         <View style={styles.sortContainer}>
//           <Button
//             title={`Sort by: ${sortOrder === 'score' ? '⭐ Top' : '🕒 New'}`}
//             onPress={() => setSortOrder(sortOrder === 'score' ? 'time' : 'score')}
//             variant="secondary"
//             size="small"
//           />
//         </View>
//       </View>

//       <FlatList
//         data={filteredAndSortedStories}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <StoryItem story={item} onPress={() => handleStoryPress(item.id)} />
//         )}
//         refreshControl={
//           <RefreshControl 
//             refreshing={isLoading} 
//             onRefresh={fetchTopStories}
//             colors={[colors.primary]}
//             tintColor={colors.primary}
//           />
//         }
//         ListEmptyComponent={
//           !isLoading ? (
//             <EmptyState
//               icon="🔍"
//               title="No stories found"
//               message={searchQuery ? `No results for "${searchQuery}"` : "No stories available"}
//             />
//           ) : null
//         }
//         contentContainerStyle={styles.listContent}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   header: {
//     backgroundColor: colors.white,
//     padding: spacing[12],
//     borderBottomWidth: 1,
//     borderBottomColor: colors.gray[200],
//   },
//   searchInput: {
//     height: 44,
//     backgroundColor: colors.gray[100],
//     borderRadius: layout.borderRadius.md,
//     paddingHorizontal: spacing[16],
//     fontSize: 16,
//     marginBottom: spacing[8],
//   },
//   sortContainer: {
//     alignItems: 'flex-end',
//   },
//   listContent: {
//     padding: spacing[12],
//     paddingBottom: spacing[20],
//   },
// });

// export default ArticleList;

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

const ArticleList = () => {
  const navigation = useNavigation();
  const { storyIds, stories, fetchTopStories, isLoading, error } = useNewsStore();
  const { searchQuery, setSearchQuery, sortOrder, setSortOrder } = useUIStore();

  useEffect(() => { fetchTopStories(); }, []);

  const filteredAndSortedStories = useMemo(() => {
    let data = storyIds.map((id: any) => stories[id]).filter(Boolean);
    if (searchQuery) {
      data = data.filter((story: any) =>
        story.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return data.sort((a: any, b: any) =>
      sortOrder === 'score' ? b.score - a.score : b.time - a.time
    );
  }, [storyIds, stories, searchQuery, sortOrder]);

  if (isLoading && storyIds.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  if (error && storyIds.length === 0) {
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

  const handleStoryPress = (storyId: number) => {
  navigation.navigate('ArticleDetail' as never, { storyId } as never);
};

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