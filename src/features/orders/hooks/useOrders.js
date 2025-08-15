import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { API_BASE_URL, API_ENDPOINTS } from '../../../config/api';
import useAlertStore from '../../../stores/alertStore';
import { transformApiOrder } from '../utils/orderUtils';
import { getOrders } from '../api/order';
import axiosInstance from '../../../services/axios';

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
        const transformedOrder = transformApiOrder(newOrder);
        if (transformedOrder) {
          setOrders(prevOrders => [transformedOrder, ...prevOrders]);
          triggerAlert('success', 'طلب جديد تم استلامه!');
        }
      });

      // Listen for order updates
      socketRef.current.on('order_updated', (updatedOrder) => {
        console.log('📝 Order updated via socket:', updatedOrder);
        const transformedOrder = transformApiOrder(updatedOrder);
        if (transformedOrder) {
          setOrders(prevOrders =>
            prevOrders.map(order =>
              order.id === transformedOrder.id ? transformedOrder : order
            )
          );
          triggerAlert('success', 'تم تحديث حالة الطلب');
        }
      });

      // Listen for order cancellations
      socketRef.current.on('order_cancelled', (cancelledOrder) => {
        console.log('❌ Order cancelled via socket:', cancelledOrder);
        const transformedOrder = transformApiOrder(cancelledOrder);
        if (transformedOrder) {
          setOrders(prevOrders =>
            prevOrders.map(order =>
              order.id === transformedOrder.id ? transformedOrder : order
            )
          );
          triggerAlert('warning', 'تم إلغاء الطلب');
        }
      });

      // Listen for order status changes
      socketRef.current.on('order_status_changed', (statusChange) => {
        console.log('🔄 Order status changed via socket:', statusChange);
        const { orderId, newStatus, oldStatus } = statusChange;

        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId
              ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
              : order
          )
        );

        // Show appropriate alert based on status change
        const statusMessages = {
          'accepted': 'تم قبول الطلب',
          'preparing': 'تم بدء تحضير الطلب',
          'ready_for_pickup': 'الطلب جاهز للاستلام',
          'assigned_to_driver': 'تم تعيين سائق للطلب',
          'picked_up_by_driver': 'تم استلام الطلب من السائق',
          'on_the_way': 'الطلب في الطريق',
          'delivered': 'تم توصيل الطلب',
          'cancelled_by_customer': 'تم إلغاء الطلب من العميل',
          'cancelled_by_restaurant': 'تم إلغاء الطلب من المطعم',
          'cancelled_by_admin': 'تم إلغاء الطلب من الإدارة'
        };

        if (statusMessages[newStatus]) {
          triggerAlert('success', statusMessages[newStatus]);
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

      console.log('📦 Orders received from API:', ordersData);

      if (ordersData) {
        // Transform API orders to component format
        const transformedOrders = ordersData.map(order => transformApiOrder(order)).filter(Boolean);
        console.log('🔄 Transformed orders:', transformedOrders);
        setOrders(transformedOrders);
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

      // Make actual API call to update order status
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        console.log('✅ Order status updated successfully');
        
        // Update locally
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId
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
        throw new Error(result.message || 'فشل في تحديث حالة الطلب');
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

      // Make actual API call to cancel order
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status: 'cancelled_by_restaurant',
          reason: 'Cancelled by restaurant'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        console.log('✅ Order cancelled successfully');
        
        // Update locally
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId
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
        throw new Error(result.message || 'فشل في إلغاء الطلب');
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
    refreshOrders,
    getSocketStatus,
    socket: socketRef.current
  };
};
