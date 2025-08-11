import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function OrderNotes({ notes = '', onNotesChange, onFocus, placeholder = 'أضف ملاحظات خاصة للطلب...' }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>ملاحظات خاصة</Text>
            <TextInput
                style={styles.textInput}
                value={notes}
                onChangeText={onNotesChange}
                onFocus={onFocus}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.onSurfaceVariant}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                maxLength={200}
            />
            <Text style={styles.characterCount}>
                {notes.length}/200
            </Text>
        </View>
    );
}

const createStyles = (theme) => StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        margin: 16,
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.onSurface,
        marginBottom: 12,
    },
    textInput: {
        borderWidth: 1,
        borderColor: theme.colors.outline,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: theme.colors.onSurface,
        backgroundColor: theme.colors.surface,
        minHeight: 80,
        textAlign: 'right',
    },
    characterCount: {
        fontSize: 12,
        color: theme.colors.onSurfaceVariant,
        textAlign: 'left',
        marginTop: 4,
    },
}); 