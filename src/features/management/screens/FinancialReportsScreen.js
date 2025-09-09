import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TopBar from '../../../components/TopBar';
import FinancialMetricCard from '../components/FinancialMetricCard';
import FinancialSummaryCard from '../components/FinancialSummaryCard';
import { useFinancialReports } from '../hooks/useFinancialReports';
import useRestaurantStore from '../../../stores/restaurantStore';

const FinancialReportsScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { financialData, balanceData, loading, error, refreshData } = useFinancialReports();
  const { restaurant, fetchMyRestaurant } = useRestaurantStore();

  // Ensure restaurant data is loaded when screen mounts
  React.useEffect(() => {
    if (!restaurant) {
      fetchMyRestaurant().catch(err => {
      });
    }
  }, [restaurant, fetchMyRestaurant]);

  const handleRefresh = () => {
    refreshData();
  };

  const handleError = () => {
    Alert.alert(
      'خطأ في التحميل',
      error || 'حدث خطأ في تحميل البيانات المالية',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'إعادة المحاولة', onPress: refreshData }
      ]
    );
  };

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <TopBar 
          title="التقارير المالية"
          showBackButton={true}
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.onPrimary}
        />
        
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons 
            name="alert-circle-outline" 
            size={64} 
            color={theme.colors.error} 
          />
          <Text style={[styles.errorTitle, { color: theme.colors.error }]}>
            خطأ في التحميل
          </Text>
          <Text style={[styles.errorMessage, { color: theme.colors.onSurfaceVariant }]}>
            {error}
          </Text>
          <View style={styles.errorActions}>
            <Button 
              mode="outlined" 
              onPress={() => fetchMyRestaurant()}
              style={styles.retryButton}
            >
              تحميل بيانات المطعم
            </Button>
            <Button 
              mode="contained" 
              onPress={refreshData}
              style={styles.retryButton}
            >
              إعادة المحاولة
            </Button>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopBar 
        title="التقارير المالية"
        showBackButton={true}
        backgroundColor={theme.colors.primary}
        titleColor={theme.colors.onPrimary}
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.content}>
          {/* Financial Metrics */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              المؤشرات المالية
            </Text>
            
            <FinancialMetricCard
              title="الرصيد الحالي"
              value={financialData?.currentBalance || balanceData?.currentBalance}
              subtitle="المبلغ المتاح حالياً"
              icon="wallet"
              color="#4CAF50"
              isLoading={loading}
            />
            
            <FinancialMetricCard
              title="إجمالي الأرباح"
              value={financialData?.totalEarnings || balanceData?.totalEarnings}
              subtitle="مجموع الأرباح منذ البداية"
              icon="trending-up"
              color="#2196F3"
              isLoading={loading}
            />
            
            <FinancialMetricCard
              title="إجمالي المدفوع"
              value={financialData?.totalPaidOut || balanceData?.totalPaidOut}
              subtitle="المبالغ المسحوبة سابقاً"
              icon="cash-multiple"
              color="#FF9800"
              isLoading={loading}
            />
          </View>

          {/* Order Statistics */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              إحصائيات الطلبات
            </Text>
            
            <View style={styles.metricsRow}>
              <View style={styles.metricHalf}>
                <FinancialMetricCard
                  title="الطلبات المعلقة"
                  value={financialData?.pendingOrders || balanceData?.pendingOrders}
                  subtitle="في انتظار الإتمام"
                  icon="clock-outline"
                  color="#F44336"
                  isLoading={loading}
                />
              </View>
              
              <View style={styles.metricHalf}>
                <FinancialMetricCard
                  title="الطلبات المكتملة"
                  value={financialData?.completedOrders || balanceData?.completedOrders}
                  subtitle="تم تسليمها بنجاح"
                  icon="check-circle-outline"
                  color="#4CAF50"
                  isLoading={loading}
                />
              </View>
            </View>
          </View>

          {/* Account Summary */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              ملخص الحساب
            </Text>
            
            <FinancialSummaryCard
              title="معلومات الحساب"
              data={financialData || balanceData}
              isLoading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricHalf: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    marginTop: 8,
    marginHorizontal: 8,
  },
  errorActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
});

export default FinancialReportsScreen;
