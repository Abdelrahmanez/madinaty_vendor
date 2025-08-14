import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme, Card, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TopBar from '../../../../components/TopBar';

const AdminDashboard = ({ navigation }) => {
  const theme = useTheme();

  const adminFeatures = [
    {
      title: 'إدارة المطاعم',
      icon: 'store',
      description: 'إضافة وتعديل وحذف المطاعم',
      onPress: () => navigation.navigate('RestaurantsManagement')
    },
    {
      title: 'إدارة المستخدمين',
      icon: 'account-group',
      description: 'إدارة جميع المستخدمين',
      onPress: () => navigation.navigate('UsersManagement')
    },
    {
      title: 'التقارير المالية',
      icon: 'chart-line',
      description: 'عرض التقارير المالية',
      onPress: () => navigation.navigate('FinancialReports')
    },
    {
      title: 'إدارة الطلبات',
      icon: 'clipboard-list',
      description: 'مراقبة وإدارة الطلبات',
      onPress: () => navigation.navigate('OrdersManagement')
    },
    {
      title: 'إدارة التوصيل',
      icon: 'truck-delivery',
      description: 'إدارة شركاء التوصيل',
      onPress: () => navigation.navigate('DeliveryManagement')
    },
    {
      title: 'الإعدادات',
      icon: 'cog',
      description: 'إعدادات النظام',
      onPress: () => navigation.navigate('SystemSettings')
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopBar 
        title="لوحة تحكم المدير"
        rightIconName="logout"
        onRightIconPress={() => navigation.navigate('Auth')}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.welcomeText, { color: theme.colors.onSurface }]}>
            مرحباً بك في لوحة تحكم المدير
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            اختر الميزة التي تريد إدارتها
          </Text>
        </View>

        <View style={styles.featuresGrid}>
          {adminFeatures.map((feature, index) => (
            <Card
              key={index}
              style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}
              onPress={feature.onPress}
            >
              <Card.Content style={styles.cardContent}>
                <MaterialCommunityIcons 
                  name={feature.icon} 
                  size={32} 
                  color={theme.colors.primary} 
                  style={styles.featureIcon}
                />
                <Text style={[styles.featureTitle, { color: theme.colors.onSurface }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: theme.colors.onSurfaceVariant }]}>
                  {feature.description}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  featuresGrid: {
    padding: 16,
  },
  featureCard: {
    marginBottom: 16,
    elevation: 2,
  },
  cardContent: {
    alignItems: 'center',
    padding: 20,
  },
  featureIcon: {
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AdminDashboard;
