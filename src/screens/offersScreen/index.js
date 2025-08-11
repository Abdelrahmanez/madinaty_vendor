import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions,
  I18nManager,
  RefreshControl
} from "react-native";
import { useTheme, Card, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api';
import TopBar from '../../components/TopBar';
import LoadingIndicator from '../../components/LoadingIndicator';

const { width } = Dimensions.get('window');
// حيث أن اللغة الأساسية هي العربية، نضمن أن isRTL دائماً true
const isRTL = true; // I18nManager.isRTL;

const OfferCard = ({ offer, onPress, theme }) => {
  // تنسيق التاريخ للعرض
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-EG', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('خطأ في تنسيق التاريخ:', error);
      return dateString;
    }
  };

  // معالجة مسار الصورة
  const getImageUrl = (imageUrl) => {
    if (imageUrl && imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `${API_BASE_URL}/uploads/banners/${imageUrl}`;
  };

  return (
    <Card 
      style={[
        styles.card, 
        { backgroundColor: theme.colors.surface }
      ]} 
      onPress={onPress}
      mode="elevated"
    >
      <Card.Cover 
        source={{ uri: getImageUrl(offer.imageUrl) }} 
        style={styles.cardImage} 
        resizeMode="cover"
      />
      
      {offer.isFeatured && (
        <View style={[styles.featuredBadge, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.featuredText}>مميز</Text>
        </View>
      )}
      
      <Card.Content style={[styles.cardContent, { backgroundColor: theme.colors.surface }]}>
        <Text 
          numberOfLines={1} 
          ellipsizeMode="tail" 
          style={[
            styles.cardTitle, 
            { color: theme.colors.primary }
          ]}
        >
          {offer.title}
        </Text>
        
        <Text 
          numberOfLines={2} 
          ellipsizeMode="tail" 
          style={[
            styles.cardDescription, 
            { color: theme.colors.onSurface }
          ]}
        >
          {offer.description}
        </Text>
        
        <View style={styles.bottomRow}>
          <View style={styles.restaurantInfo}>
            <MaterialCommunityIcons name="store" size={14} color={theme.colors.primary} />
            <Text 
              numberOfLines={1} 
              ellipsizeMode="tail" 
              style={[
                styles.restaurantName, 
                { color: theme.colors.onSurface }
              ]}
            >
              {offer.restaurantId?.name || ""}
            </Text>
          </View>
          
          <Text 
            style={[
              styles.dateText, 
              { color: theme.colors.onSurfaceVariant }
            ]}
          >
            ينتهي: {formatDate(offer.endDate)}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const OffersScreen = ({ navigation }) => {
  const theme = useTheme();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);

      
      // إضافة معامل عشوائي للتغلب على التخزين المؤقت
      const timestamp = new Date().getTime();
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.BANNER_OFFERS.LIST}?t=${timestamp}`,
        {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        }
      );
      

      
      if (response.data.status === 'success') {
        // الوصول إلى البيانات مع التحقق من مسار البيانات الصحيح
        const offersData = response.data.data?.bannerOffers || 
                           response.data.data || 
                           [];
        
        setOffers(offersData);
      } else {
        setError('فشل في تحميل العروض');
      }
    } catch (err) {
      setError(`حدث خطأ أثناء تحميل العروض: ${err.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchOffers();
    } catch (error) {
      console.error('Error refreshing offers:', error);
    }
  };

  const handleOfferPress = (offer) => {
    // التنقل إلى صفحة تفاصيل العرض أو المطعم
    if (offer.restaurantId?._id) {
      navigation.navigate('Restaurants', { 
        screen: 'RestaurantDetails',
        params: { restaurantId: offer.restaurantId._id }
      });
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <TopBar title="العروض المتاحة" />
        <LoadingIndicator message="جاري تحميل العروض..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <TopBar title="العروض المتاحة" />
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={48} color={theme.colors.error} />
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
          <Button 
            mode="contained" 
            onPress={fetchOffers}
            style={{ marginTop: 16, backgroundColor: theme.colors.primary }}
          >
            إعادة المحاولة
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopBar 
        title="العروض المتاحة"
        subtitle="اكتشف أفضل العروض من مطاعمك المفضلة"
        rightIconName="refresh"
        onRightIconPress={fetchOffers}
      />

      {offers.length > 0 ? (
        <FlatList
          data={offers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <OfferCard 
              offer={item} 
              onPress={() => handleOfferPress(item)}
              theme={theme}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          I18nManager={{
            forceRTL: true
          }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons 
            name="ticket-percent-outline" 
            size={64} 
            color={theme.colors.primary}
          />
          <Text style={styles.emptyText}>
            لا توجد عروض متاحة حالياً
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center', 
    writingDirection: 'rtl'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    writingDirection: 'rtl'
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    width: width - 32, // عرض الشاشة ناقص هامش جانبي
    alignSelf: 'center',
  },
  cardImage: {
    height: 150, // تقليل ارتفاع الصورة
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12, // دائمًا على اليسار في RTL
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12, // نصف قطر أصغر متناسب مع الحجم الأصغر
  },
  featuredText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  cardContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 16, // نصف قطر أقل من قطر البطاقة بمقدار الحشو
    borderBottomRightRadius: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'right',
    writingDirection: 'rtl',
    alignSelf: 'flex-start',
  },
  cardDescription: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
    height: 40, // ارتفاع ثابت لسطرين
    textAlign: 'right',
    writingDirection: 'rtl',
    alignSelf: 'flex-start',
  },
  bottomRow: {
    flexDirection: 'row', // دائمًا من اليمين إلى اليسار في RTL
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  restaurantName: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 6, // هامش يمين ثابت للعربية
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  dateText: {
    fontSize: 10,
    opacity: 0.7,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
    opacity: 0.7,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});

export default OffersScreen; 