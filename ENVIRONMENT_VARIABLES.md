# Environment Variables Configuration

This document describes the environment variables used in the Madinaty Vendor app and how to configure them.

## Setup Instructions

### 1. Create .env File

Create a `.env` file in the root directory of the project with the following variables:

```bash
# ===========================================
# MADINATY VENDOR APP - ENVIRONMENT VARIABLES
# ===========================================

# API Configuration
API_BASE_URL=https://madinaty-backend.onrender.com/api/v1
SOCKET_URL=https://madinaty-backend.onrender.com

# App Configuration
APP_NAME=FitRack
APP_SLUG=FitRack-app
APP_VERSION=1.0.0

# Environment
NODE_ENV=development

# Debug Settings
DEBUG_MODE=true
ENABLE_SOCKET_DEBUG=true

# Notification Settings
NOTIFICATION_ICON=./assets/notification-icon.png
NOTIFICATION_COLOR=#ffffff
NOTIFICATION_SOUND=./assets/notification_sound.wav

# Bundle Identifiers
IOS_BUNDLE_ID=com.fitrack.app
ANDROID_PACKAGE_NAME=com.fitrack.app

# EAS Configuration
EAS_PROJECT_ID=2c0d505e-d892-4060-8daa-c2f92ea730cf

# Image Placeholder
DEFAULT_IMAGE_PLACEHOLDER=https://via.placeholder.com

# Socket Configuration
SOCKET_TRANSPORTS=websocket,polling
SOCKET_AUTO_CONNECT=true

# API Timeout Settings
API_TIMEOUT=30000
SOCKET_TIMEOUT=20000

# Feature Flags
ENABLE_REAL_TIME_UPDATES=true
ENABLE_PUSH_NOTIFICATIONS=true
ENABLE_OFFLINE_MODE=true
```

### 2. Environment Variables Reference

#### API Configuration
- **API_BASE_URL**: Base URL for all API requests
- **SOCKET_URL**: WebSocket server URL for real-time updates

#### App Configuration
- **APP_NAME**: Application display name
- **APP_SLUG**: Application slug for Expo
- **APP_VERSION**: Application version

#### Environment
- **NODE_ENV**: Environment mode (development, production, staging)

#### Debug Settings
- **DEBUG_MODE**: Enable/disable debug logging (true/false)
- **ENABLE_SOCKET_DEBUG**: Enable/disable socket debugging (true/false)

#### Notification Settings
- **NOTIFICATION_ICON**: Path to notification icon
- **NOTIFICATION_COLOR**: Notification color in hex format
- **NOTIFICATION_SOUND**: Path to notification sound file

#### Bundle Identifiers
- **IOS_BUNDLE_ID**: iOS bundle identifier
- **ANDROID_PACKAGE_NAME**: Android package name

#### EAS Configuration
- **EAS_PROJECT_ID**: Expo Application Services project ID

#### Image Settings
- **DEFAULT_IMAGE_PLACEHOLDER**: Default placeholder URL for images

#### Socket Configuration
- **SOCKET_TRANSPORTS**: Comma-separated list of socket transports
- **SOCKET_AUTO_CONNECT**: Auto-connect to socket (true/false)

#### Timeout Settings
- **API_TIMEOUT**: API request timeout in milliseconds
- **SOCKET_TIMEOUT**: Socket connection timeout in milliseconds

#### Feature Flags
- **ENABLE_REAL_TIME_UPDATES**: Enable real-time updates (true/false)
- **ENABLE_PUSH_NOTIFICATIONS**: Enable push notifications (true/false)
- **ENABLE_OFFLINE_MODE**: Enable offline mode (true/false)

## Usage in Code

The environment variables are automatically loaded and can be accessed through the `ENV_CONFIG` object:

```javascript
import { ENV_CONFIG } from './src/config/environment';

// Use environment variables
const apiUrl = ENV_CONFIG.API_BASE_URL;
const debugMode = ENV_CONFIG.DEBUG_MODE;
```

## Environment-Specific Configurations

### Development
```bash
NODE_ENV=development
DEBUG_MODE=true
ENABLE_SOCKET_DEBUG=true
```

### Production
```bash
NODE_ENV=production
DEBUG_MODE=false
ENABLE_SOCKET_DEBUG=false
```

### Staging
```bash
NODE_ENV=staging
DEBUG_MODE=true
ENABLE_SOCKET_DEBUG=false
```

## Security Notes

1. **Never commit .env files** to version control
2. **Use .env.example** as a template for other developers
3. **Keep sensitive data** (API keys, secrets) in environment variables
4. **Use different .env files** for different environments

## Troubleshooting

### Environment Variables Not Loading
1. Ensure `.env` file is in the root directory
2. Check that `dotenv` package is installed
3. Verify the import statement in `src/config/environment.js`

### Socket Connection Issues
1. Check `SOCKET_URL` is correct
2. Verify `SOCKET_TRANSPORTS` includes required transports
3. Ensure `SOCKET_TIMEOUT` is appropriate for your network

### API Connection Issues
1. Verify `API_BASE_URL` is correct
2. Check `API_TIMEOUT` is sufficient
3. Ensure backend server is accessible

## File Structure

```
madinaty_vendor/
├── .env                    # Environment variables (not in git)
├── .env.example           # Environment variables template
├── src/
│   └── config/
│       ├── environment.js # Environment configuration loader
│       └── api.js         # API configuration using env vars
└── ENVIRONMENT_VARIABLES.md # This documentation
```
