/**
 * Enums for the application
 * -----------------------------
 * هذا الملف يحتوي على القيم الثابتة المستخدمة في التطبيق
 * Updated to match backend structure
 */

// User roles - Updated to match backend
export const USER_ROLES = {
  CUSTOMER: 'customer',
  RESTAURANT: 'restaurant',
  DELIVERY_PARTNER: 'delivery_partner',
  DRIVER: 'driver',
  ADMIN: 'admin'
};

// Order statuses - Updated to match backend
export const ORDER_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  READY_FOR_PICKUP: 'ready_for_pickup',
  ASSIGNED_TO_DRIVER: 'assigned_to_driver',
  PICKED_UP_BY_DRIVER: 'picked_up_by_driver',
  ON_THE_WAY: 'on_the_way',
  DELIVERED: 'delivered',
  CANCELLED_BY_CUSTOMER: 'cancelled_by_customer',
  CANCELLED_BY_RESTAURANT: 'cancelled_by_restaurant',
  CANCELLED_BY_ADMIN: 'cancelled_by_admin',
  CUSTOMER_UNREACHABLE: 'customer_unreachable'
};

// Order status labels in Arabic
export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'في الانتظار',
  [ORDER_STATUS.PREPARING]: 'قيد التحضير',
  [ORDER_STATUS.READY_FOR_PICKUP]: 'جاهز للاستلام',
  [ORDER_STATUS.ASSIGNED_TO_DRIVER]: 'تم تعيين سائق',
  [ORDER_STATUS.PICKED_UP_BY_DRIVER]: 'تم الاستلام من السائق',
  [ORDER_STATUS.ON_THE_WAY]: 'في الطريق',
  [ORDER_STATUS.DELIVERED]: 'تم التوصيل',
  [ORDER_STATUS.CANCELLED_BY_CUSTOMER]: 'ملغي من العميل',
  [ORDER_STATUS.CANCELLED_BY_RESTAURANT]: 'ملغي من المطعم',
  [ORDER_STATUS.CANCELLED_BY_ADMIN]: 'ملغي من الإدارة',
  [ORDER_STATUS.CUSTOMER_UNREACHABLE]: 'العميل غير متاح'
};

// Order status colors
export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: '#FFA726',      // Orange
  [ORDER_STATUS.PREPARING]: '#7E57C2',    // Purple
  [ORDER_STATUS.READY_FOR_PICKUP]: '#66BB6A', // Green
  [ORDER_STATUS.ASSIGNED_TO_DRIVER]: '#26A69A', // Teal
  [ORDER_STATUS.PICKED_UP_BY_DRIVER]: '#8B5CF6', // Violet
  [ORDER_STATUS.ON_THE_WAY]: '#3B82F6',   // Blue
  [ORDER_STATUS.DELIVERED]: '#4CAF50',    // Green
  [ORDER_STATUS.CANCELLED_BY_CUSTOMER]: '#FF5722', // Deep Orange
  [ORDER_STATUS.CANCELLED_BY_RESTAURANT]: '#EF5350', // Red
  [ORDER_STATUS.CANCELLED_BY_ADMIN]: '#D32F2F', // Dark Red
  [ORDER_STATUS.CUSTOMER_UNREACHABLE]: '#FF9800' // Orange
};

// Payment methods - Updated to match backend
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  WALLET: 'wallet'
};

// Payment method labels in Arabic
export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CASH]: 'نقداً',
  [PAYMENT_METHODS.CARD]: 'بطاقة ائتمان',
  [PAYMENT_METHODS.WALLET]: 'المحفظة الإلكترونية'
};

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Payment status labels in Arabic
export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: 'في الانتظار',
  [PAYMENT_STATUS.PAID]: 'مدفوع',
  [PAYMENT_STATUS.FAILED]: 'فشل',
  [PAYMENT_STATUS.REFUNDED]: 'مسترد'
};

// Restaurant status - Updated to match backend
export const RESTAURANT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  TEMPORARILY_CLOSED: 'temporarily_closed'
};

// Restaurant status labels in Arabic
export const RESTAURANT_STATUS_LABELS = {
  [RESTAURANT_STATUS.ACTIVE]: 'نشط',
  [RESTAURANT_STATUS.INACTIVE]: 'غير نشط',
  [RESTAURANT_STATUS.TEMPORARILY_CLOSED]: 'مغلق مؤقتاً'
};

// Category types - Updated to match backend
export const CATEGORY_TYPES = {
  RESTAURANT: 'restaurant',
  MEAL: 'meal'
};

// Category type labels in Arabic
export const CATEGORY_TYPE_LABELS = {
  [CATEGORY_TYPES.RESTAURANT]: 'مطعم',
  [CATEGORY_TYPES.MEAL]: 'وجبة'
};

// Offer types - Updated to match backend
export const OFFER_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED_AMOUNT: 'fixed_amount',
  FREE_DELIVERY: 'free_delivery'
};

// Offer application types - Updated to match backend
export const OFFER_APPLICATION_TYPES = {
  ALL_ORDERS: 'all_orders',
  SPECIFIC_RESTAURANTS: 'specific_restaurants',
  SPECIFIC_CATEGORIES: 'specific_categories',
  SPECIFIC_ITEMS: 'specific_items'
};

// Vehicle types - Updated to match backend
export const VEHICLE_TYPES = {
  MOTORCYCLE: 'motorcycle',
  BIKE: 'bike',
  OTHER: 'other'
};

// Vehicle type labels in Arabic
export const VEHICLE_TYPE_LABELS = {
  [VEHICLE_TYPES.MOTORCYCLE]: 'دراجة نارية',
  [VEHICLE_TYPES.BIKE]: 'دراجة',
  [VEHICLE_TYPES.OTHER]: 'أخرى'
};

// Unit types - Updated to match backend
export const UNIT_TYPES = {
  PIECE: 'piece',
  KG: 'kg',
  LITER: 'liter',
  PORTION: 'portion',
  OTHER: 'other'
};

// Unit type labels in Arabic
export const UNIT_TYPE_LABELS = {
  [UNIT_TYPES.PIECE]: 'قطعة',
  [UNIT_TYPES.KG]: 'كيلوغرام',
  [UNIT_TYPES.LITER]: 'لتر',
  [UNIT_TYPES.PORTION]: 'حصة',
  [UNIT_TYPES.OTHER]: 'أخرى'
};

// Transaction types - Updated to match backend
export const TRANSACTION_TYPES = {
  PAYOUT: 'payout',
  CHARGE: 'charge'
};

// Transaction statuses - Updated to match backend
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// Payout methods - Updated to match backend
export const PAYOUT_METHODS = {
  BANK_TRANSFER: 'bank_transfer',
  PAYPAL: 'paypal',
  WALLET: 'wallet'
};

// Account statuses - Updated to match backend
export const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  CLOSED: 'closed'
};

// Account status labels in Arabic
export const ACCOUNT_STATUS_LABELS = {
  [ACCOUNT_STATUS.ACTIVE]: 'نشط',
  [ACCOUNT_STATUS.SUSPENDED]: 'معلق',
  [ACCOUNT_STATUS.CLOSED]: 'مغلق'
};

// Legacy enums for backward compatibility
export const OrderStatus = ORDER_STATUS;
export const PaymentMethod = PAYMENT_METHODS;
export const PaymentStatus = PAYMENT_STATUS;

// Date filter periods
export const DateFilterPeriod = {
  TODAY: 'today',
  LAST_WEEK: 'last_week',
  LAST_MONTH: 'last_month',
  LAST_3_MONTHS: 'last_3_months',
  LAST_YEAR: 'last_year',
  CUSTOM: 'custom',
};

// Order sort options
export const OrderSortOption = {
  DATE_DESC: 'date_desc',
  DATE_ASC: 'date_asc',
  PRICE_DESC: 'price_desc',
  PRICE_ASC: 'price_asc',
};

// Order tab categories
export const OrderTabCategory = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELED: 'canceled',
};

// Restaurant categories
export const RestaurantCategory = {
  FAST_FOOD: 'fast_food',
  FINE_DINING: 'fine_dining',
  CASUAL_DINING: 'casual_dining',
  CAFE: 'cafe',
  BAKERY: 'bakery',
};

// Notification types
export const NotificationType = {
  ORDER_STATUS: 'order_status',
  PROMOTION: 'promotion',
  SYSTEM: 'system',
};

// UI defaults
export const UIDefaults = {
  ITEMS_PER_PAGE: 10,
  MAX_DESCRIPTION_LENGTH: 100,
  DEBOUNCE_DELAY: 300,
};

// Order types
export const OrderType = {
  DELIVERY: 'delivery',
  PICKUP: 'pickup',
};

// Rating levels
export const RatingLevel = {
  EXCELLENT: 5,
  VERY_GOOD: 4,
  GOOD: 3,
  FAIR: 2,
  POOR: 1,
};

// Entity types - Updated to match backend
export const ENTITY_TYPES = {
  RESTAURANT: 'Restaurant',
  DELIVERY_PARTNER: 'DeliveryPartner'
};

// GeoJSON types - Updated to match backend
export const GEOJSON_TYPES = {
  POINT: 'Point'
}; 