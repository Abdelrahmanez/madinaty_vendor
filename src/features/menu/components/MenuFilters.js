import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme, Searchbar, Chip, Menu, Button, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MenuFilters = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  availabilityFilter,
  onAvailabilityChange,
  sortBy,
  onSortChange,
  onClearFilters,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [availabilityMenuVisible, setAvailabilityMenuVisible] = useState(false);

  const sortOptions = [
    { label: 'الاسم', value: 'name' },
    { label: 'السعر', value: 'price' },
    { label: 'الشعبية', value: 'popularity' },
    { label: 'التاريخ', value: 'date' },
  ];

  const availabilityOptions = [
    { label: 'الكل', value: 'all' },
    { label: 'متاح', value: 'available' },
    { label: 'غير متاح', value: 'unavailable' },
  ];

  const getSortLabel = (value) => {
    const option = sortOptions.find(opt => opt.value === value);
    return option ? option.label : 'ترتيب';
  };

  const getAvailabilityLabel = (value) => {
    const option = availabilityOptions.find(opt => opt.value === value);
    return option ? option.label : 'الحالة';
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || availabilityFilter !== 'all';

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <Searchbar
        placeholder="البحث في القائمة..."
        onChangeText={onSearchChange}
        value={searchQuery}
        style={styles.searchBar}
        iconColor={theme.colors.primary}
      />

      {/* Filters Row */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScrollView}
        contentContainerStyle={styles.filtersContainer}
      >
        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          <Chip
            mode={selectedCategory === 'all' ? 'flat' : 'outlined'}
            selected={selectedCategory === 'all'}
            onPress={() => onCategoryChange('all')}
            style={styles.categoryChip}
            textStyle={styles.chipText}
          >
            الكل
          </Chip>
          
          {categories && categories.length > 0 && categories.map((category) => (
            <Chip
              key={category._id}
              mode={selectedCategory === category._id ? 'flat' : 'outlined'}
              selected={selectedCategory === category._id}
              onPress={() => onCategoryChange(category._id)}
              style={styles.categoryChip}
              textStyle={styles.chipText}
            >
              {category.name}
            </Chip>
          ))}
        </ScrollView>

        {/* Availability Filter */}
        <Menu
          visible={availabilityMenuVisible}
          onDismiss={() => setAvailabilityMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setAvailabilityMenuVisible(true)}
              style={styles.filterButton}
              contentStyle={styles.filterButtonContent}
              labelStyle={styles.filterButtonLabel}
            >
              {getAvailabilityLabel(availabilityFilter)}
              <MaterialCommunityIcons 
                name="chevron-down" 
                size={16} 
                color={theme.colors.primary} 
              />
            </Button>
          }
        >
          {availabilityOptions.map((option) => (
            <Menu.Item
              key={option.value}
              onPress={() => {
                onAvailabilityChange(option.value);
                setAvailabilityMenuVisible(false);
              }}
              title={option.label}
              leadingIcon={availabilityFilter === option.value ? 'check' : undefined}
            />
          ))}
        </Menu>

        {/* Sort Filter */}
        <Menu
          visible={sortMenuVisible}
          onDismiss={() => setSortMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setSortMenuVisible(true)}
              style={styles.filterButton}
              contentStyle={styles.filterButtonContent}
              labelStyle={styles.filterButtonLabel}
            >
              {getSortLabel(sortBy)}
              <MaterialCommunityIcons 
                name="chevron-down" 
                size={16} 
                color={theme.colors.primary} 
              />
            </Button>
          }
        >
          {sortOptions.map((option) => (
            <Menu.Item
              key={option.value}
              onPress={() => {
                onSortChange(option.value);
                setSortMenuVisible(false);
              }}
              title={option.label}
              leadingIcon={sortBy === option.value ? 'check' : undefined}
            />
          ))}
        </Menu>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            mode="text"
            onPress={onClearFilters}
            style={styles.clearButton}
            labelStyle={styles.clearButtonLabel}
            icon="close"
          >
            مسح الفلاتر
          </Button>
        )}
      </ScrollView>

      <Divider style={styles.divider} />
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    paddingVertical: 8,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 1,
  },
  filtersScrollView: {
    maxHeight: 50,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  categoryChip: {
    marginRight: 8,
  },
  chipText: {
    fontSize: 12,
  },
  filterButton: {
    marginRight: 8,
    borderRadius: 8,
  },
  filterButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButtonLabel: {
    fontSize: 12,
    marginRight: 4,
  },
  clearButton: {
    marginLeft: 8,
  },
  clearButtonLabel: {
    fontSize: 12,
    color: theme.colors.error,
  },
  divider: {
    marginTop: 8,
  },
});

export default MenuFilters;

