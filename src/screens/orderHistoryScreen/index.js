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
  I18nManager
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

const OrderCard = ({ order, onViewDetails, onReorder, onTrackOrder, onCancel, onRate, t, styles, theme }) => {
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
  const canTrack = order.status === OrderStatus.PROCESSING || 
                  order.status === OrderStatus.READY || 
                  order.status === OrderStatus.ON_DELIVERY;
  const canRate = order.status === OrderStatus.DELIVERED && !order.isRated;
  
  return (
    <Surface style={[styles.orderCard, { backgroundColor: theme.colors.surface }]}>
      {/* رأس بطاقة الطلب */}
      <View style={[styles.orderCardHeader, { borderBottomColor: theme.colors.outlineVariant }]}>
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
            {t(`orderHistoryScreen.${order.status}`)}
          </Text>
        </View>
      </View>
      
      {/* محتوى بطاقة الطلب - العناصر */}
      <View style={styles.orderCardContent}>
        {order.items.slice(0, 2).map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={[styles.orderItemName, { color: theme.colors.onSurface }]} numberOfLines={1}>
              {item.dishName}
            </Text>
            <Text style={[styles.orderItemQuantity, { color: theme.colors.onSurfaceVariant }]}>
              {item.quantity}x
            </Text>
            <Text style={[styles.orderItemPrice, { color: theme.colors.onSurface }]}>
              {item.price} {t('orderHistoryScreen.sar')}
            </Text>
          </View>
        ))}
        
        {order.items.length > 2 && (
          <Text style={{ color: theme.colors.primary, marginTop: 4, textAlign: isRTL ? 'right' : 'left' }}>
            +{order.items.length - 2} {t('orderHistoryScreen.more')}...
          </Text>
        )}
      </View>
      
      {/* تذييل بطاقة الطلب - المجموع والإجراءات */}
      <View style={[styles.orderCardFooter, { borderTopColor: theme.colors.outlineVariant }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: theme.colors.onSurface }]}>
            {t('orderHistoryScreen.total')}
          </Text>
          <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
            {order.totalAmount} {t('orderHistoryScreen.sar')}
          </Text>
        </View>
        
        <View style={styles.actionButtonsContainer}>
          {canCancel && (
            <Button 
              mode="outlined" 
              onPress={() => onCancel(order._id)}
              compact
              style={styles.actionButton}
            >
              {t('orderHistoryScreen.cancelOrder')}
            </Button>
          )}
          
          {canTrack && (
            <Button 
              mode="outlined" 
              onPress={() => onTrackOrder(order._id)}
              compact
              style={styles.actionButton}
              icon="map-marker-path"
              textColor={theme.colors.primary}
            >
              {t('orderHistoryScreen.trackOrder')}
            </Button>
          )}
          
          {canRate && (
            <Button 
              mode="outlined" 
              onPress={() => onRate(order)}
              compact
              style={styles.actionButton}
              icon="star"
              textColor={theme.colors.tertiary}
            >
              {t('orderHistoryScreen.rateOrder')}
            </Button>
          )}
          
          <Button 
            mode="contained" 
            onPress={() => onViewDetails(order)}
            compact
            style={styles.actionButton}
          >
            {t('orderHistoryScreen.viewDetails')}
          </Button>
        </View>
      </View>
    </Surface>
  );
};



// الشاشة الرئيسية
const OrderHistoryScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = useStyles()(theme);
  const { t, i18n } = useTranslation();
  
  // حالة القائمة
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  
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
          isRated: false,  // سنقوم بتحديثه لاحقًا عندما تكون خاصية التقييم متاحة
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
  
  // تصفية الطلبات إلى طلبات منتهية فقط (مكتملة أو ملغاة)
  useEffect(() => {
    if (orders.length > 0) {
      // الطلبات المنتهية (المكتملة أو الملغاة)
      const completed = orders.filter(order => 
        order.status === OrderStatus.DELIVERED || 
        order.status === OrderStatus.CANCELED || 
        order.status === OrderStatus.REJECTED
      );
      
      // ترتيب الطلبات بحسب التاريخ من الأحدث للأقدم
      completed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setCompletedOrders(completed);
    } else {
      setCompletedOrders([]);
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
    navigation.navigate('OrderDetails', { orderId: order._id });
  };
  
  const handleReorder = (orderId) => {
    if (__DEV__) {
      console.log("Reorder", orderId);
    }
  };
  
  const handleTrackOrder = (orderId) => {
    if (__DEV__) {
      console.log("Track order", orderId);
    }
    navigation.navigate('OrderTracking', { orderId });
  };
  
  const handleCancelOrder = (orderId) => {
    Alert.alert(
      t('orderHistoryScreen.confirmCancel'),
      t('orderHistoryScreen.cancelOrderMessage'),
      [
        {
          text: t('orderHistoryScreen.no'),
          style: 'cancel',
        },
        {
          text: t('orderHistoryScreen.yes'),
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
              Alert.alert(t('orderHistoryScreen.success'), t('orderHistoryScreen.orderCanceled'));
              
            } catch (error) {
              console.error('Error canceling order:', error);
              Alert.alert(t('orderHistoryScreen.error'), t('orderHistoryScreen.cantCancel'));
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };
  
  const handleRateOrder = (order) => {
    if (__DEV__) {
      console.log("Rate order", order._id);
    }
    // navigation.navigate('RateOrder', { order });
  };
  
  // مهمة إضافية يمكن إضافتها لاحقاً
  const handleAdditionalFeatures = () => {
    // يمكن إضافة مزيد من الوظائف هنا في المستقبل
  };
  
  return (
    <View style={styles.container}>
      <TopBar
        title={t('orderHistoryScreen.title')}
        showBack={true}
        onBack={() => navigation.goBack()}
      />
      
      {loading && !refreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={completedOrders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onViewDetails={handleViewDetails}
              onReorder={handleReorder}
              onTrackOrder={handleTrackOrder}
              onCancel={handleCancelOrder}
              onRate={handleRateOrder}
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
                name="receipt-text-outline"
                size={100}
                color={theme.colors.outlineVariant}
              />
              <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>
                {t('orderHistoryScreen.noOrders')}
              </Text>
              <Text style={[styles.emptySubText, { color: theme.colors.onSurfaceVariant }]}>
                {t('orderHistoryScreen.noOrdersDesc')}
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Restaurants')}
              >
                {t('orderHistoryScreen.startOrdering')}
              </Button>
            </View>
          )}
          ListHeaderComponent={completedOrders.length > 0 ? (
            <Text style={{ 
              fontSize: 14, 
              color: theme.colors.onSurfaceVariant,
              marginBottom: 12,
              textAlign: I18nManager.isRTL ? 'right' : 'left'
            }}>
              {completedOrders.length} {completedOrders.length === 1 ? 
                t('orderHistoryScreen.orderFound') : 
                t('orderHistoryScreen.ordersFound')}
            </Text>
          ) : null}
        />
      )}
    </View>
  );
};

export default OrderHistoryScreen; 