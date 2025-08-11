import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export default function PromoCodeDisplay({ promoCode, onRemove }) {
  const theme = useTheme();
  const styles = createStyles(theme);

  if (!promoCode) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>كود الخصم</Text>
      <View style={styles.codeContainer}>
        <View style={styles.codeInfo}>
          <MaterialIcons 
            name="local-offer" 
            size={20} 
            color={theme.colors.primary} 
          />
          <Text style={styles.codeText}>{promoCode}</Text>
        </View>
        {onRemove && (
          <MaterialIcons 
            name="close" 
            size={20} 
            color={theme.colors.error}
            onPress={onRemove}
            style={styles.removeIcon}
          />
        )}
      </View>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 8,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  codeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
    marginLeft: 8,
  },
  removeIcon: {
    padding: 4,
  },
}); 