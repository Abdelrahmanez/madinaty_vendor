/**
 * Category API Definition
 * ---------------------------------------------------------------
 * Skeleton describing Category module endpoints.
 */

// ------------------------------------------------------------------
// Model Schemas
// ------------------------------------------------------------------

export const models = {
  /** Category object */
  Category: {
    type: 'object',
    required: ['_id', 'name', 'imageUrl'],
    properties: {
      _id: { type: 'string', description: 'MongoDB ObjectId' },
      name: { type: 'string', minLength: 2, maxLength: 50 },
      description: { type: 'string', maxLength: 500 },
      imageUrl: { type: 'string', format: 'uri' },
      type: { type: 'string', enum: ['restaurant', 'meal'] },
      parent: { type: 'string', description: 'Parent category ObjectId or null' },
      slug: { type: 'string' },
      createdBy: { type: 'string', description: 'User ObjectId' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },

  /** Create / Update request payload */
  CategoryRequest: {
    type: 'object',
    required: ['name', 'imageUrl'],
    properties: {
      name: { type: 'string', minLength: 2, maxLength: 50 },
      description: { type: 'string', maxLength: 500 },
      imageUrl: { type: 'string', format: 'uri' },
      type: { type: 'string', enum: ['restaurant', 'meal'] },
      parent: { type: 'string' },
    },
  },

  CategoryListResponse: {
    type: 'object',
    required: ['status', 'results', 'data'],
    properties: {
      status: { type: 'string', enum: ['success'] },
      results: { type: 'integer' },
      data: { type: 'array', items: { $ref: '#/components/schemas/Category' } },
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
  ListOK: { description: 'List of categories', schema: 'models.CategoryListResponse' },
  ItemOK: { description: 'Single category', schema: 'models.Category' },
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
    name: 'GetCategories',
    method: 'GET',
    path: '/categories',
    summary: 'Retrieve categories with optional filters',
    responses: {
      200: 'commonResponses.ListOK',
      500: 'commonResponses.ServerError',
    },
  },
  {
    name: 'CreateCategory',
    method: 'POST',
    path: '/categories',
    summary: 'Create a new category (Admin)',
    requestBody: 'models.CategoryRequest',
    responses: {
      201: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
    },
  },
  {
    name: 'GetCategoryById',
    method: 'GET',
    path: '/categories/{id}',
    summary: 'Retrieve category by ID',
    responses: {
      200: 'commonResponses.ItemOK',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'UpdateCategory',
    method: 'PUT',
    path: '/categories/{id}',
    summary: 'Update category (Admin)',
    requestBody: 'models.CategoryRequest',
    responses: {
      200: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'DeleteCategory',
    method: 'DELETE',
    path: '/categories/{id}',
    summary: 'Delete category (Admin)',
    responses: {
      204: 'commonResponses.MessageOK',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'GetSubcategories',
    method: 'GET',
    path: '/categories/{id}/subcategories',
    summary: 'Get subcategories for a parent category',
    responses: {
      200: 'commonResponses.ListOK',
      404: 'commonResponses.NotFound',
    },
  },
];

// ------------------------------------------------------------------
// Aggregate export
// ------------------------------------------------------------------

export const CategoryApiSpec = {
  models,
  commonResponses,
  endpoints,
} as const; 