import { ORDER_STATUS } from '../../../utils/enums';

/**
 * Format order number for display
 * @param {string} orderId - Order ID from API
 * @returns {string} Formatted order number
 */
export const formatOrderNumber = (orderId) => {
  if (!orderId) return 'N/A';
  // Use last 8 characters of the ID as order number
  return `#${orderId.slice(-8).toUpperCase()}`;
};

/**
 * Format currency amount
 * @param {number} amount - Amount in smallest currency unit
 * @param {string} currency - Currency code (default: EGP)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'EGP') => {
  if (amount === null || amount === undefined) return '0.00';
  return `${parseFloat(amount).toFixed(2)} ${currency}`;
};

/**
 * Calculate total order amount from API response
 * @param {Array} items - Order items array from API
 * @returns {number} Total amount
 */
export const calculateOrderTotal = (items) => {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((total, item) => {
    return total + (item.totalPrice || 0);
  }, 0);
};

/**
 * Get customer name from API response
 * @param {Object} user - User object from API
 * @returns {string} Customer name
 */
export const getCustomerName = (user) => {
  if (!user) return 'عميل مجهول';
  const name = user.name?.toString().trim();
  return name?.length ? name : 'عميل مجهول';
};

/**
 * Get customer phone from API response
 * @param {Object} user - User object from API
 * @returns {string} Customer phone
 */
export const getCustomerPhone = (user) => {
  if (!user) return null;
  return user.phoneNumber || null;
};

/**
 * Get delivery address from API response
 * @param {Object} deliveryAddress - Delivery address object from API
 * @returns {string} Formatted delivery address
 */
export const getDeliveryAddress = (deliveryAddress) => {
  if (!deliveryAddress) return null;
  
  const parts = [];
  if (deliveryAddress.street) parts.push(deliveryAddress.street);
  if (deliveryAddress.areaName) parts.push(deliveryAddress.areaName);
  if (deliveryAddress.notes) parts.push(`(${deliveryAddress.notes})`);
  
  return parts.length > 0 ? parts.join('، ') : null;
};

/**
 * Get items count from API response
 * @param {Array} items - Order items array from API
 * @returns {number} Total items count
 */
export const getItemsCount = (items) => {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((total, item) => {
    return total + (item.quantity || 0);
  }, 0);
};

/**
 * Get items summary for display
 * @param {Array} items - Order items array from API
 * @returns {string} Items summary
 */
export const getItemsSummary = (items) => {
  if (!items || !Array.isArray(items)) return '0 طبق';
  
  const uniqueDishes = items.map(item => item.dish?.name).filter(Boolean);
  const uniqueCount = [...new Set(uniqueDishes)].length;
  const totalQuantity = getItemsCount(items);
  
  return `${uniqueCount} طبق (${totalQuantity} قطعة)`;
};

/**
 * Check if order can be cancelled
 * @param {string} status - Current order status
 * @returns {boolean} Whether order can be cancelled
 */
export const canCancelOrder = (status) => {
  const cancellableStatuses = [
    ORDER_STATUS.PENDING,
    ORDER_STATUS.ACCEPTED,
    ORDER_STATUS.PREPARING
  ];
  return cancellableStatuses.includes(status);
};

/**
 * Check if order can be accepted
 * @param {string} status - Current order status
 * @returns {boolean} Whether order can be accepted
 */
export const canAcceptOrder = (status) => {
  return status === ORDER_STATUS.PENDING;
};

/**
 * Check if order can be prepared
 * @param {string} status - Current order status
 * @returns {boolean} Whether order can be prepared
 */
export const canPrepareOrder = (status) => {
  return status === ORDER_STATUS.ACCEPTED;
};

/**
 * Check if order can be marked as ready for pickup
 * @param {string} status - Current order status
 * @returns {boolean} Whether order can be marked as ready
 */
export const canMarkAsReady = (status) => {
  return status === ORDER_STATUS.PREPARING;
};

/**
 * Check if order can be assigned to driver
 * @param {string} status - Current order status
 * @returns {boolean} Whether order can be assigned to driver
 */
export const canAssignToDriver = (status) => {
  return status === ORDER_STATUS.READY_FOR_PICKUP;
};

/**
 * Check if order can be marked as picked up by driver
 * @param {string} status - Current order status
 * @returns {boolean} Whether order can be marked as picked up
 */
export const canMarkAsPickedUp = (status) => {
  return status === ORDER_STATUS.ASSIGNED_TO_DRIVER;
};

/**
 * Check if order can be marked as on the way
 * @param {string} status - Current order status
 * @returns {boolean} Whether order can be marked as on the way
 */
export const canMarkAsOnTheWay = (status) => {
  return status === ORDER_STATUS.PICKED_UP_BY_DRIVER;
};

/**
 * Check if order can be marked as delivered
 * @param {string} status - Current order status
 * @returns {boolean} Whether order can be marked as delivered
 */
export const canMarkAsDelivered = (status) => {
  return status === ORDER_STATUS.ON_THE_WAY;
};

/**
 * Format order date for display
 * @param {string|Date} date - Order date
 * @returns {string} Formatted date string
 */
export const formatOrderDate = (date) => {
  if (!date) return 'N/A';
  
  try {
    const orderDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - orderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'أمس';
    } else if (diffDays === 0) {
      return 'اليوم';
    } else if (diffDays < 7) {
      return `منذ ${diffDays} أيام`;
    } else {
      return orderDate.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  } catch (error) {
    return 'N/A';
  }
};

/**
 * Format order time for display
 * @param {string|Date} date - Order date
 * @returns {string} Formatted time string
 */
export const formatOrderTime = (date) => {
  if (!date) return 'N/A';
  
  try {
    const orderDate = new Date(date);
    return orderDate.toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    return 'N/A';
  }
};

/**
 * Transform API order data to component format
 * @param {Object} apiOrder - Order object from API
 * @returns {Object} Transformed order object
 */
export const transformApiOrder = (apiOrder) => {
  if (!apiOrder) return null;
  
  return {
    id: apiOrder._id || apiOrder.id,
    orderNumber: formatOrderNumber(apiOrder._id || apiOrder.id),
    status: apiOrder.status,
    items: apiOrder.items || [],
    totalAmount: apiOrder.totalAmount,
    subtotal: apiOrder.totalAmount - (apiOrder.deliveryFee || 0) - (apiOrder.discount || 0),
    tax: 0, // Not provided in API
    deliveryFee: apiOrder.deliveryFee,
    discount: apiOrder.discount,
    paymentMethod: apiOrder.paymentMethod,
    paymentStatus: apiOrder.paymentStatus,
    createdAt: apiOrder.createdAt,
    updatedAt: apiOrder.updatedAt,
    customerName: getCustomerName(apiOrder.user),
    customerPhone: getCustomerPhone(apiOrder.user),
    deliveryAddress: getDeliveryAddress(apiOrder.deliveryAddress),
    specialInstructions: apiOrder.customerNotes,
    itemsCount: apiOrder.itemsCount || getItemsCount(apiOrder.items),
    itemsSummary: getItemsSummary(apiOrder.items)
  };
};
