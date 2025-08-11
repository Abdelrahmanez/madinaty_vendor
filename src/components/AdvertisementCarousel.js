import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator,
  I18nManager
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axiosInstance from '../__apis__/axios';
import { API_ENDPOINTS } from '../config/api';
import { useTranslation } from 'react-i18next';
const { width: screenWidth } = Dimensions.get('window');
const ITEM_WIDTH = screenWidth - 32; // Full width minus padding
const AUTO_SCROLL_INTERVAL = 5000; // Auto scroll every 5 seconds

const AdvertisementCarousel = ({ navigation }) => {
  const theme = useTheme();
  const flatListRef = useRef(null);
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoScrollTimer = useRef(null);
  const { t } = useTranslation();

  const isRTL = I18nManager.isRTL;

  // Fetch advertisements when component mounts
  useEffect(() => {
    fetchAdvertisements();

    // Cleanup timer on unmount
    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, []);

  // Start auto-scroll when advertisements are loaded
  useEffect(() => {
    if (advertisements.length > 1) {
      startAutoScroll();
    }
    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [advertisements]);

  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_ENDPOINTS.ADVERTISEMENTS.LIST);
      
      if (response.data && response.data.data) {
        setAdvertisements(response.data.data.filter(ad => ad.isActive));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      setError(true);
      setLoading(false);
    }
  };

  const startAutoScroll = () => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }
    
    autoScrollTimer.current = setInterval(() => {
      if (flatListRef.current && advertisements.length > 0) {
        const nextIndex = (currentIndex + 1) % advertisements.length;
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true
        });
        setCurrentIndex(nextIndex);
      }
    }, AUTO_SCROLL_INTERVAL);
  };

  const handleAdvertisementClick = async (advertisement) => {
    try {
      // Record the click
      await axiosInstance.post(API_ENDPOINTS.ADVERTISEMENTS.RECORD_CLICK(advertisement._id));
      
      // Navigate based on the advertisement type
      switch (advertisement.targetType) {
        case 'restaurant':
          navigation.navigate('RestaurantScreen', { restaurantId: advertisement.targetId });
          break;
        case 'category':
          navigation.navigate('Category', { categoryId: advertisement.targetId });
          break;
        case 'dish':
          navigation.navigate('DishDetails', { dishId: advertisement.targetId });
          break;
        case 'external':
          // For external links, you might want to open a web browser
          // Linking.openURL(advertisement.targetUrl);
          console.log('External URL:', advertisement.targetUrl);
          break;
        default:
          console.log('Unknown advertisement type');
      }
    } catch (error) {
      console.error('Error handling advertisement click:', error);
    }
  };

  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.adItem, { backgroundColor: theme.colors.surface }]}
      onPress={() => handleAdvertisementClick(item)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.adImage}
        resizeMode="cover"
      />
      {item.name && (
        <View style={[styles.adInfo, { backgroundColor: `${theme.colors.surface}CC` }]}>
          <Text style={[styles.adName, { color: theme.colors.onSurface }]} numberOfLines={1}>
            {item.name}
          </Text>
          {item.description && (
            <Text style={[styles.adDescription, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  const renderDots = () => {
    return (
      <View style={styles.paginationDots}>
        {advertisements.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === currentIndex 
                  ? theme.colors.primary 
                  : theme.colors.surfaceVariant,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || advertisements.length === 0) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <MaterialCommunityIcons
          name="image-off"
          size={40}
          color={theme.colors.onSurfaceVariant}
        />
        <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
          {error ? t('errorLoading') : t('emptyAdvertisements')}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={advertisements}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
      />
      {advertisements.length > 1 && renderDots()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
    marginBottom: 10,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  adItem: {
    width: ITEM_WIDTH,
    height: 160,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  adImage: {
    width: '100%',
    height: '100%',
  },
  adInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  adName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  adDescription: {
    fontSize: 14,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default AdvertisementCarousel; 