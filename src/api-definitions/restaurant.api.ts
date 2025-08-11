/**
 * Restaurant API Definition
 * ---------------------------------------------------------------
 * Skeleton OpenAPI-style specification for Restaurant module.
 * Replace placeholders with concrete details when refining docs.
 */

// ------------------------------------------------------------------
// Model Schemas
// ------------------------------------------------------------------

export const models = {
  /** Address sub-document */
  Address: {
    type: 'object',
    required: ['street', 'area'],
    properties: {
      street: { type: 'string' },
      notes: { type: 'string' },
      area: { type: 'string', description: 'DeliveryZone ObjectId' },
    },
  },

  /** Restaurant base schema */
  Restaurant: {
    type: 'object',
    required: ['_id', 'name', 'branchLabel', 'description', 'image', 'owner', 'address'],
    properties: {
      _id: { type: 'string' },
      name: { type: 'string' },
      branchLabel: { type: 'string' },
      slug: { type: 'string' },
      description: { type: 'string' },
      phoneNumber: { type: 'string' },
      address: { $ref: '#/components/schemas/Address' },
      deliveryTime: { type: 'integer' },
      image: { type: 'string', format: 'uri' },
      isOpen: { type: 'boolean' },
      owner: { type: 'string', description: 'User ObjectId' },
      categories: { type: 'array', items: { type: 'string' } },
      ratingsAverage: { type: 'number' },
      ratingsQuantity: { type: 'integer' },
      status: { type: 'string' },
      commissionRate: { type: 'number' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },

  /** Create / Update request payload */
  RestaurantRequest: {
    type: 'object',
    required: [
      'name',
      'branchLabel',
      'description',
      'image',
      'owner',
      'address',
    ],
    properties: {
      name: { type: 'string' },
      branchLabel: { type: 'string' },
      description: { type: 'string' },
      phoneNumber: { type: 'string' },
      address: { $ref: '#/components/schemas/Address' },
      deliveryTime: { type: 'integer' },
      image: { type: 'string' },
      isOpen: { type: 'boolean' },
      owner: { type: 'string' },
      categories: { type: 'array', items: { type: 'string' } },
      status: { type: 'string' },
      commissionRate: { type: 'number' },
    },
  },

  /** Paginated list response */
  RestaurantListResponse: {
    type: 'object',
    required: ['status', 'results', 'data'],
    properties: {
      status: { type: 'string', enum: ['success'] },
      results: { type: 'integer' },
      paginationResult: { type: 'object' },
      data: { type: 'array', items: { $ref: '#/components/schemas/Restaurant' } },
    },
  },

  /** Generic success message */
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
  ListOK: { description: 'List of restaurants', schema: 'models.RestaurantListResponse' },
  ItemOK: { description: 'Single restaurant', schema: 'models.Restaurant' },
  MessageOK: { description: 'Generic success message', schema: 'models.MessageResponse' },

  BadRequest: { description: 'Invalid input data', schema: 'models.ErrorResponse' },
  Unauthorized: { description: 'Authentication required', schema: 'models.ErrorResponse' },
  Forbidden: { description: 'Insufficient privileges', schema: 'models.ErrorResponse' },
  NotFound: { description: 'Resource not found', schema: 'models.ErrorResponse' },
  Conflict: { description: 'Duplicate resource', schema: 'models.ErrorResponse' },
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
    name: 'GetRestaurants',
    method: 'GET',
    path: '/restaurants',
    summary: 'Retrieve restaurants with filtering & pagination',
    responses: {
      200: 'commonResponses.ListOK',
    },
  },
  {
    name: 'CreateRestaurant',
    method: 'POST',
    path: '/restaurants',
    summary: 'Admin: create new restaurant',
    requestBody: 'models.RestaurantRequest',
    responses: {
      201: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      409: 'commonResponses.Conflict',
    },
  },
  {
    name: 'GetRestaurantById',
    method: 'GET',
    path: '/restaurants/{id}',
    summary: 'Retrieve restaurant by ID',
    responses: {
      200: 'commonResponses.ItemOK',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'UpdateRestaurant',
    method: 'PUT',
    path: '/restaurants/{id}',
    summary: 'Update restaurant (admin / owner)',
    requestBody: 'models.RestaurantRequest',
    responses: {
      200: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'DeleteRestaurant',
    method: 'DELETE',
    path: '/restaurants/{id}',
    summary: 'Soft-delete restaurant (admin)',
    responses: {
      204: 'commonResponses.MessageOK',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'RestoreRestaurant',
    method: 'PATCH',
    path: '/restaurants/{id}/restore',
    summary: 'Restore soft-deleted restaurant (admin)',
    responses: {
      200: 'commonResponses.ItemOK',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  // Nested addons endpoints could be documented in addon.api.ts
];

// ------------------------------------------------------------------
// Aggregate Export
// ------------------------------------------------------------------

export const RestaurantApiSpec = {
  models,
  commonResponses,
  endpoints,
} as const; 