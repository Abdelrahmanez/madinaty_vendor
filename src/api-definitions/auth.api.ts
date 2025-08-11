/**
 * Auth API Definition (STRUCTURE ONLY)
 * ---------------------------------------------------------------
 * This file provides a clean, reusable skeleton for documenting the
 * Auth module endpoints. Replace every `TODO` with real values when
 * implementing the final specification.
 */

// ------------------------------------------------------------------
// Model Schemas
// ------------------------------------------------------------------

/**
 * Place your OpenAPI/JSON-schema compatible model definitions here.
 * Example:
 *   TokenResponse: {
 *     type: 'object',
 *     properties: { accessToken: { type: 'string' }, ... }
 *   }
 */
export const models = {
  /**
   * User Schema (simplified)
   */
  User: {
    type: 'object',
    description: 'Represents an application user',
    required: ['_id', 'name', 'phoneNumber', 'role'],
    properties: {
      _id: { type: 'string', description: 'MongoDB ObjectId' },
      name: { type: 'string' },
      phoneNumber: { type: 'string', example: '01001234567' },
      role: { type: 'string', enum: ['customer', 'restaurant', 'admin', 'driver', 'delivery_partner'] },
      addresses: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Home' },
            street: { type: 'string', example: '123 Main St.' },
            notes: { type: 'string', example: '3rd floor – apt. 9' },
            area: { type: 'string', description: 'Delivery zone ObjectId' },
            isDefault: { type: 'boolean' },
          },
        },
      },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },

  /**
   * Request Schemas
   */
  SignupRequest: {
    type: 'object',
    required: ['name', 'phoneNumber', 'password', 'address'],
    properties: {
      name: { type: 'string' },
      phoneNumber: { type: 'string', example: '01001234567' },
      password: { type: 'string', format: 'password', minLength: 6 },
      address: { type: 'string' },
      areaId: { type: 'string', description: 'Optional delivery zone ObjectId' },
    },
  },

  LoginRequest: {
    type: 'object',
    required: ['phoneNumber', 'password'],
    properties: {
      phoneNumber: { type: 'string', example: '01001234567' },
      password: { type: 'string', format: 'password' },
    },
  },

  RefreshTokenRequest: {
    type: 'object',
    required: ['refreshToken'],
    properties: {
      refreshToken: { type: 'string' },
    },
  },

  LogoutRequest: {
    type: 'object',
    required: ['refreshToken'],
    properties: {
      refreshToken: { type: 'string' },
    },
  },

  SetFinancialPinRequest: {
    type: 'object',
    required: ['pin'],
    properties: {
      pin: { type: 'string', minLength: 4, maxLength: 6, example: '1234' },
    },
  },

  VerifyFinancialPinRequest: {
    type: 'object',
    required: ['pin'],
    properties: {
      pin: { type: 'string', minLength: 4, maxLength: 6, example: '1234' },
    },
  },

  /**
   * Response Schemas
   */
  TokenResponse: {
    type: 'object',
    required: ['status', 'accessToken', 'refreshToken', 'data'],
    properties: {
      status: { type: 'string', enum: ['success'] },
      accessToken: { type: 'string' },
      refreshToken: { type: 'string' },
      data: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/User' },
        },
      },
    },
  },

  AccessTokenResponse: {
    type: 'object',
    required: ['status', 'accessToken'],
    properties: {
      status: { type: 'string', enum: ['success'] },
      accessToken: { type: 'string' },
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

/**
 * Reusable response components shared across Auth endpoints.
 * Reference them inside `endpoints[].responses` to avoid duplication.
 */
export const commonResponses = {
  // Success
  TokenCreated: { description: 'User created & tokens issued', schema: 'models.TokenResponse' },
  TokenOK: { description: 'Tokens issued', schema: 'models.TokenResponse' },
  AccessTokenOK: { description: 'Access token refreshed', schema: 'models.AccessTokenResponse' },
  MessageOK: { description: 'Operation completed successfully', schema: 'models.MessageResponse' },

  // Errors
  BadRequest: { description: 'Invalid input data', schema: 'models.ErrorResponse' },
  Unauthorized: { description: 'Authentication failed', schema: 'models.ErrorResponse' },
  Forbidden: { description: 'Insufficient privileges', schema: 'models.ErrorResponse' },
  Conflict: { description: 'Resource conflict (e.g., duplicate phone)', schema: 'models.ErrorResponse' },
  ServerError: { description: 'Unexpected server error', schema: 'models.ErrorResponse' },
} as const;

// ------------------------------------------------------------------
// Endpoint Definitions
// ------------------------------------------------------------------

interface EndpointDefinition {
  name: string;                     // Readable identifier, e.g. 'Login'
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;                     // Route path, e.g. '/auth/login'
  summary?: string;                 // Short summary for docs
  description?: string;             // Longer description (optional)
  requestBody?: string;             // Reference to models.<Schema>
  responses: Record<string, string>; // statusCode -> commonResponses key
}

/**
 * Auth module endpoints.
 * Only placeholders are provided – fill with actual request/response
 * schemas and descriptions later.
 */
export const endpoints: EndpointDefinition[] = [
  {
    name: 'Signup',
    method: 'POST',
    path: '/auth/signup',
    summary: 'Register a new customer account',
    requestBody: 'models.SignupRequest',
    responses: {
      201: 'commonResponses.TokenCreated',
      400: 'commonResponses.BadRequest',
      409: 'commonResponses.Conflict',
      500: 'commonResponses.ServerError',
    },
  },
  {
    name: 'Login',
    method: 'POST',
    path: '/auth/login',
    summary: 'Authenticate user and issue tokens',
    requestBody: 'models.LoginRequest',
    responses: {
      200: 'commonResponses.TokenOK',
      401: 'commonResponses.Unauthorized',
      500: 'commonResponses.ServerError',
    },
  },
  {
    name: 'RefreshAccessToken',
    method: 'POST',
    path: '/auth/refresh-token',
    summary: 'Generate a new access token using a valid refresh token',
    requestBody: 'models.RefreshTokenRequest',
    responses: {
      200: 'commonResponses.AccessTokenOK',
      401: 'commonResponses.Unauthorized',
      500: 'commonResponses.ServerError',
    },
  },
  {
    name: 'Logout',
    method: 'POST',
    path: '/auth/logout',
    summary: 'Invalidate a refresh token (logout)',
    requestBody: 'models.LogoutRequest',
    responses: {
      200: 'commonResponses.MessageOK',
      401: 'commonResponses.Unauthorized',
      500: 'commonResponses.ServerError',
    },
  },
  {
    name: 'SetFinancialPin',
    method: 'PATCH',
    path: '/auth/set-financial-pin',
    summary: 'Set or update the financial PIN (restaurant/admin)',
    requestBody: 'models.SetFinancialPinRequest',
    responses: {
      200: 'commonResponses.MessageOK',
      403: 'commonResponses.Forbidden',
      401: 'commonResponses.Unauthorized',
      500: 'commonResponses.ServerError',
    },
  },
  {
    name: 'VerifyFinancialPin',
    method: 'POST',
    path: '/auth/verify-financial-pin',
    summary: 'Verify that provided financial PIN is correct',
    requestBody: 'models.VerifyFinancialPinRequest',
    responses: {
      200: 'commonResponses.MessageOK',
      401: 'commonResponses.Unauthorized',
      403: 'commonResponses.Forbidden',
      500: 'commonResponses.ServerError',
    },
  },
];

// ------------------------------------------------------------------
// Aggregate Export (optional helper)
// ------------------------------------------------------------------

export const AuthApiSpec = {
  models,
  commonResponses,
  endpoints,
} as const; 