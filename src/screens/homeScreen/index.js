import React, { useState } from "react";
import { View, ScrollView, StyleSheet, I18nManager, RefreshControl } from "react-native";
import { Text, useTheme } from "react-native-paper";
import useLocales from "../../hooks/useLocales";
import { useTranslation } from 'react-i18next';
import useAuth from "../../hooks/useAuth";
import TopBar from "../../components/TopBar";
import AdvertisementCarousel from "../../components/AdvertisementCarousel";
import Categories from "../../components/Categories/Categories";
import CategoriesModal from "../../components/Categories/CategoriesModal";
import useAuthStore from "../../stores/authStore";
import AddressBar from "../../components/address/AddressBar";
import SearchBar from "../../components/home/SearchBar";
const isRTL = I18nManager.isRTL;

const HomeScreen = ({ navigation }) => {
  const {user } = useAuthStore();
  const { translate } = useLocales();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const theme = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = async () => {
    try {
      const { success } = await logout();
      if (success) {
        navigation.replace('Login');
      }
    } catch (error) {
      console.error('خطأ أثناء تسجيل الخروج:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Refresh advertisements and categories
      // You can add specific refresh logic here if needed
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate refresh
    } catch (error) {
      console.error('Error refreshing home screen:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopBar 
        title={t('homeScreen.title', 'الرئيسية')}
        rightIconName="logout"
        onRightIconPress={handleLogout}
        backgroundColor={theme.colors.primary}
        titleColor={theme.colors.surface}
        iconColor={theme.colors.surface}
      />
      <AddressBar navigation={navigation} />
      <SearchBar navigation={navigation}/>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.sectionContainer}>
          <AdvertisementCarousel navigation={navigation} />
        </View>
        
        {/* <View style={[styles.contentContainer, { backgroundColor: theme.colors.surfaceVariant }]}> */}
          <Categories navigation={navigation} onPressAll={() => setModalVisible(true)} />  
        {/* </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: isRTL ? 'right' : 'left',
    writingDirection: 'rtl',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: isRTL ? 'right' : 'left',
    writingDirection: 'rtl',
  },
  contentContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: isRTL ? 'right' : 'left',
    writingDirection: 'rtl',
  },
});

export default HomeScreen;
