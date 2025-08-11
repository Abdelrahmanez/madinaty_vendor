import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import TopBar from '../../components/TopBar';
import { useRestaurants } from '../../hooks/useRestaurants';
// import { useDishes } from '../../hooks/useDishes'; // تأكد أنه موجود
import { useQueryFilters } from '../../hooks/useQueryFilters';
import RestaurantsList from '../../components/restaurants/RestaurantsList';
import { useDishes } from '../../hooks/useDishes';
import DishesList from '../../components/dishes/DishesList';

const SearchScreen = () => {
  const theme = useTheme();
  const inputRef = useRef(null);

  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('restaurant'); // 'restaurant' or 'dish'
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // اختيار فئة إذا أردت
  const { filters, updateFilter, removeFilter } = useQueryFilters({
    keyword: '',
    category: null,
    minRating: null,
    isOpen: true,
    page: 1,
    limit: 10,
    sort: "-ratingsAverage"
  });

  

  useEffect(() => {
    updateFilter('keyword', query);
    console.log(filters);
  }, [query]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  const {
    restaurants,
    loading: loadingRestaurants,
    error: errorRestaurants,
  } = useRestaurants(searchType === 'restaurant' ? filters : null);

  const {
    dishes,
    loading: loadingDishes,
    error: errorDishes,
  } = useDishes(searchType === 'dish' ? filters : null);

  const handleTypeChange = (type) => {
    setSearchType(type);
    setQuery('');
    
  };

  const data = searchType === 'restaurant' ? restaurants : dishes;
  const loading = searchType === 'restaurant' ? loadingRestaurants : loadingDishes;
  const error = searchType === 'restaurant' ? errorRestaurants : errorDishes;

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <TopBar title="البحث" />

      {/* Search bar */}
      <View style={styles.searchBar}>
  <MaterialIcons name="search" size={20} color="#666" />

  <TextInput
    ref={inputRef}
    style={styles.input}
    value={query}
    onChangeText={setQuery}
    placeholder={`ابحث في ${searchType === 'restaurant' ? 'المطاعم' : 'الأطباق'}...`}
    textAlign="right"
  />

  {query.length > 0 && (
    <TouchableOpacity onPress={() => setQuery('')}>
      <MaterialIcons name="close" size={20} color="#666" />
    </TouchableOpacity>
  )}
</View>

      {/* Toggle between types */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, searchType === 'restaurant' && styles.activeButton]}
          onPress={() => handleTypeChange('restaurant')}
        >
          <Text style={searchType === 'restaurant' ? styles.activeText : styles.inactiveText}>
            مطاعم
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, searchType === 'dish' && styles.activeButton]}
          onPress={() => handleTypeChange('dish')}
        >
          <Text style={searchType === 'dish' ? styles.activeText : styles.inactiveText}>
            أطباق
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      <View style={{ flex: 1, padding: 10 }}>
      {searchType === 'restaurant' ? (
      <RestaurantsList data={restaurants} />
      ) : (
      <DishesList data={dishes} />
    )}
</View>

    </View>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    searchBar: {
      flexDirection: 'row',
      backgroundColor: '#eee',
      padding: 10,
      borderRadius: 10,
      alignItems: 'center',
      margin: 10,
    },
    input: {
      flex: 1,
      marginLeft: 10,
      fontSize: 16,
    },
    toggleContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 10,
      marginBottom: 10,
    },
    toggleButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#ccc',
    },
    activeButton: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    activeText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    inactiveText: {
      color: '#666',
    },
    card: {
      backgroundColor: '#fff',
      padding: 16,
      borderRadius: 10,
      marginBottom: 10,
      elevation: 2,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default SearchScreen;
