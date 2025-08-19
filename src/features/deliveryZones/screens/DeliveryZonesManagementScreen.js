import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { useTheme, FAB, ActivityIndicator, Searchbar, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TopBar from '../../../components/TopBar';
import ZoneCard from '../components/ZoneCard';
import PriceForm from '../components/PriceForm';
import { useDeliveryZonesManagement } from '../hooks/useDeliveryZonesManagement';

/**
 * شاشة إدارة مناطق التوصيل للمطعم
 */
const DeliveryZonesManagementScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  // استخدام hook إدارة مناطق التوصيل
  const {
    zones,
    loading,
    error,
    refreshing,
    validationStatus,
    addZonePrice,
    updateZonePriceAction,
    deactivateZoneAction,
    validateZones,
    refreshData
  } = useDeliveryZonesManagement();

  // حالة النموذج
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // تصفية المناطق حسب البحث
  const filteredZones = (zones || []).filter(zone => {
    if (!zone) return false;
    const query = (searchQuery || '').toString();
    return (
      (zone.name && typeof zone.name === 'string' && zone.name.toLowerCase().includes(query.toLowerCase())) ||
      (zone.description && typeof zone.description === 'string' && zone.description.toLowerCase().includes(query.toLowerCase()))
    );
  });

  // تعديل سعر منطقة
  const handleEditPrice = (zone) => {
    setEditingZone(zone);
    setShowPriceForm(true);
  };

  // إلغاء تفعيل منطقة
  const handleDeactivateZone = (zoneId) => {
    Alert.alert(
      'تأكيد إلغاء التفعيل',
      'هل أنت متأكد من إلغاء تفعيل هذه المنطقة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'إلغاء التفعيل', 
          style: 'destructive',
          onPress: () => deactivateZoneAction(zoneId)
        }
      ]
    );
  };

  // التحقق من صحة المناطق
  const handleValidateZones = async () => {
    try {
      await validateZones();
    } catch (error) {
      // الخطأ يتم التعامل معه في hook
    }
  };

  // إرسال نموذج السعر
  const handleSubmitPriceForm = async (priceData) => {
    try {
      if (editingZone && editingZone.price) {
        // تحديث السعر الموجود
        await updateZonePriceAction(editingZone._id, priceData.price);
      } else if (editingZone) {
        // تعيين سعر جديد
        await addZonePrice(editingZone._id, priceData.price);
      }
      setShowPriceForm(false);
      setEditingZone(null);
    } catch (error) {
      // الخطأ يتم التعامل معه في hook
    }
  };

  // إلغاء نموذج السعر
  const handleCancelPriceForm = () => {
    setShowPriceForm(false);
    setEditingZone(null);
  };

  // إذا كان نموذج السعر مفتوح
  if (showPriceForm) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <TopBar 
          title="تعديل سعر التوصيل"
          showBackButton={true}
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.onPrimary}
        />
        <PriceForm
          zone={editingZone}
          onSubmit={handleSubmitPriceForm}
          onCancel={handleCancelPriceForm}
          loading={loading}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopBar 
        title="إدارة مناطق التوصيل"
        showBackButton={true}
        backgroundColor={theme.colors.primary}
        titleColor={theme.colors.onPrimary}
      />
      
      <View style={styles.content}>
        {/* شريط البحث */}
        <Searchbar
          placeholder="البحث في مناطق التوصيل..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor={theme.colors.primary}
        />

        {/* زر التحقق من الصحة */}
        <Button
          mode="outlined"
          onPress={handleValidateZones}
          loading={loading}
          style={styles.validateButton}
          icon="check-circle"
        >
          التحقق من صحة المناطق
        </Button>

        {/* حالة التحقق */}
        {validationStatus && (
          <View style={[
            styles.validationStatus,
            { 
              backgroundColor: validationStatus.isValid 
                ? theme.colors.primaryContainer 
                : theme.colors.errorContainer 
            }
          ]}>
            <MaterialCommunityIcons 
              name={validationStatus.isValid ? "check-circle" : "alert-circle"} 
              size={24} 
              color={validationStatus.isValid ? theme.colors.onPrimaryContainer : theme.colors.onErrorContainer} 
            />
            <Text style={[
              styles.validationText,
              { 
                color: validationStatus.isValid 
                  ? theme.colors.onPrimaryContainer 
                  : theme.colors.onErrorContainer 
              }
            ]}>
              {validationStatus.message || (validationStatus.isValid ? 'جميع المناطق صحيحة' : 'يوجد مشاكل في المناطق')}
            </Text>
          </View>
        )}

        {/* إحصائيات سريعة */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.primaryContainer }]}>
            <MaterialCommunityIcons name="map-marker-multiple" size={24} color={theme.colors.onPrimaryContainer} />
            <Text style={[styles.statNumber, { color: theme.colors.onPrimaryContainer }]}>
              {zones.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.onPrimaryContainer }]}>
              إجمالي المناطق
            </Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: theme.colors.primaryContainer }]}>
            <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.onPrimaryContainer} />
            <Text style={[styles.statNumber, { color: theme.colors.onPrimaryContainer }]}>
              {zones.filter(zone => zone.isActive && zone.isRestaurantZoneActive).length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.onPrimaryContainer }]}>
               المناطق النشطة
             </Text>
           </View>

          
        </View>

        {/* قائمة المناطق */}
        <ScrollView 
          style={styles.zonesList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshData}
              colors={[theme.colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {loading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
                جاري تحميل مناطق التوصيل...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons name="alert-circle" size={48} color={theme.colors.error} />
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {error}
              </Text>
            </View>
          ) : filteredZones.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="map-marker-off" size={64} color={theme.colors.outlineVariant} />
              <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
                لا توجد مناطق توصيل
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
                {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد مناطق توصيل متاحة للمطعم'}
              </Text>
            </View>
          ) : (
            filteredZones.map((zone) => (
              <ZoneCard
                key={zone._id}
                zone={zone}
                onEditPrice={handleEditPrice}
                onDeactivate={handleDeactivateZone}
              />
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  validateButton: {
    marginBottom: 16,
  },
  validationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  validationText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    marginHorizontal: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  zonesList: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default DeliveryZonesManagementScreen;
