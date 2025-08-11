import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  I18nManager
} from 'react-native';
import { 
  Dialog, 
  Portal, 
  Button, 
  useTheme 
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import useDeliveryZones from '../../hooks/useDeliveryZones';
import { fontSize } from '../../theme/fontSizes';

const ZonePicker = ({ 
  label, 
  selectedZone, 
  onSelect,
  error,
  errorText
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { zones, loading, error: zonesError } = useDeliveryZones();
  const [menuVisible, setMenuVisible] = useState(false);
  
  const styles = {
    zonePickerContainer: {
      marginBottom: 16,
    },
    zonePickerLabel: {
      fontSize: fontSize.medium,
      fontWeight: 'bold',
      marginBottom: 8,
      color: theme.colors.onSurface,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    zonePicker: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.outline,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: theme.colors.surface,
    },
    zonePickerError: {
      borderColor: theme.colors.error,
    },
    zonePickerText: {
      fontSize: fontSize.medium,
      color: theme.colors.onSurface,
      flex: 1,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    zonePickerPlaceholder: {
      color: theme.colors.onSurfaceVariant,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: fontSize.small,
      marginTop: 4,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    zoneDialog: {
      maxHeight: '80%',
    },
    zoneItem: {
      padding: 16,
      borderRadius: 8,
      marginVertical: 2,
    },
    zoneItemSelected: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    zoneItemText: {
      fontSize: fontSize.medium,
      color: theme.colors.onSurface,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    zoneItemTextSelected: {
      fontWeight: '600',
      color: theme.colors.primary,
    },
    emptyContainer: {
      padding: 20,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: fontSize.medium,
      marginTop: 12,
      opacity: 0.6,
      textAlign: 'center',
      color: theme.colors.onSurfaceVariant,
    },
  };
  
  return (
    <View style={styles.zonePickerContainer}>
      {label && <Text style={styles.zonePickerLabel}>{label}</Text>}
      
      <TouchableOpacity
        style={[
          styles.zonePicker,
          error && styles.zonePickerError
        ]}
        onPress={() => setMenuVisible(true)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <>
            <Text style={[
              styles.zonePickerText,
              !selectedZone && styles.zonePickerPlaceholder
            ]}>
              {selectedZone ? selectedZone.name : t('addressScreen.zonePlaceholder')}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={24}
              color={theme.colors.primary}
            />
          </>
        )}
      </TouchableOpacity>
      
      {error && errorText && (
        <Text style={styles.errorText}>{errorText}</Text>
      )}
      
      <Portal>
        <Dialog
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          style={styles.zoneDialog}
        >
          <Dialog.Title>{t('addressScreen.selectZone')}</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView>
              {zones.map(zone => (
                <TouchableOpacity
                  key={zone._id}
                  style={[
                    styles.zoneItem,
                    selectedZone && selectedZone._id === zone._id && styles.zoneItemSelected
                  ]}
                  onPress={() => {
                    onSelect(zone);
                    setMenuVisible(false);
                  }}
                >
                  <Text style={[
                    styles.zoneItemText, 
                    selectedZone && selectedZone._id === zone._id && styles.zoneItemTextSelected
                  ]}>{zone.name}</Text>
                </TouchableOpacity>
              ))}
              {zones.length === 0 && (
                <View style={styles.emptyContainer}>
                  <MaterialCommunityIcons name="map-marker-off" size={40} color={theme.colors.outlineVariant} />
                  <Text style={styles.emptyText}>
                    {t('addressScreen.noZonesAvailable')}
                  </Text>
                </View>
              )}
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button 
              onPress={() => setMenuVisible(false)}
              textColor={theme.colors.primary}
              style={{ paddingHorizontal: 10 }}
            >
              {t('addressScreen.cancel')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default ZonePicker; 