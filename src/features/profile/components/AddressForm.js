import React from 'react';
import {
  View,
  Text,
  I18nManager
} from 'react-native';
import { 
  TextInput, 
  Button, 
  useTheme 
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import ZonePicker from '../components/ZonePicker';
import { fontSize } from '../../../theme/fontSizes';

const AddressForm = ({
  addressName,
  setAddressName,
  streetAddress,
  setStreetAddress,
  addressNotes,
  setAddressNotes,
  selectedZone,
  setSelectedZone,
  formErrors,
  onSave,
  onCancel,
  loading,
  editingAddress
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  
  const styles = {
    formSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    formTitle: {
      fontSize: fontSize.large,
      fontWeight: 'bold',
      marginBottom: 16,
      color: theme.colors.onSurface,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    input: {
      marginBottom: 8,
      backgroundColor: theme.colors.surface,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: fontSize.small,
      marginBottom: 8,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
      marginTop: 16,
    },
    button: {
      flex: 1,
    },
  };
  
  return (
    <View style={styles.formSection}>
      <Text style={styles.formTitle}>
        {editingAddress
          ? t('addressScreen.editAddress')
          : t('addressScreen.addAddress')
        }
      </Text>
      
      <TextInput
        mode="outlined"
        label={t('addressScreen.addressName')}
        placeholder={t('addressScreen.addressNamePlaceholder')}
        value={addressName}
        onChangeText={setAddressName}
        error={!!formErrors.name}
        style={styles.input}
        dense
      />
      {formErrors.name && <Text style={styles.errorText}>{formErrors.name}</Text>}
      
      <TextInput
        mode="outlined"
        label={t('addressScreen.streetAddress')}
        placeholder={t('addressScreen.streetAddressPlaceholder')}
        value={streetAddress}
        onChangeText={setStreetAddress}
        error={!!formErrors.street}
        style={styles.input}
        multiline
      />
      {formErrors.street && <Text style={styles.errorText}>{formErrors.street}</Text>}
      
      <TextInput
        mode="outlined"
        label={t('addressScreen.notes')}
        placeholder={t('addressScreen.notesPlaceholder')}
        value={addressNotes}
        onChangeText={setAddressNotes}
        style={styles.input}
        multiline
      />
      
      <ZonePicker
        label={t('addressScreen.deliveryZone')}
        selectedZone={selectedZone}
        onSelect={setSelectedZone}
        error={!!formErrors.zone}
        errorText={formErrors.zone}
      />
      
      <View style={styles.buttonRow}>
        <Button
          mode="outlined"
          onPress={onCancel}
          style={styles.button}
          disabled={loading}
        >
          {t('addressScreen.cancel')}
        </Button>
        
        <Button
          mode="contained"
          onPress={onSave}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          {t('addressScreen.save')}
        </Button>
      </View>
    </View>
  );
};

export default AddressForm; 