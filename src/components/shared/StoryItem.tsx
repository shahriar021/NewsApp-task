import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { getDomain, getFaviconUrl, getRelativeTime } from '../../utils/storyUtils';


interface Props {
  story: any; // Pass the whole object
  onPress: (story: any) => void;
}

// Use React.memo so the list doesn't lag when you scroll
const StoryItem = React.memo(({ story, onPress }: Props) => {
  if (!story) return null;

  const domain = getDomain(story.url || '');

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(story)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{story.title}</Text>
        
        <View style={styles.footer}>
          <Image 
            source={{ uri: getFaviconUrl(story.url || '') }} 
            style={styles.favicon} 
          />
          <Text style={styles.footerText}>
            {domain} • {story.score} pts • {story.time ? getRelativeTime(story.time) : 'Unknown'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: { 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F0F0F0', 
    backgroundColor: '#FFFFFF' 
  },
  content: { flex: 1 },
  title: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#1A1A1A', 
    lineHeight: 22,
    marginBottom: 8 
  },
  footer: { flexDirection: 'row', alignItems: 'center' },
  favicon: { width: 16, height: 16, marginRight: 8, borderRadius: 2 },
  footerText: { fontSize: 13, color: '#666' }
});

export default StoryItem;