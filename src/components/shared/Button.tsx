import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { colors, spacing, typography, layout } from '../../theme';

export const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  style,
  textStyle,
}) => {
  const variants = {
    primary: {
      background: colors.primary,
      text: colors.white,
    },
    secondary: {
      background: colors.gray[100],
      text: colors.gray[800],
    },
    outline: {
      background: 'transparent',
      text: colors.primary,
      border: colors.primary,
    },
    danger: {
      background: colors.error,
      text: colors.white,
    },
  };
  
  const sizes = {
    small: {
      paddingVertical: spacing[8],
      paddingHorizontal: spacing[12],
      fontSize: typography.small.fontSize,
    },
    medium: {
      paddingVertical: spacing[12],
      paddingHorizontal: spacing[20],
      fontSize: typography.body.fontSize,
    },
    large: {
      paddingVertical: spacing[16],
      paddingHorizontal: spacing[24],
      fontSize: typography.bodyBold.fontSize,
    },
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: variants[variant].background },
        sizes[size],
        variant === 'outline' && {
          borderWidth: 1,
          borderColor: variants[variant].border,
        },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variants[variant].text} />
      ) : (
        <Text
          style={[
            styles.text,
            { color: variants[variant].text },
            { fontSize: sizes[size].fontSize },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: layout.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
});