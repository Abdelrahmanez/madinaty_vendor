/**
 * PromocodeFilters Component
 * --------------------------------------------
 * مكون فلاتر أكواد الخصم
 * 
 * Features:
 * - Advanced filtering for promocodes
 * - Date range selection
 * - Status and type filtering
 * - Search functionality
 * - Responsive design
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { FILTER_OPTIONS, DEFAULT_FILTERS } from '../constants/filterConstants';
import { formatDate, getActiveFiltersCount } from '../utils/filterUtils';

/**
 * Custom hook for managing filter state
 */
const useFilterState = (initialFilters) => {
  const [localFilters, setLocalFilters] = useState(initialFilters);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Synchronize local filters with external filters
  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  const updateLocalFilters = useCallback((key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setLocalFilters(DEFAULT_FILTERS);
  }, []);

  return {
    localFilters,
    showStartDatePicker,
    showEndDatePicker,
    setShowStartDatePicker,
    setShowEndDatePicker,
    updateLocalFilters,
    clearFilters
  };
};

/**
 * Utility functions are now imported from filterUtils.js
 */

/**
 * Filter Section Component
 */
const FilterSection = React.memo(({ title, options, value, onValueChange, themedStyles }) => (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, themedStyles.sectionTitle]}>
      {title}
    </Text>
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.segmentedButtonsContainer}
    >
      <SegmentedButtons
        value={value}
        onValueChange={onValueChange}
        buttons={options}
        style={styles.segmentedButtons}
        buttonStyle={styles.segmentedButton}
        labelStyle={styles.segmentedButtonLabel}
      />
    </ScrollView>
  </View>
));

/**
 * Date Range Section Component
 */
const DateRangeSection = React.memo(({ 
  startDate, 
  endDate, 
  onStartDatePress, 
  onEndDatePress, 
  themedStyles 
}) => (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, themedStyles.sectionTitle]}>
      📅 نطاق التاريخ
    </Text>
    
    <View style={styles.twoColumnRow}>
      <View style={styles.infoColumn}>
        <Text style={styles.infoLabel}>من تاريخ:</Text>
        <TouchableOpacity 
          onPress={onStartDatePress}
          style={styles.dateButton}
        >
          <Text style={[styles.infoValue, themedStyles.infoValue]}>
            {formatDate(startDate)}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoColumn}>
        <Text style={styles.infoLabel}>إلى تاريخ:</Text>
        <TouchableOpacity 
          onPress={onEndDatePress}
          style={styles.dateButton}
        >
          <Text style={[styles.infoValue, themedStyles.infoValue]}>
            {formatDate(endDate)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
));

/**
 * Date Picker Component
 */
const DatePickerModal = React.memo(({ 
  visible, 
  title, 
  value, 
  onClose, 
  onDateChange, 
  theme 
}) => {
  if (!visible) return null;

  return (
    <View style={styles.datePickerOverlay}>
      <View style={styles.datePickerContainer}>
        <View style={styles.datePickerHeader}>
          <Text style={styles.datePickerTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialCommunityIcons name="close" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
        </View>
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          onChange={(event, selectedDate) => {
            onClose();
            if (selectedDate) {
              onDateChange(selectedDate);
            }
          }}
        />
      </View>
    </View>
  );
});

/**
 * Search Section Component
 */
const SearchSection = React.memo(({ 
  searchText, 
  onSearchChange, 
  themedStyles 
}) => (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, themedStyles.sectionTitle]}>
      🔍 البحث
    </Text>
    <TextInput
      label="البحث في الكود أو الوصف"
      value={searchText}
      onChangeText={onSearchChange}
      mode="outlined"
      style={styles.input}
      left={<TextInput.Icon icon="magnify" />}
    />
  </View>
));

/**
 * Main Component
 */
const PromocodeFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  visible = false,
  onDismiss 
}) => {
  const theme = useTheme();
  
  // Use custom hook for state management
  const {
    localFilters,
    showStartDatePicker,
    showEndDatePicker,
    setShowStartDatePicker,
    setShowEndDatePicker,
    updateLocalFilters,
    clearFilters
  } = useFilterState(filters);

  // Memoized themed styles for performance
  const themedStyles = useMemo(() => ({
    sectionTitle: { color: theme.colors.primary },
    infoValue: { color: theme.colors.primary },
  }), [theme.colors.primary]);

  // Memoized active filters count
  const activeFiltersCount = useMemo(() => 
    getActiveFiltersCount(filters), [filters]
  );

  // Event handlers
  const handleApplyFilters = useCallback(() => {
    onFiltersChange(localFilters);
    onDismiss();
  }, [localFilters, onFiltersChange, onDismiss]);

  const handleClearFilters = useCallback(() => {
    clearFilters();
    onClearFilters();
    onDismiss();
  }, [clearFilters, onClearFilters, onDismiss]);

  const handleDateChange = useCallback((dateType, selectedDate) => {
    if (selectedDate) {
      updateLocalFilters(dateType, selectedDate);
    }
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
  }, [updateLocalFilters, setShowStartDatePicker, setShowEndDatePicker]);

  return (
    <>
      {/* Filter Button */}
      <Button
        mode="outlined"
        onPress={onDismiss}
        icon="filter-variant"
        style={styles.filterButton}
        contentStyle={styles.filterButtonContent}
      >
        فلاتر
        {activeFiltersCount > 0 && (
          <Chip 
            style={styles.filterChip} 
            textStyle={styles.filterChipText}
          >
            {activeFiltersCount}
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
              onPress={handleClearFilters}
              style={[styles.actionButton, styles.clearButton]}
              textColor={theme.colors.error}
            >
              مسح الكل
            </Button>
            <Button
              mode="contained"
              onPress={handleApplyFilters}
              style={[styles.actionButton, styles.applyButton]}
            >
              تطبيق الفلاتر
            </Button>
          </View>
        }
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <SearchSection 
            searchText={localFilters.searchText}
            onSearchChange={(text) => updateLocalFilters('searchText', text)}
            themedStyles={themedStyles}
          />
          <View style={styles.sectionSeparator} />
          
          <FilterSection 
            title="📊 الحالة"
            options={FILTER_OPTIONS.status}
            value={localFilters.status}
            onValueChange={(value) => updateLocalFilters('status', value)}
            themedStyles={themedStyles}
          />
          <View style={styles.sectionSeparator} />
          
          <FilterSection 
            title="🎫 نوع الخصم"
            options={FILTER_OPTIONS.type}
            value={localFilters.type}
            onValueChange={(value) => updateLocalFilters('type', value)}
            themedStyles={themedStyles}
          />
          <View style={styles.sectionSeparator} />
          
          <FilterSection 
            title="🎯 ينطبق على"
            options={FILTER_OPTIONS.appliesTo}
            value={localFilters.appliesTo}
            onValueChange={(value) => updateLocalFilters('appliesTo', value)}
            themedStyles={themedStyles}
          />
          <View style={styles.sectionSeparator} />
          
          <DateRangeSection 
            startDate={localFilters.startDate}
            endDate={localFilters.endDate}
            onStartDatePress={() => setShowStartDatePicker(true)}
            onEndDatePress={() => setShowEndDatePicker(true)}
            themedStyles={themedStyles}
          />
        </ScrollView>

        {/* Date Pickers */}
        <DatePickerModal 
          visible={showStartDatePicker}
          title="اختر تاريخ البداية"
          value={localFilters.startDate}
          onClose={() => setShowStartDatePicker(false)}
          onDateChange={(date) => handleDateChange('startDate', date)}
          theme={theme}
        />

        <DatePickerModal 
          visible={showEndDatePicker}
          title="اختر تاريخ النهاية"
          value={localFilters.endDate}
          onClose={() => setShowEndDatePicker(false)}
          onDateChange={(date) => handleDateChange('endDate', date)}
          theme={theme}
        />
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
