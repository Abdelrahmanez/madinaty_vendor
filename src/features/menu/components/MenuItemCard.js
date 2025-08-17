import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme, Card, IconButton, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const MenuItemCard = ({ 
  item, 
  onPress, 
  onToggleAvailability, 
  onEdit,
  showActions = true 
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [toggleLoading, setToggleLoading] = useState(false);

  const handleToggleAvailability = async () => {
    if (onToggleAvailability && !toggleLoading) {
      setToggleLoading(true);
      try {
        await onToggleAvailability(item._id);
      } catch (error) {
        console.error('Error in toggle availability:', error);
      } finally {
        setToggleLoading(false);
      }
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(item);
    }
  };

  return (
    <Card style={[styles.card, !item.isAvailable && styles.unavailableCard]} onPress={onPress}>
      <Card.Content style={styles.cardContent}>
                 {/* Image Section */}
         <View style={styles.imageContainer}>
           {item.images && item.images.length > 0 ? (
             <Image source={{ uri: item.images[0] }} style={styles.image} />
           ) : item.imageUrl ? (
             <Image source={{ uri: item.imageUrl }} style={styles.image} />
           ) : (
             <View style={styles.placeholderImage}>
               <MaterialCommunityIcons name="food" size={40} color={theme.colors.outline} />
             </View>
           )}
          
          {/* Availability Badge */}
          <View style={[styles.availabilityBadge, 
            item.isAvailable ? styles.availableBadge : styles.unavailableBadge]}>
            <Text style={[styles.availabilityText, 
              item.isAvailable ? styles.availableText : styles.unavailableText]}>
              {item.isAvailable ? 'متاح' : 'غير متاح'}
            </Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
                     <View style={styles.headerRow}>
             <Text style={styles.title} numberOfLines={2}>
               {item.name}
             </Text>
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

          <Text style={styles.description} numberOfLines={2}>
            {item.description || 'لا يوجد وصف'}
          </Text>

                     {/* Category and Tags */}
           <View style={styles.tagsContainer}>
             {item.category && item.category.name && (
               <Chip 
                 mode="outlined" 
                 compact 
                 style={styles.categoryChip}
                 textStyle={styles.chipText}
               >
                 {item.category.name}
               </Chip>
             )}
             
             {item.isFeatured && (
               <Chip 
                 mode="outlined" 
                 compact 
                 style={[styles.categoryChip, styles.featuredChip]}
                 textStyle={styles.chipText}
               >
                 مميز
               </Chip>
             )}
             
             {item.unitType && (
               <Chip 
                 mode="outlined" 
                 compact 
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
                 compact 
                 style={styles.categoryChip}
                 textStyle={styles.chipText}
               >
                 {tag}
               </Chip>
             ))}
           </View>

                     {/* Quick Stats */}
           <View style={styles.statsContainer}>
             {item.sizes && item.sizes.length > 0 && (
               <Text style={styles.stockText}>
                 المخزون: {item.sizes.reduce((total, size) => total + (size.currentStock || 0), 0)}
               </Text>
             )}
             {item.ratingsQuantity > 0 && (
               <Text style={styles.ratingText}>
                 ⭐ {item.ratingsAverage?.toFixed(1) || 0} ({item.ratingsQuantity})
               </Text>
             )}
             {item.allowedAddons && item.allowedAddons.length > 0 && (
               <Text style={styles.addonsText}>
                 إضافات: {item.allowedAddons.length}
               </Text>
             )}
             {item.extraDeliveryFee > 0 && (
               <Text style={styles.deliveryFeeText}>
                 رسوم إضافية: {item.extraDeliveryFee} ج.م
               </Text>
             )}
             {item.displayOrder > 0 && (
               <Text style={styles.orderText}>
                 الترتيب: {item.displayOrder}
               </Text>
             )}
           </View>
        </View>

                 {/* Actions */}
         {showActions && (
           <View style={styles.actionsContainer}>
             <IconButton
               icon={item.isAvailable ? 'eye-off' : 'eye'}
               size={20}
               iconColor={item.isAvailable ? theme.colors.error : theme.colors.primary}
               onPress={handleToggleAvailability}
               style={styles.actionButton}
               disabled={toggleLoading}
               loading={toggleLoading}
             />
             <IconButton
               icon="pencil"
               size={20}
               iconColor={theme.colors.primary}
               onPress={handleEdit}
               style={styles.actionButton}
               disabled={toggleLoading}
             />
           </View>
         )}
      </Card.Content>
    </Card>
  );
};

const createStyles = (theme) => StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
    borderRadius: 12,
  },
  unavailableCard: {
    opacity: 0.6,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availabilityBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  availableBadge: {
    backgroundColor: theme.colors.primaryContainer,
  },
  unavailableBadge: {
    backgroundColor: theme.colors.errorContainer,
  },
  availabilityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  availableText: {
    color: theme.colors.onPrimaryContainer,
  },
  unavailableText: {
    color: theme.colors.onErrorContainer,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    flex: 1,
    marginRight: 8,
  },
     priceContainer: {
     alignItems: 'flex-end',
   },
   price: {
     fontSize: 14,
     fontWeight: 'bold',
     color: theme.colors.primary,
   },
   discountText: {
     fontSize: 10,
     color: theme.colors.error,
     fontWeight: 'bold',
   },
  description: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 8,
    lineHeight: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  categoryChip: {
    marginRight: 4,
    marginBottom: 4,
  },
     popularChip: {
     backgroundColor: theme.colors.tertiaryContainer,
   },
   featuredChip: {
     backgroundColor: theme.colors.secondaryContainer,
   },
  chipText: {
    fontSize: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stockText: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
  },
     ratingText: {
     fontSize: 11,
     color: theme.colors.onSurfaceVariant,
   },
   addonsText: {
     fontSize: 11,
     color: theme.colors.onSurfaceVariant,
   },
   deliveryFeeText: {
     fontSize: 11,
     color: theme.colors.error,
   },
   orderText: {
     fontSize: 11,
     color: theme.colors.onSurfaceVariant,
   },
  actionsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 8,
  },
  actionButton: {
    margin: 2,
  },
});

export default MenuItemCard;

