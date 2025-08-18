import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Text, Card, Button, Divider, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TopBar from '../../../../components/TopBar';
import SizeEditor from '../../components/SizeEditor';
import AddonManager from '../../components/AddonManager';
import OfferManager from '../../components/OfferManager';
import {
  updateDishSize,
  updateDishSizeStock,
  addDishSize,
  addDishAddons,
  removeDishAddons,
  updateDishOffer,
  deleteDishOffer,
} from '../../api/dish';
import { useAddons } from '../../hooks/useAddons';

const EditMenuItemScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets);
  
  const { item } = route.params;
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  
  // State for managing different sections
  const [showSizeEditor, setShowSizeEditor] = useState(false);
  const [editingSize, setEditingSize] = useState(null);
  const [showAddSizeForm, setShowAddSizeForm] = useState(false);
  
  // Get available addons using the hook
  const { availableAddons, loading: addonsLoading, error: addonsError, refreshAddons } = useAddons();

  const showSnackbar = (message, type = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  // Size Management Functions
  const handleSaveSize = async (sizeData) => {
    setLoading(true);
    try {
      if (editingSize) {
        // Update existing size
        await updateDishSize(item._id, editingSize._id, sizeData);
        showSnackbar('تم تحديث الحجم بنجاح');
      } else {
        // Add new size
        await addDishSize(item._id, sizeData);
        showSnackbar('تم إضافة الحجم الجديد بنجاح');
      }
      
      // Reset form states
      setEditingSize(null);
      setShowSizeEditor(false);
      setShowAddSizeForm(false);
      
      // Refresh the item data (in real app, update local state or refetch)
      // For now, just show success message
      
    } catch (error) {
      console.error('Error saving size:', error);
      showSnackbar('حدث خطأ أثناء حفظ الحجم', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSizeStock = async (sizeId, newStock) => {
    try {
      await updateDishSizeStock(item._id, sizeId, { currentStock: newStock });
      showSnackbar('تم تحديث المخزون بنجاح');
      
      // Update local state (in real app)
      // For now, just show success message
      
    } catch (error) {
      console.error('Error updating stock:', error);
      showSnackbar('حدث خطأ أثناء تحديث المخزون', 'error');
    }
  };

  const handleEditSize = (size) => {
    setEditingSize(size);
    setShowSizeEditor(true);
    setShowAddSizeForm(false);
  };

  const handleAddNewSize = () => {
    setEditingSize(null);
    setShowSizeEditor(false);
    setShowAddSizeForm(true);
  };

  const handleCancelSize = () => {
    setEditingSize(null);
    setShowSizeEditor(false);
    setShowAddSizeForm(false);
  };

  // Addon Management Functions
  const handleAddAddons = async (addonIds) => {
    try {
      await addDishAddons(item._id, { addonIds });
      showSnackbar('تم إضافة الإضافات بنجاح');
      
      // In real app, update local state or refetch data
      
    } catch (error) {
      console.error('Error adding addons:', error);
      showSnackbar('حدث خطأ أثناء إضافة الإضافات', 'error');
    }
  };

  const handleRemoveAddons = async (addonIds) => {
    try {
      await removeDishAddons(item._id, { addonIds });
      showSnackbar('تم إزالة الإضافات بنجاح');
      
      // In real app, update local state or refetch data
      
    } catch (error) {
      console.error('Error removing addons:', error);
      showSnackbar('حدث خطأ أثناء إزالة الإضافات', 'error');
    }
  };

  // Offer Management Functions
  const handleSaveOffer = async (offerData) => {
    try {
      await updateDishOffer(item._id, offerData);
      showSnackbar('تم حفظ العرض بنجاح');
      
      // In real app, update local state or refetch data
      
    } catch (error) {
      console.error('Error saving offer:', error);
      showSnackbar('حدث خطأ أثناء حفظ العرض', 'error');
    }
  };

  const handleDeleteOffer = async () => {
    Alert.alert(
      'تأكيد الحذف',
      'هل أنت متأكد من حذف هذا العرض؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDishOffer(item._id);
              showSnackbar('تم حذف العرض بنجاح');
              
              // In real app, update local state or refetch data
              
            } catch (error) {
              console.error('Error deleting offer:', error);
              showSnackbar('حدث خطأ أثناء حذف العرض', 'error');
            }
          },
        },
      ]
    );
  };

  const handleRefresh = () => {
    // Refresh both dish data and addons data
    refreshAddons();
    showSnackbar('تم تحديث البيانات');
  };

  return (
    <View style={styles.container}>
      <TopBar
        title="تعديل العنصر"
        onBack={() => navigation.goBack()}
        rightAction={
          <MaterialCommunityIcons 
            name="content-save" 
            size={24} 
            color={theme.colors.primary} 
          />
        }
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Item Basic Info */}
        <Card style={styles.basicInfoCard}>
          <Card.Content>
            <View style={styles.itemHeader}>
              <MaterialCommunityIcons 
                name="food-variant" 
                size={32} 
                color={theme.colors.primary} 
              />
              <View style={styles.itemInfo}>
                <Text variant="titleLarge" style={styles.itemName}>
                  {item.name}
                </Text>
                <Text variant="bodyMedium" style={styles.itemDescription}>
                  {item.description}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Sizes Management */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons 
                name="ruler" 
                size={24} 
                color={theme.colors.primary} 
              />
              <Text variant="titleMedium" style={styles.sectionTitle}>
                أحجام العنصر
              </Text>
              <Button
                mode="outlined"
                onPress={handleAddNewSize}
                icon="plus"
                compact
              >
                إضافة حجم
              </Button>
            </View>

            {/* Existing Sizes */}
            {item.sizes && item.sizes.length > 0 && (
              <View style={styles.sizesList}>
                {item.sizes.map((size, index) => (
                  <View key={size._id || index} style={styles.sizeItem}>
                    <View style={styles.sizeInfo}>
                      <Text variant="bodyMedium" style={styles.sizeName}>
                        {size.name}
                      </Text>
                      <Text variant="bodySmall" style={styles.sizePrice}>
                        {size.price} ج.م
                      </Text>
                      <Text variant="bodySmall" style={styles.sizeStock}>
                        المخزون: {size.currentStock || 0}
                      </Text>
                    </View>
                    <Button
                      mode="outlined"
                      onPress={() => handleEditSize(size)}
                      icon="pencil"
                      compact
                    >
                      تعديل
                    </Button>
                  </View>
                ))}
              </View>
            )}

            {/* Size Editor Forms */}
            {showSizeEditor && (
              <SizeEditor
                size={editingSize}
                onSave={handleSaveSize}
                onCancel={handleCancelSize}
                onUpdateStock={(newStock) => handleUpdateSizeStock(editingSize._id, newStock)}
                isEditing={true}
                dishId={item._id}
              />
            )}

            {showAddSizeForm && (
              <SizeEditor
                size={null}
                onSave={handleSaveSize}
                onCancel={handleCancelSize}
                onUpdateStock={() => {}}
                isEditing={false}
                dishId={item._id}
              />
            )}
          </Card.Content>
        </Card>

        <Divider style={styles.divider} />

        {/* Addons Management */}
        <AddonManager
          dishId={item._id}
          currentAddons={item.allowedAddons || []}
          availableAddons={availableAddons}
          onAddAddons={handleAddAddons}
          onRemoveAddons={handleRemoveAddons}
          onRefresh={refreshAddons}
          loading={addonsLoading}
          error={addonsError}
        />

        <Divider style={styles.divider} />

        {/* Offers Management */}
        <OfferManager
          dishId={item._id}
          currentOffer={item.offer}
          onSaveOffer={handleSaveOffer}
          onDeleteOffer={handleDeleteOffer}
          onRefresh={handleRefresh}
        />
      </ScrollView>

      {/* Snackbar for feedback */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={[
          styles.snackbar,
          snackbarType === 'error' && styles.errorSnackbar
        ]}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const createStyles = (theme, insets) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
    paddingTop: insets.top,
  },
  basicInfoCard: {
    margin: 16,
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemDescription: {
    color: theme.colors.onSurfaceVariant,
  },
  sectionCard: {
    margin: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    flex: 1,
  },
  sizesList: {
    gap: 12,
  },
  sizeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 8,
  },
  sizeInfo: {
    flex: 1,
  },
  sizeName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  sizePrice: {
    color: theme.colors.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  sizeStock: {
    color: theme.colors.onSurfaceVariant,
  },
  divider: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  snackbar: {
    backgroundColor: theme.colors.primaryContainer,
  },
  errorSnackbar: {
    backgroundColor: theme.colors.errorContainer,
  },
});

export default EditMenuItemScreen;

