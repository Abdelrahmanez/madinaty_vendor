import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { formatPriceRange } from '../../utils/dishUtils';
import DishImageSlider from './DishImageSlider';

export default function DishInfo({ dish }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    if (!dish) return null;

    return (
        <View style={styles.container}>
            {/* Dish Images */}
            <DishImageSlider 
                mainImageUrl={dish.imageUrl}
                images={dish.images || []}
            />

            {/* Dish Details */}
            <View style={styles.detailsContainer}>
                <Text style={styles.name}>{dish.name}</Text>
                
                {dish.description && (
                    <Text style={styles.description}>{dish.description}</Text>
                )}

                <View style={styles.priceContainer}>
                    <Text style={styles.price}>{formatPriceRange(dish.sizes)}</Text>
                    {dish.offer?.isActive && (
                        <View style={styles.offerBadge}>
                            <Text style={styles.offerText}>عرض خاص</Text>
                        </View>
                    )}
                </View>

                {/* Restaurant Info */}
                {dish.restaurant && (
                    <View style={styles.restaurantContainer}>
                        <Text style={styles.restaurantLabel}>المطعم:</Text>
                        <Text style={styles.restaurantName}>{dish.restaurant.name}</Text>
                    </View>
                )}

                {/* Category Info */}
                {dish.category && (
                    <View style={styles.categoryContainer}>
                        <Text style={styles.categoryLabel}>الفئة:</Text>
                        <Text style={styles.categoryName}>{dish.category.name}</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const createStyles = (theme) => StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        margin: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: theme.colors.onSurface,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    detailsContainer: {
        padding: 16,
        paddingTop: 12,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.onSurface,
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: theme.colors.onSurfaceVariant,
        lineHeight: 22,
        marginBottom: 12,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    offerBadge: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
    },
    offerText: {
        color: theme.colors.onPrimary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    restaurantContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    restaurantLabel: {
        fontSize: 14,
        color: theme.colors.onSurfaceVariant,
        marginRight: 8,
    },
    restaurantName: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.onSurface,
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryLabel: {
        fontSize: 14,
        color: theme.colors.onSurfaceVariant,
        marginRight: 8,
    },
    categoryName: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.onSurface,
    },
}); 