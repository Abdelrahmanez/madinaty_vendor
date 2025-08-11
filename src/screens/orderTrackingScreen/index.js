import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  I18nManager,
  Linking,
  Platform
} from 'react-native';
import {
  useTheme,
  Surface,
  Button,
  Divider,
  IconButton
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import TopBar from '../../components/TopBar';
import axiosInstance from '../../__apis__/axios';
import { API_ENDPOINTS } from '../../config/api';
import useStyles from './styles';
import { OrderStatus, StatusColors } from '../../utils/enums';

// Componente del mapa eliminado

// خط زمني لتقدم الطلب
const ProgressTimeline = ({ order, t, styles, theme, formatDateTimeFn }) => {
  // تحديد المرحلة الحالية بناء على حالة الطلب
  const getStepStatus = (stepNumber) => {
    const statusMap = {
      [OrderStatus.PENDING]: 1,
      [OrderStatus.PROCESSING]: 2,
      [OrderStatus.READY]: 3,
      [OrderStatus.ON_DELIVERY]: 4,
      [OrderStatus.DELIVERED]: 5,
    };
    
    const currentStep = statusMap[order.status] || 0;
    
    if (stepNumber < currentStep) {
      return 'completed';
    } else if (stepNumber === currentStep) {
      return 'active';
    } else {
      return 'pending';
    }
  };
  
  // تكوين معلومات خطوات التقدم
  const progressSteps = [
    {
      number: 1,
      status: getStepStatus(1),
      icon: 'receipt-text-outline',
      title: t('orderTrackingScreen.orderReceived'),
      time: order.createdAt ? formatDateTimeFn(order.createdAt) : '',
      description: t('orderTrackingScreen.orderReceivedDesc')
    },
    {
      number: 2,
      status: getStepStatus(2),
      icon: 'check-circle-outline',
      title: t('orderTrackingScreen.orderConfirmed'),
      time: order.confirmedAt ? formatDateTimeFn(order.confirmedAt) : '',
      description: t('orderTrackingScreen.orderConfirmedDesc')
    },
    {
      number: 3,
      status: getStepStatus(3),
      icon: 'food-outline',
      title: t('orderTrackingScreen.preparing'),
      time: order.preparingAt ? formatDateTimeFn(order.preparingAt) : '',
      description: t('orderTrackingScreen.preparingDesc')
    },
    {
      number: 4,
      status: getStepStatus(4),
      icon: 'truck-delivery-outline',
      title: t('orderTrackingScreen.onTheWay'),
      time: order.onDeliveryAt ? formatDateTimeFn(order.onDeliveryAt) : '',
      description: t('orderTrackingScreen.onTheWayDesc')
    },
    {
      number: 5,
      status: getStepStatus(5),
      icon: 'hand-okay',
      title: t('orderTrackingScreen.delivered'),
      time: order.deliveredAt ? formatDateTimeFn(order.deliveredAt) : '',
      description: t('orderTrackingScreen.deliveredDesc')
    }
  ];
  
  return (
    <View style={styles.progressTrack}>
      {/* الخط الرأسي الذي يربط بين الخطوات */}
      <View style={[
        styles.progressLine, 
        { backgroundColor: theme.colors.outlineVariant }
      ]} />
      
      {/* خطوات التقدم */}
      {progressSteps.map((step, index) => {
        const iconColor = 
          step.status === 'completed' ? theme.colors.primary : 
          step.status === 'active' ? theme.colors.primary : 
          theme.colors.outlineVariant;
        
        const backgroundColor = 
          step.status === 'completed' ? `${theme.colors.primary}20` : 
          step.status === 'active' ? `${theme.colors.primary}15` : 
          'transparent';
          
        const textColor = 
          step.status === 'completed' || step.status === 'active' ? 
          theme.colors.onSurface : theme.colors.onSurfaceVariant;
        
        return (
          <View key={index} style={styles.progressStep}>
            <View 
              style={[
                styles.progressStepIconContainer, 
                { backgroundColor }
              ]}
            >
              <MaterialCommunityIcons 
                name={step.icon} 
                size={24} 
                color={iconColor} 
              />
            </View>
            
            <View style={styles.progressStepContent}>
              <Text style={[styles.progressStepTitle, { color: textColor }]}>
                {step.title}
              </Text>
              {step.time && (
                <Text style={styles.progressStepTime}>
                  {step.time}
                </Text>
              )}
              <Text style={styles.progressStepDescription}>
                {step.description}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

// مكون بطاقة الاتصال (بالمطعم أو السائق)
const ContactCard = ({ contact, isDriver = false, t, styles, theme, onCall, onChat }) => {
  return (
    <Surface style={[styles.contactCard, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.contactHeader}>
        <View style={styles.contactAvatar}>
          <MaterialCommunityIcons 
            name={isDriver ? "account-delivery" : "store"} 
            size={24} 
            color={theme.colors.onSurfaceVariant} 
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.contactName}>
            {contact.name}
          </Text>
          <Text style={styles.contactRole}>
            {isDriver ? t('orderTrackingScreen.driver') : t('orderTrackingScreen.restaurant')}
          </Text>
        </View>
      </View>
      
      <View style={styles.contactActions}>
        <Button 
          mode="contained-tonal" 
          icon="phone" 
          onPress={onCall}
          style={styles.contactButton}
        >
          {t('orderTrackingScreen.call')}
        </Button>
        <Button 
          mode="contained-tonal" 
          icon="chat" 
          onPress={onChat}
          style={styles.contactButton}
        >
          {t('orderTrackingScreen.chat')}
        </Button>
      </View>
    </Surface>
  );
};

// مكون لعرض ملخص الطلب
const OrderSummary = ({ order, t, styles, theme, onViewDetails }) => {
  return (
    <Surface style={[styles.orderSummaryContainer, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.orderSummaryHeader}>
        <Text style={styles.orderSummaryTitle}>
          {t('orderTrackingScreen.orderSummary')}
        </Text>
        <TouchableOpacity onPress={onViewDetails}>
          <Text style={styles.orderSummaryButton}>
            {t('orderTrackingScreen.viewDetails')}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* عناصر الطلب (تظهر أول 2 فقط) */}
      {order.items && order.items.slice(0, 2).map((item, index) => (
        <View key={index} style={styles.orderItem}>
          <Text style={styles.orderItemName} numberOfLines={1}>
            {item.dishName}
          </Text>
          <Text style={styles.orderItemQuantity}>
            {item.quantity}x
          </Text>
          <Text style={styles.orderItemPrice}>
            {item.price} {t('orderTrackingScreen.sar')}
          </Text>
        </View>
      ))}
      
      {/* عرض عدد العناصر المتبقية إذا كان هناك أكثر من 2 */}
      {order.items && order.items.length > 2 && (
        <Text style={{ color: theme.colors.primary, marginTop: 4, textAlign: I18nManager.isRTL ? 'right' : 'left' }}>
          +{order.items.length - 2} {order.items.length - 2 === 1 ? 
            t('orderTrackingScreen.item') : 
            t('orderTrackingScreen.items')
          }
        </Text>
      )}
      
      {/* ملخص التكلفة */}
      <View style={styles.orderTotalContainer}>
        <View style={styles.orderTotalRow}>
          <Text style={[styles.cardLabel, { fontWeight: '500' }]}>
            {t('orderTrackingScreen.subtotal')}
          </Text>
          <Text style={[styles.cardValue, { fontWeight: '500' }]}>
            {order.subtotal} {t('orderTrackingScreen.sar')}
          </Text>
        </View>
        <View style={styles.orderTotalRow}>
          <Text style={styles.cardLabel}>
            {t('orderTrackingScreen.deliveryFee')}
          </Text>
          <Text style={styles.cardValue}>
            {order.deliveryFee} {t('orderTrackingScreen.sar')}
          </Text>
        </View>
        {order.discount > 0 && (
          <View style={styles.orderTotalRow}>
            <Text style={styles.cardLabel}>
              {t('orderTrackingScreen.discount')}
            </Text>
            <Text style={[styles.cardValue, { color: theme.colors.tertiary }]}>
              -{order.discount} {t('orderTrackingScreen.sar')}
            </Text>
          </View>
        )}
        <View style={styles.orderTotalRow}>
          <Text style={styles.orderTotalLabel}>
            {t('orderTrackingScreen.total')}
          </Text>
          <Text style={styles.orderTotalValue}>
            {order.totalAmount} {t('orderTrackingScreen.sar')}
          </Text>
        </View>
      </View>
    </Surface>
  );
};

// الشاشة الرئيسية
const OrderTrackingScreen = ({ route, navigation }) => {
  const { orderId } = route.params || {};
  const theme = useTheme();
  const styles = useStyles()(theme);
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [order, setOrder] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // تنسيق التاريخ والوقت
  const formatDateTime = (dateString) => {
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
  
  // جلب تفاصيل الطلب
  const fetchOrder = async () => {
    try {
      if (!orderId) {
        navigation.goBack();
        return;
      }
      
      setLoading(true);
      
        const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.DETAIL(orderId));
        if (response.data && response.data.data) {
          setOrder(response.data.data);
          setLastUpdated(new Date());
        }
        setLoading(false);
        setRefreshing(false);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // تحديث الصفحة
  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrder();
  };
  
  // جلب البيانات عند التحميل الأولي
  useEffect(() => {
    fetchOrder();
    
    // تحديث تلقائي كل دقيقة للطلبات النشطة
    const interval = setInterval(() => {
      if (order && 
        (order.status === OrderStatus.PENDING || 
         order.status === OrderStatus.PROCESSING || 
         order.status === OrderStatus.READY ||
         order.status === OrderStatus.ON_DELIVERY)) {
        fetchOrder();
      }
    }, 60000); // تحديث كل 60 ثانية
    
    return () => clearInterval(interval);
  }, [orderId]);
  
  // التعامل مع الاتصال بالمطعم أو السائق
  const handleCall = (phoneNumber) => {
    if (phoneNumber) {
      const url = `tel:${phoneNumber}`;
      Linking.canOpenURL(url)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(url);
          }
        })
        .catch(err => console.error('Error opening phone dialer', err));
    }
  };
  
  // التعامل مع محادثة المطعم أو السائق
  const handleChat = (contact) => {
    // يمكن تنفيذ وظيفة المحادثة هنا
    if (__DEV__) {
      console.log(`Chat with ${contact.name}`);
    }
  };
  
  // عرض تفاصيل الطلب
  const handleViewDetails = () => {
    if (order) {
      navigation.navigate('OrderDetails', { orderId: order._id });
    }
  };
  
  // إلغاء الطلب
  const handleCancelOrder = () => {
    if (order) {
      // تنفيذ وظيفة إلغاء الطلب
      if (__DEV__) {
        console.log('Cancel order', order._id);
      }
    }
  };
  
  // Función de tiempo estimado eliminada
  
  // Variables eliminadas de visualización de mapa y conductor
  
  // التحقق من إمكانية إلغاء الطلب
  const canCancel = order && (order.status === OrderStatus.PENDING || order.status === OrderStatus.PROCESSING);
  
  
  if (loading && !order) {
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
  
  return (
    <View style={styles.container}>
      <TopBar 
        title={`${t('orderTrackingScreen.title')} #${order.orderNumber}`}
        showBack={true}
        onBack={() => navigation.goBack()}
        rightContent={
          <TouchableOpacity onPress={handleRefresh} style={{ padding: 8 }}>
            <MaterialCommunityIcons 
              name="refresh" 
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
        {/* Sección del mapa eliminada */}
        
        {/* Sección de tiempo estimado eliminada */}
        
        {/* بطاقة معلومات الطلب */}
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={styles.sectionTitle}>{t('orderTrackingScreen.orderStatus')}</Text>
          
          {/* خط زمني لحالة الطلب */}
          <ProgressTimeline 
            order={order} 
            t={t} 
            styles={styles} 
            theme={theme}
            formatDateTimeFn={formatDateTime} 
          />
          
          <Divider style={styles.divider} />
          
          {/* معلومات إضافية عن الطلب */}
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>{t('orderTrackingScreen.orderNumber')}</Text>
            <Text style={styles.cardValue}>#{order.orderNumber}</Text>
          </View>
          
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>{t('orderTrackingScreen.paymentMethod')}</Text>
            <Text style={styles.cardValue}>
              {order.paymentMethod === 'cash' ? t('orderTrackingScreen.cash') : 
               order.paymentMethod === 'card' ? t('orderTrackingScreen.card') : 
               t('orderTrackingScreen.wallet')}
            </Text>
          </View>
          
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>{t('orderTrackingScreen.deliveryAddress')}</Text>
            <Text style={styles.cardValue} numberOfLines={2}>
              {order.deliveryAddress?.street}, {order.deliveryAddress?.building}
            </Text>
          </View>
          
          {/* تاريخ آخر تحديث */}
          <Text style={{ 
            fontSize: 12, 
            color: theme.colors.onSurfaceVariant, 
            marginTop: 16, 
            textAlign: isRTL ? 'right' : 'left' 
          }}>
            {t('orderTrackingScreen.lastUpdated')}: {lastUpdated.toLocaleTimeString()}
          </Text>
        </Surface>
        
        {/* معلومات الاتصال بالمطعم */}
        {order.restaurant && (
          <ContactCard 
            contact={order.restaurant}
            isDriver={false}
            t={t}
            styles={styles}
            theme={theme}
            onCall={() => handleCall(order.restaurant.phone)}
            onChat={() => handleChat(order.restaurant)}
          />
        )}
        
        {/* Sección de información del conductor eliminada */}
        
        {/* ملخص الطلب */}
        <OrderSummary 
          order={order} 
          t={t} 
          styles={styles} 
          theme={theme} 
          onViewDetails={handleViewDetails} 
        />
        
        {/* مساحة إضافية في الأسفل لتجنب تداخل المحتوى مع الأزرار السفلية */}
        <View style={{ height: 70 }} />
      </ScrollView>
      
      {/* الأزرار السفلية */}
      <View style={styles.bottomActions}>
        {canCancel ? (
          <>
            <Button 
              mode="outlined" 
              onPress={handleCancelOrder}
              style={{ flex: 1, marginRight: 8 }}
              textColor={theme.colors.error}
            >
              {t('orderTrackingScreen.cancelOrder')}
            </Button>
            <Button 
              mode="contained" 
              onPress={() => handleViewDetails()}
              style={{ flex: 1, marginLeft: 8 }}
            >
              {t('orderTrackingScreen.viewDetails')}
            </Button>
          </>
        ) : (
          <Button 
            mode="contained" 
            onPress={() => handleViewDetails()}
            style={styles.actionButtonFull}
          >
            {t('orderTrackingScreen.viewDetails')}
          </Button>
        )}
      </View>
    </View>
  );
};

export default OrderTrackingScreen; 