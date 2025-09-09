#!/usr/bin/env node

/**
 * Environment Setup Script
 * Helps users set up their .env file for the Madinaty Vendor app
 */

const fs = require('fs');
const path = require('path');

const envTemplate = `# ===========================================
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
ENABLE_OFFLINE_MODE=true`;

function setupEnvironment() {
  const envPath = path.join(process.cwd(), '.env');
  
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists!');
    console.log('   If you want to recreate it, please delete the existing file first.');
    return;
  }
  
  try {
    // Create .env file
    fs.writeFileSync(envPath, envTemplate);
    console.log('✅ .env file created successfully!');
    console.log('📝 Please review and modify the values as needed for your environment.');
    console.log('📚 See ENVIRONMENT_VARIABLES.md for detailed documentation.');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
  }
}

// Run the setup
setupEnvironment();
