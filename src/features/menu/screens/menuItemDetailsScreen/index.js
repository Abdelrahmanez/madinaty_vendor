import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Text, Card, Button, Chip, Divider, IconButton, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TopBar from '../../../../components/TopBar';
import { toggleDishAvailability } from '../../api/dish';

const MenuItemDetailsScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets);
  
  const { item } = route.params;
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');

  const handleEdit = () => {
    navigation.navigate('EditMenuItem', { item });
  };

  const handleToggleAvailability = async () => {
    setLoading(true);
    try {
      
      // Call the API to toggle availability
      const response = await toggleDishAvailability(item._id);
      
      // Update the item in route params to reflect the change
      route.params.item.isAvailable = !item.isAvailable;
      
      // Show success message
      setSnackbarMessage('تم تحديث حالة العنصر بنجاح');
      setSnackbarType('success');
      setSnackbarVisible(true);
      
    } catch (error) {
      // Show error message
      setSnackbarMessage('حدث خطأ أثناء تحديث حالة العنصر');
      setSnackbarType('error');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const renderImageSection = () => (
    <View style={styles.imageContainer}>
      {item.images && item.images.length > 0 ? (
        <Image source={{ uri: item.images[0] }} style={styles.image} />
      ) : item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.placeholderImage}>
          <MaterialCommunityIcons name="food" size={80} color={theme.colors.outline} />
        </View>
      )}
      
      <View style={[styles.availabilityBadge, 
        item.isAvailable ? styles.availableBadge : styles.unavailableBadge]}>
        <Text style={[styles.availabilityText, 
          item.isAvailable ? styles.availableText : styles.unavailableText]}>
          {item.isAvailable ? 'متاح' : 'غير متاح'}
        </Text>
      </View>
    </View>
  );

  const renderBasicInfo = () => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{item.name}</Text>
          <View style={styles.priceContainer}>
            {item.sizes && item.sizes.length > 0 ? (
              <Text style={styles.price}>
                من {Math.min(...item.sizes.map(size => size.price))} ج.م
              </Text>
            ) : item.price ? (
              <Text style={styles.price}>
                {item.price} ج.م
              </Text>
            ) : (
              <Text style={styles.price}>
                غير محدد
              </Text>
            )}
            {item.offer && item.offer.isActive && item.offer.value && (
              <Text style={styles.discountText}>
                خصم {item.offer.value}%
              </Text>
            )}
          </View>
        </View>
        
        <Text style={styles.description}>
          {item.description || 'لا يوجد وصف'}
        </Text>

                 <View style={styles.tagsContainer}>
           {item.category && item.category.name && (
             <Chip 
               mode="outlined" 
               style={styles.categoryChip}
               textStyle={styles.chipText}
             >
               {item.category.name}
             </Chip>
           )}
           
           {item.isFeatured && (
             <Chip 
               mode="outlined" 
               style={[styles.categoryChip, styles.featuredChip]}
               textStyle={styles.chipText}
             >
               مميز
             </Chip>
           )}
           
           {item.unitType && (
             <Chip 
               mode="outlined" 
               style={styles.categoryChip}
               textStyle={styles.chipText}
             >
               {item.unitType}
             </Chip>
           )}
           
           {item.tags && item.tags.length > 0 && item.tags.map((tag, index) => (
             <Chip 
               key={index}
               mode="outlined" 
               style={styles.categoryChip}
               textStyle={styles.chipText}
             >
               {tag}
             </Chip>
           ))}
         </View>
      </Card.Content>
    </Card>
  );

  const renderDetails = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.sectionTitle}>تفاصيل العنصر</Text>
        <Divider style={styles.divider} />
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>المخزون:</Text>
          <Text style={styles.detailValue}>
            {item.sizes && item.sizes.length > 0 
              ? item.sizes.reduce((total, size) => total + (size.currentStock || 0), 0)
              : 'غير محدد'
            }
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>التقييم:</Text>
          <Text style={styles.detailValue}>
            {item.ratingsQuantity > 0 
              ? `⭐ ${item.ratingsAverage?.toFixed(1) || 0} (${item.ratingsQuantity} تقييم)`
              : 'لا توجد تقييمات'
            }
          </Text>
        </View>
        
                 <View style={styles.detailRow}>
           <Text style={styles.detailLabel}>تاريخ الإضافة:</Text>
           <Text style={styles.detailValue}>
             {item.createdAt ? new Date(item.createdAt).toLocaleDateString('ar-EG') : 'غير محدد'}
           </Text>
         </View>
         
         <View style={styles.detailRow}>
           <Text style={styles.detailLabel}>آخر تحديث:</Text>
           <Text style={styles.detailValue}>
             {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('ar-EG') : 'غير محدد'}
           </Text>
         </View>
         
         <View style={styles.detailRow}>
           <Text style={styles.detailLabel}>نوع الوحدة:</Text>
           <Text style={styles.detailValue}>
             {item.unitType || 'غير محدد'}
           </Text>
         </View>
         
         {item.extraDeliveryFee > 0 && (
           <View style={styles.detailRow}>
             <Text style={styles.detailLabel}>رسوم التوصيل الإضافية:</Text>
             <Text style={styles.detailValue}>
               {item.extraDeliveryFee} ج.م
             </Text>
           </View>
         )}
         
         <View style={styles.detailRow}>
           <Text style={styles.detailLabel}>ترتيب العرض:</Text>
           <Text style={styles.detailValue}>
             {item.displayOrder || 0}
           </Text>
         </View>
         
         {item.slug && (
           <View style={styles.detailRow}>
             <Text style={styles.detailLabel}>الرابط المختصر:</Text>
             <Text style={styles.detailValue}>
               {item.slug}
             </Text>
           </View>
         )}
         
         {item.allergens && item.allergens.length > 0 && (
           <View style={styles.detailRow}>
             <Text style={styles.detailLabel}>مسببات الحساسية:</Text>
             <Text style={styles.detailValue}>
               {item.allergens.join(', ')}
             </Text>
           </View>
         )}
      </Card.Content>
    </Card>
  );

  const renderSizes = () => {
    if (!item.sizes || item.sizes.length === 0) return null;
    
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>الأحجام والأسعار</Text>
          <Divider style={styles.divider} />
          
          {item.sizes.map((size, index) => (
            <View key={size._id || index} style={styles.sizeRow}>
              <View style={styles.sizeInfo}>
                <Text style={styles.sizeName}>{size.name}</Text>
                <Text style={styles.sizePrice}>{size.price} ج.م</Text>
              </View>
              <View style={styles.sizeStats}>
                <Text style={styles.stockText}>المخزون: {size.currentStock || 0}</Text>
                <Text style={styles.soldText}>المباع: {size.sold || 0}</Text>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  const renderRestaurantInfo = () => {
    if (!item.restaurant) return null;
    
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>معلومات المطعم</Text>
          <Divider style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>اسم المطعم:</Text>
            <Text style={styles.detailValue}>{item.restaurant.name}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>الحالة:</Text>
            <Text style={styles.detailValue}>{item.restaurant.status}</Text>
          </View>
          
          {item.restaurant.owner && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>المالك:</Text>
              <Text style={styles.detailValue}>{item.restaurant.owner.name}</Text>
            </View>
          )}
          
          {item.restaurant.address?.area && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>المنطقة:</Text>
              <Text style={styles.detailValue}>{item.restaurant.address.area.name}</Text>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderOfferInfo = () => {
    if (!item.offer || !item.offer.isActive) return null;
    
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>العرض الحالي</Text>
          <Divider style={styles.divider} />
          
          {item.offer.type && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>نوع العرض:</Text>
              <Text style={styles.detailValue}>{item.offer.type}</Text>
            </View>
          )}
          
          {item.offer.value && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>قيمة الخصم:</Text>
              <Text style={styles.detailValue}>{item.offer.value}%</Text>
            </View>
          )}
          
          {item.offer.description && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>وصف العرض:</Text>
              <Text style={styles.detailValue}>{item.offer.description}</Text>
            </View>
          )}
          
          {item.offer.startDate && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>تاريخ البداية:</Text>
              <Text style={styles.detailValue}>
                {new Date(item.offer.startDate).toLocaleDateString('ar-EG')}
              </Text>
            </View>
          )}
          
          {item.offer.endDate && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>تاريخ الانتهاء:</Text>
              <Text style={styles.detailValue}>
                {new Date(item.offer.endDate).toLocaleDateString('ar-EG')}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderIngredients = () => {
    if (!item.ingredients || item.ingredients.length === 0) return null;
    
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>المكونات</Text>
          <Divider style={styles.divider} />
          
          {item.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientRow}>
              <Text style={styles.ingredientText}>• {ingredient}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  const renderAddons = () => {
    if (!item.allowedAddons || item.allowedAddons.length === 0) return null;
    
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>الإضافات المتاحة</Text>
          <Divider style={styles.divider} />
          
          {item.allowedAddons.map((addon, index) => (
            <View key={addon._id || index} style={styles.addonRow}>
              <Text style={styles.addonName}>{addon.name}</Text>
              <Text style={styles.addonPrice}>+{addon.price} ج.م</Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  const renderActions = () => (
    <View style={styles.actionsContainer}>
      <Button
        mode="contained"
        onPress={handleEdit}
        style={styles.actionButton}
        icon="pencil"
        loading={loading}
      >
        تعديل العنصر
      </Button>
      
      <Button
        mode="outlined"
        onPress={handleToggleAvailability}
        style={styles.actionButton}
        icon={item.isAvailable ? 'eye-off' : 'eye'}
        loading={loading}
      >
        {item.isAvailable ? 'إخفاء من القائمة' : 'إظهار في القائمة'}
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      <TopBar
        title="تفاصيل العنصر"
        showBackButton={true}
        backgroundColor={theme.colors.primary}
        titleColor={theme.colors.onPrimary}
        onBackPress={() => navigation.goBack()}
      />
      
             <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
         {renderImageSection()}
         {renderBasicInfo()}
         {renderDetails()}
         {renderRestaurantInfo()}
         {renderOfferInfo()}
         {renderIngredients()}
         {renderSizes()}
         {renderAddons()}
         {renderActions()}
       </ScrollView>
       
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
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    paddingVertical: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  placeholderImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availabilityBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  availableBadge: {
    backgroundColor: theme.colors.primaryContainer,
  },
  unavailableBadge: {
    backgroundColor: theme.colors.errorContainer,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  availableText: {
    color: theme.colors.onPrimaryContainer,
  },
  unavailableText: {
    color: theme.colors.onErrorContainer,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    flex: 1,
    marginRight: 12,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  discountText: {
    fontSize: 12,
    color: theme.colors.error,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 4,
  },
     popularChip: {
     backgroundColor: theme.colors.tertiaryContainer,
   },
   featuredChip: {
     backgroundColor: theme.colors.secondaryContainer,
   },
  chipText: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    marginBottom: 12,
  },
  divider: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: theme.colors.onSurface,
    fontWeight: 'bold',
  },
  actionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  actionButton: {
    borderRadius: 8,
  },
  sizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  sizeInfo: {
    flex: 1,
  },
  sizeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  },
  sizePrice: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  sizeStats: {
    alignItems: 'flex-end',
  },
  stockText: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
  },
  soldText: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
  },
  addonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  addonName: {
    fontSize: 14,
    color: theme.colors.onSurface,
  },
     addonPrice: {
     fontSize: 12,
     color: theme.colors.primary,
     fontWeight: 'bold',
   },
   ingredientRow: {
     paddingVertical: 4,
   },
   ingredientText: {
     fontSize: 14,
     color: theme.colors.onSurface,
   },
   snackbar: {
     backgroundColor: theme.colors.primaryContainer,
   },
   errorSnackbar: {
     backgroundColor: theme.colors.errorContainer,
   },
});

export default MenuItemDetailsScreen;

