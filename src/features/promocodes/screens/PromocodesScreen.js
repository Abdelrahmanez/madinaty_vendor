/**
 * PromocodesScreen
 * --------------------------------------------
 * الشاشة الرئيسية لإدارة أكواد الخصم
 */

import React, { useState, useMemo } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  RefreshControl,
  Alert,
  Text
} from 'react-native';
import { useTheme, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import TopBar from '../../../components/TopBar';
import LoadingIndicator from '../../../components/LoadingIndicator';
import CustomAlert from '../../../components/Alert';
import PromocodeCard from '../components/PromocodeCard';
import PromocodeFilters from '../components/PromocodeFilters';

import usePromocodes from '../hooks/usePromocodes';
import { filterPromocodes, getDefaultFilters, hasActiveFilters, getFilterSummary } from '../utils/filterUtils';

const PromocodesScreen = ({ navigation }) => {
  const theme = useTheme();

  const {
    promocodes,
    loading,
    error,
    pagination,
    createPromocode,
    updatePromocode,
    deletePromocode,
    togglePromocodeStatus,
    refreshPromocodes
  } = usePromocodes();

  // Filter state
  const [filters, setFilters] = useState(getDefaultFilters());
  const [showFilters, setShowFilters] = useState(false);

  // Filtered promocodes
  const filteredPromocodes = useMemo(() => {
    return filterPromocodes(promocodes, filters);
  }, [promocodes, filters]);

  // These functions are no longer needed since we're using separate screens
  // The create and update functionality is handled in CreatePromocodeScreen and EditPromocodeScreen

  const handleDeletePromocode = (promocodeId) => {
    Alert.alert(
      'تأكيد الحذف',
      'هل أنت متأكد من حذف كود الخصم هذا؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePromocode(promocodeId);
              Alert.alert('نجح', 'تم حذف كود الخصم بنجاح');
            } catch (error) {
              Alert.alert('خطأ', error.message || 'حدث خطأ في حذف كود الخصم');
            }
          }
        }
      ]
    );
  };

  const handleToggleStatus = async (promocodeId, isActive) => {
    try {
      await togglePromocodeStatus(promocodeId, isActive);
      Alert.alert(
        'نجح', 
        `تم ${isActive ? 'تفعيل' : 'إلغاء تفعيل'} كود الخصم بنجاح`
      );
    } catch (error) {
      Alert.alert('خطأ', error.message || 'حدث خطأ في تغيير حالة كود الخصم');
    }
  };

  const handleEditPromocode = (promocode) => {
    // Navigate to edit screen instead of showing modal
    navigation.navigate('EditPromocode', { promocode });
  };

  const handlePromocodePress = (promocode) => {
    // Navigate to details screen
    navigation.navigate('PromocodeDetails', { promocode });
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters(getDefaultFilters());
  };

  const renderPromocodeCard = ({ item }) => (
    <PromocodeCard
      promocode={item}
      onPress={() => handlePromocodePress(item)}
      onEdit={handleEditPromocode}
      onDelete={handleDeletePromocode}
      onToggleStatus={handleToggleStatus}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons 
        name="ticket-percent-outline" 
        size={64} 
        color={theme.colors.onSurfaceVariant} 
      />
      <Text style={[
        styles.emptyStateText, 
        { color: theme.colors.onSurfaceVariant }
      ]}>
        {hasActiveFilters(filters) ? 'لا توجد نتائج للفلاتر المطبقة' : 'لا توجد أكواد خصم'}
      </Text>
      <Text style={[
        styles.emptyStateSubtext, 
        { color: theme.colors.onSurfaceVariant }
      ]}>
        {hasActiveFilters(filters) ? 'جرب تغيير الفلاتر أو مسحها' : 'اضغط على + لإنشاء كود خصم جديد'}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (loading && promocodes.length > 0) {
      return <LoadingIndicator />;
    }
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopBar 
        title="أكواد الخصم"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      {/* Filter Summary */}
      {hasActiveFilters(filters) && (
        <View style={[styles.filterSummary, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text style={[styles.filterSummaryText, { color: theme.colors.onSurfaceVariant }]}>
            {getFilterSummary(filters)}
          </Text>
        </View>
      )}

      {/* Filter Button */}
      <View style={styles.filterContainer}>
        <PromocodeFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          visible={showFilters}
          onDismiss={() => setShowFilters(!showFilters)}
        />
      </View>

      {error && (
        <CustomAlert
          type="error"
          message={error}
          onDismiss={() => {}}
        />
      )}

      {loading && promocodes.length === 0 ? (
        <LoadingIndicator />
      ) : (
        <FlatList
          data={filteredPromocodes}
          renderItem={renderPromocodeCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refreshPromocodes}
              colors={[theme.colors.primary]}
            />
          }
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={renderFooter}
          onEndReached={() => {
            if (pagination.currentPage < pagination.totalPages && !loading) {
              // Load more promocodes
            }
          }}
          onEndReachedThreshold={0.1}
        />
      )}

      {/* Modals are no longer needed since we're using separate screens */}

      {/* FAB for creating new promocode */}
      <FAB
        icon="plus"
        style={[
          styles.fab,
          { backgroundColor: theme.colors.primary }
        ]}
        onPress={() => navigation.navigate('AddPromoCode')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  filterSummary: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8
  },
  filterSummaryText: {
    fontSize: 12,
    textAlign: 'center'
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  listContainer: {
    paddingBottom: 80 // Space for FAB
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0
  }
});

export default PromocodesScreen;
