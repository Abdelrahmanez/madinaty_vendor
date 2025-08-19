import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Chip, IconButton, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * مكون بطاقة منطقة التوصيل للمطعم
 */
const ZoneCard = ({ 
  zone, 
  onEditPrice, 
  onDeactivate,
  onPress 
}) => {
  const theme = useTheme();

  // فحص وجود zone
  if (!zone) {
    return null;
  }

  const handleEditPrice = () => {
    if (onEditPrice) {
      onEditPrice(zone);
    }
  };

  const handleDeactivate = () => {
    if (onDeactivate && zone._id) {
      onDeactivate(zone._id);
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress(zone);
    }
  };

  return (
    <Card 
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={handlePress}
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons 
              name="map-marker" 
              size={24} 
              color={theme.colors.primary} 
            />
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              {zone.name || 'منطقة بدون اسم'}
            </Text>
          </View>
          
          <Chip 
            mode="outlined"
            style={[
              styles.statusChip,
              { 
                backgroundColor: zone.isActive && zone.isRestaurantZoneActive
                  ? theme.colors.primaryContainer 
                  : theme.colors.errorContainer,
                borderColor: zone.isActive && zone.isRestaurantZoneActive
                  ? theme.colors.primary 
                  : theme.colors.error
              }
            ]}
            textStyle={{ 
              fontSize: 12,
              color: zone.isActive && zone.isRestaurantZoneActive
                ? theme.colors.onPrimaryContainer 
                : theme.colors.onErrorContainer 
            }}
          >
            {zone.isActive && zone.isRestaurantZoneActive ? 'نشط' : 'غير نشط'}
          </Chip>
        </View>

        {zone.description && (
          <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
            {zone.description}
          </Text>
        )}

        <View style={styles.details}>
          {/* سعر التوصيل للمطعم */}
          <View style={styles.detailItem}>
            <MaterialCommunityIcons 
              name="currency-usd" 
              size={16} 
              color={zone.price ? theme.colors.primary : theme.colors.error} 
            />
            <Text style={[
              styles.detailText, 
              { 
                color: zone.price ? theme.colors.onSurfaceVariant : theme.colors.error,
                fontWeight: zone.price ? 'normal' : 'bold'
              }
            ]}>
              {zone.price ? `سعر التوصيل: ${zone.price} جنيه` : 'لم يتم تعيين سعر'}
            </Text>
          </View>


        </View>

        <View style={styles.actions}>
          {/* زر تعديل السعر */}
          <Text
          style={[styles.editPriceText, { color: theme.colors.primary }]}
          >تعديل السعر</Text>
          <IconButton
            icon="currency-usd"
            size={24}
            iconColor={theme.colors.primary}
            onPress={handleEditPrice}
            style={styles.actionButton}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  statusChip: {
    height: 28,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  details: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 12,
    marginTop: 8,
  },
  actionButton: {
    margin: 0,
  },
  editPriceText: {
    fontSize: 14,
    alignSelf: 'center',
  },
});

export default ZoneCard;
