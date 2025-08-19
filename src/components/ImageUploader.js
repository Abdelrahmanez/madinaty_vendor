import React, { useCallback, useMemo, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme, Text, Button, TextInput, Chip, IconButton } from 'react-native-paper';

/**
 * A reusable image uploader that supports:
 * - Single or multiple selection (via `multiple` prop)
 * - Picking from library using expo-image-picker
 * - Preview, remove, and clear
 *
 * NOTE: Only supports photo picking from device gallery/library.
 * Selected images will be uploaded to the backend for processing.
 */
const ImageUploader = ({
  label = 'الصور',
  helperText,
  multiple = false,
  max = 5,
  value,
  onChange,
  allowUrlInput = false,
  compact = false,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme, compact);
  const images = useMemo(() => (multiple ? (Array.isArray(value) ? value : []) : value ? [value] : []), [value, multiple]);

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
        // Expo SDK 52+ expects an array of media types
        mediaTypes: ['images'],
        quality: 0.8,
        allowsMultipleSelection: false, // Accumulate manually for cross-platform consistency
        base64: false,
      });
      if (result.canceled) return;
      const pickedUri = result.assets?.[0]?.uri;
      if (!pickedUri) return;

      if (multiple) {
        const next = [...images, pickedUri].slice(0, max);
        onChange && onChange(next);
      } else {
        onChange && onChange(pickedUri);
      }
    } catch (e) {
      console.error('Image pick error:', e?.message || e);
    }
  }, [images, max, multiple, onChange, requestPermissionIfNeeded]);



  const removeAt = useCallback((index) => {
    if (multiple) {
      const next = images.filter((_, i) => i !== index);
      onChange && onChange(next);
    } else {
      onChange && onChange(null);
    }
  }, [images, multiple, onChange]);

  const handleClearAll = useCallback(() => {
    onChange && onChange(multiple ? [] : null);
  }, [multiple, onChange]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        {images.length > 0 && (
          <Button onPress={handleClearAll} compact>
            مسح الكل
          </Button>
        )}
      </View>

      <View style={styles.actionsRow}>
        <Button mode="outlined" icon="image" onPress={handlePick} style={styles.actionBtn}>
          اختر صورة
        </Button>
      </View>

      {helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}

      {images.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.previewRow}>
          {images.map((uri, idx) => (
            <View key={`${uri}-${idx}`} style={styles.previewCard}>
              <Image source={{ uri }} style={styles.previewImage} resizeMode="cover" />
              <View style={styles.previewFooter}>
                <Chip style={styles.uriChip} ellipsizeMode="tail" numberOfLines={1}>
                  {uri.replace(/^file:\/\//, '').slice(0, 30)}
                </Chip>
                <IconButton icon="close" onPress={() => removeAt(idx)} size={16} style={styles.removeBtn} />
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>لا توجد صور مضافة بعد</Text>
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
    height: 80,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  placeholderText: {
    color: theme.colors.onSurfaceVariant,
  },
  previewRow: {
    paddingVertical: 8,
    gap: 10,
  },
  previewCard: {
    width: 90,
    height: 110,
    borderRadius: 10,
    backgroundColor: theme.colors.surfaceVariant,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 70,
  },
  previewFooter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  uriChip: {
    flex: 1,
  },
  removeBtn: {
    margin: 0,
  },
});

export default ImageUploader;


