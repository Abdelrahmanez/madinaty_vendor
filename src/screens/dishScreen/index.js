import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import TopBar from '../../components/TopBar';
import { useTheme } from 'react-native-paper';
import { useGetDish } from '../../hooks/useGetDish';
import DishInfo from '../../components/dishes/DishInfo';
import DishSizes from '../../components/dishes/DishSizes';
import DishAddons from '../../components/dishes/DishAddons';
import QuantitySelector from '../../components/dishes/QuantitySelector';
import PriceCalculator from '../../components/dishes/PriceCalculator';
import OrderNotes from '../../components/dishes/OrderNotes';
import AddToCartButton from '../../components/dishes/AddToCartButton';


export default function DishScreen({ navigation, route }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    const { dishId } = route.params || {};
    const { dish, loading, error } = useGetDish(dishId);

    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [orderNotes, setOrderNotes] = useState('');
    
    const scrollViewRef = useRef(null);

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    const handleAddonToggle = (addonId) => {
        setSelectedAddons(prev => 
            prev.includes(addonId) 
                ? prev.filter(id => id !== addonId)
                : [...prev, addonId]
        );
    };

    const handleQuantityChange = (newQuantity) => {
        setQuantity(newQuantity);
    };

    const handleNotesChange = (notes) => {
        setOrderNotes(notes);
    };

    const handleNotesFocus = () => {
        // Scroll to bottom with animation when notes input is focused
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>جاري التحميل...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>حدث خطأ: {error}</Text>
            </View>
        );
    }

    if (!dish) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>لم يتم العثور على الطبق</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <TopBar title={dish.name} />
            <ScrollView 
                ref={scrollViewRef}
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scrollContent}
            >
                <DishInfo dish={dish} />
                <DishSizes 
                    sizes={dish.sizes}
                    onSizeSelect={handleSizeSelect}
                    selectedSize={selectedSize}
                />
                {dish.allowedAddons && dish.allowedAddons.length > 0 && (
                    <DishAddons 
                        addons={dish.allowedAddons}
                        selectedAddons={selectedAddons}
                        onAddonToggle={handleAddonToggle}
                    />
                )}
                
                <QuantitySelector 
                    quantity={quantity}
                    onQuantityChange={handleQuantityChange}
                />
                
                <PriceCalculator 
                    selectedSize={selectedSize}
                    selectedAddons={selectedAddons}
                    addons={dish.allowedAddons || []}
                    quantity={quantity}
                />
                
                <OrderNotes 
                    notes={orderNotes}
                    onNotesChange={handleNotesChange}
                    onFocus={handleNotesFocus}
                />
                
                <AddToCartButton 
                    dishId={dishId}
                    selectedSize={selectedSize}
                    quantity={quantity}
                    notes={orderNotes}
                    selectedAddons={selectedAddons}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: theme.colors.onSurface,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: theme.colors.error,
        textAlign: 'center',
    },
});