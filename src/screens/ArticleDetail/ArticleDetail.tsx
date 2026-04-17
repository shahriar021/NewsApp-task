import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Share,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useNewsStore } from '../../store/useNewsStore';
import { useBookmarkStore } from '../../store/useBookmarkStore';
import { getRelativeTime } from '../../utils/storyUtils';

const ArticleDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const storyId = route.params?.storyId;

  const { stories, fetchStoryDetails } = useNewsStore();
  const story = storyId ? stories[storyId] : null;

  const [loading, setLoading] = useState(!story);
  const [error, setError] = useState(null);

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
    } catch (error) {
      console.log('Error sharing:', error);
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
    } catch (error) {
      console.log('Error opening link:', error);
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

  useLayoutEffect(() => {
    if (!story?.id) return;
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#16161D',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A36',
      },
      headerTintColor: '#F0F0F5',
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
            <Text style={styles.headerIcon}>📤</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleBookmark} style={styles.iconButton}>
            <Text style={[styles.headerIcon, isBookmarked && styles.bookmarkedIcon]}>
              {isBookmarked ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, handleShare, handleBookmark, isBookmarked, story?.id]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF4D00" />
        <Text style={styles.loadingText}>Loading article...</Text>
      </View>
    );
  }

  if (error || !story) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorText}>{error || 'Story not found'}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {/* Domain tag */}
      <View style={styles.domainTag}>
        <Text style={styles.domainText}>HACKER NEWS</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{story.title || 'No Title'}</Text>

      {/* Author row */}
      <View style={styles.authorRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {story.by?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.author}>{story.by || 'Unknown'}</Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statBadge}>
          <Text style={styles.statIcon}>▲</Text>
          <Text style={styles.statValue}>{story.score || 0}</Text>
          <Text style={styles.statLabel}>points</Text>
        </View>

        <View style={styles.statBadge}>
          <Text style={styles.statIcon}>🕒</Text>
          <Text style={styles.statValue}>
            {story.time ? getRelativeTime(story.time) : 'Unknown'}
          </Text>
        </View>

        {story.descendants > 0 && (
          <View style={styles.statBadge}>
            <Text style={styles.statIcon}>💬</Text>
            <Text style={styles.statValue}>{story.descendants}</Text>
            <Text style={styles.statLabel}>comments</Text>
          </View>
        )}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Link button */}
      {story.url ? (
        <TouchableOpacity onPress={openLink} style={styles.linkButton} activeOpacity={0.85}>
          <View style={styles.linkTop}>
            <Text style={styles.linkIcon}>🌐</Text>
            <Text style={styles.linkLabel}>Open Article</Text>
            <Text style={styles.linkArrow}>→</Text>
          </View>
          <Text style={styles.urlText} numberOfLines={2}>
            {story.url}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.noLinkContainer}>
          <Text style={styles.noLinkText}>No external link available</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0F',
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },

  // center states
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0C0C0F',
    padding: 20,
    gap: 12,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  loadingText: {
    marginTop: 12,
    color: '#9090A8',
    fontSize: 14,
  },
  errorText: {
    color: '#FF4560',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  backButton: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FF4D00',
    borderRadius: 999,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  // header
  headerButtons: {
    flexDirection: 'row',
    marginRight: 10,
    gap: 4,
  },
  iconButton: {
    marginLeft: 8,
    padding: 6,
    backgroundColor: '#252532',
    borderRadius: 8,
  },
  headerIcon: {
    fontSize: 18,
    color: '#F0F0F5',
  },
  bookmarkedIcon: {
    color: '#FFB800',
  },

  // domain tag
  domainTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF4D0020',
    borderWidth: 1,
    borderColor: '#FF4D0040',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 16,
  },
  domainText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF4D00',
    letterSpacing: 1.5,
  },

  // title
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F0F0F5',
    lineHeight: 34,
    letterSpacing: -0.4,
    marginBottom: 20,
  },

  // author
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: '#FF4D0025',
    borderWidth: 1,
    borderColor: '#FF4D0050',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF4D00',
  },
  author: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9090A8',
  },

  // stats
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#1E1E28',
    borderWidth: 1,
    borderColor: '#2A2A36',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  statIcon: {
    fontSize: 12,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F0F0F5',
  },
  statLabel: {
    fontSize: 12,
    color: '#55556A',
    fontWeight: '500',
  },

  // divider
  divider: {
    height: 1,
    backgroundColor: '#2A2A36',
    marginBottom: 24,
  },

  // link
  linkButton: {
    backgroundColor: '#1E1E28',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A36',
    padding: 18,
  },
  linkTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  linkIcon: {
    fontSize: 16,
  },
  linkLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#FF4D00',
  },
  linkArrow: {
    fontSize: 18,
    color: '#FF4D00',
    fontWeight: '700',
  },
  urlText: {
    color: '#9090A8',
    fontSize: 12,
    lineHeight: 18,
  },
  noLinkContainer: {
    padding: 18,
    backgroundColor: '#1E1E28',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A36',
    alignItems: 'center',
  },
  noLinkText: {
    color: '#55556A',
    fontSize: 14,
  },
});

export default ArticleDetail;