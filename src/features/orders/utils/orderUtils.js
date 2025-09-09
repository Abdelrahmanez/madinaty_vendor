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
  
  // Try different possible field names for customer name
  const name = user.name || user.customerName || user.fullName || user.firstName;
  const trimmedName = name?.toString().trim();
  
  return trimmedName?.length ? trimmedName : 'عميل مجهول';
};

/**
 * Get customer phone from API response
 * @param {Object} user - User object from API
 * @returns {string} Customer phone
 */
export const getCustomerPhone = (user) => {
  if (!user) return null;
  
  // Try different possible field names for phone number
  return user.phoneNumber || user.phone || user.mobileNumber || user.contactNumber || null;
};

/**
 * Get delivery address from API response
 * @param {Object} deliveryAddress - Delivery address object from API
 * @returns {string} Formatted delivery address
 */
export const getDeliveryAddress = (deliveryAddress) => {
  if (!deliveryAddress) return null;
  
  // Handle case where deliveryAddress is already a string
  if (typeof deliveryAddress === 'string') {
    return deliveryAddress;
  }
  
  const parts = [];
  
  // Add street if available
  if (deliveryAddress.street && typeof deliveryAddress.street === 'string') {
    parts.push(deliveryAddress.street.trim());
  }
  
  // Add area name if available
  if (deliveryAddress.areaName && typeof deliveryAddress.areaName === 'string') {
    parts.push(deliveryAddress.areaName.trim());
  }
  
  // Add area if areaName is not available but area exists (fallback)
  if (!deliveryAddress.areaName && deliveryAddress.area && typeof deliveryAddress.area === 'string') {
    parts.push(deliveryAddress.area.trim());
  }
  
  // Add notes in parentheses if available
  if (deliveryAddress.notes && typeof deliveryAddress.notes === 'string') {
    const notes = deliveryAddress.notes.trim();
    if (notes) {
      parts.push(`(${notes})`);
    }
  }
    
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
 * Normalize incoming (socket) order payload to match API shape as much as possible
 * This prevents UI from seeing placeholder values by ensuring consistent field names.
 * @param {Object} incoming - Raw order from socket
 * @returns {Object} normalized order
 */
export const normalizeIncomingOrder = (incoming) => {
  if (!incoming) return incoming;

  // Prefer API-like keys; fallback to alternative names if present
  const id = incoming._id || incoming.id || incoming.orderId;
  const user = incoming.user || incoming.customer || null;
  const items = Array.isArray(incoming.items) ? incoming.items : [];
  const totalAmount =
    incoming.totalAmount !== undefined ? incoming.totalAmount :
    incoming.total !== undefined ? incoming.total : 0;
  const deliveryFee = incoming.deliveryFee ?? 0;
  const discount = incoming.discount ?? 0;
  const paymentMethod = incoming.paymentMethod ?? incoming.payment_type;
  const paymentStatus = incoming.paymentStatus ?? incoming.payment_status;
  const createdAt = incoming.createdAt || incoming.created_at || incoming.date;
  const updatedAt = incoming.updatedAt || incoming.updated_at || incoming.date;
  const deliveryAddress = incoming.deliveryAddress || incoming.address || incoming.delivery_address;
  const status = incoming.status || incoming.orderStatus || incoming.state;
  const customerNotes = incoming.customerNotes || incoming.notes || incoming.specialInstructions;

  return {
    ...incoming,
    _id: id, // keep _id for API parity while preserving original fields above
    user,
    items,
    totalAmount,
    deliveryFee,
    discount,
    paymentMethod,
    paymentStatus,
    createdAt,
    updatedAt,
    deliveryAddress,
    status,
    customerNotes,
  };
};

/**
 * Check if order can be cancelled
 * @param {string} status - Current order status
 * @returns {boolean} Whether order can be cancelled
 */
export const canCancelOrder = (status) => {
  const cancellableStatuses = [
    ORDER_STATUS.PENDING,
    ORDER_STATUS.PREPARING
  ];
  return cancellableStatuses.includes(status);
};

/**
 * Check if order can be prepared (start preparing)
 * @param {string} status - Current order status
 * @returns {boolean} Whether order can be prepared
 */
export const canPrepareOrder = (status) => {
  return status === ORDER_STATUS.PENDING;
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
  
  // Handle different user data structures (user vs customer)
  const userData = apiOrder.user || apiOrder.customer;
  
  return {
    id: apiOrder._id || apiOrder.id,
    orderNumber: formatOrderNumber(apiOrder._id || apiOrder.id),
    status: apiOrder.status,
    items: apiOrder.items || [],
    totalAmount: apiOrder.totalAmount || apiOrder.total || 0,
    subtotal: (apiOrder.totalAmount || apiOrder.total || 0) - (apiOrder.deliveryFee || 0) - (apiOrder.discount || 0),
    tax: 0, // Not provided in API
    deliveryFee: apiOrder.deliveryFee || 0,
    discount: apiOrder.discount || 0,
    paymentMethod: apiOrder.paymentMethod,
    paymentStatus: apiOrder.paymentStatus,
    createdAt: apiOrder.createdAt,
    updatedAt: apiOrder.updatedAt,
    customerName: getCustomerName(userData),
    customerPhone: getCustomerPhone(userData),
    deliveryAddress: getDeliveryAddress(apiOrder.deliveryAddress),
    specialInstructions: apiOrder.customerNotes || apiOrder.notes || apiOrder.specialInstructions,
    itemsCount: apiOrder.itemsCount || getItemsCount(apiOrder.items),
    itemsSummary: getItemsSummary(apiOrder.items)
  };
};

/**
 * Safely get order id from any order object
 * @param {Object} order - Order object (API or socket)
 * @returns {string|null}
 */
export const getOrderId = (order) => {
  if (!order) return null;
  return order.id || order._id || order.orderId || null;
};
