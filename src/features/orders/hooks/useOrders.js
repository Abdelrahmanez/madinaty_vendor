import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { API_BASE_URL, API_ENDPOINTS } from '../../../config/api';
import useAlertStore from '../../../stores/alertStore';
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
      const response = await axiosInstance.get(API_ENDPOINTS.RESTAURANTS.MY_RESTAURANT);
      const restaurant = response.data.data;
      setRestaurantId(restaurant._id);
      return restaurant._id;
    } catch (error) {
      return null;
    }
  }, []);

  // Initialize socket connection
  const initializeSocket = useCallback(async () => {
    try {
      
      // Get restaurant ID first
      const restaurantId = await getRestaurantInfo();
      
      // Connect to socket server
      socketRef.current = io(process.env.SOCKET_URL || "https://madinaty-backend.onrender.com", {
        transports: (process.env.SOCKET_TRANSPORTS || "websocket,polling").split(','),
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: parseInt(process.env.SOCKET_TIMEOUT || "20000", 10),
      });

      // Socket event listeners
      socketRef.current.on('connect', () => {
        setSocketConnected(true);
        setError(null);
        
        // Join restaurant room if we have restaurant ID
        if (restaurantId) {
          socketRef.current.emit('joinRestaurantRoom', restaurantId);
        }
      });

      socketRef.current.on('disconnect', (reason) => {
        setSocketConnected(false);
      });

      socketRef.current.on('connect_error', (error) => {
        setSocketConnected(false);
        setError('فشل في الاتصال بالخادم');
      });

      socketRef.current.on('reconnect', (attemptNumber) => {
        setSocketConnected(true);
      });

      socketRef.current.on('reconnect_error', (error) => {
      });

      // Listen for new orders
      socketRef.current.on('new_order', async (newOrder) => {
        console.log('📦 New order received via socket:', newOrder);
        // Refresh all orders from API to get the latest data
        await fetchOrders();
        triggerAlert('success', 'طلب جديد تم استلامه!');
      });

      // Listen for order updates
      socketRef.current.on('order_updated', async (updatedOrder) => {
        // Refresh all orders from API to get the latest data
        await fetchOrders();
        triggerAlert('success', 'تم تحديث حالة الطلب');
      });

      // Listen for order cancellations
      socketRef.current.on('order_cancelled', async (cancelledOrder) => {
        // Refresh all orders from API to get the latest data
        await fetchOrders();
        triggerAlert('warning', 'تم إلغاء الطلب');
      });

      // Listen for order status changes
      socketRef.current.on('order_status_changed', async (statusChange) => {
        const { orderId, newStatus, oldStatus } = statusChange;

        // Refresh all orders from API to get the latest data
        await fetchOrders();

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
      });

    } catch (error) {
      setError('فشل في الاتصال بالخادم');
    }
  }, [triggerAlert]);

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);


      // Make actual API call to get restaurant orders
      const ordersData = await getOrders();


      if (ordersData) {
        // Store raw API orders, let components handle transformation
        setOrders(ordersData);
      } else {
        throw new Error('فشل في تحميل الطلبات');
      }

    } catch (error) {
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


      // Debug: Check API endpoints

      // Fallback: Use hardcoded endpoints if API_ENDPOINTS is undefined
      const updateStatusEndpoint = API_ENDPOINTS.ORDERS?.UPDATE_STATUS?.(orderId) || `/orders/${orderId}/status`;

      // Debug: Check if we have authentication headers
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
      }

      // Use axiosInstance instead of raw fetch to include authentication headers
      const response = await axiosInstance.patch(updateStatusEndpoint, {
        status: newStatus
      });

      if (response.data.status === 'success') {
        
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
        
        // Refresh orders from API to get latest data
        await fetchOrders();

        // Emit socket event for real-time updates
        if (socketRef.current?.connected) {
          socketRef.current.emit('update_order_status', { orderId, newStatus });
        } else {
        }

        return { success: true };
      } else {
        throw new Error(response.data.message || 'فشل في تحديث حالة الطلب');
      }

    } catch (error) {
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


      // Debug: Check API endpoints

      // Fallback: Use hardcoded endpoints if API_ENDPOINTS is undefined
      const cancelEndpoint = API_ENDPOINTS.ORDERS?.CANCEL?.(orderId) || `/orders/${orderId}/cancel`;

      // Debug: Check if we have authentication headers
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
      }

      // Use axiosInstance instead of raw fetch to include authentication headers
      const response = await axiosInstance.patch(cancelEndpoint, {
        status: 'cancelled_by_restaurant',
        reason: 'Cancelled by restaurant'
      });

      if (response.data.status === 'success') {
        
        // Provide immediate feedback for cancellation
        triggerAlert('warning', 'تم إلغاء الطلب بنجاح! ⚠️', {
          duration: 3000,
          showIcon: true,
          autoClose: true
        });
        
        // Refresh orders from API to get latest data
        await fetchOrders();

        // Emit socket event for real-time updates
        if (socketRef.current?.connected) {
          socketRef.current.emit('cancel_order', { orderId });
        } else {
        }

        return { success: true };
      } else {
        throw new Error(response.data.message || 'فشل في إلغاء الطلب');
      }

    } catch (error) {
      setError('فشل في إلغاء الطلب');
      return { success: false, error: error.message };
    } finally {
      setUpdating(false);
    }
  }, []);

  // Refresh orders
  const refreshOrders = useCallback(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Assign driver to order
  const assignDriver = useCallback(async (orderId, driverId) => {
    try {
      setUpdating(true);
      setError(null);
      
      
      const response = await assignDriverToOrder(orderId, driverId);
      
      if (response.data.status === 'success') {
        
        // Refresh orders from API to get latest data
        await fetchOrders();

        // Emit socket event for real-time updates
        if (socketRef.current?.connected) {
          socketRef.current.emit('driver_assigned', { orderId, driverId });
        }

        return { success: true, data: response.data.data };
      } else {
        throw new Error(response.data.message || 'فشل في تعيين السائق');
      }
    } catch (error) {
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
      
      
      const response = await updateOrderStatusByRestaurant(orderId, newStatus);
      
      if (response.data.status === 'success') {
        
        // Refresh orders from API to get latest data
        await fetchOrders();

        // Emit socket event for real-time updates
        if (socketRef.current?.connected) {
          socketRef.current.emit('order_status_updated', { orderId, newStatus });
        }

        return { success: true, data: response.data.data };
      } else {
        throw new Error(response.data.message || 'فشل في تحديث حالة الطلب');
      }
    } catch (error) {
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
    const init = async () => {
      await initializeSocket();
      await fetchOrders();
    };
    init();

    // Cleanup on unmount
    return () => {
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
