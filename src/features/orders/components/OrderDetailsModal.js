import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Linking
} from 'react-native';
import { useTheme, Portal, Modal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { 
  ORDER_STATUS_LABELS, 
  ORDER_STATUS_COLORS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  ORDER_STATUS 
} from '../../../utils/enums';
import { 
  formatOrderNumber, 
  formatCurrency, 
  formatOrderDate,
  formatOrderTime,
  canCancelOrder,
  canAcceptOrder,
  canPrepareOrder,
  canMarkAsReady,
  canAssignToDriver,
  canMarkAsPickedUp,
  canMarkAsOnTheWay,
  canMarkAsDelivered,
  transformApiOrder
} from '../utils/orderUtils';
import { PrimaryButton, SecondaryButton } from '../../../components/AppButton';

/**
 * OrderDetailsModal Component
 * Displays comprehensive order details and allows order actions
 */
const OrderDetailsModal = ({ 
  visible, 
  order, 
  onDismiss, 
  onStatusUpdate,
  onCancelOrder 
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [updating, setUpdating] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);

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
    subtotal,
    tax,
    deliveryFee,
    discount,
    paymentMethod,
    paymentStatus,
    createdAt,
    updatedAt,
    customerName,
    customerPhone,
    deliveryAddress,
    specialInstructions,
    itemsCount,
    itemsSummary
  } = transformedOrder;

  const statusLabel = ORDER_STATUS_LABELS[status] || 'غير معروف';
  const statusColor = ORDER_STATUS_COLORS[status] || theme.colors.outline;
  const paymentLabel = PAYMENT_METHOD_LABELS[paymentMethod] || 'غير محدد';
  const paymentStatusLabel = PAYMENT_STATUS_LABELS[paymentStatus] || 'غير محدد';

  // Action handlers
  const handleAcceptOrder = async () => {
    if (!canAcceptOrder(status)) return;
    
    Alert.alert(
      'قبول الطلب',
      'هل تريد قبول هذا الطلب؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'قبول',
          onPress: async () => {
            setUpdating(true);
            try {
              await onStatusUpdate?.(id, ORDER_STATUS.ACCEPTED);
            } finally {
              setUpdating(false);
            }
          }
        }
      ]
    );
  };

  const handleStartPreparing = async () => {
    if (!canPrepareOrder(status)) return;
    
    Alert.alert(
      'بدء التحضير',
      'هل تريد بدء تحضير هذا الطلب؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'بدء التحضير',
          onPress: async () => {
            setUpdating(true);
            try {
              await onStatusUpdate?.(id, ORDER_STATUS.PREPARING);
            } finally {
              setUpdating(false);
            }
          }
        }
      ]
    );
  };

  const handleMarkAsReady = async () => {
    if (!canMarkAsReady(status)) return;
    
    Alert.alert(
      'الطلب جاهز',
      'هل تريد تحديد أن الطلب جاهز للاستلام؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'جاهز',
          onPress: async () => {
            setUpdating(true);
            try {
              await onStatusUpdate?.(id, ORDER_STATUS.READY_FOR_PICKUP);
            } finally {
              setUpdating(false);
            }
          }
        }
      ]
    );
  };

  const handleAssignToDriver = async () => {
    if (!canAssignToDriver(status)) return;
    
    Alert.alert(
      'تعيين سائق',
      'هل تريد تعيين سائق لهذا الطلب؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تعيين',
          onPress: async () => {
            setUpdating(true);
            try {
              await onStatusUpdate?.(id, ORDER_STATUS.ASSIGNED_TO_DRIVER);
            } finally {
              setUpdating(false);
            }
          }
        }
      ]
    );
  };

  const handleMarkAsPickedUp = async () => {
    if (!canMarkAsPickedUp(status)) return;
    
    Alert.alert(
      'تم الاستلام',
      'هل تريد تحديد أن السائق استلم الطلب؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تم الاستلام',
          onPress: async () => {
            setUpdating(true);
            try {
              await onStatusUpdate?.(id, ORDER_STATUS.PICKED_UP_BY_DRIVER);
            } finally {
              setUpdating(false);
            }
          }
        }
      ]
    );
  };

  const handleMarkAsOnTheWay = async () => {
    if (!canMarkAsOnTheWay(status)) return;
    
    Alert.alert(
      'في الطريق',
      'هل تريد تحديد أن الطلب في الطريق؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'في الطريق',
          onPress: async () => {
            setUpdating(true);
            try {
              await onStatusUpdate?.(id, ORDER_STATUS.ON_THE_WAY);
            } finally {
              setUpdating(false);
            }
          }
        }
      ]
    );
  };

  const handleMarkAsDelivered = async () => {
    if (!canMarkAsDelivered(status)) return;
    
    Alert.alert(
      'تم التوصيل',
      'هل تريد تحديد أن الطلب تم توصيله؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تم التوصيل',
          onPress: async () => {
            setUpdating(true);
            try {
              await onStatusUpdate?.(id, ORDER_STATUS.DELIVERED);
            } finally {
              setUpdating(false);
            }
          }
        }
      ]
    );
  };

  const handleCancelOrder = async () => {
    if (!canCancelOrder(status)) return;
    
    Alert.alert(
      'إلغاء الطلب',
      'هل أنت متأكد من إلغاء هذا الطلب؟ هذا الإجراء لا يمكن التراجع عنه.',
      [
        { text: 'إبقاء الطلب', style: 'cancel' },
        {
          text: 'إلغاء الطلب',
          style: 'destructive',
          onPress: async () => {
            setUpdating(true);
            try {
              await onCancelOrder?.(id);
              onDismiss?.();
            } finally {
              setUpdating(false);
            }
          }
        }
      ]
    );
  };

  // Determine the primary next action to keep UI simple and focused
  const getNextPrimaryAction = () => {
    if (canAcceptOrder(status)) {
      return { label: 'قبول الطلب', handler: handleAcceptOrder };
    }
    if (canPrepareOrder(status)) {
      return { label: 'بدء التحضير', handler: handleStartPreparing };
    }
    if (canMarkAsReady(status)) {
      return { label: 'الطلب جاهز', handler: handleMarkAsReady };
    }
    if (canAssignToDriver(status)) {
      return { label: 'تعيين سائق', handler: handleAssignToDriver };
    }
    if (canMarkAsPickedUp(status)) {
      return { label: 'تم الاستلام', handler: handleMarkAsPickedUp };
    }
    if (canMarkAsOnTheWay(status)) {
      return { label: 'في الطريق', handler: handleMarkAsOnTheWay };
    }
    if (canMarkAsDelivered(status)) {
      return { label: 'تم التوصيل', handler: handleMarkAsDelivered };
    }
    return null;
  };

  const primaryAction = getNextPrimaryAction();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.modalTitle}>تفاصيل الطلب</Text>
            <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
          </View>

          {/* Customer Information (placed first per priority) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>معلومات العميل</Text>
            <View style={styles.customerInfo}>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="account" size={20} color={theme.colors.primary} />
                <Text style={styles.infoLabel}>الاسم:</Text>
                <Text style={styles.infoValue}>{customerName}</Text>
              </View>
              {customerPhone && (
                <TouchableOpacity
                  style={styles.infoRow}
                  onPress={() => Linking.openURL(`tel:${customerPhone}`)}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons name="phone" size={20} color={theme.colors.primary} />
                  <Text style={styles.infoLabel}>الهاتف:</Text>
                  <Text style={[styles.infoValue, { color: theme.colors.primary }]}>
                    {customerPhone}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Order Basic Info */}
          <View style={styles.section}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderNumber}>
                {orderNumber}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                <Text style={styles.statusText}>{statusLabel}</Text>
              </View>
            </View>
            <View style={styles.orderMetaRow}>
              <View style={styles.metaChip}>
                <MaterialCommunityIcons name="calendar" size={14} color={theme.colors.onSurfaceVariant} />
                <Text style={styles.metaText}>{formatOrderDate(createdAt)}</Text>
              </View>
              <View style={styles.metaChip}>
                <MaterialCommunityIcons name="clock-outline" size={14} color={theme.colors.onSurfaceVariant} />
                <Text style={styles.metaText}>{formatOrderTime(createdAt)}</Text>
              </View>
              {typeof itemsCount === 'number' && (
                <View style={styles.metaChip}>
                  <MaterialCommunityIcons name="silverware-fork-knife" size={14} color={theme.colors.onSurfaceVariant} />
                  <Text style={styles.metaText}>{itemsCount} صنف</Text>
                </View>
              )}
            </View>
            {itemsSummary && (
              <Text style={styles.itemsSummaryText}>{itemsSummary}</Text>
            )}
            <View style={styles.paymentStatusRow}>
              <View style={[styles.paymentStatusBadge, { 
                backgroundColor: paymentStatus === 'paid' ? theme.colors.success : theme.colors.warning 
              }]}>
                <Text style={styles.paymentStatusText}>{paymentStatusLabel}</Text>
              </View>
            </View>
          </View>

          {/* Delivery Information */}
          {deliveryAddress && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>معلومات التوصيل</Text>
              <View style={styles.deliveryInfo}>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="map-marker" size={20} color={theme.colors.primary} />
                  <Text style={styles.infoLabel}>العنوان:</Text>
                  <Text style={styles.infoValue}>{deliveryAddress}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Order Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الأطباق المطلوبة</Text>
            {(showAllItems ? items : items.slice(0, 3)).map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.dish?.name || 'طبق غير محدد'}</Text>
                  {item.notes && (
                    <Text style={styles.itemNotes}>{item.notes}</Text>
                  )}
                  {item.addons && item.addons.length > 0 && (
                    <View style={styles.addonsContainer}>
                      <Text style={styles.addonsTitle}>الإضافات:</Text>
                      {item.addons.map((addon, addonIndex) => (
                        <Text key={addonIndex} style={styles.addonText}>
                          • {addon.addon?.name} x{addon.quantity}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
                <View style={styles.itemQuantity}>
                  <Text style={styles.quantityText}>x{item.quantity}</Text>
                  <Text style={styles.itemPrice}>
                    {formatCurrency(item.totalPrice)}
                  </Text>
                </View>
              </View>
            ))}
            {items.length > 3 && (
              <TouchableOpacity
                onPress={() => setShowAllItems((prev) => !prev)}
                style={styles.showMoreButton}
                activeOpacity={0.7}
              >
                <Text style={styles.showMoreText}>
                  {showAllItems ? 'عرض أقل' : `عرض الكل (${items.length})`}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Special Instructions */}
          {specialInstructions && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>تعليمات خاصة</Text>
              <Text style={styles.specialInstructions}>{specialInstructions}</Text>
            </View>
          )}

          {/* Payment Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>معلومات الدفع</Text>
            <View style={styles.paymentInfo}>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="credit-card" size={20} color={theme.colors.primary} />
                <Text style={styles.infoLabel}>طريقة الدفع:</Text>
                <Text style={styles.infoValue}>{paymentLabel}</Text>
              </View>
              
              {typeof subtotal === 'number' && (
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>المجموع الفرعي:</Text>
                  <Text style={styles.priceValue}>{formatCurrency(subtotal)}</Text>
                </View>
              )}
              
              {typeof deliveryFee === 'number' && (
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>رسوم التوصيل:</Text>
                  <Text style={styles.priceValue}>{formatCurrency(deliveryFee)}</Text>
                </View>
              )}
              
              {typeof discount === 'number' && discount > 0 && (
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>الخصم:</Text>
                  <Text style={styles.priceValue}>-{formatCurrency(discount)}</Text>
                </View>
              )}
              
              <View style={[styles.priceRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>المجموع الكلي:</Text>
                <Text style={styles.totalValue}>{formatCurrency(totalAmount)}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons (Apple-like: one primary, one secondary) */}
        <View style={styles.actionsContainer}>
          {primaryAction && (
            <PrimaryButton
              mode="contained"
              onPress={primaryAction.handler}
              loading={updating}
              disabled={updating}
              style={styles.actionButton}
            >
              {primaryAction.label}
            </PrimaryButton>
          )}
          {canCancelOrder(status) && (
            <SecondaryButton
              mode="outlined"
              onPress={handleCancelOrder}
              loading={updating}
              disabled={updating}
              style={[styles.actionButton, styles.cancelButton]}
              labelStyle={styles.cancelButtonLabel}
            >
              إلغاء الطلب
            </SecondaryButton>
          )}
        </View>
      </Modal>
    </Portal>
  );
};

const createStyles = (theme) => StyleSheet.create({
  modalContainer: {
    backgroundColor: theme.colors.background,
    margin: 20,
    borderRadius: 20,
    maxHeight: '90%',
    width: '94%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 8,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metaText: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginLeft: 6,
  },
  itemsSummaryText: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 6,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  paymentStatusRow: {
    marginBottom: 8,
  },
  paymentStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  paymentStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  orderDate: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  customerInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurface,
    minWidth: 80,
  },
  infoValue: {
    fontSize: 14,
    color: theme.colors.onSurface,
    flex: 1,
    textAlign: 'right',
  },
  deliveryInfo: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  itemNotes: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  addonsContainer: {
    marginTop: 4,
  },
  addonsTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant,
    marginBottom: 2,
  },
  addonText: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    marginLeft: 8,
  },
  itemQuantity: {
    alignItems: 'flex-end',
  },
  quantityText: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.primary,
  },
  showMoreButton: {
    marginTop: 8,
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  showMoreText: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  specialInstructions: {
    fontSize: 14,
    color: theme.colors.onSurface,
    fontStyle: 'italic',
    backgroundColor: theme.colors.surfaceVariant,
    padding: 12,
    borderRadius: 8,
  },
  paymentInfo: {
    gap: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  priceValue: {
    fontSize: 14,
    color: theme.colors.onSurface,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  actionsContainer: {
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
  },
  actionButton: {
    borderRadius: 12,
    minHeight: 48,
    justifyContent: 'center',
  },
  cancelButton: {
    borderColor: theme.colors.error,
  },
  cancelButtonLabel: {
    color: theme.colors.error,
  },
});

export default OrderDetailsModal;
