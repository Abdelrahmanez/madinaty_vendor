import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Keyboard } from 'react-native';
import { useTheme, TextInput, Button, Card, Text, Switch, SegmentedButtons } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ADDON_CATEGORIES, ADDON_CATEGORY_LABELS } from '../../../utils/enums';

const AddonForm = ({
  addon = null,
  onSave,
  onCancel,
  loading = false,
  isEditing = false
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  // Form state
  const [name, setName] = useState(addon?.name || '');
  const [price, setPrice] = useState(addon?.price?.toString() || '');
  const [description, setDescription] = useState(addon?.description || '');
  const [isVisible, setIsVisible] = useState(addon?.isVisible ?? true);
  const [category, setCategory] = useState(addon?.category || ADDON_CATEGORIES.GENERAL);

  // Reset form when addon changes
  useEffect(() => {
    if (addon) {
      setName(addon.name || '');
      setPrice(addon.price?.toString() || '');
      setDescription(addon.description || '');
      setIsVisible(addon.isVisible ?? true);
      setCategory(addon.category || ADDON_CATEGORIES.GENERAL);
    }
  }, [addon]);

  const handleSave = async () => {
    if (!name.trim() || !price.trim()) {
      return;
    }

    // Dismiss keyboard before saving
    Keyboard.dismiss();

    const addonData = {
      name: name.trim(),
      price: parseFloat(price),
      description: description.trim(),
      isVisible,
      category
    };

    await onSave(addonData);
  };

  const handleCancel = () => {
    // Dismiss keyboard before canceling
    Keyboard.dismiss();
    onCancel();
  };

  const isValid = name.trim() && price.trim() && parseFloat(price) > 0;

  // Get category options for segmented buttons
  const categoryOptions = Object.values(ADDON_CATEGORIES).map(cat => ({
    value: cat,
    label: ADDON_CATEGORY_LABELS[cat] || cat
  }));

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
          <View style={styles.header}>
            <MaterialCommunityIcons
              name="plus-circle-multiple"
              size={24}
              color={theme.colors.primary}
            />
            <Text variant="titleMedium" style={styles.title}>
              {isEditing ? 'تعديل الإضافة' : 'إضافة جديدة'}
            </Text>
          </View>

        <TextInput
          label="اسم الإضافة"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
          right={<TextInput.Icon icon="tag" />}
        />

        <TextInput
          label="السعر (ج.م)"
          value={price}
          onChangeText={setPrice}
          style={styles.input}
          mode="outlined"
          keyboardType="numeric"
          right={<TextInput.Icon icon="currency-usd" />}
        />

        <TextInput
          label="الوصف (اختياري)"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={3}
          right={<TextInput.Icon icon="text" />}
        />

        <View style={styles.categorySection}>
          <Text variant="bodyMedium" style={styles.categoryLabel}>
            الفئة:
          </Text>
          <SegmentedButtons
            value={category}
            onValueChange={setCategory}
            buttons={categoryOptions}
            style={styles.segmentedButtons}
          />
        </View>

        <View style={styles.switchSection}>
          <Text variant="bodyMedium" style={styles.switchLabel}>إظهار الإضافة:</Text>
          <Switch
            value={isVisible}
            onValueChange={setIsVisible}
            color={theme.colors.primary}
          />
        </View>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={loading}
            disabled={loading || !isValid}
            icon="content-save"
            style={[styles.button, styles.saveButton]}
          >
            {isEditing ? 'حفظ التغييرات' : 'إضافة الإضافة'}
          </Button>

          <Button
            mode="outlined"
            onPress={handleCancel}
            disabled={loading}
            style={[styles.button, styles.cancelButton]}
            icon="close"
          >
            إلغاء
          </Button>
                  </View>
        </ScrollView>
      </View>
    );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  categorySection: {
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
    borderBottomWidth: 2,
    borderBottomColor: '#f8f9fa',
  },
  categoryLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    paddingBottom: 8,
    color: '#000',
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  switchSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  switchLabel: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  button: {
    flex: 1,
    borderRadius: 10,
    minHeight: 50,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  cancelButton: {
    borderColor: '#dc3545',
  },
});

export default AddonForm;
