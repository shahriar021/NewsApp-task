import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, layout } from '../../theme';
import { Button } from '../shared/Button';

interface EmptyStateProps {
  icon?: string;
  title?: string;
  message?: string;
  buttonText?: string;
  onButtonPress?: () => void;
}

export const EmptyState = ({
  icon = '📭',
  title = 'Nothing here',
  message = 'Nothing to show right now',
  buttonText,
  onButtonPress,
}: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {buttonText && onButtonPress && (
        <Button
          title={buttonText}
          onPress={onButtonPress}
          variant="primary"
          size="medium"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[32],
    marginTop: spacing[48],
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: layout.borderRadius.round,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[24],
  },
  icon: { fontSize: 44 },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing[8],
    letterSpacing: -0.3,
  },
  message: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing[24],
  },
  button: { minWidth: 140 },
});