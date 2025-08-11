/**
 * Advertisement API Definition
 * ---------------------------------------------------------------
 * OpenAPI-style structure describing Advertisement module endpoints.
 * Replace placeholders with concrete examples when finalising the spec.
 */

// ------------------------------------------------------------------
// Model Schemas
// ------------------------------------------------------------------

export const models = {
  /** Advertisement object */
  Advertisement: {
    type: 'object',
    required: ['_id', 'name', 'imageUrl', 'startDate', 'endDate', 'priority', 'isActive'],
    properties: {
      _id: { type: 'string', description: 'MongoDB ObjectId' },
      name: { type: 'string' },
      description: { type: 'string' },
      imageUrl: { type: 'string', format: 'uri' },
      targetType: { type: 'string', enum: ['restaurant', 'category', 'dish', 'external'] },
      targetId: { type: 'string', description: 'ObjectId of target entity' },
      targetUrl: { type: 'string', format: 'uri' },
      startDate: { type: 'string', format: 'date-time' },
      endDate: { type: 'string', format: 'date-time' },
      isActive: { type: 'boolean' },
      priority: { type: 'integer', minimum: 1, maximum: 10 },
      budget: { type: 'number' },
      viewsCount: { type: 'integer' },
      clicksCount: { type: 'integer' },
      createdBy: { type: 'string', description: 'User ObjectId' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },

  /** Create / Update request */
  AdvertisementRequest: {
    type: 'object',
    required: ['name', 'imageUrl', 'startDate', 'endDate', 'priority', 'targetType'],
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      imageUrl: { type: 'string', format: 'uri' },
      targetType: { type: 'string', enum: ['restaurant', 'category', 'dish', 'external'] },
      targetId: { type: 'string' },
      targetUrl: { type: 'string', format: 'uri' },
      startDate: { type: 'string', format: 'date-time' },
      endDate: { type: 'string', format: 'date-time' },
      priority: { type: 'integer', minimum: 1, maximum: 10 },
      isActive: { type: 'boolean' },
      budget: { type: 'number' },
    },
  },

  /** Standard list response */
  AdvertisementListResponse: {
    type: 'object',
    required: ['status', 'results', 'data'],
    properties: {
      status: { type: 'string', enum: ['success'] },
      results: { type: 'integer' },
      data: { type: 'array', items: { $ref: '#/components/schemas/Advertisement' } },
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
  ListOK: { description: 'List of advertisements', schema: 'models.AdvertisementListResponse' },
  ItemOK: { description: 'Single advertisement', schema: 'models.Advertisement' },
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
  // Public
  {
    name: 'GetAdvertisements',
    method: 'GET',
    path: '/advertisements',
    summary: 'Retrieve all active advertisements',
    responses: {
      200: 'commonResponses.ListOK',
      500: 'commonResponses.ServerError',
    },
  },
  {
    name: 'RecordAdClick',
    method: 'POST',
    path: '/advertisements/click/{id}',
    summary: 'Increment clicks counter for an advertisement',
    responses: {
      200: 'commonResponses.MessageOK',
      400: 'commonResponses.BadRequest',
      404: 'commonResponses.NotFound',
    },
  },
  // Admin CRUD
  {
    name: 'CreateAdvertisement',
    method: 'POST',
    path: '/advertisements/admin',
    summary: 'Create a new advertisement (Admin)',
    requestBody: 'models.AdvertisementRequest',
    responses: {
      201: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
    },
  },
  {
    name: 'UpdateAdvertisement',
    method: 'PUT',
    path: '/advertisements/admin/{id}',
    summary: 'Update an advertisement (Admin)',
    requestBody: 'models.AdvertisementRequest',
    responses: {
      200: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'DeleteAdvertisement',
    method: 'DELETE',
    path: '/advertisements/admin/{id}',
    summary: 'Delete an advertisement (Admin)',
    responses: {
      200: 'commonResponses.MessageOK',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'GetAdvertisementById',
    method: 'GET',
    path: '/advertisements/{id}',
    summary: 'Retrieve single advertisement by ID',
    responses: {
      200: 'commonResponses.ItemOK',
      404: 'commonResponses.NotFound',
      500: 'commonResponses.ServerError',
    },
  },
];

// ------------------------------------------------------------------
// Aggregate export
// ------------------------------------------------------------------

export const AdvertisementApiSpec = {
  models,
  commonResponses,
  endpoints,
} as const; 