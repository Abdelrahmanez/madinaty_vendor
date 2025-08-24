# React Native Image Upload Guide

## Overview

This guide shows how to upload images from React Native to the new generic image upload middleware system. The backend supports various upload types including single images, multiple images, and mixed uploads.

## 📱 Prerequisites

Install required packages:

```bash
npm install react-native-image-picker
npm install react-native-document-picker
npm install react-native-fs
npm install react-native-permissions
```

## 🔧 Basic Setup

### 1. Import Required Libraries

```javascript
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform } from 'react-native';
```

### 2. Request Permissions

```javascript
const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera access to take photos',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    return true;
  }
};

const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs storage access to select photos',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    return true;
  }
};
```

## 📸 Image Selection Methods

### 1. Select Single Image from Gallery

```javascript
const selectImageFromGallery = () => {
  const options = {
    mediaType: 'photo',
    quality: 0.8,
    maxWidth: 1024,
    maxHeight: 1024,
    includeBase64: false,
  };

  launchImageLibrary(options, (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.assets && response.assets[0]) {
      const image = response.assets[0];
      console.log('Selected image:', image);
      // Upload the image
      uploadSingleImage(image);
    }
  });
};
```

### 2. Take Photo with Camera

```javascript
const takePhotoWithCamera = async () => {
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) {
    console.log('Camera permission denied');
    return;
  }

  const options = {
    mediaType: 'photo',
    quality: 0.8,
    maxWidth: 1024,
    maxHeight: 1024,
    includeBase64: false,
    saveToPhotos: true,
  };

  launchCamera(options, (response) => {
    if (response.didCancel) {
      console.log('User cancelled camera');
    } else if (response.error) {
      console.log('Camera Error: ', response.error);
    } else if (response.assets && response.assets[0]) {
      const image = response.assets[0];
      console.log('Captured image:', image);
      // Upload the image
      uploadSingleImage(image);
    }
  });
};
```

### 3. Select Multiple Images

```javascript
const selectMultipleImages = () => {
  const options = {
    mediaType: 'photo',
    quality: 0.8,
    maxWidth: 1024,
    maxHeight: 1024,
    includeBase64: false,
    selectionLimit: 10, // Max 10 images
  };

  launchImageLibrary(options, (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.assets && response.assets.length > 0) {
      console.log('Selected images:', response.assets);
      // Upload multiple images
      uploadMultipleImages(response.assets);
    }
  });
};
```

## 📤 Upload Functions

### 1. Upload Single Image (Restaurant, Category, etc.)

```javascript
const uploadSingleImage = async (image) => {
  try {
    const formData = new FormData();
    
    // Add image file
    formData.append('image', {
      uri: image.uri,
      type: image.type || 'image/jpeg',
      name: image.fileName || `image_${Date.now()}.jpg`,
    });

    // Add other form data if needed
    formData.append('name', 'Restaurant Name');
    formData.append('description', 'Restaurant Description');

    const response = await fetch('YOUR_API_BASE_URL/restaurants', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${YOUR_AUTH_TOKEN}`,
      },
      body: formData,
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('Upload successful:', result);
      // Handle success
    } else {
      console.error('Upload failed:', result);
      // Handle error
    }
  } catch (error) {
    console.error('Upload error:', error);
  }
};
```

### 2. Upload Dish with Gallery (Main Image + Gallery Images)

```javascript
const uploadDishWithGallery = async (mainImage, galleryImages) => {
  try {
    const formData = new FormData();
    
    // Add main image
    if (mainImage) {
      formData.append('image', {
        uri: mainImage.uri,
        type: mainImage.type || 'image/jpeg',
        name: mainImage.fileName || `main_${Date.now()}.jpg`,
      });
    }

    // Add gallery images
    if (galleryImages && galleryImages.length > 0) {
      galleryImages.forEach((image, index) => {
        formData.append('imageFiles', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.fileName || `gallery_${Date.now()}_${index}.jpg`,
        });
      });
    }

    // Add other dish data
    formData.append('name', 'Dish Name');
    formData.append('description', 'Dish Description');
    formData.append('price', '25.99');
    formData.append('categoryId', 'category_id_here');

    const response = await fetch('YOUR_API_BASE_URL/dishes', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${YOUR_AUTH_TOKEN}`,
      },
      body: formData,
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('Dish upload successful:', result);
      // Handle success
    } else {
      console.error('Dish upload failed:', result);
      // Handle error
    }
  } catch (error) {
    console.error('Upload error:', error);
  }
};
```

### 3. Upload Multiple Images to Custom Folder

```javascript
const uploadMultipleImagesToFolder = async (images, folderName) => {
  try {
    const formData = new FormData();
    
    // Add multiple images
    images.forEach((image, index) => {
      formData.append('images', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName || `image_${Date.now()}_${index}.jpg`,
      });
    });

    const response = await fetch(`YOUR_API_BASE_URL/multiple-images/${folderName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${YOUR_AUTH_TOKEN}`,
      },
      body: formData,
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('Multiple images upload successful:', result);
      // Handle success
    } else {
      console.error('Multiple images upload failed:', result);
      // Handle error
    }
  } catch (error) {
    console.error('Upload error:', error);
  }
};
```

### 4. Dynamic Upload by Image Type

```javascript
const uploadByImageType = async (image, imageType) => {
  try {
    const formData = new FormData();
    
    // Add image file
    formData.append('image', {
      uri: image.uri,
      type: image.type || 'image/jpeg',
      name: image.fileName || `image_${Date.now()}.jpg`,
    });

    const response = await fetch(`YOUR_API_BASE_URL/upload/${imageType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${YOUR_AUTH_TOKEN}`,
      },
      body: formData,
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log(`${imageType} upload successful:`, result);
      // Handle success
    } else {
      console.error(`${imageType} upload failed:`, result);
      // Handle error
    }
  } catch (error) {
    console.error('Upload error:', error);
  }
};
```

## 🎨 Complete React Native Component Example

```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const ImageUploadComponent = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Select single image
  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    launchImageLibrary(options, (response) => {
      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0]);
      }
    });
  };

  // Select multiple images for gallery
  const selectGalleryImages = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
      selectionLimit: 10,
    };

    launchImageLibrary(options, (response) => {
      if (response.assets && response.assets.length > 0) {
        setGalleryImages(response.assets);
      }
    });
  };

  // Upload restaurant image
  const uploadRestaurantImage = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      
      formData.append('image', {
        uri: selectedImage.uri,
        type: selectedImage.type || 'image/jpeg',
        name: selectedImage.fileName || `restaurant_${Date.now()}.jpg`,
      });

      formData.append('name', 'My Restaurant');
      formData.append('description', 'A great restaurant');

      const response = await fetch('YOUR_API_BASE_URL/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${YOUR_AUTH_TOKEN}`,
        },
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok) {
        Alert.alert('Success', 'Restaurant image uploaded successfully!');
        setSelectedImage(null);
      } else {
        Alert.alert('Error', result.message || 'Upload failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error occurred');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  // Upload dish with gallery
  const uploadDishWithGallery = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select a main image first');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      
      // Main image
      formData.append('image', {
        uri: selectedImage.uri,
        type: selectedImage.type || 'image/jpeg',
        name: selectedImage.fileName || `main_${Date.now()}.jpg`,
      });

      // Gallery images
      galleryImages.forEach((image, index) => {
        formData.append('imageFiles', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.fileName || `gallery_${Date.now()}_${index}.jpg`,
        });
      });

      formData.append('name', 'Delicious Dish');
      formData.append('description', 'A very tasty dish');
      formData.append('price', '29.99');

      const response = await fetch('YOUR_API_BASE_URL/dishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${YOUR_AUTH_TOKEN}`,
        },
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok) {
        Alert.alert('Success', 'Dish uploaded successfully!');
        setSelectedImage(null);
        setGalleryImages([]);
      } else {
        Alert.alert('Error', result.message || 'Upload failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error occurred');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Upload Demo</Text>
      
      {/* Single Image Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Main Image</Text>
        <TouchableOpacity style={styles.button} onPress={selectImage}>
          <Text style={styles.buttonText}>Select Main Image</Text>
        </TouchableOpacity>
        
        {selectedImage && (
          <Image source={{ uri: selectedImage.uri }} style={styles.image} />
        )}
      </View>

      {/* Gallery Images Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gallery Images</Text>
        <TouchableOpacity style={styles.button} onPress={selectGalleryImages}>
          <Text style={styles.buttonText}>Select Gallery Images</Text>
        </TouchableOpacity>
        
        <View style={styles.galleryContainer}>
          {galleryImages.map((image, index) => (
            <Image key={index} source={{ uri: image.uri }} style={styles.galleryImage} />
          ))}
        </View>
      </View>

      {/* Upload Buttons */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={[styles.button, styles.uploadButton]} 
          onPress={uploadRestaurantImage}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Upload Restaurant Image</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.uploadButton]} 
          onPress={uploadDishWithGallery}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Upload Dish with Gallery</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  galleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  galleryImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    margin: 2,
  },
});

export default ImageUploadComponent;
```

## 🔧 Configuration

### API Base URL Configuration

```javascript
// config/api.js
export const API_BASE_URL = 'https://your-api-domain.com/api/v1';
export const API_ENDPOINTS = {
  RESTAURANTS: '/restaurants',
  DISHES: '/dishes',
  CATEGORIES: '/categories',
  ADVERTISEMENTS: '/advertisements',
  BANNERS: '/banners',
  USERS: '/users',
  UPLOAD: '/upload',
  MULTIPLE_IMAGES: '/multiple-images',
};
```

### Authentication Helper

```javascript
// utils/auth.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const setAuthToken = async (token) => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Error setting auth token:', error);
  }
};
```

## 🚨 Error Handling

### Handle Upload Errors

```javascript
const handleUploadError = (error, response) => {
  if (error) {
    console.error('Network error:', error);
    Alert.alert('Error', 'Network error occurred. Please check your connection.');
    return;
  }

  if (!response.ok) {
    let errorMessage = 'Upload failed';
    
    try {
      const errorData = JSON.parse(response._bodyText);
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      console.error('Error parsing response:', e);
    }

    Alert.alert('Error', errorMessage);
    return;
  }
};
```

### File Size Validation

```javascript
const validateFileSize = (fileSize, maxSize = 5 * 1024 * 1024) => {
  if (fileSize > maxSize) {
    Alert.alert('Error', 'File size is too large. Maximum size is 5MB.');
    return false;
  }
  return true;
};

const validateImageType = (mimeType) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(mimeType)) {
    Alert.alert('Error', 'Invalid file type. Please select an image file.');
    return false;
  }
  return true;
};
```

## 📱 Platform-Specific Considerations

### iOS Configuration

Add to `ios/Info.plist`:

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs access to photo library to select images for upload.</string>
<key>NSCameraUsageDescription</key>
<string>This app needs access to camera to take photos for upload.</string>
```

### Android Configuration

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

## 🧪 Testing

### Test Upload Function

```javascript
const testUpload = async () => {
  // Test with a sample image
  const testImage = {
    uri: 'file://path/to/test/image.jpg',
    type: 'image/jpeg',
    fileName: 'test_image.jpg',
  };

  try {
    await uploadSingleImage(testImage);
    console.log('Test upload completed');
  } catch (error) {
    console.error('Test upload failed:', error);
  }
};
```

This guide provides everything you need to implement image uploads from React Native to your new generic image upload middleware system. The examples cover all the different upload scenarios supported by your backend.
