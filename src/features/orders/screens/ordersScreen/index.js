import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import TopBar from '../../../../components/TopBar';
import { RestaurantStatus } from '../../../restaurant/components';
import { OrdersList } from '../../../orders/components';
import { useOrders } from '../../../orders/hooks/useOrders';
import SocketDebugger from '../../../orders/components/SocketDebugger';

const OrdersScreen = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
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
        title="الطلبات"
        showBackButton={false}
        backgroundColor={theme.colors.primary}
        titleColor={theme.colors.onPrimary}
      />
      
      <OrdersList
        orders={orders}
        loading={loading}
        error={error}
        updating={updating}
        onRefresh={refreshOrders}
        onStatusUpdate={updateOrderStatus}
        onCancelOrder={cancelOrder}
        onAssignDriver={(order) => {
          // Navigate to order assignment screen
          navigation.navigate('OrderAssignment', { order });
        }}
        onUpdateStatus={(order, newStatus) => {
          // Handle status update
          updateOrderStatus(order._id, newStatus);
        }}
        restaurantStatus={<RestaurantStatus />}
        socketDebugger={
          __DEV__ ? (
            <SocketDebugger
              socket={socket}
              socketConnected={socketConnected}
              getSocketStatus={getSocketStatus}
            />
          ) : null
        }
      />
    </View>
  );
};

const createStyles = (theme, insets) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

export default OrdersScreen;