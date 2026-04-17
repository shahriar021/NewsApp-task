import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, spacing } from '../../theme';

const SkeletonCard = ({ delay = 0 }: { delay?: number }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true, delay }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity, delay]);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.topRow}>
        <View style={styles.skCircle} />
        <View style={styles.skDomain} />
        <View style={styles.skTime} />
      </View>
      <View style={styles.skLine100} />
      <View style={styles.skLine75} />
      <View style={styles.skLine50} />
      <View style={styles.divider} />
      <View style={styles.bottomRow}>
        <View style={styles.skAvatar} />
        <View style={styles.skAuthor} />
        <View style={styles.skBadge} />
      </View>
    </Animated.View>
  );
};

export const LoadingSpinner = ({
  fullScreen = false,
}: {
  fullScreen?: boolean;
  message?: string;
}) => {
  if (fullScreen) {
    return (
      <View style={styles.screen}>
        <View style={styles.headerSk} />
        {[0, 150, 300, 450, 600].map((delay, i) => (
          <SkeletonCard key={i} delay={delay} />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.inline}>
      <Text style={styles.inlineText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing[16],
    paddingTop: spacing[16],
  },
  inline: {
    padding: spacing[20],
    alignItems: 'center',
  },
  inlineText: {
    fontSize: 14,
    color: colors.textMuted,
  },

  // header skeleton
  headerSk: {
    height: 140,
    backgroundColor: '#252535',
    borderRadius: 16,
    marginBottom: spacing[16],
    borderWidth: 1,
    borderColor: colors.border,
  },

  // card skeleton
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing[16],
    marginBottom: spacing[12],
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing[10],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  skCircle: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#3A3A50',
  },
  skDomain: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#3A3A50',
  },
  skTime: {
    width: 40,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#3A3A50',
  },
  skLine100: {
    height: 14,
    borderRadius: 999,
    backgroundColor: '#3A3A50',
    width: '100%',
  },
  skLine75: {
    height: 14,
    borderRadius: 999,
    backgroundColor: '#3A3A50',
    width: '75%',
  },
  skLine50: {
    height: 14,
    borderRadius: 999,
    backgroundColor: '#3A3A50',
    width: '50%',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  skAvatar: {
    width: 26,
    height: 26,
    borderRadius: 999,
    backgroundColor: '#3A3A50',
  },
  skAuthor: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#3A3A50',
  },
  skBadge: {
    width: 56,
    height: 26,
    borderRadius: 999,
    backgroundColor: '#3A3A50',
  },
});