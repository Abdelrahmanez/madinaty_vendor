import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * مكون نموذج تعديل سعر منطقة التوصيل
 */
const PriceForm = ({ 
  zone = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const theme = useTheme();

  // حالة النموذج
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState({});

  // تحميل سعر المنطقة عند التعديل
  useEffect(() => {
    if (zone && zone.price !== undefined && zone.price !== null) {
      setPrice(zone.price.toString());
    }
  }, [zone]);

  // التحقق من صحة النموذج
  const validateForm = () => {
    const newErrors = {};

    if (!price || !price.trim()) {
      newErrors.price = 'سعر التوصيل مطلوب';
    } else if (isNaN(Number(price)) || Number(price) < 0) {
      newErrors.price = 'سعر التوصيل يجب أن يكون رقم موجب';
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
      price: Number(price)
    };

    onSubmit(submitData);
  };

  // تحديث قيمة السعر
  const updatePrice = (value) => {
    setPrice(value || '');
    if (errors.price) {
      setErrors(prev => ({
        ...prev,
        price: null
      }));
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <View style={styles.header}>
          <MaterialCommunityIcons 
            name="currency-usd" 
            size={32} 
            color={theme.colors.primary} 
          />
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            تعديل سعر التوصيل
          </Text>
        </View>

        {/* معلومات المنطقة */}
        {zone && (
          <View style={styles.zoneInfo}>
            <Text style={[styles.zoneName, { color: theme.colors.onSurface }]}>
              {zone.name || 'منطقة بدون اسم'}
            </Text>
            {zone.description && (
              <Text style={[styles.zoneDescription, { color: theme.colors.onSurfaceVariant }]}>
                {zone.description}
              </Text>
            )}
            <Text style={[styles.zoneStatus, { color: theme.colors.onSurfaceVariant }]}>
              الحالة: {zone.isActive && zone.isRestaurantZoneActive ? 'نشط' : 'غير نشط'}
            </Text>
          </View>
        )}

        {/* سعر التوصيل */}
        <TextInput
          mode="outlined"
          label="سعر التوصيل (جنيه) *"
          placeholder="0"
          value={price}
          onChangeText={updatePrice}
          error={!!errors.price}
          keyboardType="numeric"
          style={styles.input}
          left={<TextInput.Icon icon="currency-usd" />}
        />
        {errors.price && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.price}</Text>}

        {/* معلومات إضافية */}
        <View style={styles.infoContainer}>
          <MaterialCommunityIcons 
            name="information" 
            size={20} 
            color={theme.colors.primary} 
          />
          <Text style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
            سيتم تطبيق هذا السعر على جميع الطلبات المقدمة من هذه المنطقة
          </Text>
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
            حفظ السعر
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
  zoneInfo: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  zoneName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  zoneDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  zoneStatus: {
    fontSize: 14,
    marginTop: 8,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
    marginLeft: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
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

export default PriceForm;
