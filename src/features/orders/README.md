# Orders Feature

This feature handles all order-related functionality for the restaurant vendor app.

## Components

### OrderCardItem
- Displays order information in a card format
- Shows customer details, order items, and status
- Includes action buttons for order management
- **New**: Action buttons for driver assignment and status updates

### OrderDetailsModal
- Detailed view of order information
- Allows status updates and order cancellation
- **New**: Enhanced with driver assignment capabilities

### OrderAssignmentModal
- **New Component**: Modal for assigning drivers to orders
- Shows available drivers for selection
- Allows restaurant to update order status
- Integrates with driver management system

### OrdersList
- List view of all orders with filtering
- **New**: Supports driver assignment actions
- **New**: Supports status update actions

## Screens

### OrdersScreen
- Main orders management screen
- **New**: Navigation to order assignment screen
- **New**: Integration with driver assignment actions

### OrderAssignmentScreen
- **New Screen**: Dedicated screen for order assignment management
- Shows orders that can be assigned to drivers
- Provides search and filtering capabilities
- Integrates with OrderAssignmentModal

## API Integration

### New Endpoints
- `PATCH /orders/{order_id}/assign-driver` - Assign driver to order
- `PATCH /orders/{order_id}/status-by-restaurant` - Update order status by restaurant

### API Functions
- `assignDriverToOrder(orderId, driverId)` - Assigns a driver to an order
- `updateOrderStatusByRestaurant(orderId, status)` - Updates order status

## Hooks

### useOrders
- **New**: `assignDriver(orderId, driverId)` - Assign driver to order
- **New**: `updateOrderStatusByRestaurant(orderId, status)` - Update order status
- Real-time updates via Socket.io
- Local state management for immediate UI updates

## Order Status Flow

1. **pending** → **preparing** (Restaurant starts preparing)
2. **preparing** → **ready_for_pickup** (Order ready for driver pickup)
3. **ready_for_pickup** → **assigned_to_driver** (Driver assigned)
4. **assigned_to_driver** → **picked_up_by_driver** (Driver picked up)
5. **picked_up_by_driver** → **on_the_way** (Driver en route)
6. **on_the_way** → **delivered** (Order delivered)

## Driver Assignment

- Drivers are manually selected from available drivers list
- Only orders with status `ready_for_pickup` can be assigned to drivers
- Restaurant can update order status at any stage if needed
- Real-time updates ensure all connected clients see changes immediately

## Usage

### From Orders Screen
- Orders with actionable statuses show action buttons
- "تعيين سائق" (Assign Driver) button for ready orders
- "جاهز للاستلام" (Ready for Pickup) button for preparing orders

### From Management Screen
- Navigate to "تخصيص الطلبات" (Order Assignment) from Delivery Management
- Dedicated interface for order assignment management
- Search and filter orders by status

### From Order Cards
- Direct action buttons on order cards
- Immediate status updates and driver assignment
- Seamless integration with existing order flow

## Error Handling

- API error messages are displayed to users
- Network failures are handled gracefully
- Loading states provide user feedback
- Validation ensures only valid actions are performed

## Real-time Updates

- Socket.io integration for live updates
- All connected clients see changes immediately
- Driver assignment and status updates are broadcast
- Maintains consistency across multiple devices
