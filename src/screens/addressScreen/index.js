import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  I18nManager
} from 'react-native';
import { 
  FAB, 
  useTheme 
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TopBar from '../../components/TopBar';
import AddressCard from '../../components/address/AddressCard';
import AddressForm from '../../components/address/AddressForm';
import { useAddresses } from '../../hooks/useAddresses';
import { fontSize } from '../../theme/fontSizes';

const isRTL = I18nManager.isRTL;

const AddressScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  // استخدام الهوك الجديد
  const { 
    addresses, 
    loading, 
    error, 
    addNewAddress, 
    updateExistingAddress, 
    deleteExistingAddress, 
    setDefaultExistingAddress 
  } = useAddresses();
  
  // حالة نموذج العنوان
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressName, setAddressName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [addressNotes, setAddressNotes] = useState('');
  const [selectedZone, setSelectedZone] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  // التحقق من صحة النموذج قبل الإرسال
  const validateForm = () => {
    const errors = {};
    
    if (!addressName.trim()) {
      errors.name = t('addressScreen.requiredField');
    }
    
    if (!streetAddress.trim()) {
      errors.street = t('addressScreen.requiredField');
    }
    
    if (!selectedZone) {
      errors.zone = t('addressScreen.requiredField');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // حفظ العنوان (إضافة جديد أو تعديل)
  const saveAddress = async () => {
    if (!validateForm()) return;
    
    try {
      // تجهيز بيانات العنوان
      const addressData = {
        name: addressName,
        street: streetAddress,
        notes: addressNotes || streetAddress,
        area: selectedZone._id,
        isDefault: editingAddress ? editingAddress.isDefault : false
      };
      
      if (__DEV__) {
        console.log('بيانات العنوان للإرسال:', addressData);
      }
      
      let result;
      if (editingAddress) {
        // تحديث عنوان موجود
        result = await updateExistingAddress(editingAddress._id, addressData);
      } else {
        // إضافة عنوان جديد
        result = await addNewAddress(addressData);
      }
      
      if (result.success) {
        resetForm();
        Alert.alert(
          t('addressScreen.success'),
          editingAddress
            ? t('addressScreen.addressUpdated')
            : t('addressScreen.addressAdded')
        );
      } else {
        Alert.alert(
          t('addressScreen.error'),
          t('addressScreen.errorSavingAddress')
        );
      }
    } catch (error) {
      console.error('خطأ في حفظ العنوان:', error);
      Alert.alert(
        t('addressScreen.error'),
        t('addressScreen.errorSavingAddress')
      );
    }
  };
  
  // تعيين عنوان كعنوان حالي
  const handleSetDefault = async (addressId) => {
    try {
      const result = await setDefaultExistingAddress(addressId);
      
      if (result.success) {
        Alert.alert(
          t('addressScreen.success'),
          t('addressScreen.defaultAddressSet')
        );
      } else {
        Alert.alert(
          t('addressScreen.error'),
          t('addressScreen.errorSettingDefault')
        );
      }
    } catch (error) {
      console.error('خطأ في تعيين العنوان الحالي:', error);
      Alert.alert(
        t('addressScreen.error'),
        t('addressScreen.errorSettingDefault')
      );
    }
  };
  
  // حذف عنوان
  const handleDelete = async (addressId) => {
    Alert.alert(
      t('addressScreen.confirmDelete'),
      t('addressScreen.deleteWarning'),
      [
        { text: t('addressScreen.cancel'), style: 'cancel' },
        {
          text: t('addressScreen.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await deleteExistingAddress(addressId);
              
              if (result.success) {
                Alert.alert(
                  t('addressScreen.success'),
                  t('addressScreen.addressDeleted')
                );
              } else {
                Alert.alert(
                  t('addressScreen.error'),
                  t('addressScreen.errorDeletingAddress')
                );
              }
            } catch (error) {
              console.error('خطأ في حذف العنوان:', error);
              Alert.alert(
                t('addressScreen.error'),
                t('addressScreen.errorDeletingAddress')
              );
            }
          }
        }
      ]
    );
  };
  
  // تحرير عنوان
  const handleEdit = (address) => {
    setEditingAddress(address);
    setAddressName(address.name);
    setStreetAddress(address.street);
    setAddressNotes(address.notes);
    
    // تحسين التعامل مع بيانات المنطقة
    let zoneData;
    if (address.zone && typeof address.zone === 'object') {
      zoneData = { _id: address.zone._id, name: address.zone.name };
    } else if (address.area) {
      if (typeof address.area === 'object') {
        zoneData = { _id: address.area._id, name: address.area.name };
      } else {
        zoneData = { _id: address.area, name: address.zone?.name || 'منطقة التوصيل' };
      }
    }
    
    setSelectedZone(zoneData);
    setShowForm(true);
  };
  
  // إعادة تعيين نموذج إضافة العنوان
  const resetForm = () => {
    setEditingAddress(null);
    setAddressName('');
    setStreetAddress('');
    setAddressNotes('');
    setSelectedZone(null);
    setFormErrors({});
    setShowForm(false);
  };
  
  const styles = {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      padding: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyText: {
      fontSize: fontSize.large,
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
    },
    floatingButton: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.primary,
    },
  };
  
  return (
    <View style={styles.container}>
      <TopBar
        title={t('addressScreen.title')}
        showBack={true}
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {/* نموذج إضافة/تحرير العنوان */}
          {showForm && (
            <AddressForm
              addressName={addressName}
              setAddressName={setAddressName}
              streetAddress={streetAddress}
              setStreetAddress={setStreetAddress}
              addressNotes={addressNotes}
              setAddressNotes={setAddressNotes}
              selectedZone={selectedZone}
              setSelectedZone={setSelectedZone}
              formErrors={formErrors}
              onSave={saveAddress}
              onCancel={resetForm}
              loading={loading}
              editingAddress={editingAddress}
            />
          )}
          
          {loading && !showForm ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : addresses.length > 0 ? (
            addresses.map(address => (
              <AddressCard
                key={address._id}
                address={address}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="map-marker-off"
                size={64}
                color={theme.colors.onSurfaceVariant}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyText}>
                {t('addressScreen.noAddresses')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* زر إضافة عنوان جديد */}
      {!showForm && (
        <FAB
          style={styles.floatingButton}
          icon="plus"
          onPress={() => setShowForm(true)}
          disabled={loading}
        />
      )}
    </View>
  );
};

export default AddressScreen; 