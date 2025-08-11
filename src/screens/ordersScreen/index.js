import React from "react";
import { View, Text, StyleSheet, I18nManager } from "react-native";
import { useTheme } from 'react-native-paper';
import TopBar from '../../components/TopBar';

const isRTL = I18nManager.isRTL;

const OrdersScreen = ({ navigation }) => {
  const theme = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopBar 
        title="الطلبات"
        subtitle="متابعة طلباتك الحالية والسابقة"
      />
      
      <View style={styles.contentContainer}>
        <Text style={[styles.contentText, { color: theme.colors.primary }]}>
          صفحة الطلبات
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentText: {
    fontSize: 24, 
    fontWeight: 'bold',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});

export default OrdersScreen; 