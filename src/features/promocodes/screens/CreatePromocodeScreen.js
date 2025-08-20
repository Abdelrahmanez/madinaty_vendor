/**
 * CreatePromocodeScreen
 * --------------------------------------------
 * شاشة إنشاء كود خصم جديد
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import { Alert } from 'react-native';

import TopBar from '../../../components/TopBar';
import PromocodeForm from '../components/PromocodeForm';
import usePromocodes from '../hooks/usePromocodes';

const CreatePromocodeScreen = ({ navigation }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  
  const { createPromocode } = usePromocodes();

  const handleCreatePromocode = async (formData) => {
    try {
      setLoading(true);
      await createPromocode(formData);
      Alert.alert('نجح', 'تم إنشاء كود الخصم بنجاح', [
        {
          text: 'حسناً',
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (error) {
      Alert.alert('خطأ', error.message || 'حدث خطأ في إنشاء كود الخصم');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'تأكيد الإلغاء',
      'هل أنت متأكد من إلغاء إنشاء كود الخصم؟',
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
        title="إنشاء كود خصم جديد"
        showBackButton
        onBackPress={handleCancel}
      />
      
      <PromocodeForm
        onSubmit={handleCreatePromocode}
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

export default CreatePromocodeScreen;
