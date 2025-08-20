import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useTheme, Card, Button, Chip, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TopBar from '../../../components/TopBar';
import useRestaurant from '../hooks/useRestaurant';
import RestaurantForm from '../components/RestaurantForm';

/**
 * Restaurant Management Screen
 * Displays restaurant information and allows editing
 */
const RestaurantManagementScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  
  const { 
    restaurant, 
    loading, 
    error, 
    updating, 
    updateRestaurantData,
    refreshRestaurant 
  } = useRestaurant();
  
  const [isEditing, setIsEditing] = useState(false);

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      const result = await updateRestaurantData(restaurant._id, formData);
      
      if (result.success) {
        Alert.alert('نجح', 'تم تحديث بيانات المطعم بنجاح');
        setIsEditing(false);
        refreshRestaurant();
      } else {
        Alert.alert('خطأ', result.error || 'فشل في تحديث بيانات المطعم');
      }
    } catch (error) {
      console.error('Error updating restaurant:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء تحديث بيانات المطعم');
    }
  };

  // Handle cancel editing
  const handleCancel = () => {
    setIsEditing(false);
  };

  // Handle edit mode toggle
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <TopBar
          title="إدارة المطعم"
          showBackButton={true}
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.onPrimary}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
            جاري تحميل بيانات المطعم...
          </Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <TopBar
          title="إدارة المطعم"
          showBackButton={true}
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.onPrimary}
        />
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons 
            name="alert-circle" 
            size={64} 
            color={theme.colors.error} 
          />
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
          <Button 
            mode="contained" 
            onPress={refreshRestaurant}
            style={styles.retryButton}
          >
            إعادة المحاولة
          </Button>
        </View>
      </View>
    );
  }

  // If editing, show the form
  if (isEditing) {
    return (
      <View style={styles.container}>
        <TopBar
          title="تعديل بيانات المطعم"
          showBackButton={true}
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.onPrimary}
        />
        <RestaurantForm
          restaurant={restaurant}
          onSubmit={handleSubmit}
          loading={updating}
          onCancel={handleCancel}
        />
      </View>
    );
  }

  // Display restaurant information
  return (
    <View style={styles.container}>
      <TopBar
        title="إدارة المطعم"
        showBackButton={true}
        backgroundColor={theme.colors.primary}
        titleColor={theme.colors.onPrimary}
        rightComponent={
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={handleEdit}
          >
            <MaterialCommunityIcons name="pencil" size={20} color={theme.colors.onPrimary} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Restaurant Header */}
        <Card style={[styles.headerCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.headerContent}>
            <View style={styles.imageContainer}>
              {restaurant.image ? (
                <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
              ) : (
                <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <MaterialCommunityIcons 
                    name="store" 
                    size={48} 
                    color={theme.colors.onSurfaceVariant} 
                  />
                </View>
              )}
            </View>
            
            <View style={styles.headerInfo}>
              <Text style={[styles.restaurantName, { color: theme.colors.onSurface }]}>
                {restaurant.name}
              </Text>
              <Text style={[styles.restaurantDescription, { color: theme.colors.onSurfaceVariant }]}>
                {restaurant.description || 'لا يوجد وصف'}
              </Text>
              
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusBadge, 
                  { 
                    backgroundColor: restaurant.isOpen 
                      ? theme.colors.primary 
                      : theme.colors.error 
                  }
                ]}>
                  <Text style={[styles.statusText, { color: theme.colors.onPrimary }]}>
                    {restaurant.isOpen ? 'مفتوح' : 'مغلق'}
                  </Text>
                </View>
                
                <View style={[styles.statusBadge, { backgroundColor: theme.colors.secondary }]}>
                  <Text style={[styles.statusText, { color: theme.colors.onSecondary }]}>
                    {restaurant.status === 'active' ? 'نشط' : 'غير نشط'}
                  </Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Basic Information */}
        <Card style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              المعلومات الأساسية
            </Text>
            
            <View style={styles.infoRow}>
              <MaterialCommunityIcons 
                name="phone" 
                size={20} 
                color={theme.colors.onSurfaceVariant} 
              />
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                رقم الهاتف:
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                {restaurant.phoneNumber}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialCommunityIcons 
                name="clock-outline" 
                size={20} 
                color={theme.colors.onSurfaceVariant} 
              />
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                وقت التوصيل:
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                {restaurant.deliveryTime} دقيقة
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialCommunityIcons 
                name="currency-usd" 
                size={20} 
                color={theme.colors.onSurfaceVariant} 
              />
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                رسوم التوصيل:
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                {restaurant.deliveryFee} ج.م
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialCommunityIcons 
                name="percent" 
                size={20} 
                color={theme.colors.onSurfaceVariant} 
              />
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                نسبة العمولة:
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                {restaurant.commissionRate}%
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Address Information */}
        <Card style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              معلومات العنوان
            </Text>
            
            <View style={styles.infoRow}>
              <MaterialCommunityIcons 
                name="map-marker" 
                size={20} 
                color={theme.colors.onSurfaceVariant} 
              />
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                الشارع:
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                {restaurant.address?.street || 'غير محدد'}
              </Text>
            </View>
            
            {restaurant.address?.notes && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons 
                  name="note-text" 
                  size={20} 
                  color={theme.colors.onSurfaceVariant} 
                />
                <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                  ملاحظات:
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                  {restaurant.address.notes}
                </Text>
              </View>
            )}
            
            <View style={styles.infoRow}>
              <MaterialCommunityIcons 
                name="map-marker-radius" 
                size={20} 
                color={theme.colors.onSurfaceVariant} 
              />
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                المنطقة:
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                {restaurant.address?.area?.name || 'غير محدد'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Categories */}
        <Card style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              فئات الطعام
            </Text>
            
            {restaurant.categories && restaurant.categories.length > 0 ? (
              <View style={styles.categoriesContainer}>
                {restaurant.categories.map((category, index) => (
                  <Chip
                    key={index}
                    style={styles.categoryChip}
                    mode="outlined"
                  >
                    {category.name}
                  </Chip>
                ))}
              </View>
            ) : (
              <Text style={[styles.noDataText, { color: theme.colors.onSurfaceVariant }]}>
                لم يتم تحديد فئات بعد
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Ratings */}
        <Card style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              التقييمات
            </Text>
            
            <View style={styles.ratingContainer}>
              <View style={styles.ratingInfo}>
                <MaterialCommunityIcons 
                  name="star" 
                  size={24} 
                  color={theme.colors.primary} 
                />
                <Text style={[styles.ratingValue, { color: theme.colors.onSurface }]}>
                  {restaurant.ratingsAverage?.toFixed(1) || '0.0'}
                </Text>
                <Text style={[styles.ratingCount, { color: theme.colors.onSurfaceVariant }]}>
                  ({restaurant.ratingsQuantity || 0} تقييم)
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Edit Button */}
        <View style={styles.editContainer}>
          <Button
            mode="contained"
            onPress={handleEdit}
            style={styles.editButtonLarge}
            icon="pencil"
          >
            تعديل بيانات المطعم
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    marginTop: 16,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 16,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  restaurantDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    marginLeft: 8,
    marginRight: 8,
    minWidth: 80,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    marginBottom: 8,
  },
  noDataText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  ratingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  ratingCount: {
    fontSize: 14,
  },
  editContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  editButtonLarge: {
    paddingVertical: 8,
  },
});

export default RestaurantManagementScreen;
