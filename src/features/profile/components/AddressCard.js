import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  I18nManager
} from 'react-native';
import { 
  IconButton, 
  Menu, 
  Divider, 
  useTheme 
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { fontSize } from '../../../theme/fontSizes';

const AddressCard = ({ 
  address, 
  onEdit, 
  onDelete, 
  onSetDefault,
  showConfirmation = true
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [menuVisible, setMenuVisible] = useState(false);
  
  const handleCardPress = () => {
    // إذا لم يكن العنوان حالي، قم بتعيينه كحالي
    if (!address.isDefault) {
      onSetDefault(address._id);
    }
  };
  
  const styles = {
    addressCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    currentAddressCard: {
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    clickableCard: {
      borderWidth: 1,
      borderColor: theme.colors.outline,
      borderStyle: 'dashed',
    },
    addressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    addressTitle: {
      fontSize: fontSize.large,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    currentBadge: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 8,
    },
    currentBadgeText: {
      color: theme.colors.surface,
      fontSize: fontSize.small,
      fontWeight: 'bold',
    },
    addressContent: {
      gap: 4,
    },
    addressText: {
      fontSize: fontSize.medium,
      color: theme.colors.onSurface,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      lineHeight: 20,
    },
    clickableHint: {
      fontSize: fontSize.small,
      color: theme.colors.primary,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      fontStyle: 'italic',
      marginTop: 4,
    },
  };
  
  return (
    <TouchableOpacity 
      onPress={handleCardPress}
      activeOpacity={0.7}
      style={[
        styles.addressCard,
        address.isDefault && styles.currentAddressCard,
        !address.isDefault && styles.clickableCard
      ]}
    >
      <View style={styles.addressHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.addressTitle}>{address.name}</Text>
          {address.isDefault && (
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>
                {t('addressScreen.default')}
              </Text>
            </View>
          )}
        </View>
        
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              onPress={() => setMenuVisible(true)}
              size={20}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              onEdit(address);
            }}
            title={t('addressScreen.edit')}
            leadingIcon="pencil"
          />
          {!address.isDefault && (
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                onSetDefault(address._id);
              }}
              title={t('addressScreen.setDefault')}
              leadingIcon="check-circle"
            />
          )}
          <Divider />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              onDelete(address._id);
            }}
            title={t('addressScreen.delete')}
            leadingIcon="delete"
          />
        </Menu>
      </View>
      
      <View style={styles.addressContent}>
        <Text style={styles.addressText}>{address.street}</Text>
        {address.notes && address.notes !== address.street && (
          <Text style={styles.addressText}>{address.notes}</Text>
        )}
        <Text style={[styles.addressText, { opacity: 0.7 }]}>
          {(address.zone && address.zone.name) || (address.area && typeof address.area === 'object' && address.area.name) || t('addressScreen.unknownZone')}
        </Text>
        {!address.isDefault && (
          <Text style={styles.clickableHint}>
            {t('addressScreen.clickToSetCurrent')}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default AddressCard; 