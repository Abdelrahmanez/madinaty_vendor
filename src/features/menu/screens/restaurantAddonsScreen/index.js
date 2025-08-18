import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Keyboard, KeyboardAvoidingView, Platform, Modal as RNModal } from 'react-native';
import { useTheme, Text, Appbar, Snackbar } from 'react-native-paper';
import { useAddons } from '../../hooks/useAddons';
import { AddonList, AddonForm } from '../../components';
import { createRestaurantAddon, updateRestaurantAddon, deleteRestaurantAddon } from '../../api/addons';
import useRestaurantStore from '../../../../stores/restaurantStore';
import { Alert } from 'react-native';

const RestaurantAddonsScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const { getRestaurantId } = useRestaurantStore();
  const restaurantId = getRestaurantId();

  const { availableAddons, loading, error, refreshAddons } = useAddons();

  // Modal states
  const [showAddonForm, setShowAddonForm] = useState(false);
  const [editingAddon, setEditingAddon] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Snackbar states
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');

  const showSnackbar = (message, type = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const handleCreateAddon = () => {
    setEditingAddon(null);
    setShowAddonForm(true);
  };

  const handleEditAddon = (addon) => {
    setEditingAddon(addon);
    setShowAddonForm(true);
  };

  const handleDeleteAddon = (addon) => {
    Alert.alert(
      'تأكيد الحذف',
      `هل أنت متأكد من حذف "${addon.name}"؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'حذف', 
          style: 'destructive',
          onPress: () => performDeleteAddon(addon._id)
        }
      ]
    );
  };

  const performDeleteAddon = async (addonId) => {
    if (!restaurantId) {
      showSnackbar('خطأ: لا يمكن تحديد المطعم', 'error');
      return;
    }

    setFormLoading(true);
    try {
      await deleteRestaurantAddon(restaurantId, addonId);
      showSnackbar('تم حذف الإضافة بنجاح');
      refreshAddons();
    } catch (error) {
      console.error('Error deleting addon:', error);
      showSnackbar('خطأ في حذف الإضافة', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSaveAddon = async (addonData) => {
    if (!restaurantId) {
      showSnackbar('خطأ: لا يمكن تحديد المطعم', 'error');
      return;
    }

    setFormLoading(true);
    try {
      if (editingAddon) {
        // Update existing addon
        await updateRestaurantAddon(restaurantId, editingAddon._id, addonData);
        showSnackbar('تم تحديث الإضافة بنجاح');
      } else {
        // Create new addon
        await createRestaurantAddon(restaurantId, addonData);
        showSnackbar('تم إضافة الإضافة بنجاح');
      }
      
      setShowAddonForm(false);
      setEditingAddon(null);
      refreshAddons();
    } catch (error) {
      console.error('Error saving addon:', error);
      showSnackbar(
        editingAddon ? 'خطأ في تحديث الإضافة' : 'خطأ في إضافة الإضافة', 
        'error'
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowAddonForm(false);
    setEditingAddon(null);
  };

  const handleRefresh = () => {
    refreshAddons();
  };

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="إدارة إضافات المطعم" />
        <Appbar.Action icon="refresh" onPress={handleRefresh} />
      </Appbar.Header>

      {/* Addons List */}
      <AddonList
        addons={availableAddons}
        loading={loading}
        error={error}
        onEditAddon={handleEditAddon}
        onDeleteAddon={handleDeleteAddon}
        onCreateAddon={handleCreateAddon}
        onRefresh={handleRefresh}
      />

      {/* Addon Form Modal */}
      <RNModal
        visible={showAddonForm}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancelForm}
      >
        <View style={styles.overlay}>
          <View style={[
            styles.modalContainer,
            keyboardVisible && styles.modalContainerKeyboardVisible
          ]}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardAvoidingView}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
              <AddonForm
                addon={editingAddon}
                onSave={handleSaveAddon}
                onCancel={handleCancelForm}
                loading={formLoading}
                isEditing={!!editingAddon}
              />
            </KeyboardAvoidingView>
          </View>
        </View>
      </RNModal>

      {/* Snackbar for feedback */}
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

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '95%',
    height: '85%',
    overflow: 'hidden',
  },
  modalContainerKeyboardVisible: {
    height: '75%',
    marginTop: 20,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  snackbar: {
    backgroundColor: theme.colors.primary,
  },
  errorSnackbar: {
    backgroundColor: theme.colors.error,
  },
});

export default RestaurantAddonsScreen;
