import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Modal, Portal, Button, useTheme, Divider } from 'react-native-paper';
import useCategories from '../../hooks/useCategories';

const CategoriesModal = () => {
  const theme = useTheme();
  const { categories, loading } = useCategories();
  const [visible, setVisible] = useState(false);

  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);

  const renderItem = ({ item }) => (
    <Pressable style={styles.categoryItem} onPress={() => console.log('Selected:', item.name)}>
      <Text style={styles.categoryText}>{item.name}</Text>
    </Pressable>
  );

  return (
    <View>
      <Button
        icon="apps"
        mode="contained-tonal"
        onPress={openModal}
        style={{ marginVertical: 10 }}
      >
        استعرض كل التصنيفات
      </Button>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={closeModal}
          contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.elevation.level1 }]}
        >
          <Text style={styles.modalTitle}>كل التصنيفات</Text>
          <Divider style={{ marginBottom: 8 }} />

          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <FlatList
              data={categories}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
              numColumns={2} // grid شكل
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}

          <Button mode="outlined" onPress={closeModal} style={{ marginTop: 16 }}>
            إغلاق
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  categoryItem: {
    backgroundColor: '#eee',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CategoriesModal;
