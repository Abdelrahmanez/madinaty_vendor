/**
 * Custom Hook for Promocode Filters
 * --------------------------------------------
 * Hook لإدارة حالة فلاتر أكواد الخصم
 * 
 * Features:
 * - State management for filters
 * - Date picker state management
 * - Filter validation
 * - Performance optimization
 */

import { useState, useEffect, useCallback } from 'react';

// Default filter values
const DEFAULT_FILTERS = {
  status: 'all',
  type: 'all',
  appliesTo: 'all',
  searchText: '',
  startDate: null,
  endDate: null
};

/**
 * Custom hook for managing promocode filter state
 * @param {Object} initialFilters - Initial filter values
 * @returns {Object} Filter state and handlers
 */
export const usePromocodeFilters = (initialFilters = DEFAULT_FILTERS) => {
  const [localFilters, setLocalFilters] = useState(initialFilters);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Synchronize local filters with external filters
  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  // Update specific filter value
  const updateLocalFilters = useCallback((key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
    
    // Clear validation error for this field
    setValidationErrors(prev => ({ ...prev, [key]: null }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setLocalFilters(DEFAULT_FILTERS);
    setValidationErrors({});
  }, []);

  // Validate filters
  const validateFilters = useCallback((filters) => {
    const errors = {};

    // Validate date range
    if (filters.startDate && filters.endDate) {
      if (filters.startDate > filters.endDate) {
        errors.dateRange = 'تاريخ البداية يجب أن يكون قبل تاريخ النهاية';
      }
    }

    // Validate search text length
    if (filters.searchText && filters.searchText.length < 2) {
      errors.searchText = 'نص البحث يجب أن يكون على الأقل حرفين';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, []);

  // Get active filters count
  const getActiveFiltersCount = useCallback((filters) => {
    let count = 0;
    if (filters.status !== 'all') count++;
    if (filters.type !== 'all') count++;
    if (filters.appliesTo !== 'all') count++;
    if (filters.searchText) count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    return count;
  }, []);

  // Date picker handlers
  const openStartDatePicker = useCallback(() => {
    setShowStartDatePicker(true);
    setShowEndDatePicker(false);
  }, []);

  const openEndDatePicker = useCallback(() => {
    setShowEndDatePicker(true);
    setShowStartDatePicker(false);
  }, []);

  const closeDatePickers = useCallback(() => {
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
  }, []);

  // Handle date selection
  const handleDateChange = useCallback((dateType, selectedDate) => {
    if (selectedDate) {
      updateLocalFilters(dateType, selectedDate);
    }
    closeDatePickers();
  }, [updateLocalFilters, closeDatePickers]);

  return {
    // State
    localFilters,
    showStartDatePicker,
    showEndDatePicker,
    validationErrors,
    
    // Actions
    updateLocalFilters,
    clearFilters,
    validateFilters,
    getActiveFiltersCount,
    
    // Date picker handlers
    openStartDatePicker,
    openEndDatePicker,
    closeDatePickers,
    handleDateChange,
    
    // Constants
    DEFAULT_FILTERS
  };
};

export default usePromocodeFilters;
