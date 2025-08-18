import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme, Text, Card, Button, Chip, TextInput, Searchbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AddonManager = ({ 
  dishId, 
  currentAddons = [], 
  availableAddons = [], 
  onAddAddons, 
  onRemoveAddons,
  onRefresh,
  loading: externalLoading = false,
  error: externalError = null
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = externalLoading || internalLoading;
  const [showAddForm, setShowAddForm] = useState(false);

  // Filter available addons based on search
  const filteredAvailableAddons = availableAddons.filter(addon => 
    addon.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    addon.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter out already added addons
  const availableToAdd = filteredAvailableAddons.filter(addon => 
    !currentAddons.some(current => current._id === addon._id)
  );

  const handleAddAddons = async () => {
    if (selectedAddons.length === 0) return;

    setInternalLoading(true);
    try {
      await onAddAddons(selectedAddons);
      setSelectedAddons([]);
      setShowAddForm(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error adding addons:', error);
    } finally {
      setInternalLoading(false);
    }
  };

  const handleRemoveAddons = async (addonIds) => {
    setInternalLoading(true);
    try {
      await onRemoveAddons(addonIds);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error removing addons:', error);
    } finally {
      setInternalLoading(false);
    }
  };

  const toggleAddonSelection = (addonId) => {
    setSelectedAddons(prev => 
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  return (
    <Card style={styles.container}>
      <Card.Content>
        <View style={styles.header}>
          <MaterialCommunityIcons 
            name="plus-circle-multiple" 
            size={24} 
            color={theme.colors.primary} 
          />
          <Text variant="titleMedium" style={styles.title}>
            إدارة الإضافات
          </Text>
        </View>

        {/* Current Addons */}
        {currentAddons.length > 0 && (
          <View style={styles.section}>
            <Text variant="titleSmall" style={styles.sectionTitle}>
              الإضافات الحالية ({currentAddons.length})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipsContainer}>
                {currentAddons.map((addon) => (
                  <Chip
                    key={addon._id}
                    mode="outlined"
                    onClose={() => handleRemoveAddons([addon._id])}
                    style={styles.chip}
                    closeIcon="delete"
                  >
                    {addon.name}
                  </Chip>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Add New Addons */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="titleSmall" style={styles.sectionTitle}>
              إضافة إضافات جديدة
            </Text>
            <Button
              mode="outlined"
              onPress={() => setShowAddForm(!showAddForm)}
              icon={showAddForm ? "chevron-up" : "chevron-down"}
              compact
            >
              {showAddForm ? 'إخفاء' : 'إظهار'}
            </Button>
          </View>

          {/* Error Display */}
          {externalError && (
            <Text style={styles.errorText}>
              ❌ {externalError}
            </Text>
          )}

          {/* Loading State */}
          {externalLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>جاري تحميل الإضافات المتاحة...</Text>
            </View>
          )}

          {showAddForm && (
            <View style={styles.addForm}>
              <Searchbar
                placeholder="البحث في الإضافات المتاحة..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
              />

              {availableToAdd.length > 0 ? (
                <ScrollView style={styles.addonsList} showsVerticalScrollIndicator={false}>
                  {availableToAdd.map((addon) => (
                    <View key={addon._id} style={styles.addonItem}>
                      <View style={styles.addonInfo}>
                        <Text variant="bodyMedium" style={styles.addonName}>
                          {addon.name}
                        </Text>
                        {addon.description && (
                          <Text variant="bodySmall" style={styles.addonDescription}>
                            {addon.description}
                          </Text>
                        )}
                        {addon.price && (
                          <Text variant="bodySmall" style={styles.addonPrice}>
                            +{addon.price} ج.م
                          </Text>
                        )}
                      </View>
                      <Button
                        mode={selectedAddons.includes(addon._id) ? "contained" : "outlined"}
                        onPress={() => toggleAddonSelection(addon._id)}
                        compact
                      >
                        {selectedAddons.includes(addon._id) ? 'محدد' : 'اختيار'}
                      </Button>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <Text style={styles.noAddons}>
                  {searchQuery ? 'لا توجد إضافات تطابق البحث' : 'لا توجد إضافات متاحة'}
                </Text>
              )}

              {selectedAddons.length > 0 && (
                <View style={styles.addActions}>
                  <Text variant="bodySmall" style={styles.selectedCount}>
                    تم اختيار {selectedAddons.length} إضافات
                  </Text>
                  <Button
                    mode="contained"
                    onPress={handleAddAddons}
                    loading={loading}
                    disabled={loading}
                    icon="plus"
                    style={styles.addButton}
                  >
                    إضافة الإضافات المحددة
                  </Button>
                </View>
              )}
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  title: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: theme.colors.onSurface,
    fontWeight: '600',
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
  },
  chip: {
    marginRight: 8,
  },
  addForm: {
    gap: 12,
  },
  searchBar: {
    marginBottom: 8,
  },
  addonsList: {
    maxHeight: 200,
  },
  addonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 8,
    marginBottom: 8,
  },
  addonInfo: {
    flex: 1,
    marginRight: 12,
  },
  addonName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  addonDescription: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 2,
  },
  addonPrice: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  noAddons: {
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
    padding: 20,
  },
  addActions: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  selectedCount: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: theme.colors.primary,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    padding: 8,
    backgroundColor: theme.colors.errorContainer,
    borderRadius: 4,
    marginBottom: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
});

export default AddonManager;
