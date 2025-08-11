/**
 * Review API Definition
 * ---------------------------------------------------------------
 * Skeleton OpenAPI-style specification for Review module endpoints.
 */

// ------------------------------------------------------------------
// Model Schemas
// ------------------------------------------------------------------

export const models = {
  /** Review object */
  Review: {
    type: 'object',
    required: ['_id', 'rating', 'user', 'restaurant', 'createdAt'],
    properties: {
      _id: { type: 'string' },
      rating: { type: 'integer', minimum: 1, maximum: 5 },
      review: { type: 'string' },
      user: { type: 'string', description: 'User ObjectId' },
      restaurant: { type: 'string', description: 'Restaurant ObjectId' },
      menuItem: { type: 'string', description: 'Dish ObjectId', nullable: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },

  /** Create / Update review payload */
  ReviewRequest: {
    type: 'object',
    required: ['rating'],
    properties: {
      rating: { type: 'integer', minimum: 1, maximum: 5 },
      review: { type: 'string' },
      restaurant: { type: 'string' },
      menuItem: { type: 'string' },
    },
  },

  /** List response */
  ReviewListResponse: {
    type: 'object',
    required: ['status', 'results', 'data'],
    properties: {
      status: { type: 'string', enum: ['success'] },
      results: { type: 'integer' },
      paginationResult: { type: 'object' },
      data: { type: 'array', items: { $ref: '#/components/schemas/Review' } },
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
  ListOK: { description: 'List of reviews', schema: 'models.ReviewListResponse' },
  ItemOK: { description: 'Single review', schema: 'models.Review' },
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
    name: 'GetReviews',
    method: 'GET',
    path: '/reviews',
    summary: 'Retrieve reviews (optionally filtered by query params or nested routes)',
    responses: {
      200: 'commonResponses.ListOK',
    },
  },
  {
    name: 'CreateReview',
    method: 'POST',
    path: '/reviews',
    summary: 'Create new review (customer)',
    requestBody: 'models.ReviewRequest',
    responses: {
      201: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
    },
  },
  {
    name: 'GetReviewById',
    method: 'GET',
    path: '/reviews/{id}',
    summary: 'Retrieve review by ID',
    responses: {
      200: 'commonResponses.ItemOK',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'UpdateReview',
    method: 'PUT',
    path: '/reviews/{id}',
    summary: 'Update review (owner)',
    requestBody: 'models.ReviewRequest',
    responses: {
      200: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'DeleteReview',
    method: 'DELETE',
    path: '/reviews/{id}',
    summary: 'Delete review (owner / admin)',
    responses: {
      204: 'commonResponses.MessageOK',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      404: 'commonResponses.NotFound',
    },
  },
  // Example nested path for restaurant or dish reviews
  {
    name: 'GetRestaurantReviews',
    method: 'GET',
    path: '/restaurants/{restaurantId}/reviews',
    summary: 'List reviews for a specific restaurant',
    responses: {
      200: 'commonResponses.ListOK',
      404: 'commonResponses.NotFound',
    },
  },
];

// ------------------------------------------------------------------
// Aggregate Export
// ------------------------------------------------------------------

export const ReviewApiSpec = {
  models,
  commonResponses,
  endpoints,
} as const; 