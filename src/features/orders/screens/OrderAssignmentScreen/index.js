import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useTheme, Surface, Chip, Searchbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TopBar from '../../../../components/TopBar';
import { OrdersList } from '../../components';
import { useOrders } from '../../hooks/useOrders';
import OrderAssignmentModal from '../../components/OrderAssignmentModal';
import { ORDER_STATUS, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../../../utils/enums';
import { canAssignToDriver, canMarkAsReady, transformApiOrder } from '../../utils/orderUtils';

/**
 * OrderAssignmentScreen Component
 * Screen for managing order assignments to drivers
 */
const OrderAssignmentScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  
  const {
    orders,
    loading,
    error,
    updating,
    refreshOrders,
    updateOrderStatus
  } = useOrders();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(ORDER_STATUS.READY_FOR_PICKUP);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  // Transform all orders once to avoid repeated transformations
  const transformedOrders = React.useMemo(() => {
    return orders.map(order => transformApiOrder(order)).filter(Boolean);
  }, [orders]);

  // Filter orders based on search and status
  const filteredOrders = transformedOrders.filter(order => {
    const matchesSearch = searchQuery === '' || 
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone?.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get orders that can be assigned to drivers
  const assignableOrders = filteredOrders.filter(order => 
    canAssignToDriver(order.status) || canMarkAsReady(order.status)
  );

  // Get orders that are already assigned
  const assignedOrders = filteredOrders.filter(order => 
    order.status === ORDER_STATUS.ASSIGNED_TO_DRIVER ||
    order.status === ORDER_STATUS.PICKED_UP_BY_DRIVER ||
    order.status === ORDER_STATUS.ON_THE_WAY
  );

  const handleOrderPress = (order) => {
    if (!order) return;
    
    // Transform order to check status
    const transformedOrder = transformApiOrder(order);
    if (!transformedOrder) return;
    
    if (canAssignToDriver(transformedOrder.status) || canMarkAsReady(transformedOrder.status)) {
      setSelectedOrder(order); // Pass raw order to modal
      setShowAssignmentModal(true);
    }
  };

  const handleDriverAssigned = (updatedOrder) => {
    // Refresh orders after assignment
    refreshOrders();
    Alert.alert('نجح', 'تم تعيين السائق بنجاح');
  };

  const handleStatusUpdated = (updatedOrder) => {
    // Refresh orders after status update
    refreshOrders();
    Alert.alert('نجح', 'تم تحديث حالة الطلب بنجاح');
  };

  const renderOrderItem = ({ item: order }) => {
    if (!order) return null;
    
    const statusLabel = ORDER_STATUS_LABELS[order.status] || 'غير معروف';
    const statusColor = ORDER_STATUS_COLORS[order.status] || theme.colors.outline;
    const canAssign = canAssignToDriver(order.status);
    const canMarkReady = canMarkAsReady(order.status);

    return (
      <Surface style={styles.orderCard} elevation={2}>
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={[styles.orderNumber, { color: theme.colors.onSurface }]}>
              {order.orderNumber}
            </Text>
            <Text style={[styles.orderTime, { color: theme.colors.onSurfaceVariant }]}>
              {new Date(order.createdAt).toLocaleTimeString('ar-EG', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>

        <View style={styles.customerInfo}>
          <MaterialCommunityIcons 
            name="account" 
            size={16} 
            color={theme.colors.onSurfaceVariant} 
          />
          <Text style={[styles.customerName, { color: theme.colors.onSurface }]}>
            {order.customerName}
          </Text>
        </View>

        <View style={styles.customerInfo}>
          <MaterialCommunityIcons 
            name="phone" 
            size={16} 
            color={theme.colors.onSurfaceVariant} 
          />
          <Text style={[styles.customerPhone, { color: theme.colors.onSurfaceVariant }]}>
            {order.customerPhone || 'غير متوفر'}
          </Text>
        </View>

                         <View style={styles.customerInfo}>
                   <MaterialCommunityIcons 
                     name="map-marker" 
                     size={16} 
                     color={theme.colors.onSurfaceVariant} 
                   />
                   <Text style={[styles.deliveryAddress, { color: theme.colors.onSurfaceVariant }]}>
                     {order.deliveryAddress || 'لم يتم تحديد عنوان التوصيل'}
                   </Text>
                 </View>
 

        <View style={styles.orderFooter}>
          <Text style={[styles.orderAmount, { color: theme.colors.onSurface }]}>
            {order.totalAmount ? `${order.totalAmount} ج.م` : 'غير محدد'}
          </Text>
          
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: canAssign || canMarkReady ? theme.colors.primary : theme.colors.outline }
            ]}
                         onPress={() => {
          // Find the original order from the orders array
          const originalOrder = orders.find(o => o._id === order.id);
          handleOrderPress(originalOrder || order);
        }}
            disabled={!canAssign && !canMarkReady}
          >
            <MaterialCommunityIcons 
              name={canAssign ? "truck-delivery" : "cog"} 
              size={20} 
              color="white" 
            />
            <Text style={styles.actionButtonText}>
              {canAssign ? 'تعيين سائق' : canMarkReady ? 'تحديث الحالة' : 'غير متاح'}
            </Text>
          </TouchableOpacity>
        </View>
      </Surface>
    );
  };

  const renderStatusFilter = () => (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Chip
          selected={statusFilter === 'all'}
          onPress={() => setStatusFilter('all')}
          style={styles.filterChip}
          textStyle={styles.filterChipText}
        >
          جميع الطلبات
        </Chip>
        
        <Chip
          selected={statusFilter === ORDER_STATUS.READY_FOR_PICKUP}
          onPress={() => setStatusFilter(ORDER_STATUS.READY_FOR_PICKUP)}
          style={styles.filterChip}
          textStyle={styles.filterChipText}
        >
          جاهز للاستلام
        </Chip>
        
        <Chip
          selected={statusFilter === ORDER_STATUS.ASSIGNED_TO_DRIVER}
          onPress={() => setStatusFilter(ORDER_STATUS.ASSIGNED_TO_DRIVER)}
          style={styles.filterChip}
          textStyle={styles.filterChipText}
        >
          تم تعيين سائق
        </Chip>
        
        <Chip
          selected={statusFilter === ORDER_STATUS.PICKED_UP_BY_DRIVER}
          onPress={() => setStatusFilter(ORDER_STATUS.PICKED_UP_BY_DRIVER)}
          style={styles.filterChip}
          textStyle={styles.filterChipText}
        >
          تم الاستلام
        </Chip>
      </ScrollView>
    </View>
  );

  if (loading && orders.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <TopBar
          title="تخصيص الطلبات"
          showBackButton={true}
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.onPrimary}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
            جاري تحميل الطلبات...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar
        title="تخصيص الطلبات"
        showBackButton={true}
        backgroundColor={theme.colors.primary}
        titleColor={theme.colors.onPrimary}
      />
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="البحث في الطلبات..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor={theme.colors.onSurfaceVariant}
        />
      </View>

      {/* Status Filters */}
      {renderStatusFilter()}

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshOrders}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={64}
              color={theme.colors.outline}
            />
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
              {searchQuery || statusFilter !== 'all' 
                ? 'لا توجد طلبات تطابق البحث'
                : 'لا توجد طلبات حالياً'
              }
            </Text>
          </View>
        }
      />

      {/* Assignment Modal */}
      <OrderAssignmentModal
        visible={showAssignmentModal}
        order={selectedOrder}
        onDismiss={() => {
          setShowAssignmentModal(false);
          setSelectedOrder(null);
        }}
        onDriverAssigned={handleDriverAssigned}
        onStatusUpdated={handleStatusUpdated}
      />
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    borderRadius: 12,
    elevation: 2,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterChip: {
    marginRight: 8,
    borderRadius: 20,
  },
  filterChipText: {
    fontSize: 12,
  },
  ordersList: {
    padding: 16,
  },
  orderCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: theme.colors.surface,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderTime: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  customerPhone: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  deliveryAddress: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default OrderAssignmentScreen;
