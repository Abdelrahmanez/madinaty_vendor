# Management Feature

This directory contains the refactored management feature following SOLID principles and clean architecture.

## Structure

```
src/features/management/
├── components/           # Reusable UI components
│   ├── ManagementUnlockScreen.js
│   ├── ManagementDashboard.js
│   ├── ManagementFeatureCard.js
│   ├── FeatureGridScreen.js
│   ├── FinancialMetricCard.js
│   └── FinancialSummaryCard.js
├── screens/             # Screen components
│   ├── PromoCodeManagementScreen.js
│   ├── DeliveryManagementScreen.js
│   ├── PlaceholderScreen.js
│   └── FinancialReportsScreen.js
├── hooks/               # Custom hooks
│   └── useFinancialReports.js
├── api/                 # API services
│   └── financialReports.js
├── data/               # Business logic and configuration
│   └── managementFeatures.js
├── index.js            # Feature exports
└── README.md           # This file
```

## Components

### ManagementUnlockScreen
- **Responsibility**: Handles PIN verification for management access
- **Props**: None
- **Dependencies**: `useManagementStore`, `verifyFinancialPinRequest`

### ManagementDashboard
- **Responsibility**: Main dashboard with management features grid
- **Props**: `navigation`
- **Dependencies**: `ManagementFeatureCard`, `MANAGEMENT_FEATURES`

### ManagementFeatureCard
- **Responsibility**: Reusable card component for management features
- **Props**: `title`, `description`, `icon`, `color`, `onPress`
- **Dependencies**: None

### FeatureGridScreen
- **Responsibility**: Reusable screen for feature grids
- **Props**: `title`, `subtitle`, `features`, `navigation`
- **Dependencies**: `ManagementFeatureCard`

### FinancialMetricCard
- **Responsibility**: Displays financial metrics with currency formatting
- **Props**: `title`, `value`, `subtitle`, `icon`, `color`, `isLoading`
- **Dependencies**: None

### FinancialSummaryCard
- **Responsibility**: Displays account summary information
- **Props**: `title`, `data`, `isLoading`
- **Dependencies**: None

## Data

### managementFeatures.js
Contains all feature configurations separated from UI components:
- `MANAGEMENT_FEATURES`: Main dashboard features
- `PROMO_CODE_FEATURES`: Promocode management features
- `DELIVERY_FEATURES`: Delivery management features

## Hooks

### useFinancialReports
- **Responsibility**: Manages financial data fetching and state
- **Returns**: `{ financialData, balanceData, loading, error, refreshData }`
- **Dependencies**: `getVendorFinancialData`, `getRestaurantBalance`

## API Services

### financialReports.js
- `getVendorFinancialData(restaurantId)`: Fetches vendor financial data
- `getRestaurantBalance(restaurantId)`: Fetches restaurant balance data

## SOLID Principles Applied

### Single Responsibility Principle (SRP)
- Each component has a single, well-defined responsibility
- Business logic separated from presentation logic
- Data configuration separated from components

### Open/Closed Principle (OCP)
- Components are open for extension (via props) but closed for modification
- New features can be added by extending the data configuration

### Liskov Substitution Principle (LSP)
- All feature cards can be used interchangeably
- Placeholder screens can be substituted with actual implementations

### Interface Segregation Principle (ISP)
- Components receive only the props they need
- No unnecessary dependencies

### Dependency Inversion Principle (DIP)
- Components depend on abstractions (props) rather than concrete implementations
- Data flows from configuration to components

## Benefits

1. **Maintainability**: Easy to modify and extend
2. **Reusability**: Components can be reused across different screens
3. **Testability**: Each component can be tested in isolation
4. **Readability**: Clear separation of concerns
5. **Scalability**: Easy to add new features and screens

## Usage

```javascript
// Import components
import { ManagementDashboard, ManagementFeatureCard } from '../../features/management';

// Use in navigation
<Stack.Screen name="ManagementDashboard" component={ManagementDashboard} />

// Use financial reports
import { FinancialReportsScreen, useFinancialReports } from '../../features/management';

// Add new features by extending the data configuration
export const NEW_FEATURES = [
  {
    id: 'new-feature',
    title: 'New Feature',
    icon: 'new-icon',
    description: 'Description',
    color: '#color',
    route: 'NewFeatureScreen'
  }
];
```
