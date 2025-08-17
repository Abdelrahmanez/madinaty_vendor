import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useTheme, Text, ActivityIndicator, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MenuItemCard from './MenuItemCard';

const MenuList = ({
  dishes,
  loading,
  error,
  onRefresh,
  onItemPress,
  onToggleAvailability,
  onEditItem,
  refreshing = false,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const renderMenuItem = ({ item }) => (
    <MenuItemCard
      item={item}
      onPress={() => onItemPress(item)}
      onToggleAvailability={onToggleAvailability}
      onEdit={onEditItem}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons 
        name="food-off" 
        size={64} 
        color={theme.colors.outline} 
      />
      <Text style={styles.emptyTitle}>لا توجد عناصر في القائمة</Text>
      <Text style={styles.emptySubtitle}>
        قم بإضافة عناصر جديدة إلى قائمة الطعام الخاصة بك
      </Text>
      <Button 
        mode="contained" 
        onPress={onRefresh}
        style={styles.refreshButton}
        icon="refresh"
      >
        تحديث
      </Button>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <MaterialCommunityIcons 
        name="alert-circle-outline" 
        size={64} 
        color={theme.colors.error} 
      />
      <Text style={styles.errorTitle}>حدث خطأ</Text>
      <Text style={styles.errorSubtitle}>{error}</Text>
      <Button 
        mode="contained" 
        onPress={onRefresh}
        style={styles.refreshButton}
        icon="refresh"
      >
        إعادة المحاولة
      </Button>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.loadingText}>جاري تحميل القائمة...</Text>
    </View>
  );

  if (loading && dishes.length === 0) {
    return renderLoadingState();
  }

  if (error && dishes.length === 0) {
    return renderErrorState();
  }

  return (
    <FlatList
      data={dishes}
      renderItem={renderMenuItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={[
        styles.listContainer,
        dishes.length === 0 && styles.emptyListContainer
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
      ListEmptyComponent={renderEmptyState}
      showsVerticalScrollIndicator={false}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
    />
  );
};

const createStyles = (theme) => StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
  emptyListContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.error,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    marginTop: 16,
    textAlign: 'center',
  },
  refreshButton: {
    marginTop: 8,
  },
});

export default MenuList;

