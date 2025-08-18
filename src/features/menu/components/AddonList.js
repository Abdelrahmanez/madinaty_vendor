import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme, Text, Card, Button, Chip, IconButton, Searchbar, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ADDON_CATEGORY_LABELS } from '../../../utils/enums';

const AddonList = ({
  addons = [],
  loading = false,
  error = null,
  onEditAddon,
  onDeleteAddon,
  onCreateAddon,
  onRefresh
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter addons based on search and category
  const filteredAddons = addons.filter(addon => {
    const matchesSearch = addon.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         addon.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || addon.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filtering
  const categories = ['all', ...Array.from(new Set(addons.map(addon => addon.category)))];
  const categoryLabels = {
    'all': 'الكل',
    ...ADDON_CATEGORY_LABELS
  };

  const handleDelete = (addon) => {
    // Show confirmation dialog before deleting
    if (onDeleteAddon) {
      onDeleteAddon(addon);
    }
  };

  const renderAddonCard = (addon) => (
    <Card key={addon._id} style={styles.addonCard}>
      <Card.Content>
        <View style={styles.addonHeader}>
          <View style={styles.addonInfo}>
            <Text variant="titleMedium" style={styles.addonName}>
              {addon.name}
            </Text>
            <Text variant="bodySmall" style={styles.addonPrice}>
              {addon.price} ج.م
            </Text>
          </View>
          
          <View style={styles.addonActions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => onEditAddon?.(addon)}
              iconColor={theme.colors.primary}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => handleDelete(addon)}
              iconColor={theme.colors.error}
            />
          </View>
        </View>

        {addon.description && (
          <Text variant="bodySmall" style={styles.addonDescription}>
            {addon.description}
          </Text>
        )}

        <View style={styles.addonFooter}>
          <Chip
            mode="outlined"
            style={[
              styles.categoryChip,
              { borderColor: addon.isVisible ? theme.colors.primary : theme.colors.outline }
            ]}
            textStyle={{ color: addon.isVisible ? theme.colors.primary : theme.colors.outline }}
          >
            {ADDON_CATEGORY_LABELS[addon.category] || addon.category}
          </Chip>

          <Chip
            mode="outlined"
            style={[
              styles.visibilityChip,
              { 
                borderColor: addon.isVisible ? theme.colors.primary : theme.colors.outline,
                backgroundColor: addon.isVisible ? theme.colors.primaryContainer : 'transparent'
              }
            ]}
            textStyle={{ color: addon.isVisible ? theme.colors.primary : theme.colors.outline }}
          >
            {addon.isVisible ? 'مرئي' : 'مخفي'}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>جاري تحميل الإضافات...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>❌ {error}</Text>
        <Button mode="outlined" onPress={onRefresh} style={styles.retryButton}>
          إعادة المحاولة
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search and Filters */}
      <View style={styles.filtersContainer}>
        <Searchbar
          placeholder="البحث في الإضافات..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilter}
        >
          {categories.map(cat => (
            <Chip
              key={cat}
              mode={selectedCategory === cat ? "flat" : "outlined"}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.filterChip,
                selectedCategory === cat && { backgroundColor: theme.colors.primary }
              ]}
              textStyle={{
                color: selectedCategory === cat ? theme.colors.onPrimary : theme.colors.onSurface
              }}
            >
              {categoryLabels[cat] || cat}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {/* Addons List */}
      <ScrollView style={styles.addonsList} showsVerticalScrollIndicator={false}>
        {filteredAddons.length > 0 ? (
          filteredAddons.map(renderAddonCard)
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="plus-circle-multiple-outline"
              size={64}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="titleMedium" style={styles.emptyTitle}>
              لا توجد إضافات
            </Text>
            <Text variant="bodySmall" style={styles.emptySubtitle}>
              {searchQuery || selectedCategory !== 'all' 
                ? 'جرب تغيير معايير البحث' 
                : 'ابدأ بإضافة إضافات جديدة لمطعمك'
              }
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Create Addon FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={onCreateAddon}
        label="إضافة جديدة"
      />
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: theme.colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: theme.colors.surface,
  },
  searchBar: {
    marginBottom: 12,
  },
  categoryFilter: {
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  addonsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  addonCard: {
    marginBottom: 12,
  },
  addonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  addonInfo: {
    flex: 1,
    marginRight: 8,
  },
  addonName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  addonPrice: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  addonActions: {
    flexDirection: 'row',
  },
  addonDescription: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  addonFooter: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryChip: {
    marginRight: 8,
  },
  visibilityChip: {
    marginRight: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default AddonList;
