import React, { useCallback, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme, Text, Button, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Restaurant Image Uploader Component
 * Handles single image upload for restaurants following the same pattern as dish image upload
 * Only supports file uploads, no URL input
 */
const RestaurantImageUploader = ({
  label = 'صورة المطعم',
  helperText = 'اختر صورة من الجهاز',
  value,
  onChange,
  compact = false,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme, compact);

  const requestPermissionIfNeeded = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('يجب منح إذن الوصول للصور للمتابعة');
    }
  }, []);

  const handlePick = useCallback(async () => {
    try {
      await requestPermissionIfNeeded();
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        quality: 0.8,
        allowsEditing: true,
        aspect: [16, 9],
        base64: false,
      });
      
      if (result.canceled) return;
      
      const asset = result.assets?.[0];
      if (!asset) return;

      // Create image object following the same pattern as dish upload
      const imageFile = {
        uri: asset.uri,
        type: 'image/jpeg',
        name: asset.uri.split('/').pop() || 'restaurant-image.jpg',
      };

      onChange && onChange(imageFile);
    } catch (e) {
      console.error('Image pick error:', e?.message || e);
    }
  }, [onChange, requestPermissionIfNeeded]);

  const removeImage = useCallback(() => {
    onChange && onChange(null);
  }, [onChange]);

  const hasImage = value && value.uri;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        {hasImage && (
          <Button onPress={removeImage} compact>
            إزالة الصورة
          </Button>
        )}
      </View>

      <View style={styles.actionsRow}>
        <Button 
          mode="outlined" 
          icon="image" 
          onPress={handlePick} 
          style={styles.actionBtn}
        >
          {hasImage ? 'تغيير الصورة' : 'اختر صورة'}
        </Button>
      </View>

      {helperText && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}

      {hasImage ? (
        <View style={styles.imagePreview}>
          <Image source={{ uri: value.uri }} style={styles.previewImage} resizeMode="cover" />
          <View style={styles.imageInfo}>
            <Text style={styles.imageName} numberOfLines={1}>
              {value.name}
            </Text>
            <IconButton 
              icon="close" 
              onPress={removeImage} 
              size={16} 
              style={styles.removeBtn} 
            />
          </View>
        </View>
      ) : (
        <View style={styles.placeholder}>
          <MaterialCommunityIcons 
            name="camera-plus" 
            size={48} 
            color={theme.colors.onSurfaceVariant} 
          />
          <Text style={styles.placeholderText}>لا توجد صورة مضافة</Text>
        </View>
      )}
    </View>
  );
};

const createStyles = (theme, compact) => StyleSheet.create({
  container: {
    marginVertical: compact ? 6 : 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: theme.colors.onSurface,
    fontWeight: '600',
    fontSize: 16,
  },
  actionsRow: {
    gap: 8,
  },
  actionBtn: {
    alignSelf: 'flex-start',
  },
  helperText: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 6,
    fontSize: 12,
  },
  placeholder: {
    height: 120,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.outlineVariant,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: theme.colors.surfaceVariant,
  },
  placeholderText: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 8,
    fontSize: 14,
  },
  imagePreview: {
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceVariant,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 200,
  },
  imageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: theme.colors.surface,
  },
  imageName: {
    flex: 1,
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
    marginRight: 8,
  },
  removeBtn: {
    margin: 0,
  },
});

export default RestaurantImageUploader;

