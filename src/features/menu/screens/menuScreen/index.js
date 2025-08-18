import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TopBar from '../../../../components/TopBar';
import { MenuFilters, MenuList } from '../../components';
import { useMenu } from '../../hooks/useMenu';

const MenuScreen = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets);

  const {
    dishes,
    categories,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    availabilityFilter,
    setAvailabilityFilter,
    sortBy,
    setSortBy,
    toggleDishAvailability,
    refreshData,
  } = useMenu();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleItemPress = (item) => {
    navigation.navigate('MenuItemDetails', { item });
  };

  const handleEditItem = (item) => {
    navigation.navigate('EditMenuItem', { item });
  };

  const handleAddItem = () => {
    navigation.navigate('AddMenuItem');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setAvailabilityFilter('all');
    setSortBy('name');
  };

  return (
    <View style={styles.container}>
      <TopBar
        title="قائمة الطعام"
        showBackButton={false}
        backgroundColor={theme.colors.primary}
        titleColor={theme.colors.onPrimary}
      />
      
      <MenuFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        availabilityFilter={availabilityFilter}
        onAvailabilityChange={setAvailabilityFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onClearFilters={handleClearFilters}
      />

      <MenuList
        dishes={dishes}
        loading={loading}
        error={error}
        onRefresh={handleRefresh}
        onItemPress={handleItemPress}
        onToggleAvailability={toggleDishAvailability}
        onEditItem={handleEditItem}
        refreshing={refreshing}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAddItem}
        color={theme.colors.onPrimary}
      />

      {/* Addon Management FAB */}
      <FAB
        icon="plus-circle-multiple"
        style={[styles.fab, styles.addonFab]}
        onPress={() => navigation.navigate('RestaurantAddons')}
        color={theme.colors.onPrimary}
        label="إدارة الإضافات"
        small
      />
    </View>
  );
};

const createStyles = (theme, insets) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: insets.bottom + 16,
    backgroundColor: theme.colors.primary,
  },
  addonFab: {
    bottom: insets.bottom + 80, // Position above the main FAB
    backgroundColor: theme.colors.secondary,
  },
});

export default MenuScreen;

