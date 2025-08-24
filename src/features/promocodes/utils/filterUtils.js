/**
 * Filter Utilities for Promocodes
 * --------------------------------------------
 * أدوات مساعدة لفلاتر أكواد الخصم
 * 
 * This file contains utility functions for filter operations
 * to improve code reusability and maintainability.
 */

import { DATE_FORMAT_CONFIG } from '../constants/filterConstants';

/**
 * Format date for display
 * @param {Date|null} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return 'غير محدد';
  
  try {
    return date.toLocaleDateString(
      DATE_FORMAT_CONFIG.locale, 
      DATE_FORMAT_CONFIG.options
    );
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'غير محدد';
  }
};

/**
 * Get active filters count
 * @param {Object} filters - Filter object
 * @returns {number} Number of active filters
 */
export const getActiveFiltersCount = (filters) => {
  if (!filters) return 0;
  
  let count = 0;
  const defaultValues = ['all', '', null, undefined];
  
  Object.values(filters).forEach(value => {
    if (!defaultValues.includes(value)) {
      count++;
    }
  });
  
  return count;
};

/**
 * Validate filter values
 * @param {Object} filters - Filter object to validate
 * @returns {Object} Validation result with errors
 */
export const validateFilters = (filters) => {
  const errors = {};

  // Validate date range
  if (filters.startDate && filters.endDate) {
    if (filters.startDate > filters.endDate) {
      errors.dateRange = 'تاريخ البداية يجب أن يكون قبل تاريخ النهاية';
    }
  }

  // Validate search text
  if (filters.searchText && filters.searchText.trim().length < 2) {
    errors.searchText = 'نص البحث يجب أن يكون على الأقل حرفين';
  }

  // Validate required fields
  if (!filters.status) {
    errors.status = 'حالة الكوبون مطلوبة';
  }

  if (!filters.type) {
    errors.type = 'نوع الكوبون مطلوب';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Apply filters to data
 * @param {Array} data - Data to filter
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered data
 */
export const applyFilters = (data, filters) => {
  if (!data || !Array.isArray(data)) return [];
  if (!filters) return data;

  return data.filter(item => {
    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (item.status !== filters.status) return false;
    }

    // Type filter
    if (filters.type && filters.type !== 'all') {
      if (item.type !== filters.type) return false;
    }

    // Applies to filter
    if (filters.appliesTo && filters.appliesTo !== 'all') {
      if (item.appliesTo !== filters.appliesTo) return false;
    }

    // Search text filter
    if (filters.searchText && filters.searchText.trim()) {
      const searchTerm = filters.searchText.toLowerCase();
      const searchableFields = [
        item.code,
        item.description,
        item.name
      ].filter(Boolean);

      const matches = searchableFields.some(field => 
        field.toLowerCase().includes(searchTerm)
      );
      
      if (!matches) return false;
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      const itemDate = new Date(item.createdAt || item.startDate);
      
      if (filters.startDate && itemDate < filters.startDate) {
        return false;
      }
      
      if (filters.endDate && itemDate > filters.endDate) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Reset filters to default values
 * @returns {Object} Default filter values
 */
export const resetFilters = () => ({
  status: 'all',
  type: 'all',
  appliesTo: 'all',
  searchText: '',
  startDate: null,
  endDate: null
});

/**
 * Check if filters are empty (all default values)
 * @param {Object} filters - Filter object to check
 * @returns {boolean} True if filters are empty
 */
export const isEmptyFilters = (filters) => {
  if (!filters) return true;
  
  const defaultValues = {
    status: 'all',
    type: 'all',
    appliesTo: 'all',
    searchText: '',
    startDate: null,
    endDate: null
  };

  return Object.keys(defaultValues).every(key => 
    filters[key] === defaultValues[key]
  );
};

/**
 * Get filter summary for display
 * @param {Object} filters - Filter object
 * @returns {string} Human-readable filter summary
 */
export const getFilterSummary = (filters) => {
  if (!filters || isEmptyFilters(filters)) {
    return 'لا توجد فلاتر مطبقة';
  }

  const summary = [];
  
  if (filters.status && filters.status !== 'all') {
    summary.push(`الحالة: ${filters.status}`);
  }
  
  if (filters.type && filters.type !== 'all') {
    summary.push(`النوع: ${filters.type}`);
  }
  
  if (filters.searchText) {
    summary.push(`البحث: ${filters.searchText}`);
  }
  
  if (filters.startDate || filters.endDate) {
    const dateRange = [];
    if (filters.startDate) dateRange.push(formatDate(filters.startDate));
    if (filters.endDate) dateRange.push(formatDate(filters.endDate));
    summary.push(`التاريخ: ${dateRange.join(' - ')}`);
  }

  return summary.join(' | ');
};

/**
 * Debounce function for search input
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
