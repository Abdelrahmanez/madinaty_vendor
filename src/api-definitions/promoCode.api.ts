/**
 * Promo Code API Definition
 * ---------------------------------------------------------------
 * Skeleton OpenAPI-style structure for PromoCode module endpoints.
 * Replace placeholders with concrete details when finalising docs.
 */

// ------------------------------------------------------------------
// Model Schemas
// ------------------------------------------------------------------

export const models = {
  /** PromoCode core object */
  PromoCode: {
    type: 'object',
    required: [
      '_id',
      'code',
      'type',
      'value',
      'startDate',
      'endDate',
      'isActive',
    ],
    properties: {
      _id: { type: 'string' },
      code: { type: 'string' },
      description: { type: 'string' },
      type: { type: 'string', enum: ['percentage', 'fixed_amount', 'free_delivery'] },
      value: { type: 'number' },
      minOrderAmount: { type: 'number' },
      maxDiscountAmount: { type: 'number' },
      startDate: { type: 'string', format: 'date-time' },
      endDate: { type: 'string', format: 'date-time' },
      usageLimit: { type: 'number' },
      usageCount: { type: 'number' },
      perUserLimit: { type: 'number' },
      isActive: { type: 'boolean' },
      appliesTo: { type: 'string' },
      appliedToRestaurants: { type: 'array', items: { type: 'string' } },
      appliedToCategories: { type: 'array', items: { type: 'string' } },
      appliedToMenuItems: { type: 'array', items: { type: 'string' } },
      createdBy: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },

  /** Create / Update request schema */
  PromoCodeRequest: {
    type: 'object',
    required: ['code', 'type', 'value', 'startDate', 'endDate', 'appliesTo'],
    properties: {
      code: { type: 'string' },
      description: { type: 'string' },
      type: { type: 'string' },
      value: { type: 'number' },
      minOrderAmount: { type: 'number' },
      maxDiscountAmount: { type: 'number' },
      startDate: { type: 'string', format: 'date-time' },
      endDate: { type: 'string', format: 'date-time' },
      usageLimit: { type: 'number' },
      perUserLimit: { type: 'number' },
      isActive: { type: 'boolean' },
      appliesTo: { type: 'string' },
      appliedToRestaurants: { type: 'array', items: { type: 'string' } },
      appliedToCategories: { type: 'array', items: { type: 'string' } },
      appliedToMenuItems: { type: 'array', items: { type: 'string' } },
    },
  },

  /** List response */
  PromoCodeListResponse: {
    type: 'object',
    required: ['status', 'results', 'data'],
    properties: {
      status: { type: 'string', enum: ['success'] },
      results: { type: 'integer' },
      paginationResult: { type: 'object' },
      data: { type: 'array', items: { $ref: '#/components/schemas/PromoCode' } },
    },
  },

  /** Validation request for promo code */
  ValidatePromoCodeRequest: {
    type: 'object',
    required: ['code', 'orderAmount'],
    properties: {
      code: { type: 'string' },
      orderAmount: { type: 'number' },
      restaurantId: { type: 'string' },
      items: { type: 'array', items: { type: 'object' } }, // Simplified
      deliveryFee: { type: 'number' },
    },
  },

  /** Result of validation */
  ValidatePromoCodeResponse: {
    type: 'object',
    required: ['status', 'data'],
    properties: {
      status: { type: 'string', enum: ['success'] },
      data: {
        type: 'object',
        properties: {
          valid: { type: 'boolean' },
          message: { type: 'string' },
          promoCode: { $ref: '#/components/schemas/PromoCode', nullable: true },
          discount: { type: 'number' },
        },
      },
    },
  },

  /** Standard success message */
  MessageResponse: {
    type: 'object',
    required: ['status', 'message'],
    properties: {
      status: { type: 'string', enum: ['success'] },
      message: { type: 'string' },
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
  ListOK: { description: 'List of promo codes', schema: 'models.PromoCodeListResponse' },
  ItemOK: { description: 'Single promo code', schema: 'models.PromoCode' },
  ValidationOK: { description: 'Promo code validation result', schema: 'models.ValidatePromoCodeResponse' },
  MessageOK: { description: 'Generic success message', schema: 'models.MessageResponse' },

  BadRequest: { description: 'Invalid input data', schema: 'models.ErrorResponse' },
  Unauthorized: { description: 'Authentication required', schema: 'models.ErrorResponse' },
  Forbidden: { description: 'Insufficient privileges', schema: 'models.ErrorResponse' },
  NotFound: { description: 'Resource not found', schema: 'models.ErrorResponse' },
  Conflict: { description: 'Duplicate promo code', schema: 'models.ErrorResponse' },
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
  // Admin routes
  {
    name: 'CreatePromoCode',
    method: 'POST',
    path: '/promo-codes/admin',
    summary: 'Admin: create new promo code',
    requestBody: 'models.PromoCodeRequest',
    responses: {
      201: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      409: 'commonResponses.Conflict',
    },
  },
  {
    name: 'GetPromoCodes',
    method: 'GET',
    path: '/promo-codes/admin',
    summary: 'Admin: get paginated promo codes',
    responses: {
      200: 'commonResponses.ListOK',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
    },
  },
  {
    name: 'GetPromoCodeById',
    method: 'GET',
    path: '/promo-codes/admin/{id}',
    summary: 'Admin: get promo code by ID',
    responses: {
      200: 'commonResponses.ItemOK',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'UpdatePromoCode',
    method: 'PUT',
    path: '/promo-codes/admin/{id}',
    summary: 'Admin: update promo code',
    requestBody: 'models.PromoCodeRequest',
    responses: {
      200: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'DeletePromoCode',
    method: 'DELETE',
    path: '/promo-codes/admin/{id}',
    summary: 'Admin: delete promo code',
    responses: {
      204: 'commonResponses.MessageOK',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  // Public validation
  {
    name: 'ValidatePromoCode',
    method: 'POST',
    path: '/promo-codes/validate',
    summary: 'Validate promo code for current customer',
    requestBody: 'models.ValidatePromoCodeRequest',
    responses: {
      200: 'commonResponses.ValidationOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
    },
  },
];

// ------------------------------------------------------------------
// Aggregate export
// ------------------------------------------------------------------

export const PromoCodeApiSpec = {
  models,
  commonResponses,
  endpoints,
} as const; 