import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function CustomerNotes({ notes, onNotesChange, placeholder = "ملاحظات إضافية للطلب (اختياري)..." }) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ملاحظات للطلب (اختياري)</Text>
      <TextInput
        style={styles.input}
        value={notes}
        onChangeText={onNotesChange}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.outline}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />
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
  input: {
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: theme.colors.onSurface,
    backgroundColor: theme.colors.surface,
    minHeight: 80,
  },
}); 