import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Linking,
  TextInput,
  I18nManager
} from 'react-native';
import {
  useTheme,
  Surface,
  Button,
  Divider,
  Modal,
  Portal,
  IconButton
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import TopBar from '../../components/TopBar';
import axiosInstance from '../../__apis__/axios';
import { API_ENDPOINTS } from '../../config/api';
import useStyles from './styles';
import { OrderStatus, StatusColors } from '../../utils/enums';

// مكون لعرض حالة الطلب
const OrderStatusChip = ({ status, styles, theme }) => {
  const { t } = useTranslation();
  
  const getStatusColor = (status) => {
    return StatusColors[status] || '#999999';
  };
  
  return (
    <View style={[styles.statusChip, { backgroundColor: `${getStatusColor(status)}20` }]}>
      <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
        {t(`orderDetailsScreen.${status}`)}
      </Text>
    </View>
  );
};

// مكون لعرض صف معلومات
const InfoRow = ({ label, value, styles }) => {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
    </View>
  );
};

// مكون لعرض عنصر من الطلب
const OrderItem = ({ item, styles, theme, t }) => {
  return (
    <View style={[styles.orderItemRow, { borderBottomColor: theme.colors.outlineVariant }]}>
      <View style={styles.orderItemInfo}>
        <Text style={styles.orderItemName} numberOfLines={1}>
          {item.dishName}
        </Text>
        {item.options && item.options.length > 0 && (
          <Text style={styles.orderItemOptions} numberOfLines={1}>
            {item.options.join(', ')}
          </Text>
        )}
      </View>
      <Text style={styles.orderItemQuantity}>{item.quantity}x</Text>
      <Text style={styles.orderItemPrice}>{item.price} {t('orderDetailsScreen.sar')}</Text>
    </View>
  );
};

// مكون لتقييم الطلب
const OrderRating = ({ onSubmitRating, styles, theme, t }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmitRating = async () => {
    if (rating === 0) return;
    
    setSubmitting(true);
    
    try {
      // في الإنتاج، سنرسل التقييم إلى واجهة برمجة التطبيقات
      // await axiosInstance.post(API_ENDPOINTS.REVIEWS.ADD, { rating, comment: feedback });
      
      // محاكاة استجابة الخادم
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (submitted) {
    return (
      <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.ratingContainer}>
          <MaterialCommunityIcons name="check-circle" size={48} color={theme.colors.primary} />
          <Text style={[styles.ratingTitle, { marginTop: 12 }]}>
            {t('orderDetailsScreen.thankYouForRating')}
          </Text>
          <Text style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
            {t('orderDetailsScreen.yourFeedbackMatters')}
          </Text>
        </View>
      </Surface>
    );
  }
  
  return (
    <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]}>
      <Text style={styles.sectionTitle}>{t('orderDetailsScreen.rateYourOrder')}</Text>
      <View style={styles.ratingContainer}>
        <Text style={{ marginBottom: 12, textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
          {t('orderDetailsScreen.rateExperience')}
        </Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)} style={{ padding: 8 }}>
              <MaterialCommunityIcons
                name={star <= rating ? 'star' : 'star-outline'}
                size={32}
                color={star <= rating ? theme.colors.primary : theme.colors.outlineVariant}
              />
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          placeholder={t('orderDetailsScreen.leaveFeedback')}
          value={feedback}
          onChangeText={setFeedback}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          style={[styles.ratingComment, { backgroundColor: theme.colors.background }]}
        />
        <Button
          mode="contained"
          onPress={handleSubmitRating}
          style={{ marginTop: 16, width: '100%' }}
          disabled={rating === 0 || submitting}
          loading={submitting}
        >
          {t('orderDetailsScreen.submitRating')}
        </Button>
      </View>
    </Surface>
  );
};

// مكون لعرض الفاتورة
const OrderReceipt = ({ order, t, styles, theme }) => {
  const isRTL = I18nManager.isRTL;
  
  // تنسيق التاريخ والوقت
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      };
      return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', options);
    } catch (error) {
      return dateString;
    }
  };
  
  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = { 
        hour: '2-digit', 
        minute: '2-digit'
      };
      return date.toLocaleTimeString(isRTL ? 'ar-SA' : 'en-US', options);
    } catch (error) {
      return '';
    }
  };
  
  return (
    <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]}>
      <Text style={styles.sectionTitle}>{t('orderDetailsScreen.receipt')}</Text>
      <View style={styles.receiptContainer}>
        <View style={styles.receiptHeader}>
          <Image
            source={{ uri: order.restaurant?.image || 'https://via.placeholder.com/60' }}
            style={styles.receiptLogo}
          />
          <Text style={styles.receiptTitle}>{order.restaurant?.name || 'Restaurant'}</Text>
          <Text style={styles.receiptSubtitle}>
            {formatDate(order.createdAt)} - {formatTime(order.createdAt)}
          </Text>
          <Text style={styles.receiptOrderId}>
            {t('orderDetailsScreen.receiptOrderId')}: #{order.orderNumber}
          </Text>
        </View>
        
        <View style={styles.receiptDivider} />
        
        {order.items && order.items.map((item, index) => (
          <View key={index} style={styles.orderItemRow}>
            <View style={styles.orderItemInfo}>
              <Text style={styles.orderItemName} numberOfLines={1}>
                {item.dishName}
              </Text>
              {item.options && item.options.length > 0 && (
                <Text style={styles.orderItemOptions} numberOfLines={1}>
                  {item.options.join(', ')}
                </Text>
              )}
            </View>
            <Text style={styles.orderItemQuantity}>{item.quantity}x</Text>
            <Text style={styles.orderItemPrice}>{item.price} {t('orderDetailsScreen.sar')}</Text>
          </View>
        ))}
        
        <View style={styles.receiptDivider} />
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            {t('orderDetailsScreen.subTotal')}
          </Text>
          <Text style={styles.summaryValue}>
            {order.subtotal} {t('orderDetailsScreen.sar')}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            {t('orderDetailsScreen.deliveryFee')}
          </Text>
          <Text style={styles.summaryValue}>
            {order.deliveryFee} {t('orderDetailsScreen.sar')}
          </Text>
        </View>
        {order.tax > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {t('orderDetailsScreen.tax')} (15%)
            </Text>
            <Text style={styles.summaryValue}>
              {order.tax} {t('orderDetailsScreen.sar')}
            </Text>
          </View>
        )}
        {order.discount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {t('orderDetailsScreen.discount')}
            </Text>
            <Text style={styles.discountValue}>
              -{order.discount} {t('orderDetailsScreen.sar')}
            </Text>
          </View>
        )}
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>
            {t('orderDetailsScreen.totalAmount')}
          </Text>
          <Text style={styles.totalValue}>
            {order.totalAmount} {t('orderDetailsScreen.sar')}
          </Text>
        </View>
        
        <View style={styles.receiptFooter}>
          <Text style={styles.receiptFooterText}>
            {t('orderDetailsScreen.receiptThankYou')}
          </Text>
          <Text style={styles.receiptFooterText}>
            {t('orderDetailsScreen.receiptVisitAgain')}
          </Text>
        </View>
      </View>
    </Surface>
  );
};

// الشاشة الرئيسية
const OrderDetailsScreen = ({ route, navigation }) => {
  const { orderId } = route.params || {};
  const theme = useTheme();
  const styles = useStyles()(theme);
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  
  // تنسيق التاريخ والوقت
  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', options);
    } catch (error) {
      return dateString;
    }
  };
  
  // جلب تفاصيل الطلب
  const fetchOrder = async () => {
    try {
      if (!orderId) {
        navigation.goBack();
        return;
      }
      
      setLoading(true);
      
      // استدعاء واجهة برمجة التطبيقات للحصول على تفاصيل الطلب من الخادم
      const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.DETAIL(orderId));
      if (response.data && response.data.data) {
        setOrder(response.data.data);
      } else {
        // إذا لم يتم العثور على البيانات، نعرض رسالة خطأ
        Alert.alert(
          t('orderDetailsScreen.error'),
          t('orderDetailsScreen.orderNotFound'),
          [{ text: t('orderDetailsScreen.ok') }]
        );
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order details:', error);
      Alert.alert(
        t('orderDetailsScreen.error'),
        t('orderDetailsScreen.errorFetchingDetails'),
        [{ text: t('orderDetailsScreen.ok') }]
      );
      setLoading(false);
    }
  };
  
  // جلب البيانات عند التحميل الأولي
  useEffect(() => {
    fetchOrder();
  }, [orderId]);
  
  // التعامل مع إلغاء الطلب
  const handleCancelOrder = () => {
    if (order) {
      Alert.alert(
        t('orderDetailsScreen.confirmCancel'),
        t('orderDetailsScreen.cancelOrderMessage'),
        [
          {
            text: t('orderDetailsScreen.no'),
            style: 'cancel',
          },
          {
            text: t('orderDetailsScreen.yes'),
            style: 'destructive',
            onPress: async () => {
              try {
                setLoading(true);
                // عندما يكون API الإلغاء جاهزًا
                // await axiosInstance.patch(`${API_ENDPOINTS.ORDERS.DETAIL(order._id)}/cancel`);
                
                // مؤقتًا نقوم بتحديث الحالة محليًا
                setOrder({ ...order, status: OrderStatus.CANCELED });
                Alert.alert(t('orderDetailsScreen.orderCanceled'));
                
              } catch (error) {
                console.error('Error canceling order:', error);
                Alert.alert(t('orderDetailsScreen.cantCancel'));
              } finally {
                setLoading(false);
              }
            }
          }
        ]
      );
    }
  };
  
  // التعامل مع تتبع الطلب
  const handleTrackOrder = () => {
    if (order) {
      navigation.navigate('OrderTracking', { orderId: order._id });
    }
  };
  
  // التعامل مع إعادة الطلب
  const handleReorder = () => {
    if (order) {
      // تنفيذ وظيفة إعادة الطلب
      if (__DEV__) {
        console.log('Reorder', order._id);
      }
      Alert.alert(t('orderDetailsScreen.reorderSuccess'));
    }
  };
  
  // التعامل مع الاتصال بالمطعم
  const handleContactRestaurant = () => {
    if (order && order.restaurant && order.restaurant.phone) {
      const url = `tel:${order.restaurant.phone}`;
      Linking.canOpenURL(url)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(url);
          }
        })
        .catch(err => console.error('Error opening phone dialer', err));
    }
  };
  
  // التعامل مع تقييم الطلب
  const handleSubmitRating = async (rating, feedback) => {
    try {
      // في الإنتاج، سنرسل التقييم إلى واجهة برمجة التطبيقات
      // await axiosInstance.post(API_ENDPOINTS.REVIEWS.ADD, { orderId: order._id, rating, comment: feedback });
      
      // محاكاة استجابة الخادم
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOrder({ ...order, isRated: true });
      Alert.alert(t('orderDetailsScreen.ratingSubmitted'));
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };
  
  // تحديد الأزرار التي يجب إظهارها بناءً على حالة الطلب
  const getActionButtons = () => {
    if (!order) return [];
    
    const canCancel = order.status === OrderStatus.PENDING || order.status === OrderStatus.PROCESSING;
    const canTrack = order.status === OrderStatus.PROCESSING || 
                   order.status === OrderStatus.READY || 
                   order.status === OrderStatus.ON_DELIVERY;
    const canReorder = order.status === OrderStatus.DELIVERED || 
                      order.status === OrderStatus.CANCELED || 
                      order.status === OrderStatus.REJECTED;
    const canRate = order.status === OrderStatus.DELIVERED && !order.isRated;
    
    const buttons = [];
    
    if (canCancel) {
      buttons.push({
        label: t('orderDetailsScreen.cancelOrder'),
        onPress: handleCancelOrder,
        mode: "outlined",
        textColor: theme.colors.error,
      });
    }
    
    if (canTrack) {
      buttons.push({
        label: t('orderDetailsScreen.trackOrder'),
        onPress: handleTrackOrder,
        mode: "contained",
        icon: "map-marker-path"
      });
    }
    
    if (canReorder) {
      buttons.push({
        label: t('orderDetailsScreen.reorder'),
        onPress: handleReorder,
        mode: "contained"
      });
    }
    
    return buttons;
  };
  
  // تم إزالة دالة البيانات التجريبية لأننا نستخدم البيانات الحقيقية الآن
  
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  if (!order) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.colors.error }}>لا يمكن العثور على الطلب</Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.goBack()} 
          style={{ marginTop: 16 }}
        >
          {t('orderTrackingScreen.backToOrders')}
        </Button>
      </View>
    );
  }
  
  const actionButtons = getActionButtons();
  
  return (
    <View style={styles.container}>
      <TopBar 
        title={t('orderDetailsScreen.title')}
        showBack={true}
        onBack={() => navigation.goBack()}
        rightContent={
          <TouchableOpacity onPress={() => setShowReceipt(true)} style={{ padding: 8 }}>
            <MaterialCommunityIcons 
              name="receipt" 
              size={24} 
              color={theme.colors.onSurface} 
            />
          </TouchableOpacity>
        }
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* معلومات الطلب الرئيسية */}
        <Surface style={[styles.headerSection, { backgroundColor: theme.colors.surface }]}>
          <OrderStatusChip status={order.status} styles={styles} theme={theme} />
          
          <InfoRow 
            label={t('orderDetailsScreen.orderNumber')}
            value={`#${order.orderNumber}`}
            styles={styles}
          />
          
          <InfoRow 
            label={t('orderDetailsScreen.orderDate')}
            value={formatDateTime(order.createdAt)}
            styles={styles}
          />
        </Surface>
        
        {/* معلومات المطعم */}
        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={styles.sectionTitle}>
            {t('orderDetailsScreen.restaurantInformation')}
          </Text>
          <View style={styles.sectionContent}>
            <View style={styles.restaurantInfoContainer}>
              <Image 
                source={{ uri: order.restaurant?.image || 'https://via.placeholder.com/50' }} 
                style={styles.restaurantLogo}
              />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{order.restaurant?.name || 'Restaurant'}</Text>
                <Text style={styles.restaurantAddress} numberOfLines={1}>
                  {/* {order.restaurant?.address || ''} */}
                </Text>
              </View>
            </View>
            
            <Button 
              mode="outlined" 
              onPress={handleContactRestaurant}
              icon="phone"
              style={{ marginTop: 8 }}
            >
              {t('orderDetailsScreen.contactRestaurant')}
            </Button>
          </View>
        </Surface>
        
        {/* معلومات التوصيل */}
        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={styles.sectionTitle}>
            {t('orderDetailsScreen.deliveryInformation')}
          </Text>
          <View style={styles.sectionContent}>
            {/* تعديل طريقة عرض عنوان التوصيل في معلومات التوصيل */}
            <View style={styles.addressContainer}>
              <Text style={styles.addressLine}>{order.deliveryAddress?.street || ''}</Text>
              <Text style={styles.addressLine}>{order.deliveryAddress?.building || ''}</Text>
              {order.deliveryAddress?.apartment && (
                <Text style={styles.addressLine}>
                  {typeof order.deliveryAddress.apartment === 'string' 
                    ? order.deliveryAddress.apartment 
                    : JSON.stringify(order.deliveryAddress.apartment)}
                </Text>
              )}
              {order.deliveryAddress?.landmark && (
                <Text style={styles.addressLine}>
                  {typeof order.deliveryAddress.landmark === 'string' 
                    ? order.deliveryAddress.landmark 
                    : JSON.stringify(order.deliveryAddress.landmark)}
                </Text>
              )}
              {order.deliveryAddress?.notes && (
                <Text style={styles.addressNote}>
                  {typeof order.deliveryAddress.notes === 'string' 
                    ? order.deliveryAddress.notes 
                    : JSON.stringify(order.deliveryAddress.notes)}
                </Text>
              )}
              {order.deliveryAddress?.areaName && (
                <Text style={styles.addressNote}>
                  {typeof order.deliveryAddress.areaName === 'string' 
                    ? order.deliveryAddress.areaName 
                    : JSON.stringify(order.deliveryAddress.areaName)}
                </Text>
              )}
              {order.deliveryAddress?.area && (
                <Text style={styles.addressNote}>
                  {typeof order.deliveryAddress.area === 'string' 
                    ? order.deliveryAddress.area 
                    : typeof order.deliveryAddress.area === 'object' && order.deliveryAddress.area.name
                      ? order.deliveryAddress.area.name
                      : JSON.stringify(order.deliveryAddress.area)}
                </Text>
              )}
            </View>
          </View>
        </Surface>
        
        {/* معلومات الدفع */}
        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={styles.sectionTitle}>
            {t('orderDetailsScreen.paymentInformation')}
          </Text>
          <View style={styles.sectionContent}>
            <InfoRow 
              label={t('orderDetailsScreen.paymentMethod')}
              value={t(`orderDetailsScreen.${order.paymentMethod}`)}
              styles={styles}
            />
            <InfoRow 
              label={t('orderDetailsScreen.paymentStatus')}
              value={t(`orderDetailsScreen.${order.paymentStatus || 'paid'}`)}
              styles={styles}
            />
          </View>
        </Surface>
        
        {/* عناصر الطلب */}
        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={styles.sectionTitle}>
            {t('orderDetailsScreen.orderItems')}
          </Text>
          <View style={styles.sectionContent}>
            {order.items && order.items.map((item, index) => (
              <OrderItem 
                key={index} 
                item={item} 
                styles={styles} 
                theme={theme} 
                t={t} 
              />
            ))}
            
            <Divider style={styles.divider} />
            
            {/* ملخص الحساب */}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {t('orderDetailsScreen.subTotal')}
              </Text>
              <Text style={styles.summaryValue}>
                {order.subtotal} {t('orderDetailsScreen.sar')}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {t('orderDetailsScreen.deliveryFee')}
              </Text>
              <Text style={styles.summaryValue}>
                {order.deliveryFee} {t('orderDetailsScreen.sar')}
              </Text>
            </View>
            {order.tax > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  {t('orderDetailsScreen.tax')} (15%)
                </Text>
                <Text style={styles.summaryValue}>
                  {order.tax} {t('orderDetailsScreen.sar')}
                </Text>
              </View>
            )}
            {order.discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  {t('orderDetailsScreen.discount')}
                </Text>
                <Text style={styles.discountValue}>
                  -{order.discount} {t('orderDetailsScreen.sar')}
                </Text>
              </View>
            )}
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                {t('orderDetailsScreen.totalAmount')}
              </Text>
              <Text style={styles.totalValue}>
                {order.totalAmount} {t('orderDetailsScreen.sar')}
              </Text>
            </View>
          </View>
        </Surface>
        
        {/* قسم التقييم (إذا كان الطلب مكتملًا ولم يتم تقييمه بعد) */}
        {order.status === OrderStatus.DELIVERED && !order.isRated && (
          <OrderRating 
            onSubmitRating={handleSubmitRating} 
            styles={styles} 
            theme={theme} 
            t={t} 
          />
        )}
        
        {/* مساحة إضافية في الأسفل لتجنب تداخل المحتوى مع الأزرار السفلية */}
        {actionButtons.length > 0 && <View style={{ height: 70 }} />}
      </ScrollView>
      
      {/* نافذة الفاتورة */}
      <Portal>
        <Modal 
          visible={showReceipt} 
          onDismiss={() => setShowReceipt(false)}
          contentContainerStyle={{ 
            margin: 24, 
            backgroundColor: theme.colors.background,
            borderRadius: 12,
            maxHeight: '80%'
          }}
        >
          <ScrollView>
            <View style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.onSurface }}>
                  {t('orderDetailsScreen.receipt')}
                </Text>
                <IconButton 
                  icon="close" 
                  size={24} 
                  onPress={() => setShowReceipt(false)} 
                />
              </View>
              <OrderReceipt 
                order={order} 
                t={t} 
                styles={styles} 
                theme={theme} 
              />
            </View>
          </ScrollView>
        </Modal>
      </Portal>
      
      {/* الأزرار السفلية */}
      {actionButtons.length > 0 && (
        <View style={styles.bottomActions}>
          {actionButtons.map((button, index) => (
            <Button 
              key={index}
              mode={button.mode}
              onPress={button.onPress}
              style={[
                styles.actionButton, 
                index === 0 ? { marginLeft: 0 } : {},
                index === actionButtons.length - 1 ? { marginRight: 0 } : {}
              ]}
              icon={button.icon}
              textColor={button.textColor}
            >
              {button.label}
            </Button>
          ))}
        </View>
      )}
    </View>
  );
};

export default OrderDetailsScreen; 