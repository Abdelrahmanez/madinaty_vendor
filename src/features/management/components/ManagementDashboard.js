import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TopBar from '../../../components/TopBar';
import ManagementFeatureCard from './ManagementFeatureCard';
import { MANAGEMENT_FEATURES } from '../data/managementFeatures';
import useManagementStore from '../../../stores/financeStore';

const ManagementDashboard = ({ navigation }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { lockManagement } = useManagementStore();

  const handleFeaturePress = (route) => {
    navigation.navigate(route);
  };

  const handleLogout = () => {
    lockManagement();
    Alert.alert('تم', 'تم إغلاق لوحة الإدارة');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopBar 
        title="لوحة الإدارة"
        showBackButton={false}
        backgroundColor={theme.colors.primary}
        titleColor={theme.colors.onPrimary}
        rightComponent={
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
          >
            <MaterialCommunityIcons name="logout" size={20} color={theme.colors.onPrimary} />
          </TouchableOpacity>
        }
      />
      
      <View style={styles.header}>
        <Text style={[styles.headerSubtitle, { color: theme.colors.onSurfaceVariant }]}>
          إدارة النظام والإعدادات المحمية
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.featuresGrid}>
          {MANAGEMENT_FEATURES.map((feature) => (
            <ManagementFeatureCard
              key={feature.id}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              color={feature.color}
              onPress={() => handleFeaturePress(feature.route)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
});

export default ManagementDashboard;
