import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Switch, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * مكون نموذج منطقة التوصيل
 */
const ZoneForm = ({ 
  zone = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const theme = useTheme();
  const isEditing = !!zone;

  // حالة النموذج
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deliveryFee: '',
    deliveryTime: '',
    isActive: true,
    coordinates: {
      latitude: '',
      longitude: ''
    },
    radius: ''
  });

  // أخطاء التحقق
  const [errors, setErrors] = useState({});

  // تحميل بيانات المنطقة عند التعديل
  useEffect(() => {
    if (zone) {
      setFormData({
        name: zone.name || '',
        description: zone.description || '',
        deliveryFee: zone.deliveryFee?.toString() || '',
        deliveryTime: zone.deliveryTime?.toString() || '',
        isActive: zone.isActive !== undefined ? zone.isActive : true,
        coordinates: {
          latitude: zone.coordinates?.latitude?.toString() || '',
          longitude: zone.coordinates?.longitude?.toString() || ''
        },
        radius: zone.radius?.toString() || ''
      });
    }
  }, [zone]);

  // التحقق من صحة النموذج
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'اسم المنطقة مطلوب';
    }

    if (!formData.deliveryFee.trim()) {
      newErrors.deliveryFee = 'رسوم التوصيل مطلوبة';
    } else if (isNaN(Number(formData.deliveryFee)) || Number(formData.deliveryFee) < 0) {
      newErrors.deliveryFee = 'رسوم التوصيل يجب أن تكون رقم موجب';
    }

    if (!formData.deliveryTime.trim()) {
      newErrors.deliveryTime = 'وقت التوصيل مطلوب';
    } else if (isNaN(Number(formData.deliveryTime)) || Number(formData.deliveryTime) < 1) {
      newErrors.deliveryTime = 'وقت التوصيل يجب أن يكون رقم موجب';
    }

    if (formData.coordinates.latitude && isNaN(Number(formData.coordinates.latitude))) {
      newErrors.latitude = 'خط العرض يجب أن يكون رقم صحيح';
    }

    if (formData.coordinates.longitude && isNaN(Number(formData.coordinates.longitude))) {
      newErrors.longitude = 'خط الطول يجب أن يكون رقم صحيح';
    }

    if (formData.radius && isNaN(Number(formData.radius))) {
      newErrors.radius = 'نصف القطر يجب أن يكون رقم صحيح';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // إرسال النموذج
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      deliveryFee: Number(formData.deliveryFee),
      deliveryTime: Number(formData.deliveryTime),
      isActive: formData.isActive,
      coordinates: formData.coordinates.latitude && formData.coordinates.longitude ? {
        latitude: Number(formData.coordinates.latitude),
        longitude: Number(formData.coordinates.longitude)
      } : null,
      radius: formData.radius ? Number(formData.radius) : null
    };

    onSubmit(submitData);
  };

  // تحديث قيمة الحقل
  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // مسح خطأ الحقل عند التعديل
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // تحديث إحداثيات
  const updateCoordinates = (field, value) => {
    setFormData(prev => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [field]: value
      }
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <View style={styles.header}>
          <MaterialCommunityIcons 
            name={isEditing ? "pencil" : "plus-circle"} 
            size={32} 
            color={theme.colors.primary} 
          />
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            {isEditing ? 'تعديل منطقة التوصيل' : 'إضافة منطقة توصيل جديدة'}
          </Text>
        </View>

        {/* اسم المنطقة */}
        <TextInput
          mode="outlined"
          label="اسم المنطقة *"
          placeholder="مثال: وسط البلد"
          value={formData.name}
          onChangeText={(value) => updateField('name', value)}
          error={!!errors.name}
          style={styles.input}
          left={<TextInput.Icon icon="map-marker" />}
        />
        {errors.name && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.name}</Text>}

        {/* وصف المنطقة */}
        <TextInput
          mode="outlined"
          label="وصف المنطقة"
          placeholder="وصف مختصر للمنطقة"
          value={formData.description}
          onChangeText={(value) => updateField('description', value)}
          multiline
          numberOfLines={3}
          style={styles.input}
          left={<TextInput.Icon icon="text" />}
        />

        {/* رسوم التوصيل */}
        <TextInput
          mode="outlined"
          label="رسوم التوصيل (جنيه) *"
          placeholder="0"
          value={formData.deliveryFee}
          onChangeText={(value) => updateField('deliveryFee', value)}
          error={!!errors.deliveryFee}
          keyboardType="numeric"
          style={styles.input}
          left={<TextInput.Icon icon="currency-usd" />}
        />
        {errors.deliveryFee && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.deliveryFee}</Text>}

        {/* وقت التوصيل */}
        <TextInput
          mode="outlined"
          label="وقت التوصيل (دقيقة) *"
          placeholder="30"
          value={formData.deliveryTime}
          onChangeText={(value) => updateField('deliveryTime', value)}
          error={!!errors.deliveryTime}
          keyboardType="numeric"
          style={styles.input}
          left={<TextInput.Icon icon="clock-outline" />}
        />
        {errors.deliveryTime && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.deliveryTime}</Text>}

        {/* إحداثيات المنطقة */}
        <View style={styles.coordinatesContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            إحداثيات المنطقة (اختياري)
          </Text>
          
          <View style={styles.coordinatesRow}>
            <TextInput
              mode="outlined"
              label="خط العرض"
              placeholder="30.0444"
              value={formData.coordinates.latitude}
              onChangeText={(value) => updateCoordinates('latitude', value)}
              error={!!errors.latitude}
              keyboardType="numeric"
              style={[styles.input, styles.halfInput]}
              left={<TextInput.Icon icon="latitude" />}
            />
            
            <TextInput
              mode="outlined"
              label="خط الطول"
              placeholder="31.2357"
              value={formData.coordinates.longitude}
              onChangeText={(value) => updateCoordinates('longitude', value)}
              error={!!errors.longitude}
              keyboardType="numeric"
              style={[styles.input, styles.halfInput]}
              left={<TextInput.Icon icon="longitude" />}
            />
          </View>
          
          {errors.latitude && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.latitude}</Text>}
          {errors.longitude && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.longitude}</Text>}
        </View>

        {/* نصف القطر */}
        <TextInput
          mode="outlined"
          label="نصف القطر (كم)"
          placeholder="5"
          value={formData.radius}
          onChangeText={(value) => updateField('radius', value)}
          error={!!errors.radius}
          keyboardType="numeric"
          style={styles.input}
          left={<TextInput.Icon icon="radius" />}
        />
        {errors.radius && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.radius}</Text>}

        {/* حالة المنطقة */}
        <View style={styles.switchContainer}>
          <Text style={[styles.switchLabel, { color: theme.colors.onSurface }]}>
            تفعيل المنطقة
          </Text>
          <Switch
            value={formData.isActive}
            onValueChange={(value) => updateField('isActive', value)}
            color={theme.colors.primary}
          />
        </View>

        {/* أزرار التحكم */}
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={onCancel}
            style={[styles.button, styles.cancelButton]}
            disabled={loading}
          >
            إلغاء
          </Button>
          
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={[styles.button, styles.submitButton]}
          >
            {isEditing ? 'تحديث' : 'إضافة'}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
  },
  input: {
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  coordinatesContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  coordinatesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
    marginLeft: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    borderColor: '#666',
  },
  submitButton: {
    // استخدام الألوان الافتراضية للثيم
  },
});

export default ZoneForm;
