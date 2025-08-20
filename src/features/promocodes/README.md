# Promocodes Feature

## Overview
The Promocodes feature provides a complete management system for restaurant promocodes, allowing restaurant owners to create, edit, delete, and manage discount codes for their customers.

## Features
- ✅ Create new promocodes with various discount types
- ✅ Edit existing promocodes
- ✅ Delete promocodes
- ✅ Toggle promocode activation status
- ✅ View detailed promocode information
- ✅ Support for multiple discount types (percentage, fixed amount, free delivery)
- ✅ Application scope (all orders, specific categories, specific items)
- ✅ Category and menu item selection
- ✅ Date range management
- ✅ Usage limits and per-user limits
- ✅ Real-time status tracking
- ✅ Advanced filtering and search capabilities

## Folder Structure
```
src/features/promocodes/
├── components/
│   ├── PromocodeCard.js          # Card component for displaying promocode info
│   ├── PromocodeForm.js          # Form component for creating/editing promocodes
│   └── PromocodeStatusBadge.js   # Status badge component
├── screens/
│   ├── PromocodesScreen.js       # Main list screen
│   ├── CreatePromocodeScreen.js  # Create new promocode screen
│   ├── EditPromocodeScreen.js    # Edit existing promocode screen
│   └── PromocodeDetailsScreen.js # Detailed view screen
├── services/
│   └── promocodesService.js      # API service for promocodes
├── hooks/
│   └── usePromocodes.js          # Custom hook for promocodes state management
└── index.js                      # Feature exports
```

## Components

### PromocodeCard
Displays promocode information in a card format with:
- Promocode code and description
- Type and value information
- Requirements (min order amount, max discount)
- Usage statistics
- Date range
- Status badge
- Action buttons (edit, delete, toggle status)

### PromocodeForm
Comprehensive form for creating and editing promocodes with:
- Code input (auto-uppercase)
- Description field
- Type selection (percentage, fixed amount, free delivery)
- Application scope selection (all orders, specific categories, specific items)
- Category selection (when scope is specific categories)
- Menu item selection (when scope is specific items)
- Value input (conditional based on type)
- Minimum order amount
- Maximum discount amount (for percentage type)
- Usage limits
- Per-user limits
- Date range pickers
- Active status toggle
- Form validation

### PromocodeStatusBadge
Displays the current status of a promocode with appropriate colors:
- Active/Inactive
- Expired
- Not started
- Usage limit reached

### MultiSelectField
Reusable component for multi-selection of categories and menu items:
- Modal-based selection interface
- Chip display for selected items
- Search and filter capabilities
- Loading states
- Error handling

### PromocodeFilters
Comprehensive filtering component with modal interface:
- Search by code or description
- Filter by status (active, inactive, expired, etc.)
- Filter by type (percentage, fixed amount, free delivery)
- Filter by application scope (all orders, specific categories, items)
- Date range filtering
- Filter summary display
- Clear all filters functionality

## Screens

### PromocodesScreen
Main screen displaying a list of all promocodes with:
- Pull-to-refresh functionality
- Empty state handling
- Advanced filtering and search capabilities
- Filter summary display
- FAB for quick creation
- Error handling

### CreatePromocodeScreen
Dedicated screen for creating new promocodes with full-screen form.

### EditPromocodeScreen
Dedicated screen for editing existing promocodes.

### PromocodeDetailsScreen
Detailed view of a promocode with comprehensive information organized in sections.

## Services

### promocodesService
Handles all API calls for promocodes:
- `getPromocodes(page, limit)` - Fetch promocodes list
- `createPromocode(data)` - Create new promocode
- `updatePromocode(id, data)` - Update existing promocode
- `deletePromocode(id)` - Delete promocode
- `togglePromocodeStatus(id, isActive)` - Toggle activation status

## Hooks

### usePromocodes
Custom hook providing:
- State management for promocodes
- Loading and error states
- Pagination handling
- CRUD operations
- Automatic data fetching

## Utilities

### filterUtils
Utility functions for promocode filtering:
- `filterPromocodes(promocodes, filters)` - Filter promocodes based on criteria
- `getPromocodeStatus(promocode)` - Get status string for a promocode
- `getDefaultFilters()` - Get default filter values
- `hasActiveFilters(filters)` - Check if any filters are active
- `getFilterSummary(filters)` - Get human-readable filter summary

## API Endpoints

The feature uses the following API endpoints:
- `GET /promo-codes/restaurant` - List promocodes
- `POST /promocodes/restaurant` - Create promocode
- `PUT /promocodes/restaurant/:id` - Update promocode
- `DELETE /promocodes/restaurant/:id` - Delete promocode
- `GET /categories?type=meal` - Get restaurant categories
- `GET /dishes` - Get restaurant menu items

## Usage

### Basic Usage
```javascript
import { PromocodesScreen } from '../features/promocodes';

// In your navigation
<Stack.Screen name="Promocodes" component={PromocodesScreen} />
```

### Using the Hook
```javascript
import usePromocodes from '../features/promocodes/hooks/usePromocodes';

const MyComponent = () => {
  const {
    promocodes,
    loading,
    error,
    createPromocode,
    updatePromocode,
    deletePromocode
  } = usePromocodes();

  // Use the hook methods
};
```

### Using Components
```javascript
import { PromocodeCard, PromocodeForm, PromocodeFilters } from '../features/promocodes';

// Display a promocode
<PromocodeCard 
  promocode={promocodeData}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onToggleStatus={handleToggleStatus}
/>

// Show form
<PromocodeForm
  initialData={editingData}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  loading={isLoading}
/>

// Show filters
<PromocodeFilters
  filters={filters}
  onFiltersChange={handleFiltersChange}
  onClearFilters={handleClearFilters}
  visible={showFilters}
  onDismiss={() => setShowFilters(false)}
/>
```

### Using Filter Utilities
```javascript
import { filterPromocodes, getDefaultFilters, hasActiveFilters } from '../features/promocodes/utils/filterUtils';

// Filter promocodes
const filteredPromocodes = filterPromocodes(promocodes, filters);

// Check if filters are active
const hasFilters = hasActiveFilters(filters);

// Get default filters
const defaultFilters = getDefaultFilters();
```

## Promocode Types

The feature supports three types of promocodes:

1. **Percentage** (`percentage`)
   - Discount as a percentage of order total
   - Optional maximum discount amount
   - Value range: 0-100%

2. **Fixed Amount** (`fixed_amount`)
   - Fixed discount amount
   - Value in currency units

3. **Free Delivery** (`free_delivery`)
   - Waives delivery fees
   - No value field required

## Application Scopes

The feature supports three application scopes:

1. **All Orders** (`all_orders`)
   - Applies to all orders regardless of content

2. **Specific Categories** (`specific_categories`)
   - Applies only to orders containing items from selected categories
   - Requires category selection

3. **Specific Items** (`specific_items`)
   - Applies only to orders containing selected menu items
   - Requires menu item selection

## Validation Rules

- Code must be at least 3 characters
- Description is required
- Value must be positive
- Percentage values cannot exceed 100%
- Minimum order amount is required
- End date must be after start date
- Per-user limit must be at least 1
- When scope is specific categories, at least one category must be selected
- When scope is specific items, at least one menu item must be selected
- Usage limit is required and must be greater than 0

## Styling

The feature uses React Native Paper components and follows the app's theme system:
- Consistent with app design language
- RTL support for Arabic
- Responsive design
- Accessibility considerations

## Error Handling

- Network error handling
- Validation error display
- User-friendly error messages
- Loading states
- Retry mechanisms

## Future Enhancements

- Bulk operations
- Promocode templates
- Analytics and reporting
- Integration with marketing campaigns
- Customer usage tracking
- Export filtered results
- Filter presets and saved searches
