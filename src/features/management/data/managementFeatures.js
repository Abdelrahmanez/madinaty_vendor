/**
 * Management features configuration
 * Separates business logic from presentation components
 */

export const MANAGEMENT_FEATURES = [
  {
    id: 'restaurant',
    title: 'إدارة المطعم',
    icon: 'store',
    description: 'إدارة معلومات المطعم والإعدادات',
    color: '#00BCD4',
    route: 'RestaurantManagement'
  },
  {
    id: 'accounts',
    title: 'إدارة الحسابات',
    icon: 'account-group',
    description: 'إدارة حسابات المستخدمين',
    color: '#2196F3',
    route: 'AccountsManagement'
  },
  {
    id: 'promocodes',
    title: 'رموز الخصم',
    icon: 'ticket-percent',
    description: 'إدارة رموز الخصم والعروض الترويجية',
    color: '#4CAF50',
    route: 'PromoCodeManagement'
  },
  {
    id: 'delivery-zones',
    title: 'مناطق التوصيل',
    icon: 'map-marker-multiple',
    description: 'إدارة مناطق التوصيل والحدود',
    color: '#FF9800',
    route: 'DeliveryZonesManagement'
  },
  {
    id: 'delivery',
    title: 'إدارة التوصيل',
    icon: 'truck-delivery',
    description: 'إدارة شركاء التوصيل والطلبات',
    color: '#9C27B0',
    route: 'DeliveryManagement'
  },
  {
    id: 'financial-reports',
    title: 'التقارير المالية',
    icon: 'chart-line',
    description: 'عرض التقارير المالية والإحصائيات',
    color: '#F44336',
    route: 'FinancialReports'
  },
  {
    id: 'system-settings',
    title: 'إعدادات النظام',
    icon: 'cog',
    description: 'إعدادات النظام العامة',
    color: '#607D8B',
    route: 'SystemSettings'
  }
];

export const PROMO_CODE_FEATURES = [
  {
    id: 'add-promocode',
    title: 'إضافة رمز خصم',
    icon: 'plus-circle',
    description: 'إنشاء رمز خصم جديد',
    color: '#4CAF50',
    route: 'AddPromoCode'
  },
  {
    id: 'promocode-list',
    title: 'قائمة رموز الخصم',
    icon: 'format-list-bulleted',
    description: 'عرض وتعديل رموز الخصم الحالية',
    color: '#2196F3',
    route: 'PromoCodeList'
  }
];

export const DELIVERY_FEATURES = [
  {
    id: 'drivers-management',
    title: 'إدارة السائقين',
    icon: 'account-group',
    description: 'إضافة وإدارة سائقين المطعم',
    color: '#2196F3',
    route: 'DriversManagement'
  },
  {
    id: 'order-assignment',
    title: 'تخصيص الطلبات',
    icon: 'truck-delivery',
    description: 'تخصيص الطلبات للسائقين',
    color: '#4CAF50',
    route: 'OrderAssignment'
  }
];
