/**
 * Cart API Definition
 * ---------------------------------------------------------------
 * Skeleton OpenAPI‐style description for Cart module endpoints.
 * Fill concrete examples later.
 */

// ------------------------------------------------------------------
// Model Schemas
// ------------------------------------------------------------------

export const models = {
  /** CartItem (dish in cart) */
  CartItem: {
    type: 'object',
    required: ['_id', 'dish', 'quantity', 'itemTotal', 'selectedSize'],
    properties: {
      _id: { type: 'string', description: 'Cart item ObjectId' },
      dish: { type: 'string', description: 'Dish ObjectId' },
      quantity: { type: 'integer', minimum: 1 },
      notes: { type: 'string' },
      selectedSize: { type: 'string', description: 'Size ObjectId' },
      selectedAddons: { type: 'array', items: { type: 'string' } },
      itemTotal: { type: 'number' },
    },
  },

  /** Cart */
  Cart: {
    type: 'object',
    required: ['_id', 'user', 'items', 'totalAmount'],
    properties: {
      _id: { type: 'string' },
      user: { type: 'string', description: 'User ObjectId' },
      items: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } },
      totalAmount: { type: 'number' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },

  /** Add / Update request payload */
  CartItemRequest: {
    type: 'object',
    required: ['dishId', 'quantity', 'selectedSize'],
    properties: {
      dishId: { type: 'string' },
      quantity: { type: 'integer', minimum: 1 },
      notes: { type: 'string' },
      selectedSize: { type: 'string' },
      selectedAddons: { type: 'array', items: { type: 'string' } },
    },
  },

  GuestCartRequest: {
    $ref: '#/components/schemas/CartItemRequest',
  },

  TransferGuestCartRequest: {
    type: 'object',
    required: ['tempCartId'],
    properties: {
      tempCartId: { type: 'string' },
    },
  },

  CartResponse: {
    type: 'object',
    required: ['status', 'data'],
    properties: {
      status: { type: 'string', enum: ['success'] },
      message: { type: 'string' },
      data: { $ref: '#/components/schemas/Cart' },
      removedItems: { type: 'array', items: { type: 'object' } },
    },
  },

  MessageResponse: {
    type: 'object',
    required: ['status', 'message'],
    properties: {
      status: { type: 'string', enum: ['success'] },
      message: { type: 'string' },
    },
  },

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
  CartOK: { description: 'Current cart state', schema: 'models.CartResponse' },
  MessageOK: { description: 'Generic success message', schema: 'models.MessageResponse' },

  // Errors
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
    name: 'CreateGuestCart',
    method: 'POST',
    path: '/cart/guest',
    summary: 'Create a temporary cart for guest users',
    requestBody: 'models.GuestCartRequest',
    responses: {
      201: 'commonResponses.CartOK',
      400: 'commonResponses.BadRequest',
      500: 'commonResponses.ServerError',
    },
  },
  {
    name: 'AddToCart',
    method: 'POST',
    path: '/cart/add',
    summary: 'Add item to authenticated user cart',
    requestBody: 'models.CartItemRequest',
    responses: {
      200: 'commonResponses.CartOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      500: 'commonResponses.ServerError',
    },
  },
  {
    name: 'RemoveCartItem',
    method: 'DELETE',
    path: '/cart/remove/{itemId}',
    summary: 'Remove item from cart',
    responses: {
      200: 'commonResponses.CartOK',
      401: 'commonResponses.Unauthorized',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'UpdateCartItem',
    method: 'PATCH',
    path: '/cart/update/{itemId}',
    summary: 'Update quantity / notes / size / addons for cart item',
    requestBody: 'models.CartItemRequest',
    responses: {
      200: 'commonResponses.CartOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'GetCart',
    method: 'GET',
    path: '/cart',
    summary: 'Retrieve current user cart',
    responses: {
      200: 'commonResponses.CartOK',
      401: 'commonResponses.Unauthorized',
    },
  },
  {
    name: 'EmptyCart',
    method: 'DELETE',
    path: '/cart/empty',
    summary: 'Empty current user cart',
    responses: {
      200: 'commonResponses.MessageOK',
      401: 'commonResponses.Unauthorized',
    },
  },
  {
    name: 'TransferGuestCart',
    method: 'POST',
    path: '/cart/transfer-guest-cart',
    summary: 'Merge guest cart with authenticated user cart',
    requestBody: 'models.TransferGuestCartRequest',
    responses: {
      200: 'commonResponses.CartOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
    },
  },
];

// ------------------------------------------------------------------
// Aggregate export
// ------------------------------------------------------------------

export const CartApiSpec = {
  models,
  commonResponses,
  endpoints,
} as const; 