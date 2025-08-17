import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { 
  ORDER_STATUS_LABELS, 
  ORDER_STATUS_COLORS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS
} from '../../../utils/enums';
import { 
  formatOrderNumber, 
  formatCurrency, 
  formatOrderTime,
  transformApiOrder
} from '../utils/orderUtils';

/**
 * OrderCardItem Component
 * Displays a summary of order information in a card format
 * Opens order details modal when pressed
 */
const OrderCardItem = ({ 
  order, 
  onPress, 
  style 
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  if (!order) {
    return null;
  }

  // Transform API order data to component format
  const transformedOrder = transformApiOrder(order);
  
  if (!transformedOrder) {
    return null;
  }

  const {
    id,
    orderNumber,
    status,
    items = [],
    totalAmount,
    paymentMethod,
    paymentStatus,
    createdAt,
    customerName,
    customerPhone,
    deliveryAddress,
    itemsCount,
    itemsSummary
  } = transformedOrder;

  const statusLabel = ORDER_STATUS_LABELS[status] || 'غير معروف';
  const statusColor = ORDER_STATUS_COLORS[status] || theme.colors.outline;
  const paymentLabel = PAYMENT_METHOD_LABELS[paymentMethod] || 'غير محدد';
  const paymentStatusLabel = PAYMENT_STATUS_LABELS[paymentStatus] || 'غير محدد';


  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onPress?.(order)}
      activeOpacity={0.7}
    >
      {/* Header Row - Order Number, Status, Payment Status */}
      <View style={styles.header}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>
            {orderNumber}
          </Text>
          <Text style={styles.orderTime}>
            {formatOrderTime(createdAt)}
          </Text>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
          <View style={[styles.paymentStatusBadge, { 
            backgroundColor: paymentStatus === 'paid' ? theme.colors.success : theme.colors.warning 
          }]}>
            <Text style={styles.paymentStatusText}>{paymentStatusLabel}</Text>
          </View>
        </View>
      </View>

      {/* Customer Info Row */}
      <View style={styles.customerRow}>
        <View style={styles.customerInfo}>
          <MaterialCommunityIcons 
            name="account" 
            size={16} 
            color={theme.colors.onSurfaceVariant} 
          />
          <Text style={styles.customerName} numberOfLines={1}>
            {customerName}
          </Text>
        </View>
        
        {customerPhone && (
          <View style={styles.phoneInfo}>
            <MaterialCommunityIcons 
              name="phone" 
              size={16} 
              color={theme.colors.onSurfaceVariant} 
            />
            <Text style={styles.phoneText} numberOfLines={1}>
              {customerPhone}
            </Text>
          </View>
        )}
      </View>

      {/* Items Summary Row */}
      <View style={styles.itemsRow}>
        <View style={styles.itemsInfo}>
          <MaterialCommunityIcons 
            name="food-fork-drink" 
            size={16} 
            color={theme.colors.onSurfaceVariant} 
          />
          <Text style={styles.itemsText}>
            {itemsSummary}
          </Text>
        </View>
        
        <Text style={styles.totalAmount}>
          {formatCurrency(totalAmount)}
        </Text>
      </View>

      {/* Payment and Delivery Row */}
      <View style={styles.paymentRow}>
        <View style={styles.paymentInfo}>
          <MaterialCommunityIcons 
            name="credit-card" 
            size={16} 
            color={theme.colors.onSurfaceVariant} 
          />
          <Text style={styles.paymentText}>
            {paymentLabel}
          </Text>
        </View>
        
        {deliveryAddress && (
          <View style={styles.addressInfo}>
            <MaterialCommunityIcons 
              name="map-marker" 
              size={16} 
              color={theme.colors.onSurfaceVariant} 
            />
            <Text style={styles.addressText} numberOfLines={1}>
              {deliveryAddress}
            </Text>
          </View>
        )}
      </View>

      {/* Items Preview */}
      {items.length > 0 && (
        <View style={styles.itemsPreview}>
          <Text style={styles.itemsPreviewTitle}>الأطباق:</Text>
          {items.slice(0, 2).map((item, index) => (
            <Text key={index} style={styles.itemPreview} numberOfLines={1}>
              • {item.dish?.name || 'طبق غير محدد'} x{item.quantity}
            </Text>
          ))}
          {items.length > 2 && (
            <Text style={styles.moreItems}>
              +{items.length - 2} طبق آخر
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  orderTime: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  statusContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  paymentStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  paymentStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  customerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurface,
    marginLeft: 6,
    flex: 1,
  },
  phoneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  phoneText: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginLeft: 4,
  },
  itemsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemsText: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    marginLeft: 6,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentText: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginLeft: 6,
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  addressText: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    marginLeft: 4,
    textAlign: 'right',
  },
  itemsPreview: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
  },
  itemsPreviewTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  itemPreview: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 2,
  },
  moreItems: {
    fontSize: 10,
    color: theme.colors.primary,
    fontStyle: 'italic',
  },
});

export default OrderCardItem;
