import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  I18nManager,
  ScrollView,
} from 'react-native';
import { useRestaurant } from '../../hooks/useRestaurant';
import useAlertStore from '../../stores/alertStore';
import TopBar from '../../components/TopBar';
import LoadingIndicator from '../../components/LoadingIndicator';
import { useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { isRTL } from '../../locales/i18n';
import GrouppedDishes from '../../components/dishes/GrouppedDishes';

export default function RestaurantScreen({ route }) {
  const { id } = route.params;
  const { restaurant, loading, error } = useRestaurant(id);
  const { triggerAlert } = useAlertStore();
  const theme = useTheme();
  const styles = createStyles(theme);

  if (loading) {
    return (
      <View style={styles.centered}>
        <TopBar
          title="تفاصيل المطعم"
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.surface}
          iconColor={theme.colors.surface}
        />
        <LoadingIndicator message="جاري تحميل المطعم..." />
        
      </View>
    );
  }

  if (error) {
    triggerAlert({
      type: 'error',
      message: error,
    });
  }

  return (
    <View style={styles.container}>
      <TopBar
        title={restaurant.name}
        backgroundColor={theme.colors.primary}
        titleColor={theme.colors.surface}
        iconColor={theme.colors.surface}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: restaurant.image }} style={styles.image} />

        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.description}>{restaurant.description}</Text>

        <View style={styles.infoBox}>
          <InfoRow styles={styles} label="رقم الهاتف" value={restaurant.phoneNumber} />
          <InfoRow styles={styles} label="الفرع" value={restaurant.branchLabel} />
          <InfoRow styles={styles} label="المنطقة" value={restaurant.address?.area?.name} />
          <InfoRow styles={styles} label="الشارع" value={restaurant.address?.street} />
          <InfoRow styles={styles} label="مدة التوصيل" value={`${restaurant.deliveryTime} دقيقة`} />
          <InfoRow styles={styles} label="رسوم التوصيل" value={`${restaurant.deliveryFee} ج.م`} />
          <InfoRow styles={styles} label="الحالة" value={restaurant.isOpen ? 'مفتوح' : 'مغلق'} icon={restaurant.isOpen ? 'check-circle' : 'cancel'} color={restaurant.isOpen ? 'green' : 'red'} />
          <InfoRow styles={styles} label="التقييم" value={`${restaurant.ratingsAverage} ⭐ (${restaurant.ratingsQuantity})`} />
        </View>
        
        <GrouppedDishes restaurantId={id} />
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value, icon, color, styles }) {
  return (
    <View style={styles.infoRow}>
      {icon && <MaterialIcons name={icon} size={20} color={color || 'gray'} style={{ marginLeft: 6 }} />}
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value || '-'}</Text>
    </View>
  );
}

const createStyles = (theme) => {
  const rtl = I18nManager.isRTL;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      padding: 16,
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 16,
      marginBottom: 16,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: rtl ? 'right' : 'left',
      marginBottom: 8,
    },
    description: {
      fontSize: 16,
      color: '#555',
      textAlign: rtl ? 'right' : 'left',
      marginBottom: 16,
    },
    infoBox: {
      backgroundColor: '#f9f9f9',
      borderRadius: 12,
      padding: 12,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: rtl ? 'row-reverse' : 'row',
      alignItems: 'center',
      marginVertical: 6,
    },
    infoLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: '#333',
      marginHorizontal: 4,
    },
    infoValue: {
      fontSize: 15,
      color: '#444',
      flexShrink: 1,
    },
  });
};
