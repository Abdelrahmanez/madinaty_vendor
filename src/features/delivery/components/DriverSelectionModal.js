/**
 * DriverSelectionModal Component
 * --------------------------------------------
 * مكون اختيار السائق لتخصيص الطلبات
 */

import React, { useState, useMemo } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity
} from 'react-native';
import { 
  useTheme, 
  Text, 
  TextInput,
  ActivityIndicator,
  Chip
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DriverCard from './DriverCard';
import useDrivers from '../hooks/useDrivers';
import SharedModal from '../../../components/SharedModal';
import { 
  filterDrivers, 
  sortDrivers, 
  getDefaultFilters 
} from '../utils/driverFilterUtils';

const DriverSelectionModal = ({ 
  visible, 
  onDismiss, 
  onDriverSelect,
  orderId = null,
  loading = false 
}) => {
  const theme = useTheme();
  
  const {
    availableDrivers,
    loading: driversLoading,
    error,
    refreshDrivers
  } = useDrivers();

  const [filters, setFilters] = useState(getDefaultFilters());
  const [searchText, setSearchText] = useState('');

  // Filter and sort available drivers
  const filteredDrivers = useMemo(() => {
    const searchFilters = {
      ...filters,
      searchText: searchText
    };
    const filtered = filterDrivers(availableDrivers, searchFilters);
    return sortDrivers(filtered, filters.sortBy);
  }, [availableDrivers, filters, searchText]);

  const handleDriverSelect = (driver) => {
    onDriverSelect?.(driver, orderId);
    onDismiss();
  };

  const renderDriverCard = ({ item }) => (
    <DriverCard
      driver={item}
      onPress={() => handleDriverSelect(item)}
      showRemoveButton={false}
      showAssignButton={false}
      loading={loading}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons 
        name="account-search-outline" 
        size={64} 
        color={theme.colors.onSurfaceVariant} 
      />
      <Text style={[styles.emptyStateText, { color: theme.colors.onSurfaceVariant }]}>
        {searchText 
          ? 'لا توجد سائقين متاحين يطابقون البحث'
          : 'لا توجد سائقين متاحين حالياً'
        }
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>
        اختيار سائق للطلب
      </Text>
      {orderId && (
        <Chip 
          icon="package-variant" 
          style={styles.orderChip}
        >
          طلب #{orderId}
        </Chip>
      )}
      
      <TextInput
        label="البحث في السائقين"
        value={searchText}
        onChangeText={setSearchText}
        mode="outlined"
        style={styles.searchInput}
        left={<TextInput.Icon icon="magnify" />}
        placeholder="ابحث بالاسم أو رقم الهاتف"
      />
      
      <View style={styles.statsRow}>
        <Text style={[styles.statsText, { color: theme.colors.onSurfaceVariant }]}>
          {filteredDrivers.length} سائق متاح
        </Text>
        <Text style={[styles.statsText, { color: theme.colors.onSurfaceVariant }]}>
          {availableDrivers.length} إجمالي المتاحين
        </Text>
      </View>
    </View>
  );

  return (
    <SharedModal
      visible={visible}
      title="اختيار سائق"
      onDismiss={onDismiss}
    >
      {/* Content */}
      {driversLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
            جاري تحميل السائقين المتاحين...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredDrivers}
          renderItem={renderDriverCard}
          keyExtractor={(item) => item._id || item.phoneNumber}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={driversLoading}
          onRefresh={refreshDrivers}
        />
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
          اضغط على السائق لتخصيص الطلب له
        </Text>
      </View>
    </SharedModal>
  );
};

const styles = StyleSheet.create({
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
    height: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  modalTitle: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  listContainer: {
    flexGrow: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  orderChip: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 32,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default DriverSelectionModal;
