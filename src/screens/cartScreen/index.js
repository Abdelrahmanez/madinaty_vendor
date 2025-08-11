import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, I18nManager, RefreshControl, ScrollView, Alert } from "react-native";
import { useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import TopBar from '../../components/TopBar';
import { useGetCart } from "../../hooks/useGetCart";
import LoadingIndicator from "../../components/LoadingIndicator";
import CartList from "../../components/cart/CartList";
import Promocode from "../../components/promocode/promocode";
import AddressBar from "../../components/address/AddressBar";
import OrderForm from "../../components/order/OrderForm";
import { useNavigation } from "@react-navigation/native";
import { useGetCurrentAddress } from "../../hooks/useGetCurrentAddress";

const isRTL = I18nManager.isRTL;

const CartScreen = ({ navigation }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [promoCode, setPromoCode] = useState(null);
  
  const { cart, loading, error, refreshCart } = useGetCart();
  const { currentAddress, loading: addressLoading, error: addressError } = useGetCurrentAddress();

  const handleRefresh = () => {
    refreshCart();
  };

  const handleOrderSuccess = (orderResult) => {
    // Navigate to order details or show success message
    if (__DEV__) {
      console.log('Order created successfully:', orderResult);
    }
    // You can navigate to order details screen here
    // navigation.navigate('OrderDetails', { orderId: orderResult.id });
  };

  const handleOrderError = (error) => {
    if (__DEV__) {
      console.error('Order creation failed:', error);
    }
  };

  // Refresh cart when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refreshCart();
    }, [refreshCart])
  );

  // Show loading only when we don't have any cart data yet
  if (loading && !cart) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <TopBar title={t('cartScreen.title')} />
        <LoadingIndicator message={t('cartScreen.loadingCart')} />
      </View>
    );
  }

  // Show error only when we don't have any cart data yet
  if (error && !cart) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <TopBar title={t('cartScreen.title')} />
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        >
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {t('cartScreen.errorLoadingCart')}
          </Text>
        </ScrollView>
      </View>
    );
  }

  // Only check for empty cart when we have actual cart data
  const cartItems = cart?.data?.items || [];
  const isCartEmpty = cart && cartItems.length === 0;

  if (isCartEmpty) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <TopBar 
          title={t('cartScreen.title')}
          subtitle={t('cartScreen.subtitle')}
        />
        
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        >
          <Text style={[styles.contentText, { color: theme.colors.primary }]}>
            {t('cartScreen.emptyCart')}
          </Text>
        </ScrollView>
      </View>
    );
  }

  const totalPrice = cart?.totalAmount || 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopBar 
        title={t('cartScreen.title')}
        backgroundColor={theme.colors.primary}
        titleColor={theme.colors.surface}
        iconColor={theme.colors.surface}
      />
      <AddressBar navigation={navigation} />
      <View style={styles.contentContainer}>
          <CartList 
            data={cartItems} 
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={handleRefresh}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
          />
      </View>
      <Promocode totalPrice={totalPrice} />
      <OrderForm 
        promoCode={promoCode}
        onOrderSuccess={handleOrderSuccess}
        onOrderError={handleOrderError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentText: {
    fontSize: 24, 
    fontWeight: 'bold',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});

export default CartScreen;