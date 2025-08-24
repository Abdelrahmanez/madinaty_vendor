/**
 * Filter Constants for Promocodes
 * --------------------------------------------
 * ثوابت فلاتر أكواد الخصم
 * 
 * This file contains all filter-related constants and options
 * to improve maintainability and reduce code duplication.
 */

import { PROMOCODE_TYPES } from '../../../utils/enums';

// Default filter values
export const DEFAULT_FILTERS = {
  status: 'all',
  type: 'all',
  appliesTo: 'all',
  searchText: '',
  startDate: null,
  endDate: null
};

// Filter options for different filter types
export const FILTER_OPTIONS = {
  status: [
    { value: 'all', label: 'الكل' },
    { value: 'active', label: 'مفعل' },
    { value: 'inactive', label: 'غير مفعل' },
    { value: 'expired', label: 'منتهي الصلاحية' },
    { value: 'not_started', label: 'لم يبدأ بعد' },
    { value: 'usage_limit_reached', label: 'تم استنفاذ الحد' }
  ],
  type: [
    { value: 'all', label: 'الكل' },
    { value: PROMOCODE_TYPES.PERCENTAGE, label: 'نسبة مئوية' },
    { value: PROMOCODE_TYPES.FIXED_AMOUNT, label: 'مبلغ ثابت' },
    { value: PROMOCODE_TYPES.FREE_DELIVERY, label: 'توصيل مجاني' }
  ],
  appliesTo: [
    { value: 'all', label: 'الكل' },
    { value: 'all_orders', label: 'جميع الطلبات' },
    { value: 'specific_categories', label: 'فئات محددة' },
    { value: 'specific_items', label: 'عناصر محددة' }
  ]
};

// Section titles with icons
export const SECTION_TITLES = {
  search: '🔍 البحث',
  status: '📊 الحالة',
  type: '🎫 نوع الخصم',
  appliesTo: '🎯 ينطبق على',
  dateRange: '📅 نطاق التاريخ'
};

// Date picker titles
export const DATE_PICKER_TITLES = {
  startDate: 'اختر تاريخ البداية',
  endDate: 'اختر تاريخ النهاية'
};

// Validation messages
export const VALIDATION_MESSAGES = {
  dateRange: 'تاريخ البداية يجب أن يكون قبل تاريخ النهاية',
  searchText: 'نص البحث يجب أن يكون على الأقل حرفين',
  required: 'هذا الحقل مطلوب'
};

// Search input configuration
export const SEARCH_CONFIG = {
  label: 'البحث في الكود أو الوصف',
  placeholder: 'اكتب للبحث...',
  minLength: 2,
  icon: 'magnify'
};

// Date format configuration
export const DATE_FORMAT_CONFIG = {
  locale: 'ar-EG',
  options: {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
};

// Filter button configuration
export const FILTER_BUTTON_CONFIG = {
  label: 'فلاتر',
  icon: 'filter-variant'
};

// Modal configuration
export const MODAL_CONFIG = {
  title: 'فلاتر أكواد الخصم',
  actionButtons: {
    clear: 'مسح الكل',
    apply: 'تطبيق الفلاتر'
  }
};
