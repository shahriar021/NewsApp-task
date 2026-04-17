import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { layout, spacing } from '../../theme';
import { colors } from '../../theme';

export const Card = ({ 
  children, 
  onPress, 
  style, 
  elevation = true,
  padding = 'md' 
}) => {
  const Container = onPress ? TouchableOpacity : View;
  
  const paddingSize = {
    sm: spacing[12],
    md: spacing[16],
    lg: spacing[24],
    none: 0,
  };
  
  return (
    <Container
      style={[
        styles.card,
        elevation && styles.elevation,
        { padding: paddingSize[padding] },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.lg,
    marginBottom: spacing[12],
  },
  elevation: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});