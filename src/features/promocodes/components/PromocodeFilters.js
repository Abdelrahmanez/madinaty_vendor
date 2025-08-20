/**
 * PromocodeFilters Component
 * --------------------------------------------
 * مكون فلاتر أكواد الخصم
 */

import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity
} from 'react-native';
import { 
  useTheme, 
  Text, 
  Chip, 
  Button, 
  SegmentedButtons,
  TextInput
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PROMOCODE_TYPES } from '../../../utils/enums';
import SharedModal from '../../../components/SharedModal';

const PromocodeFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  visible = false,
  onDismiss 
}) => {
  const theme = useTheme();
  
  const [localFilters, setLocalFilters] = useState(filters);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'الكل' },
    { value: 'active', label: 'مفعل' },
    { value: 'inactive', label: 'غير مفعل' },
    { value: 'expired', label: 'منتهي الصلاحية' },
    { value: 'not_started', label: 'لم يبدأ بعد' },
    { value: 'usage_limit_reached', label: 'تم استنفاذ الحد' }
  ];

  const typeOptions = [
    { value: 'all', label: 'الكل' },
    { value: PROMOCODE_TYPES.PERCENTAGE, label: 'نسبة مئوية' },
    { value: PROMOCODE_TYPES.FIXED_AMOUNT, label: 'مبلغ ثابت' },
    { value: PROMOCODE_TYPES.FREE_DELIVERY, label: 'توصيل مجاني' }
  ];

  const appliesToOptions = [
    { value: 'all', label: 'الكل' },
    { value: 'all_orders', label: 'جميع الطلبات' },
    { value: 'specific_categories', label: 'فئات محددة' },
    { value: 'specific_items', label: 'عناصر محددة' }
  ];

  const updateLocalFilters = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onDismiss();
  };

  const clearFilters = () => {
    const clearedFilters = {
      status: 'all',
      type: 'all',
      appliesTo: 'all',
      searchText: '',
      startDate: null,
      endDate: null
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
    onDismiss();
  };

  const formatDate = (date) => {
    if (!date) return 'غير محدد';
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.status !== 'all') count++;
    if (filters.type !== 'all') count++;
    if (filters.appliesTo !== 'all') count++;
    if (filters.searchText) count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    return count;
  };

  // Generate themed styles
  const themedStyles = {
    sectionTitle: { color: theme.colors.primary },
    infoValue: { color: theme.colors.primary },
  };

  return (
    <>
      {/* Filter Button */}
      <Button
        mode="outlined"
        onPress={() => onDismiss()}
        icon="filter-variant"
        style={styles.filterButton}
        contentStyle={styles.filterButtonContent}
      >
        فلاتر
        {getActiveFiltersCount() > 0 && (
          <Chip 
            style={styles.filterChip} 
            textStyle={styles.filterChipText}
          >
            {getActiveFiltersCount()}
          </Chip>
        )}
      </Button>

      {/* Filter Modal */}
      <SharedModal
        visible={visible}
        title="فلاتر أكواد الخصم"
        onDismiss={onDismiss}
        footerContent={
          <View style={styles.actionsContainer}>
            <Button
              mode="outlined"
              onPress={clearFilters}
              style={[styles.actionButton, styles.clearButton]}
              textColor={theme.colors.error}
            >
              مسح الكل
            </Button>
            <Button
              mode="contained"
              onPress={applyFilters}
              style={[styles.actionButton, styles.applyButton]}
            >
              تطبيق الفلاتر
            </Button>
          </View>
        }
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Search Section */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, themedStyles.sectionTitle]}>🔍 البحث</Text>
                <TextInput
                  label="البحث في الكود أو الوصف"
                  value={localFilters.searchText}
                  onChangeText={(text) => updateLocalFilters('searchText', text)}
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Icon icon="magnify" />}
                />
              </View>

              {/* Separator */}
              <View style={styles.sectionSeparator} />

              {/* Status Filter */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, themedStyles.sectionTitle]}>📊 الحالة</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.segmentedButtonsContainer}
                >
                  <SegmentedButtons
                    value={localFilters.status}
                    onValueChange={(value) => updateLocalFilters('status', value)}
                    buttons={statusOptions}
                    style={styles.segmentedButtons}
                    buttonStyle={styles.segmentedButton}
                    labelStyle={styles.segmentedButtonLabel}
                  />
                </ScrollView>
              </View>

              {/* Separator */}
              <View style={styles.sectionSeparator} />

              {/* Type Filter */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, themedStyles.sectionTitle]}>🎫 نوع الخصم</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.segmentedButtonsContainer}
                >
                  <SegmentedButtons
                    value={localFilters.type}
                    onValueChange={(value) => updateLocalFilters('type', value)}
                    buttons={typeOptions}
                    style={styles.segmentedButtons}
                    buttonStyle={styles.segmentedButton}
                    labelStyle={styles.segmentedButtonLabel}
                  />
                </ScrollView>
              </View>

              {/* Separator */}
              <View style={styles.sectionSeparator} />

              {/* Applies To Filter */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, themedStyles.sectionTitle]}>🎯 ينطبق على</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.segmentedButtonsContainer}
                >
                  <SegmentedButtons
                    value={localFilters.appliesTo}
                    onValueChange={(value) => updateLocalFilters('appliesTo', value)}
                    buttons={appliesToOptions}
                    style={styles.segmentedButtons}
                    buttonStyle={styles.segmentedButton}
                    labelStyle={styles.segmentedButtonLabel}
                  />
                </ScrollView>
              </View>

              {/* Separator */}
              <View style={styles.sectionSeparator} />

              {/* Date Range */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, themedStyles.sectionTitle]}>📅 نطاق التاريخ</Text>
                
                <View style={styles.twoColumnRow}>
                  <View style={styles.infoColumn}>
                    <Text style={styles.infoLabel}>من تاريخ:</Text>
                    <TouchableOpacity 
                      onPress={() => setShowStartDatePicker(true)}
                      style={styles.dateButton}
                    >
                      <Text style={[styles.infoValue, themedStyles.infoValue]}>
                        {formatDate(localFilters.startDate)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.infoColumn}>
                    <Text style={styles.infoLabel}>إلى تاريخ:</Text>
                    <TouchableOpacity 
                      onPress={() => setShowEndDatePicker(true)}
                      style={styles.dateButton}
                    >
                      <Text style={[styles.infoValue, themedStyles.infoValue]}>
                        {formatDate(localFilters.endDate)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <Button
                mode="outlined"
                onPress={clearFilters}
                style={[styles.actionButton, styles.clearButton]}
                textColor={theme.colors.error}
              >
                مسح الكل
              </Button>
              <Button
                mode="contained"
                onPress={applyFilters}
                style={[styles.actionButton, styles.applyButton]}
              >
                تطبيق الفلاتر
              </Button>
            </View>
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
                value={localFilters.startDate || new Date()}
                mode="date"
                onChange={(event, selectedDate) => {
                  setShowStartDatePicker(false);
                  if (selectedDate) {
                    updateLocalFilters('startDate', selectedDate);
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
                value={localFilters.endDate || new Date()}
                mode="date"
                onChange={(event, selectedDate) => {
                  setShowEndDatePicker(false);
                  if (selectedDate) {
                    updateLocalFilters('endDate', selectedDate);
                  }
                }}
              />
            </View>
          </View>
        )}
      </SharedModal>
    </>
  );
};

const styles = StyleSheet.create({
  // Filter Button Styles
  filterButton: {
    marginHorizontal: 8,
    marginVertical: 4
  },
  filterButtonContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  filterChip: {
    marginLeft: 8,
    height: 20,
    minWidth: 20
  },
  filterChipText: {
    fontSize: 10
  },

  // Modal Styles (matching OrderDetailsModal)
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '95%',
    height: '85%',
    overflow: 'hidden',
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
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#e9ecef',
  },
  content: {
    flex: 1,
    padding: 10,
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
  segmentedButtonsContainer: {
    paddingHorizontal: 4,
    minWidth: '100%'
  },
  segmentedButtons: {
    marginBottom: 8,
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
  actionsContainer: {
    padding: 20,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  actionButton: {
    borderRadius: 10,
    minHeight: 50,
  },
  clearButton: {
    borderColor: '#dc3545',
  },
  applyButton: {
    // Default contained button styling
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

export default PromocodeFilters;
