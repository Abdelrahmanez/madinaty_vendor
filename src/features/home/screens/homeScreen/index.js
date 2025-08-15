import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import TopBar from '../../../../components/TopBar';
import { RestaurantStatus } from '../../../restaurant/components';
import { OrdersList } from '../../../orders/components';
import { useOrders } from '../../../orders/hooks/useOrders';
import SocketDebugger from '../../../orders/components/SocketDebugger';

/**
 * Home Screen Component
 * Main screen for restaurant vendor dashboard
 */
const HomeScreen = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets);

  const {
    orders,
    loading,
    error,
    updating,
    socketConnected,
    updateOrderStatus,
    cancelOrder,
    refreshOrders,
    getSocketStatus,
    socket
  } = useOrders();

  return (
    <View style={styles.container}>
      <TopBar
        title="الرئيسية"
        showBackButton={false}
        backgroundColor={theme.colors.primary}
        titleColor={theme.colors.onPrimary}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Restaurant Status */}
        <RestaurantStatus />

        {/* Socket Debugger - Only show in development */}
        {__DEV__ && (
          <SocketDebugger
            socket={socket}
            socketConnected={socketConnected}
            getSocketStatus={getSocketStatus}
          />
        )}

        {/* Orders List */}
        <OrdersList
          orders={orders}
          loading={loading}
          error={error}
          updating={updating}
          onRefresh={refreshOrders}
          onStatusUpdate={updateOrderStatus}
          onCancelOrder={cancelOrder}
        />
      </ScrollView>
    </View>
  );
};

const createStyles = (theme, insets) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: insets.bottom + 20,
  },
});

export default HomeScreen;
