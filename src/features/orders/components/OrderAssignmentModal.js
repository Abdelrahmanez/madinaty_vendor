import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useTheme, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PrimaryButton, SecondaryButton } from '../../../components/AppButton';
import SharedModal from '../../../components/SharedModal';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../../utils/enums';
import { formatOrderNumber, formatCurrency, formatOrderTime, transformApiOrder, getDeliveryAddress } from '../utils/orderUtils';
import { assignDriverToOrder } from '../api/order';
import axiosInstance from '../../../services/axios';
import { API_ENDPOINTS } from '../../../config/api';

/**
 * OrderAssignmentModal Component
 * Modal for assigning drivers to orders
 */
const OrderAssignmentModal = ({
  visible,
  order,
  onDismiss,
  onDriverAssigned,
  onStatusUpdated
}) => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const theme = useTheme();

  // Fetch available drivers
  useEffect(() => {
    if (visible && order) {
      fetchAvailableDrivers();
    }
  }, [visible, order]);

  // Define fetchAvailableDrivers function before useEffect
  const fetchAvailableDrivers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_ENDPOINTS.DRIVERS.GET_AVAILABLE_DRIVERS);
      setDrivers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      Alert.alert('خطأ', 'فشل في جلب السائقين المتاحين');
    } finally {
      setLoading(false);
    }
  };

  // Early return after hooks
  if (!order) return null;

  // Transform API order data to component format
  const transformedOrder = transformApiOrder(order);
  if (!transformedOrder) return null;

  const {
    id,
    orderNumber,
    status,
    items = [],
    totalAmount,
    customerName,
    customerPhone,
    deliveryAddress,
    createdAt
  } = transformedOrder;

  const statusLabel = ORDER_STATUS_LABELS[status] || 'غير معروف';
  const statusColor = ORDER_STATUS_COLORS[status] || '#666';

  const handleAssignDriver = async () => {
    if (!selectedDriver) {
      Alert.alert('تنبيه', 'يرجى اختيار سائق');
      return;
    }

    try {
      setAssigning(true);
      const response = await assignDriverToOrder(id, selectedDriver._id);
      
      if (response.data.status === 'success') {
        Alert.alert(
          'نجح',
          response.data.message || 'تم تعيين السائق بنجاح',
          [{ text: 'حسناً', onPress: () => {
            onDriverAssigned?.(response.data.data);
            onDismiss?.();
          }}]
        );
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ في تعيين السائق';
      Alert.alert('خطأ', errorMessage);
    } finally {
      setAssigning(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setAssigning(true);
      const response = await axiosInstance.patch(
        API_ENDPOINTS.ORDERS.UPDATE_STATUS_BY_RESTAURANT(id),
        { status: newStatus }
      );
      
      if (response.data.status === 'success') {
        Alert.alert(
          'نجح',
          'تم تحديث حالة الطلب بنجاح',
          [{ text: 'حسناً', onPress: () => {
            onStatusUpdated?.(response.data.data);
            onDismiss?.();
          }}]
        );
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ في تحديث حالة الطلب';
      Alert.alert('خطأ', errorMessage);
    } finally {
      setAssigning(false);
    }
  };

  const renderDriverItem = (driver) => {
    console.log('🔍 Driver:', driver);
    const isSelected = selectedDriver?._id === driver._id;
    
    return (
      <TouchableOpacity
        key={driver._id}
        style={[
          styles.driverItem,
          isSelected && { borderColor: theme.colors.primary, borderWidth: 2 }
        ]}
        onPress={() => setSelectedDriver(driver)}
      >
        <View style={styles.driverInfo}>
          <MaterialCommunityIcons
            name="account-circle"
            size={40}
            color={theme.colors.primary}
          />
          <View style={styles.driverDetails}>
            <Text style={[styles.driverName, { color: theme.colors.onSurface }]}>
              {driver.name || driver.phoneNumber || 'سائق مجهول'}
            </Text>
            <Text style={[styles.driverPhone, { color: theme.colors.onSurfaceVariant }]}>
              {driver.phoneNumber}
            </Text>
            {driver.vehicleInfo && (
              <Text style={[styles.vehicleInfo, { color: theme.colors.onSurfaceVariant }]}>
                {driver.vehicleInfo}
              </Text>
            )}
           
              <Text style={[styles.activeOrdersCount, { color: theme.colors.onSurfaceVariant }]}>
                الطلبات النشطة: {driver.activeOrdersCount || 0}
              </Text>
          
          </View>
        </View>
        
        {isSelected && (
          <MaterialCommunityIcons
            name="check-circle"
            size={24}
            color={theme.colors.primary}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderFooterContent = () => (
    <View style={styles.modalFooter}>
      <SecondaryButton
        mode="outlined"
        onPress={onDismiss}
        disabled={assigning}
        style={styles.footerButton}
      >
        إلغاء
      </SecondaryButton>
      
      <PrimaryButton
        mode="contained"
        onPress={handleAssignDriver}
        disabled={!selectedDriver || assigning}
        loading={assigning}
        style={styles.footerButton}
      >
        تعيين السائق
      </PrimaryButton>
    </View>
  );

  return (
    <SharedModal
      visible={visible}
      title="تخصيص الطلب"
      onDismiss={onDismiss}
      footerContent={renderFooterContent()}
    >
            {/* Order Information */}
            <Surface style={styles.orderInfoCard} elevation={1}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                معلومات الطلب
              </Text>
              
              <View style={styles.orderDetails}>
                <View style={styles.orderRow}>
                  <Text style={[styles.orderLabel, { color: theme.colors.onSurfaceVariant }]}>
                    رقم الطلب:
                  </Text>
                  <Text style={[styles.orderValue, { color: theme.colors.onSurface }]}>
                    {orderNumber}
                  </Text>
                </View>
                
                <View style={styles.orderRow}>
                  <Text style={[styles.orderLabel, { color: theme.colors.onSurfaceVariant }]}>
                    الحالة:
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                    <Text style={styles.statusText}>{statusLabel}</Text>
                  </View>
                </View>
                
                <View style={styles.orderRow}>
                  <Text style={[styles.orderLabel, { color: theme.colors.onSurfaceVariant }]}>
                    العميل:
                  </Text>
                  <Text style={[styles.orderValue, { color: theme.colors.onSurface }]}>
                    {customerName}
                  </Text>
                </View>
                
                <View style={styles.orderRow}>
                  <Text style={[styles.orderLabel, { color: theme.colors.onSurfaceVariant }]}>
                    الهاتف:
                  </Text>
                  <Text style={[styles.orderValue, { color: theme.colors.onSurface }]}>
                    {customerPhone}
                  </Text>
                </View>
                
                                 <View style={styles.orderRow}>
                   <Text style={[styles.orderLabel, { color: theme.colors.onSurfaceVariant }]}>
                     العنوان:
                   </Text>
                   <Text style={[styles.orderValue, { color: theme.colors.onSurface }]}>
                     {getDeliveryAddress(deliveryAddress) || 'لم يتم تحديد عنوان التوصيل'}
                   </Text>
                 </View>
              
                
                <View style={styles.orderRow}>
                  <Text style={[styles.orderLabel, { color: theme.colors.onSurfaceVariant }]}>
                    المبلغ:
                  </Text>
                  <Text style={[styles.orderValue, { color: theme.colors.onSurface }]}>
                    {formatCurrency(totalAmount)}
                  </Text>
                </View>
              </View>
            </Surface>

            <Divider style={styles.divider} />

            {/* Driver Selection */}
            <View style={styles.driverSelection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                اختيار السائق
              </Text>
              
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                  <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
                    جاري جلب السائقين...
                  </Text>
                </View>
              ) : drivers.length === 0 ? (
                <View style={styles.noDriversContainer}>
                  <MaterialCommunityIcons
                    name="account-off"
                    size={48}
                    color={theme.colors.outline}
                  />
                  <Text style={[styles.noDriversText, { color: theme.colors.onSurfaceVariant }]}>
                    لا يوجد سائقين متاحين حالياً
                  </Text>
                </View>
              ) : (
                <View style={styles.driversList}>
                  {drivers.map(renderDriverItem)}
                </View>
              )}
            </View>

            <Divider style={styles.divider} />

            {/* Status Update Options */}
            <View style={styles.statusUpdate}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                تحديث حالة الطلب
              </Text>
              
              <View style={styles.statusButtons}>
                <SecondaryButton
                  mode="outlined"
                  onPress={() => handleStatusUpdate('preparing')}
                  disabled={assigning}
                  style={styles.statusButton}
                >
                  بدء التحضير
                </SecondaryButton>
                
                <SecondaryButton
                  mode="outlined"
                  onPress={() => handleStatusUpdate('ready_for_pickup')}
                  disabled={assigning}
                  style={styles.statusButton}
                >
                  جاهز للاستلام
                </SecondaryButton>
              </View>
            </View>
        </SharedModal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  orderInfoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderDetails: {
    gap: 12,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderValue: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'left',
    flex: 1,
    marginLeft: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    marginVertical: 16,
  },
  driverSelection: {
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  noDriversContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noDriversText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  driversList: {
    gap: 12,
  },
  driverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F8F9FA',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  driverDetails: {
    marginLeft: 16,
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  driverPhone: {
    fontSize: 14,
    marginBottom: 2,
  },
  vehicleInfo: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  statusUpdate: {
    marginBottom: 16,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
  },
});

export default OrderAssignmentModal;
