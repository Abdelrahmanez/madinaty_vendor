/**
 * PromocodeForm Component
 * --------------------------------------------
 * نموذج إنشاء وتعديل أكواد الخصم
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { 
  useTheme, 
  TextInput, 
  Button, 
  SegmentedButtons, 
  Switch,
  Text,
  HelperText
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PROMOCODE_TYPES, OFFER_APPLICATION_TYPES } from '../../../utils/enums';
import MultiSelectField from './MultiSelectField';
import promocodesService from '../services/promocodesService';

const PromocodeForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: PROMOCODE_TYPES.PERCENTAGE,
    value: '',
    appliesTo: OFFER_APPLICATION_TYPES.ALL_ORDERS,
    appliedToCategories: [],
    appliedToMenuItems: [],
    minOrderAmount: '',
    maxDiscountAmount: '',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    usageLimit: '',
    perUserLimit: '1',
    isActive: true
  });

  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const [errors, setErrors] = useState({});
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Initialize form with initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || '',
        description: initialData.description || '',
        type: initialData.type || PROMOCODE_TYPES.PERCENTAGE,
        value: initialData.value?.toString() || '',
        appliesTo: initialData.appliesTo || OFFER_APPLICATION_TYPES.ALL_ORDERS,
        appliedToCategories: initialData.appliedToCategories || [],
        appliedToMenuItems: initialData.appliedToMenuItems || [],
        minOrderAmount: initialData.minOrderAmount?.toString() || '',
        maxDiscountAmount: initialData.maxDiscountAmount?.toString() || '',
        startDate: new Date(initialData.startDate) || new Date(),
        endDate: new Date(initialData.endDate) || new Date(),
        usageLimit: initialData.usageLimit?.toString() || '',
        perUserLimit: initialData.perUserLimit?.toString() || '1',
        isActive: initialData.isActive ?? true
      });
    }
  }, [initialData]);

  // Fetch categories and menu items on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [categoriesData, menuItemsData] = await Promise.all([
          promocodesService.getRestaurantCategories(),
          promocodesService.getRestaurantMenuItems()
        ]);
        setCategories(categoriesData);
        setMenuItems(menuItemsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Code validation
    if (!formData.code.trim()) {
      newErrors.code = 'كود الخصم مطلوب';
    } else if (formData.code.length < 3) {
      newErrors.code = 'كود الخصم يجب أن يكون 3 أحرف على الأقل';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'وصف كود الخصم مطلوب';
    }

    // Value validation (only for non-free delivery types)
    if (formData.type !== PROMOCODE_TYPES.FREE_DELIVERY) {
      if (!formData.value) {
        newErrors.value = 'قيمة الخصم مطلوبة';
      } else {
        const value = parseFloat(formData.value);
        if (isNaN(value) || value < 0) {
          newErrors.value = 'قيمة الخصم يجب أن تكون رقم موجب';
        }
        if (formData.type === PROMOCODE_TYPES.PERCENTAGE && value > 100) {
          newErrors.value = 'النسبة المئوية لا يمكن أن تتجاوز 100%';
        }
      }
    }

    // Min order amount validation
    if (!formData.minOrderAmount) {
      newErrors.minOrderAmount = 'الحد الأدنى للطلب مطلوب';
    } else {
      const minAmount = parseFloat(formData.minOrderAmount);
      if (isNaN(minAmount) || minAmount < 0) {
        newErrors.minOrderAmount = 'الحد الأدنى للطلب يجب أن يكون رقم موجب';
      }
    }

    // Max discount amount validation (optional for percentage)
    if (formData.maxDiscountAmount && formData.type === PROMOCODE_TYPES.PERCENTAGE) {
      const maxAmount = parseFloat(formData.maxDiscountAmount);
      if (isNaN(maxAmount) || maxAmount < 0) {
        newErrors.maxDiscountAmount = 'الحد الأقصى للخصم يجب أن يكون رقم موجب';
      }
    }

    // Usage limit validation
    if (!formData.usageLimit) {
      newErrors.usageLimit = 'حد الاستخدام مطلوب';
    } else {
      const usageLimit = parseInt(formData.usageLimit);
      if (isNaN(usageLimit) || usageLimit <= 0) {
        newErrors.usageLimit = 'حد الاستخدام يجب أن يكون أكبر من 0';
      }
    }

    // Per user limit validation
    if (!formData.perUserLimit) {
      newErrors.perUserLimit = 'الحد لكل مستخدم مطلوب';
    } else {
      const perUserLimit = parseInt(formData.perUserLimit);
      if (isNaN(perUserLimit) || perUserLimit < 1) {
        newErrors.perUserLimit = 'الحد لكل مستخدم يجب أن يكون رقم موجب';
      }
    }

    // Date validation
    if (formData.endDate <= formData.startDate) {
      newErrors.endDate = 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية';
    }

    // Validation for appliesTo specific selections
    if (formData.appliesTo === OFFER_APPLICATION_TYPES.SPECIFIC_CATEGORIES && formData.appliedToCategories.length === 0) {
      newErrors.appliedToCategories = 'يجب اختيار فئة واحدة على الأقل';
    }

    if (formData.appliesTo === OFFER_APPLICATION_TYPES.SPECIFIC_ITEMS && formData.appliedToMenuItems.length === 0) {
      newErrors.appliedToMenuItems = 'يجب اختيار عنصر واحد على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const submitData = {
        ...formData,
        value: formData.type === PROMOCODE_TYPES.FREE_DELIVERY ? 0 : parseFloat(formData.value),
        minOrderAmount: parseFloat(formData.minOrderAmount),
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : 0,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : 0,
        perUserLimit: parseInt(formData.perUserLimit),
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        appliedToCategories: formData.appliedToCategories.map(cat => cat.id),
        appliedToMenuItems: formData.appliedToMenuItems.map(item => item.id)
      };

      onSubmit(submitData);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeOptions = () => [
    { value: PROMOCODE_TYPES.PERCENTAGE, label: 'نسبة مئوية' },
    { value: PROMOCODE_TYPES.FIXED_AMOUNT, label: 'مبلغ ثابت' },
    { value: PROMOCODE_TYPES.FREE_DELIVERY, label: 'توصيل مجاني' }
  ];

  const getAppliesToOptions = () => [
    { value: OFFER_APPLICATION_TYPES.ALL_ORDERS, label: 'جميع الطلبات' },
    { value: OFFER_APPLICATION_TYPES.SPECIFIC_CATEGORIES, label: 'فئات محددة' },
    { value: OFFER_APPLICATION_TYPES.SPECIFIC_ITEMS, label: 'عناصر محددة' }
  ];

  // Generate themed styles
  const themedStyles = {
    sectionTitle: { color: theme.colors.primary },
    infoValue: { color: theme.colors.primary },
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Basic Information Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, themedStyles.sectionTitle]}>📝 المعلومات الأساسية</Text>
            
            {/* Code */}
            <TextInput
              label="كود الخصم"
              value={formData.code}
              onChangeText={(text) => updateFormData('code', text.toUpperCase())}
              mode="outlined"
              style={styles.input}
              error={!!errors.code}
              disabled={loading}
            />
            {errors.code && <HelperText type="error">{errors.code}</HelperText>}

            {/* Description */}
            <TextInput
              label="وصف كود الخصم"
              value={formData.description}
              onChangeText={(text) => updateFormData('description', text)}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
              error={!!errors.description}
              disabled={loading}
            />
            {errors.description && <HelperText type="error">{errors.description}</HelperText>}
          </View>

          {/* Separator */}
          <View style={styles.sectionSeparator} />

          {/* Type and Application Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, themedStyles.sectionTitle]}>🎫 نوع الخصم والتطبيق</Text>
            
            {/* Type */}
            <Text style={styles.label}>نوع الخصم</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.segmentedButtonsContainer}
            >
              <SegmentedButtons
                value={formData.type}
                onValueChange={(value) => updateFormData('type', value)}
                buttons={getTypeOptions()}
                style={styles.segmentedButtons}
                buttonStyle={styles.segmentedButton}
                labelStyle={styles.segmentedButtonLabel}
                disabled={loading}
              />
            </ScrollView>

            {/* Applies To */}
            <Text style={styles.label}>ينطبق على</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.segmentedButtonsContainer}
            >
              <SegmentedButtons
                value={formData.appliesTo}
                onValueChange={(value) => updateFormData('appliesTo', value)}
                buttons={getAppliesToOptions()}
                style={styles.segmentedButtons}
                buttonStyle={styles.segmentedButton}
                labelStyle={styles.segmentedButtonLabel}
                disabled={loading}
              />
            </ScrollView>

            {/* Applied To Categories */}
            {formData.appliesTo === OFFER_APPLICATION_TYPES.SPECIFIC_CATEGORIES && (
              <>
                <MultiSelectField
                  label="الفئات المحددة"
                  selectedItems={formData.appliedToCategories}
                  availableItems={categories}
                  onSelectionChange={(selected) => updateFormData('appliedToCategories', selected)}
                  itemKey="id"
                  itemLabel="name"
                  placeholder="اختر الفئات"
                  disabled={loading}
                  loading={loadingData}
                />
                {errors.appliedToCategories && (
                  <HelperText type="error">{errors.appliedToCategories}</HelperText>
                )}
              </>
            )}

            {/* Applied To Menu Items */}
            {formData.appliesTo === OFFER_APPLICATION_TYPES.SPECIFIC_ITEMS && (
              <>
                <MultiSelectField
                  label="العناصر المحددة"
                  selectedItems={formData.appliedToMenuItems}
                  availableItems={menuItems}
                  onSelectionChange={(selected) => updateFormData('appliedToMenuItems', selected)}
                  itemKey="id"
                  itemLabel="name"
                  placeholder="اختر العناصر"
                  disabled={loading}
                  loading={loadingData}
                />
                {errors.appliedToMenuItems && (
                  <HelperText type="error">{errors.appliedToMenuItems}</HelperText>
                )}
              </>
            )}
          </View>

          {/* Separator */}
          <View style={styles.sectionSeparator} />

          {/* Value and Limits Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, themedStyles.sectionTitle]}>💰 القيم والحدود</Text>
            
            {/* Value */}
            {formData.type !== PROMOCODE_TYPES.FREE_DELIVERY && (
              <>
                <TextInput
                  label={formData.type === PROMOCODE_TYPES.PERCENTAGE ? 'النسبة المئوية (%)' : 'المبلغ (جنية)'}
                  value={formData.value}
                  onChangeText={(text) => updateFormData('value', text)}
                  mode="outlined"
                  style={styles.input}
                  keyboardType="numeric"
                  error={!!errors.value}
                  disabled={loading}
                />
                {errors.value && <HelperText type="error">{errors.value}</HelperText>}
              </>
            )}

            {/* Max Discount Amount (only for percentage) */}
            {formData.type === PROMOCODE_TYPES.PERCENTAGE && (
              <>
                <TextInput
                  label="الحد الأقصى للخصم (جنية) - اختياري"
                  value={formData.maxDiscountAmount}
                  onChangeText={(text) => updateFormData('maxDiscountAmount', text)}
                  mode="outlined"
                  style={styles.input}
                  keyboardType="numeric"
                  error={!!errors.maxDiscountAmount}
                  disabled={loading}
                />
                {errors.maxDiscountAmount && <HelperText type="error">{errors.maxDiscountAmount}</HelperText>}
              </>
            )}

            {/* Min Order Amount */}
            <TextInput
              label="الحد الأدنى للطلب (جنية)"
              value={formData.minOrderAmount}
              onChangeText={(text) => updateFormData('minOrderAmount', text)}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              error={!!errors.minOrderAmount}
              disabled={loading}
            />
            {errors.minOrderAmount && <HelperText type="error">{errors.minOrderAmount}</HelperText>}

            {/* Usage Limit */}
            <TextInput
              label="حد الاستخدام"
              value={formData.usageLimit}
              onChangeText={(text) => updateFormData('usageLimit', text)}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              error={!!errors.usageLimit}
              disabled={loading}
            />
            {errors.usageLimit && <HelperText type="error">{errors.usageLimit}</HelperText>}

            {/* Per User Limit */}
            <TextInput
              label="الحد لكل مستخدم"
              value={formData.perUserLimit}
              onChangeText={(text) => updateFormData('perUserLimit', text)}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              error={!!errors.perUserLimit}
              disabled={loading}
            />
            {errors.perUserLimit && <HelperText type="error">{errors.perUserLimit}</HelperText>}
          </View>

          {/* Separator */}
          <View style={styles.sectionSeparator} />

          {/* Date Range Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, themedStyles.sectionTitle]}>📅 نطاق التاريخ</Text>
            
            <View style={styles.twoColumnRow}>
              <View style={styles.infoColumn}>
                <Text style={styles.infoLabel}>تاريخ البداية:</Text>
                <TouchableOpacity 
                  onPress={() => setShowStartDatePicker(true)}
                  style={styles.dateButton}
                  disabled={loading}
                >
                  <Text style={[styles.infoValue, themedStyles.infoValue]}>
                    {formatDate(formData.startDate)}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.infoColumn}>
                <Text style={styles.infoLabel}>تاريخ الانتهاء:</Text>
                <TouchableOpacity 
                  onPress={() => setShowEndDatePicker(true)}
                  style={styles.dateButton}
                  disabled={loading}
                >
                  <Text style={[styles.infoValue, themedStyles.infoValue]}>
                    {formatDate(formData.endDate)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {errors.endDate && <HelperText type="error">{errors.endDate}</HelperText>}
          </View>

          {/* Separator */}
          <View style={styles.sectionSeparator} />

          {/* Status Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, themedStyles.sectionTitle]}>⚙️ الحالة</Text>
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>
                تفعيل كود الخصم
              </Text>
              <Switch
                value={formData.isActive}
                onValueChange={(value) => updateFormData('isActive', value)}
                disabled={loading}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Date Pickers - Inside Modal */}
      {showStartDatePicker && (
        <View style={styles.datePickerOverlay}>
          <View style={styles.datePickerContainer}>
            <View style={styles.datePickerHeader}>
              <Text style={styles.datePickerTitle}>اختر تاريخ البداية</Text>
              <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
                <MaterialCommunityIcons name="close" size={24} color={theme.colors.onSurface} />
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={formData.startDate}
              mode="datetime"
              onChange={(event, selectedDate) => {
                setShowStartDatePicker(false);
                if (selectedDate) {
                  updateFormData('startDate', selectedDate);
                }
              }}
            />
          </View>
        </View>
      )}

      {showEndDatePicker && (
        <View style={styles.datePickerOverlay}>
          <View style={styles.datePickerContainer}>
            <View style={styles.datePickerHeader}>
              <Text style={styles.datePickerTitle}>اختر تاريخ النهاية</Text>
              <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                <MaterialCommunityIcons name="close" size={24} color={theme.colors.onSurface} />
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={formData.endDate}
              mode="datetime"
              onChange={(event, selectedDate) => {
                setShowEndDatePicker(false);
                if (selectedDate) {
                  updateFormData('endDate', selectedDate);
                }
              }}
            />
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  form: {
    padding: 10
  },
  section: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderColor: '#e9ecef',
    borderBottomColor: '#f8f9fa',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    paddingBottom: 8,
  },
  sectionSeparator: {
    height: 2,
    backgroundColor: '#e9ecef',
    marginVertical: 8,
    marginHorizontal: 20,
    borderRadius: 0.5,
  },
  input: {
    marginBottom: 8
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#000'
  },
  segmentedButtonsContainer: {
    paddingHorizontal: 4,
    minWidth: '100%'
  },
  segmentedButtons: {
    marginBottom: 16,
    minWidth: '100%'
  },
  segmentedButton: {
    minWidth: 120,
    paddingHorizontal: 8
  },
  segmentedButtonLabel: {
    fontSize: 12,
    textAlign: 'center'
  },
  twoColumnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoColumn: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    paddingVertical: 8
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000'
  },

  // Date Picker Styles
  datePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    minWidth: 300,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  datePickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});

export default PromocodeForm;
