import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export default function QuantitySelector({ quantity = 1, onQuantityChange, minQuantity = 1, maxQuantity = 99 }) {
    const theme = useTheme();
    const styles = createStyles(theme);
    const { t } = useTranslation();

    const handleIncrement = () => {
        if (quantity < maxQuantity) {
            onQuantityChange(quantity + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > minQuantity) {
            onQuantityChange(quantity - 1);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{t('quantity')}</Text>
            <View style={styles.quantityContainer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        quantity <= minQuantity && styles.disabledButton
                    ]}
                    onPress={handleDecrement}
                    disabled={quantity <= minQuantity}
                >
                    <Text style={[
                        styles.buttonText,
                        quantity <= minQuantity && styles.disabledButtonText
                    ]}>
                        -
                    </Text>
                </TouchableOpacity>
                
                <View style={styles.quantityDisplay}>
                    <Text style={styles.quantityText}>{quantity}</Text>
                </View>
                
                <TouchableOpacity
                    style={[
                        styles.button,
                        quantity >= maxQuantity && styles.disabledButton
                    ]}
                    onPress={handleIncrement}
                    disabled={quantity >= maxQuantity}
                >
                    <Text style={[
                        styles.buttonText,
                        quantity >= maxQuantity && styles.disabledButtonText
                    ]}>
                        +
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const createStyles = (theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: theme.colors.onSurface,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.outline,
        overflow: 'hidden',
    },
    button: {
        width: 40,
        height: 40,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        backgroundColor: theme.colors.surfaceDisabled,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.onPrimary,
    },
    disabledButtonText: {
        color: theme.colors.onSurfaceDisabled,
    },
    quantityDisplay: {
        width: 50,
        height: 40,
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: theme.colors.outline,
    },
    quantityText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.onSurface,
    },
}); 