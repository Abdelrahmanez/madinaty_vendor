/**
 * EditPromocodeScreen
 * --------------------------------------------
 * شاشة تعديل كود الخصم
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Alert } from 'react-native';

import TopBar from '../../../components/TopBar';
import PromocodeForm from '../components/PromocodeForm';
import usePromocodes from '../hooks/usePromocodes';

const EditPromocodeScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  
  const { promocode } = route.params;
  const { updatePromocode } = usePromocodes();

  const handleUpdatePromocode = async (formData) => {
    try {
      setLoading(true);
      await updatePromocode(promocode.id, formData);
      Alert.alert('نجح', 'تم تحديث كود الخصم بنجاح', [
        {
          text: 'حسناً',
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (error) {
      Alert.alert('خطأ', error.message || 'حدث خطأ في تحديث كود الخصم');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'تأكيد الإلغاء',
      'هل أنت متأكد من إلغاء تعديل كود الخصم؟',
      [
        { text: 'البقاء', style: 'cancel' },
        {
          text: 'إلغاء',
          style: 'destructive',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopBar 
        title="تعديل كود الخصم"
        showBackButton
        onBackPress={handleCancel}
      />
      
      <PromocodeForm
        initialData={promocode}
        onSubmit={handleUpdatePromocode}
        onCancel={handleCancel}
        loading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default EditPromocodeScreen;
