/**
 * Driver Filter Utilities
 * --------------------------------------------
 * أدوات فلاتر السائقين
 */

/**
 * Filter drivers based on applied filters
 * @param {Array} drivers - Array of drivers to filter
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered drivers
 */
export const filterDrivers = (drivers, filters) => {
  if (!drivers || !Array.isArray(drivers)) {
    return [];
  }

  return drivers.filter(driver => {
    // Search text filter
    if (filters.searchText && filters.searchText.trim()) {
      const searchText = filters.searchText.toLowerCase().trim();
      const nameMatch = driver.name?.toLowerCase().includes(searchText);
      const phoneMatch = driver.phoneNumber?.includes(searchText);
      
      if (!nameMatch && !phoneMatch) {
        return false;
      }
    }

    // Availability filter
    if (filters.availability && filters.availability !== 'all') {
      switch (filters.availability) {
        case 'available':
          if (!driver.isAvailable) return false;
          break;
        case 'unavailable':
          if (driver.isAvailable) return false;
          break;
        case 'working':
          if (!driver.isWorking) return false;
          break;
      }
    }

    return true;
  });
};

/**
 * Sort drivers based on sort criteria
 * @param {Array} drivers - Array of drivers to sort
 * @param {string} sortBy - Sort criteria
 * @returns {Array} Sorted drivers
 */
export const sortDrivers = (drivers, sortBy) => {
  if (!drivers || !Array.isArray(drivers)) {
    return [];
  }

  const sortedDrivers = [...drivers];

  switch (sortBy) {
    case 'activeOrdersCount':
      return sortedDrivers.sort((a, b) => {
        const aCount = a.activeOrdersCount || 0;
        const bCount = b.activeOrdersCount || 0;
        return aCount - bCount; // Sort by ascending order count
      });
    
    case 'name':
      return sortedDrivers.sort((a, b) => {
        const aName = a.name || '';
        const bName = b.name || '';
        return aName.localeCompare(bName, 'ar');
      });
    
    case 'phoneNumber':
      return sortedDrivers.sort((a, b) => {
        const aPhone = a.phoneNumber || '';
        const bPhone = b.phoneNumber || '';
        return aPhone.localeCompare(bPhone);
      });
    
    default:
      return sortedDrivers;
  }
};

/**
 * Get default filter values
 * @returns {Object} Default filter object
 */
export const getDefaultFilters = () => ({
  availability: 'all',
  sortBy: 'activeOrdersCount',
  searchText: ''
});

/**
 * Check if any filters are active
 * @param {Object} filters - Filter object
 * @returns {boolean} True if any filters are active
 */
export const hasActiveFilters = (filters) => {
  return (
    filters.availability !== 'all' ||
    filters.sortBy !== 'activeOrdersCount' ||
    (filters.searchText && filters.searchText.trim())
  );
};

/**
 * Get filter summary text
 * @param {Object} filters - Filter object
 * @returns {string} Summary text
 */
export const getFilterSummary = (filters) => {
  const activeFilters = [];

  if (filters.availability !== 'all') {
    const availabilityLabels = {
      'available': 'متاح',
      'unavailable': 'غير متاح',
      'working': 'يعمل'
    };
    activeFilters.push(`الحالة: ${availabilityLabels[filters.availability]}`);
  }

  if (filters.sortBy !== 'activeOrdersCount') {
    const sortLabels = {
      'name': 'الاسم',
      'phoneNumber': 'رقم الهاتف'
    };
    activeFilters.push(`الترتيب: ${sortLabels[filters.sortBy]}`);
  }

  if (filters.searchText && filters.searchText.trim()) {
    activeFilters.push(`البحث: "${filters.searchText}"`);
  }

  return activeFilters.length > 0 ? activeFilters.join(' • ') : 'لا توجد فلاتر';
};

/**
 * Get driver status text
 * @param {Object} driver - Driver object
 * @returns {string} Status text
 */
export const getDriverStatus = (driver) => {
  if (driver.isAvailable) {
    return 'متاح';
  }
  if (driver.isWorking) {
    return 'يعمل';
  }
  return 'غير متاح';
};

/**
 * Get driver status color
 * @param {Object} driver - Driver object
 * @returns {string} Status color
 */
export const getDriverStatusColor = (driver) => {
  if (driver.isAvailable) {
    return '#4CAF50'; // Green
  }
  if (driver.isWorking) {
    return '#FF9800'; // Orange
  }
  return '#F44336'; // Red
};
