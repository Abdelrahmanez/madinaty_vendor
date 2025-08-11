/**
 * Notification API Definition
 * ---------------------------------------------------------------
 * Skeleton OpenAPI-style structure for the Notification module.
 * Replace every TODO with concrete examples when finalising specs.
 */

// ------------------------------------------------------------------
// Model Schemas
// ------------------------------------------------------------------

export const models = {
  /** Generic Notification object returned from backend */
  Notification: {
    type: 'object',
    required: ['_id', 'title', 'body', 'user', 'isRead', 'createdAt'],
    properties: {
      _id: { type: 'string', description: 'MongoDB ObjectId' },
      user: { type: 'string', description: 'User ObjectId' },
      title: { type: 'string' },
      body: { type: 'string' },
      data: { type: 'object', additionalProperties: true },
      isRead: { type: 'boolean' },
      readAt: { type: 'string', format: 'date-time', nullable: true },
      deliveredToDevice: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },

  /** Paginated list response */
  NotificationListResponse: {
    type: 'object',
    required: ['status', 'results', 'data'],
    properties: {
      status: { type: 'string', enum: ['success'] },
      results: { type: 'integer' },
      pagination: { type: 'object' },
      data: { type: 'array', items: { $ref: '#/components/schemas/Notification' } },
    },
  },

  /** Unread count response */
  UnreadCountResponse: {
    type: 'object',
    required: ['status', 'data'],
    properties: {
      status: { type: 'string', enum: ['success'] },
      data: {
        type: 'object',
        properties: {
          count: { type: 'integer' },
        },
      },
    },
  },

  /** Expo push token registration payload */
  TokenRequest: {
    type: 'object',
    required: ['token'],
    properties: {
      token: { type: 'string', pattern: '^ExponentPushToken\\[' },
    },
  },

  /** Simple success / info response */
  MessageResponse: {
    type: 'object',
    required: ['status', 'message'],
    properties: {
      status: { type: 'string', enum: ['success'] },
      message: { type: 'string' },
    },
  },

  /** Standard error response */
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
  ListOK: { description: 'List of notifications', schema: 'models.NotificationListResponse' },
  ItemOK: { description: 'Single notification', schema: 'models.Notification' },
  CountOK: { description: 'Unread notifications count', schema: 'models.UnreadCountResponse' },
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
    name: 'GetNotifications',
    method: 'GET',
    path: '/notifications',
    summary: 'Retrieve current user notifications (paginated)',
    responses: {
      200: 'commonResponses.ListOK',
      401: 'commonResponses.Unauthorized',
    },
  },
  {
    name: 'GetUnreadCount',
    method: 'GET',
    path: '/notifications/unread-count',
    summary: 'Get count of unread notifications',
    responses: {
      200: 'commonResponses.CountOK',
      401: 'commonResponses.Unauthorized',
    },
  },
  {
    name: 'MarkAllAsRead',
    method: 'PATCH',
    path: '/notifications/mark-all-read',
    summary: 'Mark all notifications as read',
    responses: {
      200: 'commonResponses.MessageOK',
      401: 'commonResponses.Unauthorized',
    },
  },
  {
    name: 'DeleteAllNotifications',
    method: 'DELETE',
    path: '/notifications',
    summary: 'Delete all notifications for user',
    responses: {
      204: 'commonResponses.MessageOK',
      401: 'commonResponses.Unauthorized',
    },
  },
  {
    name: 'MarkNotificationRead',
    method: 'PATCH',
    path: '/notifications/{id}/read',
    summary: 'Mark specific notification as read',
    responses: {
      200: 'commonResponses.ItemOK',
      401: 'commonResponses.Unauthorized',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'DeleteNotification',
    method: 'DELETE',
    path: '/notifications/{id}',
    summary: 'Delete specific notification',
    responses: {
      204: 'commonResponses.MessageOK',
      401: 'commonResponses.Unauthorized',
      404: 'commonResponses.NotFound',
    },
  },
  {
    name: 'RegisterPushToken',
    method: 'POST',
    path: '/notifications/register-token',
    summary: 'Register Expo push token',
    requestBody: 'models.TokenRequest',
    responses: {
      200: 'commonResponses.MessageOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
    },
  },
  {
    name: 'UnregisterPushToken',
    method: 'POST',
    path: '/notifications/unregister-token',
    summary: 'Unregister Expo push token',
    requestBody: 'models.TokenRequest',
    responses: {
      200: 'commonResponses.MessageOK',
      400: 'commonResponses.BadRequest',
      401: 'commonResponses.Unauthorized',
    },
  },
];

// ------------------------------------------------------------------
// Aggregate Export
// ------------------------------------------------------------------

export const NotificationApiSpec = {
  models,
  commonResponses,
  endpoints,
} as const; 