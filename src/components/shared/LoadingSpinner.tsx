import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';

export const LoadingSpinner = ({ size = 'large', message = 'Loading...', fullScreen = false }) => {
  const content = (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
  
  return content;
};

const styles = StyleSheet.create({
  container: {
    padding: spacing[20],
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  message: {
    marginTop: spacing[12],
    color: colors.gray[600],
    ...typography.caption,
  },
});