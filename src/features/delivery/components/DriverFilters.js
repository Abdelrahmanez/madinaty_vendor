/**
 * DriverFilters Component
 * --------------------------------------------
 * مكون فلاتر السائقين
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
import SharedModal from '../../../components/SharedModal';

const DriverFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  visible = false,
  onDismiss 
}) => {
  const theme = useTheme();
  
  const [localFilters, setLocalFilters] = useState(filters);

  const availabilityOptions = [
    { value: 'all', label: 'الكل' },
    { value: 'available', label: 'متاح' },
    { value: 'unavailable', label: 'غير متاح' },
    { value: 'working', label: 'يعمل' }
  ];

  const sortOptions = [
    { value: 'activeOrdersCount', label: 'الطلبات النشطة' },
    { value: 'name', label: 'الاسم' },
    { value: 'phoneNumber', label: 'رقم الهاتف' }
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
      availability: 'all',
      sortBy: 'activeOrdersCount',
      searchText: ''
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
    onDismiss();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.availability !== 'all') count++;
    if (filters.sortBy !== 'activeOrdersCount') count++;
    if (filters.searchText) count++;
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
        title="فلاتر السائقين"
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
                  label="البحث في الاسم أو رقم الهاتف"
                  value={localFilters.searchText}
                  onChangeText={(text) => updateLocalFilters('searchText', text)}
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Icon icon="magnify" />}
                />
              </View>

              {/* Separator */}
              <View style={styles.sectionSeparator} />

              {/* Availability Filter */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, themedStyles.sectionTitle]}>📊 الحالة</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.segmentedButtonsContainer}
                >
                  <SegmentedButtons
                    value={localFilters.availability}
                    onValueChange={(value) => updateLocalFilters('availability', value)}
                    buttons={availabilityOptions}
                    style={styles.segmentedButtons}
                    buttonStyle={styles.segmentedButton}
                    labelStyle={styles.segmentedButtonLabel}
                  />
                </ScrollView>
              </View>

              {/* Separator */}
              <View style={styles.sectionSeparator} />

              {/* Sort Options */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, themedStyles.sectionTitle]}>🔄 الترتيب</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.segmentedButtonsContainer}
                >
                  <SegmentedButtons
                    value={localFilters.sortBy}
                    onValueChange={(value) => updateLocalFilters('sortBy', value)}
                    buttons={sortOptions}
                    style={styles.segmentedButtons}
                    buttonStyle={styles.segmentedButton}
                    labelStyle={styles.segmentedButtonLabel}
                  />
                </ScrollView>
              </View>
        </ScrollView>
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
});

export default DriverFilters;
