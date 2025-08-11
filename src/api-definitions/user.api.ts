/**
 * User API Definition
 * ---------------------------------------------------------------
 * Skeleton OpenAPI-style specification for User module endpoints.
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
      _id: { type: 'string' },
      name: { type: 'string' },
      street: { type: 'string' },
      notes: { type: 'string' },
      area: { type: 'string', description: 'DeliveryZone ObjectId' },
      isDefault: { type: 'boolean' },
    },
  },

  /** User object */
  User: {
    type: 'object',
    required: ['_id', 'name', 'phoneNumber', 'role'],
    properties: {
      _id: { type: 'string' },
      name: { type: 'string' },
      phoneNumber: { type: 'string' },
      role: { type: 'string' },
      addresses: { type: 'array', items: { $ref: '#/components/schemas/Address' } },
      active: { type: 'boolean' },
      isDeleted: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },

  /** Create user payload */
  CreateUserRequest: {
    type: 'object',
    required: ['name', 'phoneNumber', 'password'],
    properties: {
      name: { type: 'string' },
      phoneNumber: { type: 'string' },
      password: { type: 'string' },
      role: { type: 'string' },
      addresses: { type: 'array', items: { $ref: '#/components/schemas/Address' } },
    },
  },

  /** Update user payload */
  UpdateUserRequest: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      phoneNumber: { type: 'string' },
      role: { type: 'string' },
      active: { type: 'boolean' },
      addresses: { type: 'array', items: { $ref: '#/components/schemas/Address' } },
    },
  },

  /** Address create/update request */
  AddressRequest: {
    type: 'object',
    required: ['street', 'area'],
    properties: {
      name: { type: 'string' },
      street: { type: 'string' },
      notes: { type: 'string' },
      area: { type: 'string' },
      isDefault: { type: 'boolean' },
    },
  },

  /** Update password payload */
  UpdatePasswordRequest: {
    type: 'object',
    required: ['currentPassword', 'password', 'passwordConfirm'],
    properties: {
      currentPassword: { type: 'string' },
      password: { type: 'string' },
      passwordConfirm: { type: 'string' },
    },
  },

  /** Push Token payload */
  PushTokenRequest: {
    type: 'object',
    required: ['token'],
    properties: {
      token: { type: 'string', pattern: '^ExponentPushToken\\[' },
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

  /** List response */
  UserListResponse: {
    type: 'object',
    required: ['status', 'results', 'data'],
    properties: {
      status: { type: 'string', enum: ['success'] },
      results: { type: 'integer' },
      paginationResult: { type: 'object' },
      data: { type: 'array', items: { $ref: '#/components/schemas/User' } },
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
  ListOK: { description: 'List of users', schema: 'models.UserListResponse' },
  ItemOK: { description: 'Single user', schema: 'models.User' },
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
  // Current user profile routes
  {
    name: 'GetMyProfile',
    method: 'GET',
    path: '/users/me',
    summary: 'Get current user profile',
    responses: { 200: 'commonResponses.ItemOK', 401: 'commonResponses.Unauthorized' },
  },
  {
    name: 'UpdateMyProfile',
    method: 'PUT',
    path: '/users/me',
    summary: 'Update current user profile',
    requestBody: 'models.UpdateUserRequest',
    responses: {
      200: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
    },
  },
  {
    name: 'UpdateMyPassword',
    method: 'PUT',
    path: '/users/update-password',
    summary: 'Update current user password',
    requestBody: 'models.UpdatePasswordRequest',
    responses: {
      200: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
    },
  },
  // Address management
  {
    name: 'AddAddress',
    method: 'POST',
    path: '/users/addresses',
    summary: 'Add new address',
    requestBody: 'models.AddressRequest',
    responses: {
      201: 'commonResponses.ItemOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
    },
  },
  { name: 'GetMyAddresses', method: 'GET', path: '/users/addresses', responses: { 200: 'commonResponses.ItemOK', 401: 'commonResponses.Unauthorized' } },
  { name: 'GetMyDefaultAddress', method: 'GET', path: '/users/addresses/default', responses: { 200: 'commonResponses.ItemOK', 401: 'commonResponses.Unauthorized' } },
  {
    name: 'UpdateAddress', method: 'PUT', path: '/users/addresses/{addressId}', requestBody: 'models.AddressRequest', responses: { 200: 'commonResponses.ItemOK', 400: 'commonResponses.BadRequest', 401: 'commonResponses.Unauthorized', 404: 'commonResponses.NotFound' },
  },
  {
    name: 'DeleteAddress', method: 'DELETE', path: '/users/addresses/{addressId}', responses: { 204: 'commonResponses.MessageOK', 401: 'commonResponses.Unauthorized', 404: 'commonResponses.NotFound' },
  },
  {
    name: 'SetDefaultAddress', method: 'PATCH', path: '/users/addresses/{addressId}/set-default', responses: { 200: 'commonResponses.ItemOK', 401: 'commonResponses.Unauthorized', 404: 'commonResponses.NotFound' },
  },
  // Push tokens
  {
    name: 'RegisterPushToken', method: 'POST', path: '/users/push-token', requestBody: 'models.PushTokenRequest', responses: { 200: 'commonResponses.MessageOK', 400: 'commonResponses.BadRequest', 401: 'commonResponses.Unauthorized' },
  },
  { name: 'UnregisterPushToken', method: 'DELETE', path: '/users/push-token', requestBody: 'models.PushTokenRequest', responses: { 200: 'commonResponses.MessageOK', 400: 'commonResponses.BadRequest', 401: 'commonResponses.Unauthorized' } },
  { name: 'GetMyPushTokens', method: 'GET', path: '/users/push-tokens', responses: { 200: 'commonResponses.ItemOK', 401: 'commonResponses.Unauthorized' } },
  // Admin routes
  {
    name: 'CreateUser', method: 'POST', path: '/users', summary: 'Admin: create user', requestBody: 'models.CreateUserRequest', responses: { 201: 'commonResponses.ItemOK', 400: 'commonResponses.BadRequest', 401: 'commonResponses.Unauthorized', 403: 'commonResponses.Forbidden' } },
  { name: 'GetUsers', method: 'GET', path: '/users', summary: 'Admin: list users', responses: { 200: 'commonResponses.ListOK', 401: 'commonResponses.Unauthorized', 403: 'commonResponses.Forbidden' } },
  { name: 'GetUserById', method: 'GET', path: '/users/{id}', responses: { 200: 'commonResponses.ItemOK', 401: 'commonResponses.Unauthorized', 403: 'commonResponses.Forbidden', 404: 'commonResponses.NotFound' } },
  { name: 'UpdateUser', method: 'PUT', path: '/users/{id}', requestBody: 'models.UpdateUserRequest', responses: { 200: 'commonResponses.ItemOK', 400: 'commonResponses.BadRequest', 401: 'commonResponses.Unauthorized', 403: 'commonResponses.Forbidden', 404: 'commonResponses.NotFound' } },
  { name: 'DeleteUser', method: 'DELETE', path: '/users/{id}', responses: { 204: 'commonResponses.MessageOK', 401: 'commonResponses.Unauthorized', 403: 'commonResponses.Forbidden', 404: 'commonResponses.NotFound' } },
];

// ------------------------------------------------------------------
// Aggregate Export
// ------------------------------------------------------------------

export const UserApiSpec = {
  models,
  commonResponses,
  endpoints,
} as const; 