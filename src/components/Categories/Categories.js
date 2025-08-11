import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  I18nManager,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import useCategories from '../../hooks/useCategories';
import { fontSize } from '../../theme/fontSizes';
import { CategoryType } from '../../utils/enums';

const isRTL = I18nManager.isRTL;
const { width } = Dimensions.get('window');

const Categories = ({ navigation }) => {
  const theme = useTheme();
  const { categories, loading, error } = useCategories(CategoryType.MEAL);
  const [modalVisible, setModalVisible] = useState(false);

  if (loading) {
    return <ActivityIndicator size="large" color={theme.colors.primary} />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const handleCategoryPress = (item) => {
    setModalVisible(false);
    navigation.navigate('Category', { categoryId: item._id });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategoryPress(item)}>
      <Image source={{ uri: item.imageUrl }} style={[styles.categoryImage, { borderColor: theme.colors.primary }]} />
      <Text style={[styles.categoryName, { color: theme.colors.secondary }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.sectionTitleContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.secondary }]}>تصنيف الوجبات</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={[styles.sectionTitle, { color: theme.colors.secondary }]}>الكل</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories.slice(0, 5)} // عرض أول 5 فقط بشكل أفقي
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        renderItem={renderItem}
      />

      {/* Fullscreen Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: theme.colors.primary }]}>كل التصنيفات</Text>
            <FlatList
              data={categories}
              keyExtractor={(item) => item._id}
              numColumns={3}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              contentContainerStyle={{ padding: 10 }}
              renderItem={renderItem}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: fontSize.large,
    fontWeight: 'bold',
    writingDirection: 'rtl',
    marginBottom: 10,
  },
  categoryList: {
    flexDirection: 'row',
  },
  categoryImage: {
    width: 70,
    height: 70,
    borderRadius: 100,
    borderWidth: 1,
  },
  categoryItem: {
    width: 80,
    height: 106,
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: fontSize.medium,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    maxHeight: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  modalTitle: {
    fontSize: fontSize.large,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalItem: {
    width: (width - 60) / 3,
    marginBottom: 20,
    alignItems: 'center',
  },
  modalImage: {
    width: 70,
    height: 70,
    borderRadius: 100,
    borderWidth: 1,
  },
  modalText: {
    fontSize: fontSize.small,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default Categories;
