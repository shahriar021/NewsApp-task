export const colors = {
  // Brand
  primary: '#FF4D00',
  primaryLight: '#FF6A00',

  // Dark surfaces
  background: '#0C0C0F',
  surface: '#16161D',
  card: '#1E1E28',
  cardElevated: '#252532',
  border: '#2A2A36',

  // Text
  textPrimary: '#F0F0F5',
  textSecondary: '#9090A8',
  textMuted: '#55556A',

  // Semantic
  success: '#00C896',
  error: '#FF4560',
  warning: '#FFB800',

  white: '#FFFFFF',
  black: '#000000',

  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  overlay: 'rgba(0,0,0,0.6)',
};

export const spacing = {
  2: 2,
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
  40: 40,
  48: 48,
  64: 64,
};

export const layout = {
  screenPadding: spacing[16],
  cardPadding: spacing[16],
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    round: 999,
  },
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '800' as const, lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '700' as const, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyBold: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  caption: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  captionBold: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
  small: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
};