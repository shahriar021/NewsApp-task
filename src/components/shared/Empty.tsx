import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Button } from '../shared/Button';

export const EmptyState = ({ 
  icon = '📚', 
  title = 'Nothing here', 
  message = 'Add some items to get started',
  buttonText,
  onButtonPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {buttonText && onButtonPress && (
        <Button
          title={buttonText}
          onPress={onButtonPress}
          variant="outline"
          size="small"
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
  },
  icon: {
    fontSize: 64,
    marginBottom: spacing[16],
  },
  title: {
    ...typography.h3,
    color: colors.gray[800],
    marginBottom: spacing[8],
  },
  message: {
    ...typography.caption,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: spacing[20],
  },
  button: {
    minWidth: 120,
  },
});