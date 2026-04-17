import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { colors, spacing, layout } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  style?: any;
  textStyle?: any;
}

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
}: ButtonProps) => {
  const v = {
    primary: { bg: colors.primary, text: colors.white, border: colors.primary },
    secondary: { bg: colors.card, text: colors.textPrimary, border: colors.border },
    outline: { bg: 'transparent', text: colors.primary, border: colors.primary },
    danger: { bg: colors.error, text: colors.white, border: colors.error },
  }[variant];

  const s = {
    small: { py: spacing[8], px: spacing[14], fontSize: 13 },
    medium: { py: spacing[12], px: spacing[20], fontSize: 15 },
    large: { py: spacing[16], px: spacing[24], fontSize: 16 },
  }[size];

  return (
    <TouchableOpacity
      style={[
        styles.base,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          paddingVertical: s.py,
          paddingHorizontal: s.px,
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
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <Text style={[styles.text, { color: v.text, fontSize: s.fontSize }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: layout.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.4 },
  text: { fontWeight: '700', letterSpacing: 0.2 },
});