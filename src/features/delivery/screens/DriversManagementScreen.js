/**
 * DriversManagementScreen Component
 * --------------------------------------------
 * شاشة إدارة السائقين
 */

import React, { useState, useMemo } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  Alert,
  TouchableOpacity
} from 'react-native';
import { 
  useTheme, 
  Text, 
  FAB, 
  TextInput, 
  Button,
  Portal,
  ActivityIndicator
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TopBar from '../../../components/TopBar';
import DriverCard from '../components/DriverCard';
import DriverFilters from '../components/DriverFilters';
import useDrivers from '../hooks/useDrivers';
import SharedModal from '../../../components/SharedModal';
import { 
  filterDrivers, 
  sortDrivers, 
  getDefaultFilters, 
  hasActiveFilters, 
  getFilterSummary 
} from '../utils/driverFilterUtils';

const DriversManagementScreen = ({ navigation }) => {
  const theme = useTheme();
  
  const {
    drivers,
    loading,
    error,
    addDriver,
    removeDriver,
    refreshDrivers
  } = useDrivers();

  const [filters, setFilters] = useState(getDefaultFilters());
  const [showFilters, setShowFilters] = useState(false);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [newDriverPhone, setNewDriverPhone] = useState('');
  const [addingDriver, setAddingDriver] = useState(false);

  // Filter and sort drivers
  const filteredDrivers = useMemo(() => {
    const filtered = filterDrivers(drivers, filters);
    return sortDrivers(filtered, filters.sortBy);
  }, [drivers, filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters(getDefaultFilters());
  };

  const handleAddDriver = async () => {
    if (!newDriverPhone.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال رقم الهاتف');
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
    if (!phoneRegex.test(newDriverPhone.trim())) {
      Alert.alert('خطأ', 'يرجى إدخال رقم هاتف صحيح');
      return;
    }

    try {
      setAddingDriver(true);
      await addDriver(newDriverPhone.trim());
      
      Alert.alert(
        'نجح', 
        'تم إضافة السائق بنجاح',
        [{ text: 'حسناً', onPress: () => setShowAddDriverModal(false) }]
      );
      
      setNewDriverPhone('');
    } catch (error) {
      Alert.alert('خطأ', error.message || 'حدث خطأ في إضافة السائق');
    } finally {
      setAddingDriver(false);
    }
  };

  const handleRemoveDriver = async (driver) => {
    Alert.alert(
      'حذف السائق',
      `هل أنت متأكد من حذف السائق ${driver.name || driver.phoneNumber}؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeDriver(driver.phoneNumber);
              Alert.alert('نجح', 'تم حذف السائق بنجاح');
            } catch (error) {
              Alert.alert('خطأ', error.message || 'حدث خطأ في حذف السائق');
            }
          }
        }
      ]
    );
  };

  const handleDriverPress = (driver) => {
    // Could navigate to driver details screen in the future
    Alert.alert(
      'تفاصيل السائق',
      `الاسم: ${driver.name || 'غير محدد'}\nرقم الهاتف: ${driver.phoneNumber}\nالطلبات النشطة: ${driver.activeOrdersCount || 0}`
    );
  };

  const renderDriverCard = ({ item }) => (
    <DriverCard
      driver={item}
      onPress={() => handleDriverPress(item)}
      onRemove={handleRemoveDriver}
      loading={loading}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons 
        name="account-group-outline" 
        size={64} 
        color={theme.colors.onSurfaceVariant} 
      />
      <Text style={[styles.emptyStateText, { color: theme.colors.onSurfaceVariant }]}>
        {hasActiveFilters(filters) 
          ? 'لا توجد سائقين يطابقون الفلاتر المحددة'
          : 'لا توجد سائقين مسجلين'
        }
      </Text>
      {hasActiveFilters(filters) && (
        <Button 
          mode="outlined" 
          onPress={handleClearFilters}
          style={styles.clearFiltersButton}
        >
          مسح الفلاتر
        </Button>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          إدارة السائقين
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          {filteredDrivers.length} سائق
        </Text>
      </View>
      
      <View style={styles.headerActions}>
        <DriverFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          visible={showFilters}
          onDismiss={() => setShowFilters(!showFilters)}
        />
        
        <Button
          mode="outlined"
          onPress={() => setShowAddDriverModal(true)}
          icon="account-plus"
          style={styles.addButton}
        >
          إضافة سائق
        </Button>
      </View>

      {hasActiveFilters(filters) && (
        <View style={styles.filterSummary}>
          <Text style={[styles.filterSummaryText, { color: theme.colors.onSurfaceVariant }]}>
            {getFilterSummary(filters)}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopBar title="إدارة السائقين" />
      
      {loading && !drivers.length ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
            جاري تحميل السائقين...
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
          refreshing={loading}
          onRefresh={refreshDrivers}
        />
      )}

      {/* Add Driver Modal */}
      <SharedModal
        visible={showAddDriverModal}
        title="إضافة سائق جديد"
        onDismiss={() => setShowAddDriverModal(false)}
        footerContent={
          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setShowAddDriverModal(false)}
              style={[styles.modalButton, styles.cancelButton]}
              disabled={addingDriver}
            >
              إلغاء
            </Button>
            <Button
              mode="contained"
              onPress={handleAddDriver}
              loading={addingDriver}
              disabled={addingDriver || !newDriverPhone.trim()}
              style={[styles.modalButton, styles.addButton]}
            >
              {addingDriver ? 'جاري الإضافة...' : 'إضافة'}
            </Button>
          </View>
        }
      >
        <Text style={[styles.modalDescription, { color: theme.colors.onSurfaceVariant }]}>
          أدخل رقم هاتف السائق لإضافته للمطعم
        </Text>
        
        <TextInput
          label="رقم الهاتف"
          value={newDriverPhone}
          onChangeText={setNewDriverPhone}
          mode="outlined"
          style={styles.phoneInput}
          keyboardType="phone-pad"
          placeholder="مثال: 01012345678"
          left={<TextInput.Icon icon="phone" />}
        />
      </SharedModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addButton: {
    marginLeft: 8,
  },
  filterSummary: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginTop: 8,
  },
  filterSummaryText: {
    fontSize: 12,
    textAlign: 'center',
  },
  clearFiltersButton: {
    marginTop: 16,
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

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
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
  modalCloseButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#e9ecef',
  },
  modalContent: {
    padding: 20,
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  phoneInput: {
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  modalButton: {
    flex: 1,
    borderRadius: 10,
    minHeight: 50,
  },
  cancelButton: {
    borderColor: '#6c757d',
  },
});

export default DriversManagementScreen;
