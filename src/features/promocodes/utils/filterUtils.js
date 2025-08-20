/**
 * Promocode Filter Utilities
 * --------------------------------------------
 * أدوات فلاتر أكواد الخصم
 */

/**
 * Filter promocodes based on applied filters
 * @param {Array} promocodes - Array of promocodes to filter
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered promocodes
 */
export const filterPromocodes = (promocodes, filters) => {
  if (!promocodes || !Array.isArray(promocodes)) {
    return [];
  }

  return promocodes.filter(promocode => {
    // Search text filter
    if (filters.searchText && filters.searchText.trim()) {
      const searchText = filters.searchText.toLowerCase().trim();
      const codeMatch = promocode.code?.toLowerCase().includes(searchText);
      const descriptionMatch = promocode.description?.toLowerCase().includes(searchText);
      
      if (!codeMatch && !descriptionMatch) {
        return false;
      }
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      const status = getPromocodeStatus(promocode);
      if (status !== filters.status) {
        return false;
      }
    }

    // Type filter
    if (filters.type && filters.type !== 'all') {
      if (promocode.type !== filters.type) {
        return false;
      }
    }

    // Applies to filter
    if (filters.appliesTo && filters.appliesTo !== 'all') {
      if (promocode.appliesTo !== filters.appliesTo) {
        return false;
      }
    }

    // Date range filter
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      const promocodeStartDate = new Date(promocode.startDate);
      if (promocodeStartDate < startDate) {
        return false;
      }
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      const promocodeEndDate = new Date(promocode.endDate);
      if (promocodeEndDate > endDate) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Get the status of a promocode based on its properties
 * @param {Object} promocode - Promocode object
 * @returns {string} Status string
 */
export const getPromocodeStatus = (promocode) => {
  if (!promocode.isActive) {
    return 'inactive';
  }

  if (promocode.hasExpired) {
    return 'expired';
  }

  if (!promocode.hasStarted) {
    return 'not_started';
  }

  if (promocode.usageLimitReached) {
    return 'usage_limit_reached';
  }

  return 'active';
};

/**
 * Get default filter values
 * @returns {Object} Default filter object
 */
export const getDefaultFilters = () => ({
  status: 'all',
  type: 'all',
  appliesTo: 'all',
  searchText: '',
  startDate: null,
  endDate: null
});

/**
 * Check if any filters are active
 * @param {Object} filters - Filter object
 * @returns {boolean} True if any filters are active
 */
export const hasActiveFilters = (filters) => {
  return (
    filters.status !== 'all' ||
    filters.type !== 'all' ||
    filters.appliesTo !== 'all' ||
    (filters.searchText && filters.searchText.trim()) ||
    filters.startDate ||
    filters.endDate
  );
};

/**
 * Get filter summary text
 * @param {Object} filters - Filter object
 * @returns {string} Summary text
 */
export const getFilterSummary = (filters) => {
  const activeFilters = [];

  if (filters.status !== 'all') {
    const statusLabels = {
      'active': 'مفعل',
      'inactive': 'غير مفعل',
      'expired': 'منتهي الصلاحية',
      'not_started': 'لم يبدأ بعد',
      'usage_limit_reached': 'تم استنفاذ الحد'
    };
    activeFilters.push(`الحالة: ${statusLabels[filters.status]}`);
  }

  if (filters.type !== 'all') {
    const typeLabels = {
      'percentage': 'نسبة مئوية',
      'fixed_amount': 'مبلغ ثابت',
      'free_delivery': 'توصيل مجاني'
    };
    activeFilters.push(`النوع: ${typeLabels[filters.type]}`);
  }

  if (filters.appliesTo !== 'all') {
    const appliesToLabels = {
      'all_orders': 'جميع الطلبات',
      'specific_categories': 'فئات محددة',
      'specific_items': 'عناصر محددة'
    };
    activeFilters.push(`ينطبق على: ${appliesToLabels[filters.appliesTo]}`);
  }

  if (filters.searchText && filters.searchText.trim()) {
    activeFilters.push(`البحث: "${filters.searchText}"`);
  }

  if (filters.startDate || filters.endDate) {
    const startDate = filters.startDate ? new Date(filters.startDate).toLocaleDateString('ar-EG') : 'غير محدد';
    const endDate = filters.endDate ? new Date(filters.endDate).toLocaleDateString('ar-EG') : 'غير محدد';
    activeFilters.push(`التاريخ: ${startDate} - ${endDate}`);
  }

  return activeFilters.length > 0 ? activeFilters.join(' • ') : 'لا توجد فلاتر';
};
