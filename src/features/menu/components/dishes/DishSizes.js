import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { sortSizesByPrice } from '../../../../utils/dishUtils';

export default function DishSizes({ sizes, onSizeSelect, selectedSize }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    if (!sizes || sizes.length === 0) return null;

    const sortedSizes = sortSizesByPrice(sizes);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>اختر الحجم</Text>
            <View style={styles.sizesContainer}>
                {sortedSizes.map((size) => (
                    <TouchableOpacity
                        key={size._id}
                        style={[
                            styles.sizeItem,
                            selectedSize?._id === size._id && styles.selectedSize
                        ]}
                        onPress={() => onSizeSelect(size)}
                    >
                        <Text style={[
                            styles.sizeName,
                            selectedSize?._id === size._id && styles.selectedSizeText
                        ]}>
                            {size.name}
                        </Text>
                        <Text style={[
                            styles.sizePrice,
                            selectedSize?._id === size._id && styles.selectedSizeText
                        ]}>
                            {size.price} جنيه
                        </Text>
                        {size.currentStock <= 0 && (
                            <Text style={styles.outOfStock}>نفذت الكمية</Text>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
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
    sizesContainer: {
        gap: 8,
    },
    sizeItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.outline,
        backgroundColor: theme.colors.surface,
    },
    selectedSize: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primaryContainer,
    },
    sizeName: {
        fontSize: 16,
        fontWeight: '500',
        color: theme.colors.onSurface,
    },
    selectedSizeText: {
        color: theme.colors.onPrimaryContainer,
        fontWeight: 'bold',
    },
    sizePrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    outOfStock: {
        fontSize: 12,
        color: theme.colors.error,
        fontStyle: 'italic',
    },
}); 