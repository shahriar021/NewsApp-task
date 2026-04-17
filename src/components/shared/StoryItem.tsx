import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { getDomain, getFaviconUrl, getRelativeTime } from '../../utils/storyUtils';
import { colors, spacing, layout } from '../../theme';

interface Props {
  story: any;
  onPress: (story: any) => void;
}

export const StoryItem = React.memo(({ story, onPress }: Props) => {
  if (!story) return null;
  const domain = getDomain(story.url || '');

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(story)}
      activeOpacity={0.85}
    >
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={styles.faviconWrapper}>
          <Image
            source={{ uri: getFaviconUrl(story.url || '') }}
            style={styles.favicon}
          />
        </View>
        <Text style={styles.domain}>{domain}</Text>
        <Text style={styles.time}>
          {story.time ? getRelativeTime(story.time) : ''}
        </Text>
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={3}>
        {story.title}
      </Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom row */}
      <View style={styles.bottomRow}>
        <View style={styles.authorRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {story.by?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.author}>{story.by}</Text>
        </View>

        <View style={styles.scoreBadge}>
          <Text style={styles.scoreArrow}>▲</Text>
          <Text style={styles.scoreText}>{story.score}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.xl,
    padding: spacing[16],
    marginBottom: spacing[12],
    borderWidth: 1,
    borderColor: colors.border,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[12],
    gap: spacing[8],
  },
  faviconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: colors.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  favicon: {
    width: 18,
    height: 18,
    borderRadius: 3,
  },
  domain: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  time: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 24,
    letterSpacing: -0.3,
    marginBottom: spacing[12],
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing[12],
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 999,
    backgroundColor: colors.primary + '25',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  author: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    backgroundColor: colors.primary + '18',
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[4],
    borderRadius: layout.borderRadius.round,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  scoreArrow: {
    fontSize: 10,
    color: colors.primary,
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default StoryItem;