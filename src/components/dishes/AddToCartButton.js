import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useCart } from '../../hooks/useCart';
import LoadingButton from '../common/LoadingButton';
import { useTranslation } from 'react-i18next';

export default function AddToCartButton({ 
    dishId,
    selectedSize, 
    quantity = 1,
    notes = '',
    selectedAddons = [],
    disabled = false 
}) {
    const theme = useTheme();
    const styles = createStyles(theme);
    const { addItemToCart, loading } = useCart();
    const { t } = useTranslation();

    const isButtonDisabled = !selectedSize || quantity < 1 || disabled || !dishId;

    const getButtonText = () => {
        if (!dishId) return t('required');
        if (!selectedSize) return t('dishSize') + ' ' + t('required');
        if (quantity < 1) return t('quantity') + ' ' + t('required');
        return t('buttonAddToCart');
    };

    const handleAddToCart = async () => {
        if (!isButtonDisabled) {
            try {
                // Ensure selectedSize is the ID string, not the object
                const sizeId = typeof selectedSize === 'object' ? selectedSize._id : selectedSize;
                
                const cartData = {
                    dishId: dishId,
                    quantity: quantity,
                    notes: notes,
                    selectedSize: sizeId,
                    selectedAddons: selectedAddons
                };
                
                await addItemToCart(cartData);
            } catch (error) {
                // Error is already handled in the hook
                console.error('Failed to add item to cart:', error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <LoadingButton
                onPress={handleAddToCart}
                title={getButtonText()}
                loading={loading}
                disabled={isButtonDisabled}
                loadingText={t('loading')}
            />
        </View>
    );
}

const createStyles = (theme) => StyleSheet.create({
    container: {
        margin: 16,
    },
}); 