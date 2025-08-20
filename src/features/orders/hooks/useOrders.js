import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { API_BASE_URL, API_ENDPOINTS } from '../../../config/api';
import useAlertStore from '../../../stores/alertStore';
import { transformApiOrder } from '../utils/orderUtils';
import { getOrders, assignDriverToOrder, updateOrderStatusByRestaurant } from '../api/order';
import axiosInstance from '../../../services/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Hook for managing restaurant orders with real-time updates via Socket.io
 */
export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [restaurantId, setRestaurantId] = useState(null);

  const socketRef = useRef(null);
  const { triggerAlert } = useAlertStore();

  // Get restaurant information
  const getRestaurantInfo = useCallback(async () => {
    try {
      console.log('🏪 Fetching restaurant information...');
      const response = await axiosInstance.get(API_ENDPOINTS.RESTAURANTS.MY_RESTAURANT);
      const restaurant = response.data.data;
      setRestaurantId(restaurant._id);
      console.log('✅ Restaurant ID:', restaurant._id);
      return restaurant._id;
    } catch (error) {
      console.error('❌ Error fetching restaurant info:', error);
      return null;
    }
  }, []);

  // Initialize socket connection
  const initializeSocket = useCallback(async () => {
    try {
      console.log('🔌 Initializing Socket.io connection...');
      console.log('🔗 Socket URL:', API_BASE_URL.replace('/api/v1', ''));
      
      // Get restaurant ID first
      const restaurantId = await getRestaurantInfo();
      
      // Connect to socket server
      socketRef.current = io(API_BASE_URL.replace('/api/v1', ''), {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 20000,
      });

      // Socket event listeners
      socketRef.current.on('connect', () => {
        console.log('✅ Socket connected successfully!');
        console.log('🆔 Socket ID:', socketRef.current.id);
        setSocketConnected(true);
        setError(null);
        
        // Join restaurant room if we have restaurant ID
        if (restaurantId) {
          console.log('🏪 Joining restaurant room:', restaurantId);
          socketRef.current.emit('joinRestaurantRoom', restaurantId);
        }
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
        setSocketConnected(false);
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
        console.error('🔍 Error details:', {
          message: error.message,
          description: error.description,
          context: error.context
        });
        setSocketConnected(false);
        setError('فشل في الاتصال بالخادم');
      });

      socketRef.current.on('reconnect', (attemptNumber) => {
        console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
        setSocketConnected(true);
      });

      socketRef.current.on('reconnect_error', (error) => {
        console.error('❌ Socket reconnection error:', error);
      });

      // Listen for new orders
      socketRef.current.on('new_order', (newOrder) => {
        console.log('📦 New order received via socket:', newOrder);
        setOrders(prevOrders => [newOrder, ...prevOrders]);
        triggerAlert('success', 'طلب جديد تم استلامه!');
      });

      // Listen for order updates
      socketRef.current.on('order_updated', (updatedOrder) => {
        console.log('📝 Order updated via socket:', updatedOrder);
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );
        triggerAlert('success', 'تم تحديث حالة الطلب');
      });

      // Listen for order cancellations
      socketRef.current.on('order_cancelled', (cancelledOrder) => {
        console.log('❌ Order cancelled via socket:', cancelledOrder);
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === cancelledOrder._id ? cancelledOrder : order
          )
        );
        triggerAlert('warning', 'تم إلغاء الطلب');
      });

      // Listen for order status changes
      socketRef.current.on('order_status_changed', (statusChange) => {
        console.log('🔄 Order status changed via socket:', statusChange);
        const { orderId, newStatus, oldStatus } = statusChange;

        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId
              ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
              : order
          )
        );

        // Show appropriate alert based on status change with enhanced UX
        const statusMessages = {
          'accepted': 'تم قبول الطلب بنجاح! 🎉',
          'preparing': 'تم بدء تحضير الطلب! 👨‍🍳',
          'ready_for_pickup': 'الطلب جاهز للاستلام! ✅',
          'assigned_to_driver': 'تم تعيين سائق للطلب! 🚗',
          'picked_up_by_driver': 'تم استلام الطلب من السائق! 📦',
          'on_the_way': 'الطلب في الطريق! 🚚',
          'delivered': 'تم توصيل الطلب بنجاح! 🎊',
          'cancelled_by_customer': 'تم إلغاء الطلب من العميل',
          'cancelled_by_restaurant': 'تم إلغاء الطلب من المطعم',
          'cancelled_by_admin': 'تم إلغاء الطلب من الإدارة'
        };

        if (statusMessages[newStatus]) {
          if (newStatus === 'preparing') {
            // Special enhanced feedback for preparing status
            triggerAlert('success', statusMessages[newStatus], {
              duration: 3000,
              showIcon: true,
              autoClose: true
            });
          } else {
            // Standard feedback for other statuses
            triggerAlert('success', statusMessages[newStatus]);
          }
        }
      });

      // Debug: Listen for all events
      socketRef.current.onAny((eventName, ...args) => {
        console.log('🔍 Socket event received:', eventName, args);
      });

    } catch (error) {
      console.error('❌ Error initializing socket:', error);
      setError('فشل في الاتصال بالخادم');
    }
  }, [triggerAlert]);

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📡 Fetching orders from API...');

      // Make actual API call to get restaurant orders
      const ordersData = await getOrders();


      if (ordersData) {
        // Store raw API orders, let components handle transformation
        setOrders(ordersData);
      } else {
        throw new Error('فشل في تحميل الطلبات');
      }

    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      setError('فشل في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update order status
  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    try {
      setUpdating(true);
      setError(null);

      console.log('🔄 Updating order status:', { orderId, newStatus });

      // Debug: Check API endpoints
      console.log('🔍 API_ENDPOINTS available:', Object.keys(API_ENDPOINTS));
      console.log('🔍 ORDERS endpoints available:', Object.keys(API_ENDPOINTS.ORDERS || {}));
      console.log('🔍 UPDATE_STATUS function:', typeof API_ENDPOINTS.ORDERS?.UPDATE_STATUS);

      // Fallback: Use hardcoded endpoints if API_ENDPOINTS is undefined
      const updateStatusEndpoint = API_ENDPOINTS.ORDERS?.UPDATE_STATUS?.(orderId) || `/orders/${orderId}/status`;
      console.log('🔍 Using endpoint:', updateStatusEndpoint);

      // Debug: Check if we have authentication headers
      const token = await AsyncStorage.getItem('access_token');
      console.log('🔑 Token available:', !!token);
      if (token) {
        console.log('🔑 Token preview:', token.substring(0, 20) + '...');
      }

      // Use axiosInstance instead of raw fetch to include authentication headers
      const response = await axiosInstance.patch(updateStatusEndpoint, {
        status: newStatus
      });

      if (response.data.status === 'success') {
        console.log('✅ Order status updated successfully');
        
        // Provide immediate feedback based on the new status
        const statusMessages = {
          'accepted': 'تم قبول الطلب بنجاح! 🎉',
          'preparing': 'تم بدء تحضير الطلب! 👨‍🍳',
          'ready_for_pickup': 'الطلب جاهز للاستلام! ✅',
          'assigned_to_driver': 'تم تعيين سائق للطلب! 🚗',
          'picked_up_by_driver': 'تم استلام الطلب من السائق! 📦',
          'on_the_way': 'الطلب في الطريق! 🚚',
          'delivered': 'تم توصيل الطلب بنجاح! 🎊',
          'cancelled_by_customer': 'تم إلغاء الطلب من العميل',
          'cancelled_by_restaurant': 'تم إلغاء الطلب من المطعم',
          'cancelled_by_admin': 'تم إلغاء الطلب من الإدارة'
        };

        // Show appropriate alert with enhanced UX for preparing status
        if (statusMessages[newStatus]) {
          if (newStatus === 'preparing') {
            // Special enhanced feedback for preparing status
            triggerAlert('success', statusMessages[newStatus], {
              duration: 3000, // Show for 3 seconds
              showIcon: true,
              autoClose: true
            });
          } else {
            // Standard feedback for other statuses
            triggerAlert('success', statusMessages[newStatus]);
          }
        }
        
        // Update locally
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId
              ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
              : order
          )
        );

        // Emit socket event for real-time updates
        if (socketRef.current?.connected) {
          console.log('📡 Emitting socket event: update_order_status');
          socketRef.current.emit('update_order_status', { orderId, newStatus });
        } else {
          console.warn('⚠️ Socket not connected, cannot emit event');
        }

        return { success: true };
      } else {
        throw new Error(response.data.message || 'فشل في تحديث حالة الطلب');
      }

    } catch (error) {
      console.error('❌ Error updating order status:', error);
      setError('فشل في تحديث حالة الطلب');
      return { success: false, error: error.message };
    } finally {
      setUpdating(false);
    }
  }, []);

  // Cancel order
  const cancelOrder = useCallback(async (orderId) => {
    try {
      setUpdating(true);
      setError(null);

      console.log('❌ Cancelling order:', orderId);

      // Debug: Check API endpoints
      console.log('🔍 API_ENDPOINTS available for cancellation:', Object.keys(API_ENDPOINTS));
      console.log('🔍 ORDERS endpoints available for cancellation:', Object.keys(API_ENDPOINTS.ORDERS || {}));
      console.log('🔍 CANCEL function:', typeof API_ENDPOINTS.ORDERS?.CANCEL);

      // Fallback: Use hardcoded endpoints if API_ENDPOINTS is undefined
      const cancelEndpoint = API_ENDPOINTS.ORDERS?.CANCEL?.(orderId) || `/orders/${orderId}/cancel`;
      console.log('🔍 Using cancel endpoint:', cancelEndpoint);

      // Debug: Check if we have authentication headers
      const token = await AsyncStorage.getItem('access_token');
      console.log('🔑 Token available for cancellation:', !!token);
      if (token) {
        console.log('🔑 Token preview for cancellation:', token.substring(0, 20) + '...');
      }

      // Use axiosInstance instead of raw fetch to include authentication headers
      const response = await axiosInstance.patch(cancelEndpoint, {
        status: 'cancelled_by_restaurant',
        reason: 'Cancelled by restaurant'
      });

      if (response.data.status === 'success') {
        console.log('✅ Order cancelled successfully');
        
        // Provide immediate feedback for cancellation
        triggerAlert('warning', 'تم إلغاء الطلب بنجاح! ⚠️', {
          duration: 3000,
          showIcon: true,
          autoClose: true
        });
        
        // Update locally
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId
              ? { ...order, status: 'cancelled_by_restaurant', updatedAt: new Date().toISOString() }
              : order
          )
        );

        // Emit socket event for real-time updates
        if (socketRef.current?.connected) {
          console.log('📡 Emitting socket event: cancel_order');
          socketRef.current.emit('cancel_order', { orderId });
        } else {
          console.warn('⚠️ Socket not connected, cannot emit event');
        }

        return { success: true };
      } else {
        throw new Error(response.data.message || 'فشل في إلغاء الطلب');
      }

    } catch (error) {
      console.error('❌ Error cancelling order:', error);
      setError('فشل في إلغاء الطلب');
      return { success: false, error: error.message };
    } finally {
      setUpdating(false);
    }
  }, []);

  // Refresh orders
  const refreshOrders = useCallback(() => {
    console.log('🔄 Refreshing orders...');
    fetchOrders();
  }, [fetchOrders]);

  // Assign driver to order
  const assignDriver = useCallback(async (orderId, driverId) => {
    try {
      setUpdating(true);
      setError(null);
      
      console.log('🚚 Assigning driver to order:', orderId, driverId);
      
      const response = await assignDriverToOrder(orderId, driverId);
      
      if (response.data.status === 'success') {
        console.log('✅ Driver assigned successfully');
        
        // Update order locally
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId
              ? { 
                  ...order, 
                  status: 'assigned_to_driver', 
                  driver: driverId,
                  driverAssignedAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString() 
                }
              : order
          )
        );

        // Emit socket event for real-time updates
        if (socketRef.current?.connected) {
          console.log('📡 Emitting socket event: driver_assigned');
          socketRef.current.emit('driver_assigned', { orderId, driverId });
        }

        return { success: true, data: response.data.data };
      } else {
        throw new Error(response.data.message || 'فشل في تعيين السائق');
      }
    } catch (error) {
      console.error('❌ Error assigning driver:', error);
      setError('فشل في تعيين السائق');
      return { success: false, error: error.message };
    } finally {
      setUpdating(false);
    }
  }, []);

  // Update order status by restaurant
  const updateOrderStatusByRestaurant = useCallback(async (orderId, newStatus) => {
    try {
      setUpdating(true);
      setError(null);
      
      console.log('🔄 Updating order status by restaurant:', orderId, newStatus);
      
      const response = await updateOrderStatusByRestaurant(orderId, newStatus);
      
      if (response.data.status === 'success') {
        console.log('✅ Order status updated successfully');
        
        // Update order locally
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId
              ? { 
                  ...order, 
                  status: newStatus,
                  updatedAt: new Date().toISOString() 
                }
              : order
          )
        );

        // Emit socket event for real-time updates
        if (socketRef.current?.connected) {
          console.log('📡 Emitting socket event: order_status_updated');
          socketRef.current.emit('order_status_updated', { orderId, newStatus });
        }

        return { success: true, data: response.data.data };
      } else {
        throw new Error(response.data.message || 'فشل في تحديث حالة الطلب');
      }
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      setError('فشل في تحديث حالة الطلب');
      return { success: false, error: error.message };
    } finally {
      setUpdating(false);
    }
  }, []);

  // Get socket connection status
  const getSocketStatus = useCallback(() => {
    if (!socketRef.current) {
      return { connected: false, id: null, error: 'Socket not initialized' };
    }
    
    return {
      connected: socketRef.current.connected,
      id: socketRef.current.id,
      error: null
    };
  }, []);

  // Initialize on mount
  useEffect(() => {
    console.log('🚀 Initializing useOrders hook...');
    const init = async () => {
      await initializeSocket();
      await fetchOrders();
    };
    init();

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up useOrders hook...');
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [initializeSocket, fetchOrders]);

  return {
    orders,
    loading,
    error,
    updating,
    socketConnected,
    updateOrderStatus,
    cancelOrder,
    assignDriver,
    updateOrderStatusByRestaurant,
    refreshOrders,
    getSocketStatus,
    socket: socketRef.current
  };
};
