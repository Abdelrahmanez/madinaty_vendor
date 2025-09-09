import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme, TextInput, Button, HelperText, Chip } from 'react-native-paper';
import { fetchCategories } from '../../menu/api/categories';
import RestaurantImageUploader from './RestaurantImageUploader';

/**
 * Restaurant Form Component
 * Allows editing of restaurant information including image and categories
 */
const RestaurantForm = ({ 
  restaurant, 
  onSubmit, 
  loading = false,
  onCancel 
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phoneNumber: '',
    address: {
      street: '',
      notes: ''
    },
    image: null,
    categories: []
  });

  // Available options
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories('restaurant');
        setCategories(categoriesData);
      } catch (error) {
      }
    };
    loadCategories();
  }, []);

  // Initialize form with restaurant data
  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || '',
        description: restaurant.description || '',
        phoneNumber: restaurant.phoneNumber || '',
        address: {
          street: restaurant.address?.street || '',
          notes: restaurant.address?.notes || ''
        },
        image: null,
        categories: restaurant.categories?.map(cat => cat.id || cat._id) || []
      });
    }
  }, [restaurant]);

  // Handle form field changes
  const updateFormData = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };



  // Handle category selection
  const toggleCategory = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'اسم المطعم مطلوب';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'رقم الهاتف مطلوب';
    }

    if (!formData.address.street.trim()) {
      newErrors.street = 'عنوان الشارع مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Create FormData for multipart/form-data submission
      const formDataToSend = new FormData();
      
      // Add basic restaurant data
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      
      // Add address data
      formDataToSend.append('address[street]', formData.address.street);
      formDataToSend.append('address[notes]', formData.address.notes);
      
      // Add image if selected - this is the key part for the backend
      if (formData.image && formData.image.uri) {
        // Create the file object correctly for React Native
        const imageFile = {
          uri: formData.image.uri,
          type: formData.image.type || 'image/jpeg',
          name: formData.image.name || 'restaurant-image.jpg'
        };
        formDataToSend.append('image', imageFile);
      } else {
      }
      
      // Add categories
      if (formData.categories && formData.categories.length > 0) {
        formData.categories.forEach(categoryId => {
          formDataToSend.append('categories[]', categoryId);
        });
      }

      
      // Debug: Check if image is properly added to FormData
      const formDataEntries = Array.from(formDataToSend._parts || []);
      const imageEntry = formDataEntries.find(entry => entry[0] === 'image');
      if (imageEntry) {
      } else {
      }
      
      await onSubmit(formDataToSend);
    } catch (error) {
    }
  };





  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          لا يمكن تحميل بيانات المطعم
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Restaurant Image */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          صورة المطعم
        </Text>
        <RestaurantImageUploader
          label="الصورة الرئيسية"
          helperText="اختر صورة من الجهاز"
          value={formData.image}
          onChange={(image) => setFormData(prev => ({ ...prev, image }))}
          compact
        />
      </View>

      {/* Basic Information */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          المعلومات الأساسية
        </Text>
        
        <TextInput
          label="اسم المطعم"
          value={formData.name}
          onChangeText={(text) => updateFormData('name', text)}
          style={styles.input}
          mode="outlined"
          error={!!errors.name}
        />
        {errors.name && <HelperText type="error">{errors.name}</HelperText>}

        <TextInput
          label="وصف المطعم"
          value={formData.description}
          onChangeText={(text) => updateFormData('description', text)}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={3}
        />

        <TextInput
          label="رقم الهاتف"
          value={formData.phoneNumber}
          onChangeText={(text) => updateFormData('phoneNumber', text)}
          style={styles.input}
          mode="outlined"
          keyboardType="phone-pad"
          error={!!errors.phoneNumber}
        />
        {errors.phoneNumber && <HelperText type="error">{errors.phoneNumber}</HelperText>}
      </View>

      {/* Address Information */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          معلومات العنوان
        </Text>
        
        <TextInput
          label="اسم الشارع"
          value={formData.address.street}
          onChangeText={(text) => updateFormData('address.street', text)}
          style={styles.input}
          mode="outlined"
          error={!!errors.street}
        />
        {errors.street && <HelperText type="error">{errors.street}</HelperText>}

        <TextInput
          label="ملاحظات إضافية"
          value={formData.address.notes}
          onChangeText={(text) => updateFormData('address.notes', text)}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={2}
        />

        {/* Note: Delivery zone selection removed as it's not needed for restaurant management */}
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          فئات الطعام
        </Text>
        
        <Text style={[styles.categoriesSubtitle, { color: theme.colors.onSurfaceVariant }]}>
          اختر الفئات التي يقدمها مطعمك
        </Text>
        
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <Chip
              key={category.id || category._id}
              selected={formData.categories.includes(category.id || category._id)}
              onPress={() => toggleCategory(category.id || category._id)}
              style={styles.categoryChip}
              mode={formData.categories.includes(category.id || category._id) ? 'flat' : 'outlined'}
            >
              {category.name}
            </Chip>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
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
          حفظ التغييرات
        </Button>
      </View>
    </ScrollView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },

  categoriesSubtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    borderColor: theme.colors.outline,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
});

export default RestaurantForm;
