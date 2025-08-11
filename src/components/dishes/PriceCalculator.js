import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export default function PriceCalculator({ 
    selectedSize, 
    selectedAddons = [], 
    addons = [], 
    quantity = 1 
}) {
    const theme = useTheme();
    const styles = createStyles(theme);
    const { t } = useTranslation();

    const calculateTotal = () => {
        let basePrice = 0;
        let addonsPrice = 0;

        // Base price from selected size
        if (selectedSize) {
            basePrice = selectedSize.price;
        }

        // Add addons price
        selectedAddons.forEach(addonId => {
            const addon = addons.find(a => a._id === addonId);
            if (addon) {
                addonsPrice += addon.price;
            }
        });

        const totalPerItem = basePrice + addonsPrice;
        const totalPrice = totalPerItem * quantity;

        return {
            basePrice,
            addonsPrice,
            totalPerItem,
            totalPrice
        };
    };

    const { basePrice, addonsPrice, totalPerItem, totalPrice } = calculateTotal();

    if (!selectedSize) {
        return (
            <View style={styles.container}>
                <Text style={styles.noSelectionText}>{t('dishSize')} {t('required')}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('price')} {t('details')}</Text>
            
            <View style={styles.priceBreakdown}>
                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>{t('dishSize')} {t('price')}:</Text>
                    <Text style={styles.priceValue}>{basePrice} {t('currency')}</Text>
                </View>
                
                {selectedAddons.length > 0 && (
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>{t('dishAddons')}:</Text>
                        <Text style={styles.priceValue}>+{addonsPrice} {t('currency')}</Text>
                    </View>
                )}
                
                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>{t('price')} {t('perItem')}:</Text>
                    <Text style={styles.priceValue}>{totalPerItem} {t('currency')}</Text>
                </View>
                
                {quantity > 1 && (
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>{t('quantity')}:</Text>
                        <Text style={styles.priceValue}>{quantity}</Text>
                    </View>
                )}
            </View>
            
            <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>{t('total')}:</Text>
                <Text style={styles.totalPrice}>{totalPrice} {t('currency')}</Text>
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
    noSelectionText: {
        fontSize: 16,
        color: theme.colors.onSurfaceVariant,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    priceBreakdown: {
        marginBottom: 16,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    priceLabel: {
        fontSize: 14,
        color: theme.colors.onSurfaceVariant,
    },
    priceValue: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.onSurface,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: theme.colors.outline,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.onSurface,
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
}); 