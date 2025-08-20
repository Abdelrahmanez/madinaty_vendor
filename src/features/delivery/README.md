# Delivery Management Feature

## Overview
This feature provides comprehensive driver management and order assignment capabilities for the restaurant delivery system.

## Features
- **Driver Management**: Add, remove, and manage restaurant drivers
- **Driver Filtering**: Search and filter drivers by availability, name, and phone number
- **Driver Selection**: Reusable component for assigning orders to drivers
- **Real-time Status**: Track driver availability and active orders
- **Phone Number Validation**: Egyptian phone number format validation

## API Endpoints

### Driver Management
- `POST /drivers/restaurant/add-driver-by-phone` - Add driver by phone number
- `POST /drivers/restaurant/remove-driver-by-phone` - Remove driver by phone number
- `GET /drivers/restaurant/drivers` - Get all restaurant drivers
- `GET /drivers/restaurant/available` - Get available drivers

## Components

### 1. DriverCard
Reusable card component for displaying driver information.

```jsx
import { DriverCard } from '../features/delivery';

<DriverCard
  driver={driverData}
  onPress={() => handleDriverPress(driver)}
  onRemove={() => handleRemoveDriver(driver)}
  showRemoveButton={true}
  showAssignButton={false}
  loading={false}
/>
```

**Props:**
- `driver` (Object): Driver data object
- `onPress` (Function): Callback when card is pressed
- `onRemove` (Function): Callback for remove action
- `onAssign` (Function): Callback for assign action
- `showRemoveButton` (Boolean): Show remove button
- `showAssignButton` (Boolean): Show assign button
- `loading` (Boolean): Loading state

### 2. DriverFilters
Modal component for filtering and searching drivers.

```jsx
import { DriverFilters } from '../features/delivery';

<DriverFilters
  filters={filters}
  onFiltersChange={handleFiltersChange}
  onClearFilters={handleClearFilters}
  visible={showFilters}
  onDismiss={() => setShowFilters(false)}
/>
```

**Props:**
- `filters` (Object): Current filter state
- `onFiltersChange` (Function): Filter change callback
- `onClearFilters` (Function): Clear filters callback
- `visible` (Boolean): Modal visibility
- `onDismiss` (Function): Modal dismiss callback

### 3. DriverSelectionModal
Modal for selecting drivers to assign orders.

```jsx
import { DriverSelectionModal } from '../features/delivery';

<DriverSelectionModal
  visible={showDriverSelection}
  onDismiss={() => setShowDriverSelection(false)}
  onDriverSelect={handleDriverSelect}
  orderId="12345"
  loading={false}
/>
```

**Props:**
- `visible` (Boolean): Modal visibility
- `onDismiss` (Function): Modal dismiss callback
- `onDriverSelect` (Function): Driver selection callback
- `orderId` (String): Order ID for assignment
- `loading` (Boolean): Loading state

## Screens

### DriversManagementScreen
Main screen for managing restaurant drivers.

**Features:**
- View all drivers with status indicators
- Add new drivers by phone number
- Remove existing drivers
- Filter and search drivers
- Real-time status updates

**Navigation:**
```jsx
navigation.navigate('DriversManagement');
```

## Hooks

### useDrivers
Custom hook for driver management operations.

```jsx
import { useDrivers } from '../features/delivery';

const {
  drivers,
  availableDrivers,
  loading,
  error,
  addDriver,
  removeDriver,
  fetchAllDrivers,
  fetchAvailableDrivers,
  refreshDrivers
} = useDrivers();
```

**Returns:**
- `drivers` (Array): All restaurant drivers
- `availableDrivers` (Array): Available drivers only
- `loading` (Boolean): Loading state
- `error` (String): Error message
- `addDriver` (Function): Add driver function
- `removeDriver` (Function): Remove driver function
- `fetchAllDrivers` (Function): Fetch all drivers
- `fetchAvailableDrivers` (Function): Fetch available drivers
- `refreshDrivers` (Function): Refresh drivers data

## Services

### driverService
Service class for API operations.

```jsx
import { driverService } from '../features/delivery';

// Add driver
await driverService.addDriverByPhone('01012345678');

// Remove driver
await driverService.removeDriverByPhone('01012345678');

// Get all drivers
const allDrivers = await driverService.getAllDrivers();

// Get available drivers
const availableDrivers = await driverService.getAvailableDrivers();
```

## Utilities

### driverFilterUtils
Utility functions for filtering and sorting drivers.

```jsx
import { 
  filterDrivers, 
  sortDrivers, 
  getDefaultFilters, 
  hasActiveFilters, 
  getFilterSummary 
} from '../features/delivery';

// Filter drivers
const filtered = filterDrivers(drivers, filters);

// Sort drivers
const sorted = sortDrivers(drivers, 'activeOrdersCount');

// Get default filters
const defaultFilters = getDefaultFilters();

// Check if filters are active
const hasFilters = hasActiveFilters(filters);

// Get filter summary
const summary = getFilterSummary(filters);
```

## Data Structures

### Driver Object
```javascript
{
  _id: "507f1f77bcf86cd799439011",
  name: "Ahmed Driver",
  phoneNumber: "01012345678",
  role: "driver",
  isWorking: true,
  isAvailable: true,
  activeOrdersCount: 2,
  currentRestaurant: "507f1f77bcf86cd799439012"
}
```

### Filter Object
```javascript
{
  availability: 'all', // 'all', 'available', 'unavailable', 'working'
  sortBy: 'activeOrdersCount', // 'activeOrdersCount', 'name', 'phoneNumber'
  searchText: ''
}
```

## Usage Examples

### 1. Basic Driver Management
```jsx
import React from 'react';
import { DriversManagementScreen } from '../features/delivery';

const MyComponent = () => {
  return <DriversManagementScreen />;
};
```

### 2. Driver Selection for Order Assignment
```jsx
import React, { useState } from 'react';
import { DriverSelectionModal } from '../features/delivery';

const OrderComponent = () => {
  const [showDriverSelection, setShowDriverSelection] = useState(false);

  const handleDriverSelect = (driver, orderId) => {
    console.log('Selected driver:', driver);
    console.log('For order:', orderId);
    // Handle order assignment
  };

  return (
    <>
      <Button onPress={() => setShowDriverSelection(true)}>
        Assign Driver
      </Button>
      
      <DriverSelectionModal
        visible={showDriverSelection}
        onDismiss={() => setShowDriverSelection(false)}
        onDriverSelect={handleDriverSelect}
        orderId="12345"
      />
    </>
  );
};
```

### 3. Custom Driver Filtering
```jsx
import React, { useState, useMemo } from 'react';
import { useDrivers, filterDrivers, sortDrivers } from '../features/delivery';

const CustomDriverList = () => {
  const { drivers } = useDrivers();
  const [filters, setFilters] = useState({
    availability: 'available',
    sortBy: 'name',
    searchText: ''
  });

  const filteredDrivers = useMemo(() => {
    const filtered = filterDrivers(drivers, filters);
    return sortDrivers(filtered, filters.sortBy);
  }, [drivers, filters]);

  return (
    <FlatList
      data={filteredDrivers}
      renderItem={({ item }) => <DriverCard driver={item} />}
    />
  );
};
```

## Error Handling

The feature includes comprehensive error handling:

1. **API Errors**: Network and server errors are caught and displayed
2. **Validation Errors**: Phone number format validation
3. **User Feedback**: Loading states and success/error messages
4. **Empty States**: Proper handling when no drivers are available

## Styling

All components follow the app's design system:
- Consistent with `OrderDetailsModal` styling
- Uses React Native Paper components
- Supports theme colors and dark/light modes
- Responsive design for different screen sizes

## Integration

### With Orders Feature
The delivery feature integrates with the orders system:
- Driver assignment during order processing
- Status updates for driver availability
- Order tracking and delivery management

### With Navigation
Integrated into the management navigation:
- Accessible from Management Dashboard
- Proper navigation flow and back button handling
- Screen transitions and modal presentations

## Future Enhancements

1. **Driver Tracking**: Real-time GPS tracking
2. **Performance Metrics**: Driver efficiency analytics
3. **Scheduling**: Driver shift management
4. **Notifications**: Push notifications for assignments
5. **Multi-language**: Additional language support
