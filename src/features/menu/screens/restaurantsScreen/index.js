// RestaurantsScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  I18nManager,
  TextInput,
  Switch,
  TouchableOpacity
} from "react-native";
import { useTheme } from "react-native-paper";
import TopBar from '../../../../components/TopBar';
import { useRestaurants } from "../../hooks/useRestaurants";
import { useQueryFilters } from "../../hooks/useQueryFilters";
import RestaurantsList from "../../components/restaurants/RestaurantsList";
import LoadingIndicator from "../../../../components/LoadingIndicator";
import  ReusableModal  from "../../../../components/ReusableModal";
import RestaurantFilter from "../../components/restaurants/RestaurantFilter";
import { MaterialCommunityIcons } from "@expo/vector-icons";
    
const isRTL = I18nManager.isRTL;

const RestaurantsScreen = () => {
  const theme = useTheme();
  const [isModalVisible, setModalVisible] = useState(false);
  const styles = createStyles(useTheme());

  const { filters, updateFilter } = useQueryFilters({
    keyword: '',
    category: null,
    minRating: null,
    isOpen: null,
    page: 1,
    limit: 10,
    sort: "-ratingsAverage"
  });

  const [localFilters, setLocalFilters] = useState(filters);

  const {
    restaurants,
    loading: loadingRestaurants,
    error: errorRestaurants,
  } = useRestaurants(filters);

  const applyFilters = () => {
    Object.entries(localFilters).forEach(([key, value]) => {
      updateFilter(key, value);
    });
    setModalVisible(false);
  };

  if (loadingRestaurants) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <TopBar title="المطاعم" backgroundColor={theme.colors.primary} titleColor={theme.colors.surface} iconColor={theme.colors.surface} />
        <LoadingIndicator message="جاري تحميل المطاعم..." />
      </View>
    );
  }

  if (errorRestaurants) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <TopBar title="المطاعم" />
        <Text>Error: {errorRestaurants.message}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopBar 
        title="المطاعم"
        subtitle="اكتشف مطاعمك المفضلة"
        backgroundColor={theme.colors.primary}
        titleColor={theme.colors.surface}
        iconColor={theme.colors.surface}
      />
      {/* open set filters modal */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.filterButton}>
        <MaterialCommunityIcons name="filter-variant" size={22} color={theme.colors.surface} style={{ marginEnd: 8 }} />
        <Text style={styles.filterButtonText}>تعديل الفلاتر</Text>
      </TouchableOpacity>
      {/* restaurant list */}
      <View style={styles.contentContainer}>
        <RestaurantsList data={restaurants} />
      </View>
      {/* filters modal */}
      <ReusableModal visible={isModalVisible} onClose={() => setModalVisible(false)}>
        <RestaurantFilter localFilters={localFilters} setLocalFilters={setLocalFilters} applyFilters={applyFilters} setModalVisible={setModalVisible} />
      </ReusableModal>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterButton: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    width: "100%",
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "bold"
  },
});



export default RestaurantsScreen;
