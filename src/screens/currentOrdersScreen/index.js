import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
  I18nManager,
  RefreshControl
} from 'react-native';
import {
  useTheme,
  Surface,
  Button,
  Divider
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import TopBar from '../../components/TopBar';
import axiosInstance from '../../__apis__/axios';
import { API_ENDPOINTS } from '../../config/api';
import useStyles from './styles';
import { OrderStatus, StatusColors } from '../../utils/enums';

// Update the OrderCard component to use the new styles
const OrderCard = ({ order, onViewDetails, onCancel, onTrack, t, styles, theme }) => {
  const isRTL = I18nManager.isRTL;
  
  // تحديد لون حالة الطلب
  const getStatusColor = (status) => {
    return StatusColors[status] || '#999999';
  };
  
  // تحويل التاريخ إلى نص مقروء
  const formatDate = (dateString) => {
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
  
  // تحديد الإجراءات المتاحة بناءً على حالة الطلب
  const canCancel = order.status === OrderStatus.PENDING || order.status === OrderStatus.PROCESSING;
  const canTrack = order.status !== OrderStatus.PENDING;
  
  // تقدير وقت التوصيل المتبقي
  const getEstimatedDeliveryTime = () => {
    switch (order.status) {
      case OrderStatus.PENDING:
        return t('currentOrdersScreen.preparingSoon');
      case OrderStatus.PROCESSING:
        return t('currentOrdersScreen.preparingNow');
      case OrderStatus.READY:
        return t('currentOrdersScreen.readyForDelivery');
      case OrderStatus.ON_DELIVERY:
        return t('currentOrdersScreen.onTheWay');
      default:
        return '';
    }
  };
  
  // حساب نسبة تقدم الطلب
  const calculateProgress = () => {
    switch (order.status) {
      case OrderStatus.PENDING:
        return 0.25;
      case OrderStatus.PROCESSING:
        return 0.5;
      case OrderStatus.READY:
        return 0.75;
      case OrderStatus.ON_DELIVERY:
        return 0.9;
      default:
        return 0;
    }
  };
  
  const progress = calculateProgress();
  
  return (
    <Surface 
      style={[
        styles.orderCard, 
        { backgroundColor: theme.colors.surface }
      ]}
      elevation={1}
    >
      {/* رأس بطاقة الطلب */}
      <View style={styles.orderCardHeader}>
        <View style={styles.orderRestaurantInfo}>
          <Image 
            source={{ uri: order.restaurantLogo || 'https://via.placeholder.com/40' }} 
            style={styles.restaurantLogo}
          />
          <View>
            <Text style={[styles.restaurantName, { color: theme.colors.onSurface }]}>
              {order.restaurantName}
            </Text>
            <Text style={[styles.orderDate, { color: theme.colors.onSurfaceVariant }]}>
              {formatDate(order.createdAt)}
            </Text>
          </View>
        </View>
        <View style={[styles.statusChip, { backgroundColor: `${getStatusColor(order.status)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {t(`currentOrdersScreen.${order.status}`)}
          </Text>
        </View>
      </View>
      
      {/* خط فاصل بلون خفيف */}
      <Divider style={{ backgroundColor: theme.colors.surfaceVariant, marginHorizontal: 16 }} />
      
      {/* محتوى بطاقة الطلب - العناصر */}
      <View style={styles.orderCardContent}>
        {order.items && order.items.slice(0, 2).map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={[styles.orderItemName, { color: theme.colors.onSurface }]} numberOfLines={1}>
              {item.dishName}
            </Text>
            <Text style={[styles.orderItemQuantity, { color: theme.colors.primary }]}>
              {item.quantity}x
            </Text>
            <Text style={[styles.orderItemPrice, { color: theme.colors.onSurface }]}>
              {item.price} {t('currentOrdersScreen.sar')}
            </Text>
          </View>
        ))}
        
        {order.items && order.items.length > 2 && (
          <Text style={{ color: theme.colors.primary, marginTop: 8, textAlign: isRTL ? 'right' : 'left', fontWeight: '500' }}>
            +{order.items.length - 2} {t('currentOrdersScreen.more')}...
          </Text>
        )}
      </View>
      
      {/* شريط التقدم للطلب */}
      <View style={styles.trackingContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressBarFill, 
              { 
                width: `${progress * 100}%`,
                backgroundColor: getStatusColor(order.status)
              }
            ]} 
          />
        </View>
        
        <View 
          style={[
            styles.deliveryTimeContainer, 
            { backgroundColor: `${getStatusColor(order.status)}15` }
          ]}
        >
          <MaterialCommunityIcons 
            name="clock-outline" 
            size={22} 
            color={getStatusColor(order.status)} 
          />
          <Text style={[styles.deliveryTimeText, { color: theme.colors.onSurface }]}>
            {getEstimatedDeliveryTime()}
          </Text>
        </View>
      </View>
      
      {/* تذييل بطاقة الطلب - المجموع والإجراءات */}
      <View style={[styles.orderCardFooter, { borderTopColor: theme.colors.surfaceVariant }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: theme.colors.onSurface }]}>
            {t('currentOrdersScreen.total')}
          </Text>
          <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
            {order.totalAmount} {t('currentOrdersScreen.sar')}
          </Text>
        </View>
        
        <View style={styles.actionButtonsContainer}>
          {canTrack && (
            <Button 
              mode="contained" 
              onPress={() => onTrack(order)}
              style={styles.actionButton}
              icon="map-marker-path"
            >
              {t('currentOrdersScreen.trackOrder')}
            </Button>
          )}
          
          <Button 
            mode="contained-tonal" 
            onPress={() => onViewDetails(order)}
            style={styles.actionButton}
          >
            {t('currentOrdersScreen.viewDetails')}
          </Button>
          
          {canCancel && (
            <Button 
              mode="outlined" 
              onPress={() => onCancel(order._id)}
              style={[styles.actionButton, { borderColor: theme.colors.error }]}
              textColor={theme.colors.error}
            >
              {t('currentOrdersScreen.cancelOrder')}
            </Button>
          )}
        </View>
      </View>
    </Surface>
  );
};

// الشاشة الرئيسية
const CurrentOrdersScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = useStyles()(theme);
  const { t } = useTranslation();
  
  // حالة القائمة
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  
  // جلب بيانات الطلبات
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.LIST);
      
      if (response.data && response.data.data) {
        const formattedOrders = response.data.data.map(order => ({
          ...order,
          restaurantName: order.restaurant?.name || 'Restaurant',
          restaurantLogo: order.restaurant?.image,
        }));
        
        setOrders(formattedOrders);
      } else {
        setOrders([]);
      }
      
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // تصفية الطلبات إلى طلبات نشطة فقط
  useEffect(() => {
    if (orders.length > 0) {
      // الطلبات النشطة (قيد التنفيذ حالياً)
      const active = orders.filter(order => 
        [OrderStatus.PENDING, OrderStatus.PROCESSING, 
         OrderStatus.READY, OrderStatus.ON_DELIVERY].includes(order.status)
      );
      
      // ترتيب الطلبات بحسب الحالة والتاريخ
      active.sort((a, b) => {
        // ترتيب حسب الحالة أولاً (ON_DELIVERY ثم READY ثم PROCESSING ثم PENDING)
        const statusOrder = {
          [OrderStatus.ON_DELIVERY]: 1,
          [OrderStatus.READY]: 2,
          [OrderStatus.PROCESSING]: 3,
          [OrderStatus.PENDING]: 4
        };
        
        const statusDiff = statusOrder[a.status] - statusOrder[b.status];
        
        // إذا كانت الحالة متساوية، قم بالترتيب حسب التاريخ (الأحدث أولاً)
        if (statusDiff === 0) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        
        return statusDiff;
      });
      
      setActiveOrders(active);
    } else {
      setActiveOrders([]);
    }
  }, [orders]);
  
  // تحميل البيانات عند فتح الصفحة
  useEffect(() => {
    fetchOrders();
  }, []);
  
  // تحديث البيانات
  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };
  
  // التعامل مع الأحداث
  const handleViewDetails = (order) => {
    if (__DEV__) {
      console.log("View order details", order._id);
    }
    navigation.navigate('OrderDetails', { orderId: order._id });
  };
  
  const handleTrackOrder = (order) => {
    if (__DEV__) {
      console.log("Track order", order._id);
    }
    navigation.navigate('OrderTracking', { orderId: order._id });
  };
  
  const handleCancelOrder = (orderId) => {
    Alert.alert(
      t('currentOrdersScreen.confirmCancel'),
      t('currentOrdersScreen.cancelOrderMessage'),
      [
        {
          text: t('currentOrdersScreen.no'),
          style: 'cancel',
        },
        {
          text: t('currentOrdersScreen.yes'),
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              // عندما يكون API الإلغاء جاهزًا
              // await axiosInstance.patch(`${API_ENDPOINTS.ORDERS.DETAIL(orderId)}/cancel`);
              
              // مؤقتًا نقوم بتحديث الحالة محليًا
              const updatedOrders = orders.map(order => {
                if (order._id === orderId) {
                  return { ...order, status: OrderStatus.CANCELED };
                }
                return order;
              });
              
              setOrders(updatedOrders);
              Alert.alert(t('currentOrdersScreen.success'), t('currentOrdersScreen.orderCanceled'));
              
            } catch (error) {
              console.error('Error canceling order:', error);
              Alert.alert(t('currentOrdersScreen.error'), t('currentOrdersScreen.cantCancel'));
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };
  
  // تم إزالة البيانات التجريبية واستبدالها بالبيانات الحقيقية
  
  return (
    <View style={styles.container}>
      <TopBar
        title={t('currentOrdersScreen.title')}
        showBack={true}
        onBack={() => navigation.goBack()}
      />
      
      {loading && !refreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={activeOrders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onViewDetails={handleViewDetails}
              onCancel={handleCancelOrder}
              onTrack={handleTrackOrder}
              t={t}
              styles={styles}
              theme={theme}
            />
          )}
          contentContainerStyle={styles.contentContainer}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="food-off"
                size={100}
                color={theme.colors.outlineVariant}
              />
              <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>
                {t('currentOrdersScreen.noActiveOrders')}
              </Text>
              <Text style={[styles.emptySubText, { color: theme.colors.onSurfaceVariant }]}>
                {t('currentOrdersScreen.noActiveOrdersDesc')}
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Restaurants')}
              >
                {t('currentOrdersScreen.startOrdering')}
              </Button>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default CurrentOrdersScreen; 