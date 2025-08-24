/**
 * Filter Types for Promocodes
 * --------------------------------------------
 * أنواع البيانات لفلاتر أكواد الخصم
 * 
 * This file contains type definitions for better code documentation
 * and maintainability, even though this is a JavaScript project.
 */

/**
 * @typedef {Object} FilterValue
 * @property {string} value - The filter value
 * @property {string} label - The display label
 */

/**
 * @typedef {Object} FilterOptions
 * @property {FilterValue[]} status - Status filter options
 * @property {FilterValue[]} type - Type filter options
 * @property {FilterValue[]} appliesTo - Applies to filter options
 */

/**
 * @typedef {Object} PromocodeFilters
 * @property {string} status - Filter by status (all, active, inactive, expired, not_started, usage_limit_reached)
 * @property {string} type - Filter by type (all, percentage, fixed_amount, free_delivery)
 * @property {string} appliesTo - Filter by applies to (all, all_orders, specific_categories, specific_items)
 * @property {string} searchText - Search text for filtering
 * @property {Date|null} startDate - Start date for date range filter
 * @property {Date|null} endDate - End date for date range filter
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether the validation passed
 * @property {Object} errors - Validation error messages
 */

/**
 * @typedef {Object} FilterState
 * @property {PromocodeFilters} localFilters - Current local filter state
 * @property {boolean} showStartDatePicker - Whether start date picker is visible
 * @property {boolean} showEndDatePicker - Whether end date picker is visible
 * @property {Object} validationErrors - Current validation errors
 */

/**
 * @typedef {Object} FilterHandlers
 * @property {Function} updateLocalFilters - Update specific filter value
 * @property {Function} clearFilters - Clear all filters
 * @property {Function} validateFilters - Validate current filters
 * @property {Function} getActiveFiltersCount - Get count of active filters
 * @property {Function} openStartDatePicker - Open start date picker
 * @property {Function} openEndDatePicker - Open end date picker
 * @property {Function} closeDatePickers - Close all date pickers
 * @property {Function} handleDateChange - Handle date selection
 */

/**
 * @typedef {Object} FilterHookReturn
 * @property {FilterState} state - Filter state
 * @property {FilterHandlers} handlers - Filter handlers
 * @property {Object} constants - Filter constants
 */

/**
 * @typedef {Object} PromocodeFiltersProps
 * @property {PromocodeFilters} filters - Current filter values
 * @property {Function} onFiltersChange - Callback when filters change
 * @property {Function} onClearFilters - Callback when filters are cleared
 * @property {boolean} visible - Whether the modal is visible
 * @property {Function} onDismiss - Callback when modal is dismissed
 */

/**
 * @typedef {Object} FilterSectionProps
 * @property {string} title - Section title
 * @property {FilterValue[]} options - Filter options
 * @property {string} value - Current selected value
 * @property {Function} onValueChange - Callback when value changes
 * @property {Object} themedStyles - Themed styles object
 */

/**
 * @typedef {Object} DateRangeSectionProps
 * @property {Date|null} startDate - Start date
 * @property {Date|null} endDate - End date
 * @property {Function} onStartDatePress - Callback when start date is pressed
 * @property {Function} onEndDatePress - Callback when end date is pressed
 * @property {Object} themedStyles - Themed styles object
 */

/**
 * @typedef {Object} DatePickerModalProps
 * @property {boolean} visible - Whether the picker is visible
 * @property {string} title - Picker title
 * @property {Date|null} value - Current date value
 * @property {Function} onClose - Callback when picker is closed
 * @property {Function} onDateChange - Callback when date is selected
 * @property {Object} theme - Theme object
 */

/**
 * @typedef {Object} SearchSectionProps
 * @property {string} searchText - Current search text
 * @property {Function} onSearchChange - Callback when search text changes
 * @property {Object} themedStyles - Themed styles object
 */

/**
 * @typedef {Object} FilterButtonProps
 * @property {Function} onPress - Callback when button is pressed
 * @property {number} activeCount - Number of active filters
 * @property {Object} style - Button styles
 */

/**
 * @typedef {Object} FilterModalProps
 * @property {boolean} visible - Whether modal is visible
 * @property {Function} onDismiss - Callback when modal is dismissed
 * @property {React.ReactNode} children - Modal content
 * @property {React.ReactNode} footerContent - Modal footer content
 */

// Export types for documentation purposes
export const FilterTypes = {
  FilterValue: 'FilterValue',
  FilterOptions: 'FilterOptions',
  PromocodeFilters: 'PromocodeFilters',
  ValidationResult: 'ValidationResult',
  FilterState: 'FilterState',
  FilterHandlers: 'FilterHandlers',
  FilterHookReturn: 'FilterHookReturn',
  PromocodeFiltersProps: 'PromocodeFiltersProps',
  FilterSectionProps: 'FilterSectionProps',
  DateRangeSectionProps: 'DateRangeSectionProps',
  DatePickerModalProps: 'DatePickerModalProps',
  SearchSectionProps: 'SearchSectionProps',
  FilterButtonProps: 'FilterButtonProps',
  FilterModalProps: 'FilterModalProps'
};

export default FilterTypes;
