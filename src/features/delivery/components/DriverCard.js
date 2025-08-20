/**
 * DriverCard Component
 * --------------------------------------------
 * مكون بطاقة السائق
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, Text, Card, Chip, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DriverCard = ({ 
  driver, 
  onPress, 
  onRemove, 
  onAssign,
  showRemoveButton = true,
  showAssignButton = false,
  loading = false 
}) => {
  const theme = useTheme();

  const getStatusColor = () => {
    if (driver.isAvailable) {
      return theme.colors.primary;
    }
    if (driver.isWorking) {
      return theme.colors.warning;
    }
    return theme.colors.error;
  };

  const getStatusText = () => {
    if (driver.isAvailable) {
      return 'متاح';
    }
    if (driver.isWorking) {
      return 'يعمل';
    }
    return 'غير متاح';
  };

  const getStatusIcon = () => {
    if (driver.isAvailable) {
      return 'check-circle';
    }
    if (driver.isWorking) {
      return 'clock';
    }
    return 'close-circle';
  };

  return (
    <Card 
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
    >
      <Card.Content style={styles.content}>
        {/* Driver Info */}
        <View style={styles.driverInfo}>
          <View style={styles.nameSection}>
            <Text style={[styles.driverName, { color: theme.colors.onSurface }]}>
              {driver.name || `السائق ${driver.phoneNumber}`}
            </Text>
            <Text style={[styles.phoneNumber, { color: theme.colors.onSurfaceVariant }]}>
              {driver.phoneNumber}
            </Text>
          </View>

          {/* Status */}
          <View style={styles.statusSection}>
            <Chip
              icon={getStatusIcon()}
              textStyle={[styles.statusText, { color: getStatusColor() }]}
              style={[styles.statusChip, { backgroundColor: getStatusColor() + '20' }]}
            >
              {getStatusText()}
            </Chip>
          </View>
        </View>

        {/* Additional Info */}
        <View style={styles.additionalInfo}>
          {driver.activeOrdersCount !== undefined && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons 
                name="package-variant" 
                size={16} 
                color={theme.colors.onSurfaceVariant} 
              />
              <Text style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
                الطلبات النشطة: {driver.activeOrdersCount}
              </Text>
            </View>
          )}
          
          {driver.role && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons 
                name="account" 
                size={16} 
                color={theme.colors.onSurfaceVariant} 
              />
              <Text style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
                {driver.role === 'driver' ? 'سائق' : driver.role}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {showAssignButton && (
            <IconButton
              icon="account-plus"
              size={20}
              iconColor={theme.colors.primary}
              onPress={() => onAssign?.(driver)}
              disabled={loading || !driver.isAvailable}
              style={styles.actionButton}
            />
          )}
          
          {showRemoveButton && (
            <IconButton
              icon="account-remove"
              size={20}
              iconColor={theme.colors.error}
              onPress={() => onRemove?.(driver)}
              disabled={loading}
              style={styles.actionButton}
            />
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    marginHorizontal: 8,
    elevation: 2,
    borderRadius: 12,
  },
  content: {
    padding: 16,
  },
  driverInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  nameSection: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusSection: {
    marginLeft: 12,
  },
  statusChip: {
    height: 28,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  additionalInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionButton: {
    margin: 0,
  },
});

export default DriverCard;
