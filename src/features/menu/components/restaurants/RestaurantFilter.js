import React from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export default function RestaurantFilter({
  localFilters,
  setLocalFilters,
  applyFilters,
  setModalVisible,
}) {
  const styles = createStyles(useTheme());
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.modalTitle}>🎛️ {t('editFilters')}</Text>

      <TextInput
        placeholder={t('searchByName')}
        placeholderTextColor={theme.colors.onSurface}
        style={styles.input}
        value={localFilters.keyword}
        onChangeText={(text) => setLocalFilters({ ...localFilters, keyword: text })}
      />

      <TextInput
        placeholder={t('categoryName')}
        placeholderTextColor={theme.colors.onSurface}
        style={styles.input}
        value={localFilters.category || ''}
        onChangeText={(text) => setLocalFilters({ ...localFilters, category: text })}
      />

      <TextInput
        placeholder={t('minRating')}
        placeholderTextColor={theme.colors.onSurface}
        style={styles.input}
        keyboardType="numeric"
        value={localFilters.minRating?.toString() || ''}
        onChangeText={(text) =>
          setLocalFilters({ ...localFilters, minRating: parseFloat(text) || null })
        } 
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>✅ {t('openRestaurantsOnly')}</Text>
        <Switch
          trackColor={{ false: theme.colors.onSurface, true: theme.colors.primary }}
          thumbColor={localFilters.isOpen ? '#fff' : '#f4f3f4'}
          ios_backgroundColor={theme.colors.onSurface}
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }} 
          value={!!localFilters.isOpen}
          onValueChange={(value) => setLocalFilters({ ...localFilters, isOpen: value })}
        />
      </View>

      <View style={styles.modalButtons}>
        <TouchableOpacity onPress={applyFilters} style={styles.applyButton}>
          <Text style={styles.buttonText}>{t('applyFilters')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
          <Text style={styles.buttonText}>{t('cancel')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
  },
  darkBackground: {
    backgroundColor: '#1c1c1e',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '700',
    color: '#333',
  },
  darkText: {
    color: '#eee',
  },
  input: {
    backgroundColor: '#f2f2f7',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  darkInput: {
    backgroundColor: '#2c2c2e',
    borderColor: '#3a3a3c',
    color: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    color: '#444',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  applyButton: {
    flex: 1,
    backgroundColor: theme.colors.success,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.error,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
