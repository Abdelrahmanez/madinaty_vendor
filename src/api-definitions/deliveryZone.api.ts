/**
 * Delivery Zone API Definition
 * ---------------------------------------------------------------
 * OpenAPI‐style skeleton for DeliveryZone module endpoints.
 */

// ------------------------------------------------------------------
// Model Schemas
// ------------------------------------------------------------------

export const models = {
  DeliveryZone: {
    type: 'object',
    required: ['_id', 'name', 'deliveryPrice', 'isActive'],
    properties: {
      _id: { type: 'string' },
      name: { type: 'string', maxLength: 100 },
      description: { type: 'string' },
      deliveryPrice: { type: 'number', minimum: 0 },
      isActive: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },

  DeliveryZoneRequest: {
    type: 'object',
    required: ['name', 'deliveryPrice'],
    properties: {
      name: { type: 'string', maxLength: 100 },
      description: { type: 'string' },
      deliveryPrice: { type: 'number', minimum: 0 },
      isActive: { type: 'boolean' },
    },
  },

  DeliveryZoneListResponse: {
    type: 'object',
    required: ['status', 'results', 'data'],
    properties: {
      status: { type: 'string', enum: ['success'] },
      results: { type: 'integer' },
      data: { type: 'array', items: { $ref: '#/components/schemas/DeliveryZone' } },
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
  ListOK: { description: 'List of delivery zones', schema: 'models.DeliveryZoneListResponse' },
  ItemOK: { description: 'Single delivery zone', schema: 'models.DeliveryZone' },
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
  // Public
  {
    name: 'GetActiveZones',
    method: 'GET',
    path: '/delivery-zones/active',
    summary: 'Retrieve active delivery zones',
    responses: {
      200: 'commonResponses.ListOK',
    },
  },
  {
    name: 'GetDeliveryZones',
    method: 'GET',
    path: '/delivery-zones',
    summary: 'Retrieve delivery zones (default active filter can be overridden)',
    responses: {
      200: 'commonResponses.ListOK',
      500: 'commonResponses.ServerError',
    },
  },
  {
    name: 'GetDeliveryZoneById',
    method: 'GET',
    path: '/delivery-zones/{id}',
    summary: 'Retrieve delivery zone by ID',
    responses: {
      200: 'commonResponses.ItemOK',
      404: 'commonResponses.NotFound',
    },
  },
  // Admin
  {
    name: 'GetAllZonesAdmin',
    method: 'GET',
    path: '/delivery-zones/admin',
    summary: 'Retrieve all delivery zones (admin)',
    responses: {
      200: 'commonResponses.ListOK',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
    },
  },
  {
    name: 'CreateDeliveryZone',
    method: 'POST',
    path: '/delivery-zones',
    summary: 'Create delivery zone (admin)',
    requestBody: 'models.DeliveryZoneRequest',
    responses: {
      201: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
    },
  },
  {
    name: 'UpdateDeliveryZone',
    method: 'PUT',
    path: '/delivery-zones/{id}',
    summary: 'Update delivery zone (admin)',
    requestBody: 'models.DeliveryZoneRequest',
    responses: {
      200: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'DeleteDeliveryZone',
    method: 'DELETE',
    path: '/delivery-zones/{id}',
    summary: 'Delete delivery zone (admin)',
    responses: {
      204: 'commonResponses.MessageOK',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
];

// ------------------------------------------------------------------
// Aggregate export
// ------------------------------------------------------------------

export const DeliveryZoneApiSpec = {
  models,
  commonResponses,
  endpoints,
} as const; 