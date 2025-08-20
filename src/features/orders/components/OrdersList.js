import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  RefreshControl,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useTheme, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import OrderCardItem from './OrderCardItem';
import OrderDetailsModal from './OrderDetailsModal';
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../../../utils/enums';

/**
 * OrdersList Component
 * Displays a list of orders with filtering and search capabilities
 */
const OrdersList = ({ 
  orders = [], 
  loading = false, 
  onRefresh, 
  onStatusUpdate,
  onCancelOrder,
  onAssignDriver,
  onUpdateStatus,
  restaurantStatus,
  socketDebugger,
  style 
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState(ORDER_STATUS.PENDING);

  // Filter orders based on active filter
  const filteredOrders = React.useMemo(() => {
    if (activeFilter === 'all') return orders;
    return orders.filter(order => order.status === activeFilter);
  }, [orders, activeFilter]);

  // Handle order card press
  const handleOrderPress = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  // Handle modal dismiss
  const handleModalDismiss = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  // Handle status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await onStatusUpdate?.(orderId, newStatus);
      // Refresh orders after status update
      onRefresh?.();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    try {
      await onCancelOrder?.(orderId);
      // Refresh orders after cancellation
      onRefresh?.();
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  // Filter options
  const filterOptions = [
    { key: 'all', label: 'جميع الطلبات', count: orders.length },
    { key: ORDER_STATUS.PENDING, label: ORDER_STATUS_LABELS[ORDER_STATUS.PENDING], count: orders.filter(o => o.status === ORDER_STATUS.PENDING).length },
    { key: ORDER_STATUS.PREPARING, label: ORDER_STATUS_LABELS[ORDER_STATUS.PREPARING], count: orders.filter(o => o.status === ORDER_STATUS.PREPARING).length },
    { key: ORDER_STATUS.READY_FOR_PICKUP, label: ORDER_STATUS_LABELS[ORDER_STATUS.READY_FOR_PICKUP], count: orders.filter(o => o.status === ORDER_STATUS.READY_FOR_PICKUP).length },
    { key: ORDER_STATUS.ASSIGNED_TO_DRIVER, label: ORDER_STATUS_LABELS[ORDER_STATUS.ASSIGNED_TO_DRIVER], count: orders.filter(o => o.status === ORDER_STATUS.ASSIGNED_TO_DRIVER).length },
    { key: ORDER_STATUS.ON_THE_WAY, label: ORDER_STATUS_LABELS[ORDER_STATUS.ON_THE_WAY], count: orders.filter(o => o.status === ORDER_STATUS.ON_THE_WAY).length },
    { key: ORDER_STATUS.DELIVERED, label: ORDER_STATUS_LABELS[ORDER_STATUS.DELIVERED], count: orders.filter(o => o.status === ORDER_STATUS.DELIVERED).length },
  ];

  // Render filter chips
  const renderFilterChips = () => (
    <View style={styles.filterContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
      >
        {filterOptions.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            onPress={() => setActiveFilter(filter.key)}
            style={styles.filterChipContainer}
          >
            <Chip
              mode={activeFilter === filter.key ? 'flat' : 'outlined'}
              selected={activeFilter === filter.key}
              onPress={() => setActiveFilter(filter.key)}
              style={[
                styles.filterChip,
                activeFilter === filter.key && { backgroundColor: theme.colors.primary }
              ]}
              textStyle={[
                styles.filterChipText,
                activeFilter === filter.key && { color: theme.colors.onPrimary }
              ]}
            >
              {filter.label} ({filter.count})
            </Chip>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // Render order item
  const renderOrderItem = ({ item, index }) => (
    <OrderCardItem
      order={item}
      onPress={handleOrderPress}
      style={styles.orderCard}
      onAssignDriver={onAssignDriver}
      onUpdateStatus={onUpdateStatus}
    />
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons 
        name="clipboard-text-outline" 
        size={64} 
        color={theme.colors.onSurfaceVariant} 
      />
      <Text style={styles.emptyStateTitle}>لا توجد طلبات</Text>
      <Text style={styles.emptyStateSubtitle}>
        {activeFilter === 'all' 
          ? 'لم يتم العثور على أي طلبات بعد'
          : `لا توجد طلبات بحالة "${ORDER_STATUS_LABELS[activeFilter] || activeFilter}"`
        }
      </Text>
    </View>
  );

  // Render list header
  const renderListHeader = () => (
    <View>
      {/* Restaurant Status */}
      {restaurantStatus}
      
      {/* Socket Debugger */}
      {socketDebugger}
      
      {/* Filter Chips */}
      {renderFilterChips()}
      
      {/* List Title */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>الطلبات</Text>
        <Text style={styles.listSubtitle}>
          {filteredOrders.length} من {orders.length} طلب
        </Text>
      </View>
    </View>
  );

  // Improved key extractor to ensure unique keys
  const keyExtractor = (item, index) => {
    if (item.id) return item.id.toString();
    if (item.orderNumber) return item.orderNumber.toString();
    if (item._id) return item._id.toString();
    return `order-${index}`;
  };

  return (
    <View style={[styles.container, style]}>
      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        visible={modalVisible}
        order={selectedOrder}
        onDismiss={handleModalDismiss}
        onStatusUpdate={handleStatusUpdate}
        onCancelOrder={handleCancelOrder}
      />
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  filterContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChipContainer: {
    marginRight: 8,
  },
  filterChip: {
    borderRadius: 20,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  listHeader: {
    padding: 16,
    alignItems: 'center',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  listSubtitle: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  orderCard: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  separator: {
    height: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});

export default OrdersList;
