/**
 * Dish API Definition
 * ---------------------------------------------------------------
 * Skeleton OpenAPI-style structure for Dish module endpoints.
 * Fill concrete examples and refine schemas when needed.
 */

// ------------------------------------------------------------------
// Model Schemas
// ------------------------------------------------------------------

export const models = {
  /** Size sub-document */
  Size: {
    type: 'object',
    required: ['_id', 'name', 'price', 'currentStock'],
    properties: {
      _id: { type: 'string' },
      name: { type: 'string' },
      price: { type: 'number', minimum: 0 },
      currentStock: { type: 'integer', minimum: 0 },
      sold: { type: 'integer' },
    },
  },

  /** Dish object */
  Dish: {
    type: 'object',
    required: ['_id', 'name', 'restaurant', 'sizes'],
    properties: {
      _id: { type: 'string' },
      name: { type: 'string', maxLength: 100 },
      description: { type: 'string' },
      imageUrl: { type: 'string', format: 'uri' },
      images: { type: 'array', items: { type: 'string', format: 'uri' } },
      restaurant: { type: 'string', description: 'Restaurant ObjectId' },
      categories: { type: 'array', items: { type: 'string' } },
      unitType: { type: 'string' },
      isAvailable: { type: 'boolean' },
      sizes: { type: 'array', items: { $ref: '#/components/schemas/Size' } },
      allowedAddons: { type: 'array', items: { type: 'string' } },
      ratingsAverage: { type: 'number' },
      ratingsQuantity: { type: 'integer' },
      offer: { type: 'object' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },

  /** Create/Update dish payload */
  DishRequest: {
    type: 'object',
    required: ['name', 'restaurant', 'categories', 'sizes'],
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      restaurant: { type: 'string' },
      categories: { type: 'array', items: { type: 'string' } },
      images: { type: 'array', items: { type: 'string' } },
      unitType: { type: 'string' },
      isAvailable: { type: 'boolean' },
      sizes: { type: 'array', items: { $ref: '#/components/schemas/Size' } },
      allowedAddons: { type: 'array', items: { type: 'string' } },
    },
  },

  /** List response */
  DishListResponse: {
    type: 'object',
    required: ['status', 'results', 'data'],
    properties: {
      status: { type: 'string', enum: ['success'] },
      results: { type: 'integer' },
      paginationResult: { type: 'object' },
      data: { type: 'array', items: { $ref: '#/components/schemas/Dish' } },
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
  ListOK: { description: 'List of dishes', schema: 'models.DishListResponse' },
  ItemOK: { description: 'Single dish', schema: 'models.Dish' },
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
    name: 'GetDishes',
    method: 'GET',
    path: '/dishes',
    summary: 'Retrieve dishes with filters & pagination',
    responses: {
      200: 'commonResponses.ListOK',
    },
  },
  {
    name: 'CreateDish',
    method: 'POST',
    path: '/dishes',
    summary: 'Create dish (admin / restaurant)',
    requestBody: 'models.DishRequest',
    responses: {
      201: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
    },
  },
  {
    name: 'GetDishById',
    method: 'GET',
    path: '/dishes/{id}',
    summary: 'Retrieve dish by ID',
    responses: {
      200: 'commonResponses.ItemOK',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'UpdateDish',
    method: 'PUT',
    path: '/dishes/{id}',
    summary: 'Update dish basic fields',
    requestBody: 'models.DishRequest',
    responses: {
      200: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'DeleteDish',
    method: 'DELETE',
    path: '/dishes/{id}',
    summary: 'Soft-delete dish',
    responses: {
      204: 'commonResponses.MessageOK',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'ToggleDishAvailability',
    method: 'PATCH',
    path: '/dishes/{id}/toggle-availability',
    summary: 'Toggle dish availability (admin / restaurant)',
    responses: {
      200: 'commonResponses.ItemOK',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'RestoreDish',
    method: 'PATCH',
    path: '/dishes/{id}/restore',
    summary: 'Restore soft-deleted dish',
    responses: {
      200: 'commonResponses.ItemOK',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  // Size operations
  {
    name: 'AddDishSize',
    method: 'POST',
    path: '/dishes/{id}/sizes',
    summary: 'Add new size to dish',
    requestBody: 'models.Size',
    responses: {
      201: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'UpdateDishSize',
    method: 'PUT',
    path: '/dishes/{id}/sizes/{sizeId}',
    summary: 'Update size info',
    requestBody: 'models.Size',
    responses: {
      200: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'DeleteDishSize',
    method: 'DELETE',
    path: '/dishes/{id}/sizes/{sizeId}',
    summary: 'Delete size from dish',
    responses: {
      204: 'commonResponses.MessageOK',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'UpdateSizeStock',
    method: 'PATCH',
    path: '/dishes/{id}/sizes/{sizeId}/stock',
    summary: 'Update stock for a size',
    requestBody: 'models.Size',
    responses: {
      200: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  // Addon operations
  {
    name: 'AddDishAddon',
    method: 'POST',
    path: '/dishes/{id}/addons',
    summary: 'Add addons to dish',
    requestBody: 'models.MessageResponse',
    responses: {
      201: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'DeleteDishAddon',
    method: 'DELETE',
    path: '/dishes/{id}/addons',
    summary: 'Remove addons from dish',
    requestBody: 'models.MessageResponse',
    responses: {
      200: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  // Offer operations
  {
    name: 'UpdateDishOffer',
    method: 'PATCH',
    path: '/dishes/{id}/offer',
    summary: 'Create or update dish offer',
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
    name: 'DeleteDishOffer',
    method: 'DELETE',
    path: '/dishes/{id}/offer',
    summary: 'Delete dish offer',
    responses: {
      200: 'commonResponses.ItemOK',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
];

// ------------------------------------------------------------------
// Aggregate export
// ------------------------------------------------------------------

export const DishApiSpec = {
  models,
  commonResponses,
  endpoints,
} as const; 