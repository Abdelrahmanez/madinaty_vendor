/**
 * Order API Definition
 * ---------------------------------------------------------------
 * Skeleton OpenAPI-style specification for Order module endpoints.
 * Fill concrete examples/constraints later when refining specs.
 */

// ------------------------------------------------------------------
// Model Schemas
// ------------------------------------------------------------------

export const models = {
  /** Delivery address embedded in order */
  DeliveryAddress: {
    type: 'object',
    required: ['street', 'areaName', 'areaId'],
    properties: {
      street: { type: 'string' },
      notes: { type: 'string' },
      areaName: { type: 'string' },
      areaId: { type: 'string' },
    },
  },

  /** Addon info inside order item */
  OrderAddon: {
    type: 'object',
    required: ['addon', 'quantity', 'price'],
    properties: {
      addon: { type: 'string', description: 'Addon ObjectId' },
      quantity: { type: 'integer', minimum: 1 },
      price: { type: 'number', minimum: 0 },
    },
  },

  /** Item inside order */
  OrderItem: {
    type: 'object',
    required: ['dish', 'quantity', 'price', 'totalPrice'],
    properties: {
      dish: { type: 'string', description: 'Dish ObjectId' },
      quantity: { type: 'integer', minimum: 1 },
      price: { type: 'number', minimum: 0 },
      notes: { type: 'string' },
      addons: { type: 'array', items: { $ref: '#/components/schemas/OrderAddon' } },
      totalPrice: { type: 'number', minimum: 0 },
    },
  },

  /** Complete order object */
  Order: {
    type: 'object',
    required: ['_id', 'user', 'restaurant', 'items', 'status', 'totalAmount', 'deliveryFee', 'paymentMethod', 'paymentStatus', 'deliveryAddress', 'createdAt'],
    properties: {
      _id: { type: 'string' },
      user: { type: 'string' },
      restaurant: { type: 'string' },
      items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
      status: { type: 'string' },
      totalAmount: { type: 'number' },
      deliveryFee: { type: 'number' },
      discount: { type: 'number' },
      paymentMethod: { type: 'string' },
      paymentStatus: { type: 'string' },
      deliveryAddress: { $ref: '#/components/schemas/DeliveryAddress' },
      driver: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },

  /** Create order payload */
  CreateOrderRequest: {
    type: 'object',
    required: ['addressId', 'paymentMethod'],
    properties: {
      addressId: { type: 'string' },
      paymentMethod: { type: 'string' },
      promoCode: { type: 'string' },
      customerNotes: { type: 'string' },
    },
  },

  /** Generic message response */
  MessageResponse: {
    type: 'object',
    required: ['status', 'message'],
    properties: {
      status: { type: 'string', enum: ['success'] },
      message: { type: 'string' },
    },
  },

  /** Order list response */
  OrderListResponse: {
    type: 'object',
    required: ['status', 'results', 'data'],
    properties: {
      status: { type: 'string', enum: ['success'] },
      results: { type: 'integer' },
      pagination: { type: 'object' },
      data: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
    },
  },

  /** Error response */
  ErrorResponse: {
    type: 'object',
    required: ['status', 'message'],
    properties: {
      status: { type: 'string', enum: ['error'] },
      message: { type: 'string' },
      errors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            msg: { type: 'string' },
            param: { type: 'string' },
            location: { type: 'string' },
          },
        },
      },
    },
  },
} as const;

// ------------------------------------------------------------------
// Common Responses
// ------------------------------------------------------------------

export const commonResponses = {
  ListOK: { description: 'List of orders', schema: 'models.OrderListResponse' },
  ItemOK: { description: 'Single order', schema: 'models.Order' },
  MessageOK: { description: 'Generic success message', schema: 'models.MessageResponse' },

  BadRequest: { description: 'Invalid input data', schema: 'models.ErrorResponse' },
  Unauthorized: { description: 'Authentication required', schema: 'models.ErrorResponse' },
  Forbidden: { description: 'Insufficient privileges', schema: 'models.ErrorResponse' },
  NotFound: { description: 'Resource not found', schema: 'models.ErrorResponse' },
  ServerError: { description: 'Unexpected server error', schema: 'models.ErrorResponse' },
} as const;

// ------------------------------------------------------------------
// Endpoint Definitions
// ------------------------------------------------------------------

interface EndpointDefinition {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  summary?: string;
  requestBody?: string;
  responses: Record<string, string>;
}

export const endpoints: EndpointDefinition[] = [
  {
    name: 'GetOrders',
    method: 'GET',
    path: '/orders',
    summary: 'Retrieve orders list (role-based)',
    responses: {
      200: 'commonResponses.ListOK',
      401: 'commonResponses.Unauthorized',
    },
  },
  {
    name: 'CreateOrder',
    method: 'POST',
    path: '/orders',
    summary: 'Create order from cart (customer)',
    requestBody: 'models.CreateOrderRequest',
    responses: {
      201: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
    },
  },
  {
    name: 'GetOrderById',
    method: 'GET',
    path: '/orders/{id}',
    summary: 'Retrieve order by ID',
    responses: {
      200: 'commonResponses.ItemOK',
      401: 'commonResponses.Unauthorized',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'UpdateOrder',
    method: 'PUT',
    path: '/orders/{id}',
    summary: 'Admin: update order fields',
    requestBody: 'models.Order',
    responses: {
      200: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'UpdateOrderStatus',
    method: 'PATCH',
    path: '/orders/{id}/status',
    summary: 'Update order status (admin / restaurant / driver)',
    requestBody: 'models.MessageResponse',
    responses: {
      200: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'CancelOrder',
    method: 'PATCH',
    path: '/orders/{id}/cancel',
    summary: 'Cancel order (customer / restaurant / admin)',
    responses: {
      200: 'commonResponses.ItemOK',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'AssignDriver',
    method: 'PATCH',
    path: '/orders/{id}/assign-driver',
    summary: 'Assign driver to order',
    requestBody: 'models.MessageResponse',
    responses: {
      200: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'CompleteOrder',
    method: 'PATCH',
    path: '/orders/{id}/complete',
    summary: 'Mark order as delivered / completed',
    responses: {
      200: 'commonResponses.ItemOK',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'PayForOrder',
    method: 'POST',
    path: '/orders/{id}/pay',
    summary: 'Record payment for order',
    requestBody: 'models.MessageResponse',
    responses: {
      200: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'WebhookPayment',
    method: 'POST',
    path: '/orders/webhook',
    summary: 'Webhook endpoint for payment gateways',
    requestBody: 'models.MessageResponse',
    responses: {
      200: 'commonResponses.MessageOK',
    },
  },
  {
    name: 'RefundOrder',
    method: 'POST',
    path: '/orders/{id}/refund',
    summary: 'Refund paid order (admin)',
    responses: {
      200: 'commonResponses.ItemOK',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'RateOrder',
    method: 'POST',
    path: '/orders/{id}/rate',
    summary: 'Rate delivered order (customer)',
    requestBody: 'models.MessageResponse',
    responses: {
      200: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'CheckoutSession',
    method: 'POST',
    path: '/orders/checkout-session',
    summary: 'Create checkout session (customer)',
    responses: {
      200: 'commonResponses.MessageOK',
      401: 'commonResponses.Unauthorized',
    },
  },
];

// ------------------------------------------------------------------
// Aggregate Export
// ------------------------------------------------------------------

export const OrderApiSpec = {
  models,
  commonResponses,
  endpoints,
} as const; 