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
  
  // Use the bookmark store - CORRECT WAY
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
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
            <Text style={styles.buttonText}>📤</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleBookmark} style={styles.iconButton}>
            <Text style={[styles.buttonText, isBookmarked && styles.activeText]}>
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
        <ActivityIndicator size="large" color="#FF6600" />
        <Text style={styles.loadingText}>Loading article...</Text>
      </View>
    );
  }
  
  if (error || !story) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Story not found'}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{story.title || 'No Title'}</Text>
      
      <View style={styles.metaInfo}>
        <View style={styles.authorContainer}>
          <Text style={styles.authorLabel}>Author:</Text>
          <Text style={styles.author}>{story.by || 'Unknown'}</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>⭐ Score:</Text>
            <Text style={styles.statValue}>{story.score || 0}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>🕒 Posted:</Text>
            <Text style={styles.statValue}>
              {story.time ? getRelativeTime(story.time) : 'Unknown'}
            </Text>
          </View>
          
          {story.descendants > 0 && (
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>💬 Comments:</Text>
              <Text style={styles.statValue}>{story.descendants}</Text>
            </View>
          )}
        </View>
      </View>
      
      {story.url && (
        <TouchableOpacity onPress={openLink} style={styles.linkButton}>
          <Text style={styles.linkText}>🌐 Open Article</Text>
          <Text style={styles.urlText} numberOfLines={2}>
            {story.url}
          </Text>
        </TouchableOpacity>
      )}
      
      {!story.url && (
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
    backgroundColor: '#fff',
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  headerButtons: {
    flexDirection: 'row',
    marginRight: 10,
  },
  iconButton: {
    marginLeft: 20,
    padding: 5,
  },
  buttonText: {
    color: '#FF6600',
    fontSize: 24,
  },
  activeText: {
    color: '#FFD700',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    lineHeight: 34,
    color: '#000',
  },
  metaInfo: {
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  authorContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  authorLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  author: {
    fontSize: 14,
    color: '#FF6600',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 13,
    color: '#999',
    marginRight: 5,
  },
  statValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  linkButton: {
    marginTop: 10,
    padding: 18,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  linkText: {
    color: '#FF6600',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  urlText: {
    color: '#0066cc',
    fontSize: 12,
    lineHeight: 18,
  },
  noLinkContainer: {
    marginTop: 10,
    padding: 18,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    alignItems: 'center',
  },
  noLinkText: {
    color: '#999',
    fontSize: 14,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FF6600',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ArticleDetail;