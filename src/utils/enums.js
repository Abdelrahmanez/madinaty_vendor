/**
 * Enums for the application
 * -----------------------------
 * هذا الملف يحتوي على القيم الثابتة المستخدمة في التطبيق
 */

// حالات الطلب
export const OrderStatus = {
  PENDING: 'pending',           // معلق (في انتظار الموافقة)
  PROCESSING: 'processing',     // قيد التحضير
  READY: 'ready',               // جاهز للتسليم
  ON_DELIVERY: 'on_delivery',   // قيد التوصيل
  DELIVERED: 'delivered',       // تم التسليم
  CANCELED: 'canceled',         // ملغي
  REJECTED: 'rejected',         // مرفوض
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  WALLET: 'wallet'
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CASH]: 'نقداً',
  [PAYMENT_METHODS.CARD]: 'بطاقة ائتمان',
  [PAYMENT_METHODS.WALLET]: 'المحفظة الإلكترونية'
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  ON_THE_WAY: 'on_the_way',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'في الانتظار',
  [ORDER_STATUS.CONFIRMED]: 'تم التأكيد',
  [ORDER_STATUS.PREPARING]: 'قيد التحضير',
  [ORDER_STATUS.READY]: 'جاهز',
  [ORDER_STATUS.ON_THE_WAY]: 'في الطريق',
  [ORDER_STATUS.DELIVERED]: 'تم التوصيل',
  [ORDER_STATUS.CANCELLED]: 'ملغي'
};

export const CategoryType = {
  MEAL: 'meal',
  RESTAURANT: 'restaurant',
  ALL: '',
};

// طرق الدفع
export const PaymentMethod = {
  CASH: 'cash',                 // الدفع نقداً
  CREDIT_CARD: 'credit_card',   // بطاقة ائتمان
  WALLET: 'wallet',             // محفظة إلكترونية
};

// حالات الدفع
export const PaymentStatus = {
  PENDING: 'pending',           // معلق
  COMPLETED: 'completed',       // مكتمل
  FAILED: 'failed',             // فشل
  REFUNDED: 'refunded',         // مسترد
};

// فترات تاريخية للتصفية
export const DateFilterPeriod = {
  TODAY: 'today',               // اليوم
  LAST_WEEK: 'last_week',       // الأسبوع الماضي
  LAST_MONTH: 'last_month',     // الشهر الماضي
  LAST_3_MONTHS: 'last_3_months', // آخر 3 أشهر
  LAST_YEAR: 'last_year',       // السنة الماضية
  CUSTOM: 'custom',             // فترة مخصصة
};

// خيارات الفرز للطلبات
export const OrderSortOption = {
  DATE_DESC: 'date_desc',       // الأحدث أولاً
  DATE_ASC: 'date_asc',         // الأقدم أولاً
  PRICE_DESC: 'price_desc',     // السعر: من الأعلى إلى الأقل
  PRICE_ASC: 'price_asc',       // السعر: من الأقل إلى الأعلى
};

// تصنيفات الطلبات للعرض
export const OrderTabCategory = {
  ALL: 'all',                   // جميع الطلبات
  ACTIVE: 'active',             // الطلبات النشطة
  COMPLETED: 'completed',       // الطلبات المكتملة
  CANCELED: 'canceled',         // الطلبات الملغاة
};

// أنواع المطاعم
export const RestaurantCategory = {
  FAST_FOOD: 'fast_food',       // وجبات سريعة
  FINE_DINING: 'fine_dining',   // مطاعم فاخرة
  CASUAL_DINING: 'casual_dining', // مطاعم عادية
  CAFE: 'cafe',                 // كافيه
  BAKERY: 'bakery',             // مخبز
};

// أنواع الإشعارات
export const NotificationType = {
  ORDER_STATUS: 'order_status',         // تحديث حالة الطلب
  PROMOTION: 'promotion',               // عروض وتخفيضات
  SYSTEM: 'system',                     // إشعارات النظام
};

// شفرات الألوان للحالات المختلفة
export const StatusColors = {
  [OrderStatus.PENDING]: '#F59E0B',      // أصفر داكن
  [OrderStatus.PROCESSING]: '#3B82F6',   // أزرق
  [OrderStatus.READY]: '#10B981',        // أخضر فاتح
  [OrderStatus.ON_DELIVERY]: '#8B5CF6',  // بنفسجي
  [OrderStatus.DELIVERED]: '#059669',    // أخضر داكن
  [OrderStatus.CANCELED]: '#EF4444',     // أحمر
  [OrderStatus.REJECTED]: '#991B1B',     // أحمر داكن
};

// القيم الافتراضية لعناصر الواجهة
export const UIDefaults = {
  ITEMS_PER_PAGE: 10,           // عدد العناصر في الصفحة
  MAX_DESCRIPTION_LENGTH: 100,  // الحد الأقصى لطول الوصف
  DEBOUNCE_DELAY: 300,          // تأخير البحث (مللي ثانية)
};

// أنواع الطلبات
export const OrderType = {
  DELIVERY: 'delivery',         // توصيل
  PICKUP: 'pickup',             // استلام من المطعم
};

// حالات التقييمات
export const RatingLevel = {
  EXCELLENT: 5,                 // ممتاز
  VERY_GOOD: 4,                 // جيد جدا
  GOOD: 3,                      // جيد
  FAIR: 2,                      // مقبول
  POOR: 1,                      // سيء
}; 