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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
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
  canCancelOrder,
  canPrepareOrder,
  canMarkAsReady,
  canAssignToDriver,
  canMarkAsPickedUp,
  canMarkAsOnTheWay,
  canMarkAsDelivered,
  transformApiOrder,
  getDeliveryAddress
} from '../utils/orderUtils';
import { PrimaryButton, SecondaryButton } from '../../../components/AppButton';
import SharedModal from '../../../components/SharedModal';

/**
 * OrderDetailsModal Component
 * Follows Expo Modal patterns exactly
 */
const OrderDetailsModal = ({ 
  visible, 
  order, 
  onDismiss, 
  onStatusUpdate,
  onCancelOrder 
}) => {
  const [updating, setUpdating] = useState(false);
  const theme = useTheme();


  if (!order) return null;

  const transformedOrder = transformApiOrder(order);
  if (!transformedOrder) return null;

  const {
    id,
    orderNumber,
    status,
    items = [],
    totalAmount,
    subtotal,
    deliveryFee,
    discount,
    paymentMethod,
    paymentStatus,
    customerName,
    customerPhone,
    deliveryAddress,
    specialInstructions
  } = transformedOrder;

  const statusLabel = ORDER_STATUS_LABELS[status] || 'غير معروف';
  const statusColor = ORDER_STATUS_COLORS[status] || '#666';
  const paymentLabel = PAYMENT_METHOD_LABELS[paymentMethod] || 'غير محدد';
  const paymentStatusLabel = PAYMENT_STATUS_LABELS[paymentStatus] || 'غير محدد';

  // Helper function to render item details including size, addons and notes
  const renderItemDetails = (item) => {
    const hasSize = item.selectedSize;
    const hasAddons = item.addons && item.addons.length > 0;
    const hasNotes = item.notes && item.notes.trim().length > 0;
    
    return (
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>
          {item.dish?.name || 'طبق غير محدد'}
        </Text>
        <Text style={styles.itemQuantity}>الكمية: {item.quantity}</Text>
        
        {/* Display selected size if available */}
        {hasSize && (
          <Text style={[styles.itemSize, themedStyles.itemSize]}>
            الحجم: {item.selectedSize.name} (+{formatCurrency(item.selectedSize.price)})
          </Text>
        )}
        
        {/* Display selected addons if available */}
        {hasAddons && (
          <View style={styles.addonsContainer}>
            <Text style={styles.addonsLabel}>الإضافات:</Text>
            {item.addons.map((addonItem, addonIndex) => (
              <Text key={addonIndex} style={styles.addonItem}>
                • {addonItem.addon.name} x{addonItem.quantity} (+{formatCurrency(addonItem.price)})
              </Text>
            ))}
          </View>
        )}
        
        {/* Display item notes if available */}
        {hasNotes && (
          <Text style={[styles.itemNotes, themedStyles.itemNotes]}>
            📝 {item.notes}
          </Text>
        )}
      </View>
    );
  };

  // Action handlers
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
              const result = await onStatusUpdate?.(id, ORDER_STATUS.PREPARING);
              
              // Enhanced UX: Show success feedback
              if (result?.success) {
                // Small delay to show the loading state
                setTimeout(() => {
                  // The success alert will be shown by the useOrders hook
                  // This provides immediate visual feedback
                }, 500);
              }
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

  // Determine the primary next action
  const getNextPrimaryAction = () => {
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

  // Generate themed styles
  const themedStyles = {
    sectionTitle: { color: theme.colors.primary },
    itemPrice: { color: theme.colors.primary },
    totalText: { color: theme.colors.primary },
    phoneNumber: { color: theme.colors.primary },
    totalLabel: { color: theme.colors.primary },
    itemNotes: { color: theme.colors.primary },
    itemSize: { color: theme.colors.primary },
  };

  return (
    <SharedModal
      visible={visible}
      title="تفاصيل الطلب"
      onDismiss={onDismiss}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Order Info - Most Important */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, themedStyles.sectionTitle]}>📋 معلومات الطلب الأساسية</Text>
              <View style={styles.twoColumnRow}>
                <View style={styles.infoColumn}>
                  <Text style={styles.infoLabel}>رقم الطلب:</Text>
                  <Text style={styles.infoValueBold}>{orderNumber}</Text>
                </View>
                <View style={styles.infoColumn}>
                  <Text style={styles.infoLabel}>الحالة:</Text>
                  <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
                </View>
              </View>
              <View style={styles.twoColumnRow}>
                <View style={styles.infoColumn}>
                  <Text style={styles.infoLabel}>العميل:</Text>
                  <Text style={styles.infoValueBold}>{customerName}</Text>
                </View>
                <View style={styles.infoColumn}>
                  <Text style={styles.infoLabel}>المجموع:</Text>
                  <Text style={styles.infoValueBold}>{formatCurrency(totalAmount)}</Text>
                </View>
              </View>
              {customerPhone && (
                <View style={styles.twoColumnRow}>
                  <View style={styles.infoColumn}>
                    <Text style={styles.infoLabel}>الهاتف:</Text>
                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${customerPhone}`)}>
                      <Text style={[styles.infoValueBold, styles.phoneNumber, themedStyles.phoneNumber]}>{customerPhone}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.infoColumn}>
                    <Text style={styles.infoLabel}>رسوم التوصيل:</Text>
                    <Text style={styles.infoValueBold}>{formatCurrency(deliveryFee || 0)}</Text>
                  </View>
                </View>
              )}
              {
              }
            </View>

            {/* Separator */}
            <View style={styles.sectionSeparator} />

            {/* Order Items - Second Most Important */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, themedStyles.sectionTitle]}>🍽️ الأطباق المطلوبة</Text>
              {items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  {renderItemDetails(item)}
                  <Text style={[styles.itemPrice, themedStyles.itemPrice]}>
                    {formatCurrency(item.totalPrice)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Separator */}
            <View style={styles.sectionSeparator} />

            {/* Payment Info - Third Most Important */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, themedStyles.sectionTitle]}>💳 معلومات الدفع</Text>
              <View style={styles.twoColumnRow}>
                <View style={styles.infoColumn}>
                  <Text style={styles.infoLabel}>طريقة الدفع:</Text>
                  <Text style={styles.infoValue}>{paymentLabel}</Text>
                </View>
                <View style={styles.infoColumn}>
                  <Text style={styles.infoLabel}>حالة الدفع:</Text>
                  <Text style={styles.infoValue}>{paymentStatusLabel}</Text>
                </View>
              </View>
              {typeof subtotal === 'number' && (
                <View style={styles.twoColumnRow}>
                  <View style={styles.infoColumn}>
                    <Text style={styles.infoLabel}>المجموع الفرعي:</Text>
                    <Text style={styles.infoValue}>{formatCurrency(subtotal)}</Text>
                  </View>
                  <View style={styles.infoColumn}>
                    <Text style={styles.infoLabel}>رسوم التوصيل:</Text>
                    <Text style={styles.infoValue}>{formatCurrency(deliveryFee || 0)}</Text>
                  </View>
                </View>
              )}
              {typeof discount === 'number' && discount > 0 && (
                <View style={styles.twoColumnRow}>
                  <View style={styles.infoColumn}>
                    <Text style={styles.infoLabel}>الخصم:</Text>
                    <Text style={[styles.infoValue, styles.discountText]}>-{formatCurrency(discount)}</Text>
                  </View>
                  <View style={styles.infoColumn} />
                </View>
              )}
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, themedStyles.totalLabel]}>المجموع الكلي:</Text>
                <Text style={[styles.totalText, themedStyles.totalText]}>{formatCurrency(totalAmount)}</Text>
              </View>
            </View>

            {/* Separator */}
            {deliveryAddress && <View style={styles.sectionSeparator} />}

            {/* Delivery Address - Fourth Most Important */}
            {deliveryAddress && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, themedStyles.sectionTitle]}>📍 عنوان التوصيل</Text>
                <Text style={styles.infoText}>{getDeliveryAddress(deliveryAddress)}</Text>
              </View>
            )}

            {/* Separator */}
            {specialInstructions && <View style={styles.sectionSeparator} />}

            {/* Special Instructions - Least Important */}
            {specialInstructions && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, themedStyles.sectionTitle]}>📝 تعليمات خاصة</Text>
                <Text style={styles.infoText}>{specialInstructions}</Text>
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            {primaryAction && (
              <PrimaryButton
                mode="contained"
                onPress={primaryAction.handler}
                loading={updating}
                disabled={updating}
                style={[
                  styles.actionButton,
                  updating && styles.actionButtonLoading
                ]}
                labelStyle={[
                  updating && styles.actionButtonLabelLoading
                ]}
              >
                {updating ? 'جاري التحديث...' : primaryAction.label}
              </PrimaryButton>
            )}
            {canCancelOrder(status) && (
              <SecondaryButton
                mode="outlined"
                onPress={handleCancelOrder}
                loading={updating}
                disabled={updating}
                style={[
                  styles.actionButton, 
                  styles.cancelButton,
                  updating && styles.actionButtonLoading
                ]}
                labelStyle={[
                  styles.cancelButtonLabel,
                  updating && styles.actionButtonLabelLoading
                ]}
              >
                {updating ? 'جاري الإلغاء...' : 'إلغاء الطلب'}
              </SecondaryButton>
            )}
          </View>
      </SharedModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '95%',
    height: '85%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#e9ecef',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
    borderBottomWidth: 2,
    borderBottomColor: '#f8f9fa',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    paddingBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
    lineHeight: 20,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  itemName: {
    fontSize: 15,
    color: '#000',
    fontWeight: '600',
    flex: 1,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#e9ecef',
  },
  actionsContainer: {
    padding: 20,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  actionButton: {
    borderRadius: 10,
    minHeight: 50,
  },
  cancelButton: {
    borderColor: '#dc3545',
  },
  cancelButtonLabel: {
    color: '#dc3545',
  },
  twoColumnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoColumn: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  infoValueBold: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  phoneNumber: {
    textDecorationLine: 'underline',
  },
  discountText: {
    color: '#dc3545',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemInfo: {
    flex: 1,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  addonsContainer: {
    marginTop: 4,
    paddingLeft: 10,
  },
  addonsLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  addonItem: {
    fontSize: 12,
    color: '#000',
    marginBottom: 2,
  },
  itemNotes: {
    fontSize: 12,
    marginTop: 4,
  },
  itemSize: {
    fontSize: 12,
    marginTop: 4,
  },
  sectionSeparator: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 8,
    marginHorizontal: 20,
    borderRadius: 0.5,
  },
  actionButtonLoading: {
    opacity: 0.7,
  },
  actionButtonLabelLoading: {
    color: 'transparent',
  },
});

export default OrderDetailsModal;
