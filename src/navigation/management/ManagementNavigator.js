import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useTheme, Card, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useManagementStore from '../../stores/financeStore';
import { verifyFinancialPinRequest } from '../../features/auth/api/auth';
import TopBar from '../../components/TopBar';
import DeliveryZonesManagementScreen from '../../features/deliveryZones/screens/DeliveryZonesManagementScreen';

const Stack = createNativeStackNavigator();

const ManagementUnlockScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const { unlockManagement, isManagementUnlocked } = useManagementStore();

  const clearPin = () => {
    setPin('');
  };

  // مسح حقل PIN عند إغلاق الجلسة أو فتح الشاشة
  React.useEffect(() => {
    if (!isManagementUnlocked) {
      clearPin();
    }
  }, [isManagementUnlocked]);

  // مسح حقل PIN عند فتح الشاشة لأول مرة
  React.useEffect(() => {
    clearPin();
  }, []);

  // مسح حقل PIN عند كل تغيير في حالة الإدارة
  React.useEffect(() => {
    clearPin();
  }, [isManagementUnlocked]);

  const handleVerify = async () => {
    if (!pin || pin.length !== 4) {
      Alert.alert('تنبيه', 'أدخل رمز PIN مكون من 4 أرقام فقط');
      return;
    }
    
    // مسح الحقل قبل التحقق لضمان عدم الاحتفاظ بالقيمة السابقة
    const currentPin = pin;
    clearPin();
    try {
      setLoading(true);
      const res = await verifyFinancialPinRequest(currentPin);
      const ok = res?.status === 'success' || res?.valid === true;
      if (ok) {
        unlockManagement();
      } else {
        Alert.alert('خطأ', 'رمز PIN غير صحيح');
      }
    } catch (e) {
      Alert.alert('خطأ', 'تعذر التحقق من رمز PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopBar 
        title="التحقق من الإدارة"
        showBackButton={false}
        backgroundColor={theme.colors.primary}
        titleColor={theme.colors.onPrimary}
      />
      
      <View style={styles.contentContainer}>
        <View style={styles.lockIconContainer}>
          <MaterialCommunityIcons 
            name="shield-lock" 
            size={80} 
            color={theme.colors.primary} 
          />
        </View>
        
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          التحقق من الإدارة
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          أدخل رمز PIN للوصول إلى إعدادات النظام
        </Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            secureTextEntry
            placeholder="••••"
            style={[styles.input, { 
              borderColor: theme.colors.outlineVariant,
              backgroundColor: theme.colors.surface,
              color: theme.colors.onSurface
            }]}
            maxLength={6}
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />
        </View>
        
        <TouchableOpacity 
          onPress={handleVerify} 
          style={[styles.button, { backgroundColor: theme.colors.primary }]} 
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]}>
            {loading ? 'جاري التحقق...' : 'دخول'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ManagementDashboard = ({ navigation }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { lockManagement } = useManagementStore();

  const managementFeatures = [
    {
      title: 'إدارة الحسابات',
      icon: 'account-group',
      description: 'إدارة حسابات المستخدمين والصلاحيات',
      onPress: () => navigation.navigate('AccountsManagement'),
      color: '#2196F3'
    },
    {
      title: 'رموز الخصم',
      icon: 'ticket-percent',
      description: 'إدارة رموز الخصم والعروض الترويجية',
      onPress: () => navigation.navigate('PromoCodeManagement'),
      color: '#4CAF50'
    },
    {
      title: 'مناطق التوصيل',
      icon: 'map-marker-multiple',
      description: 'إدارة مناطق التوصيل والحدود',
      onPress: () => navigation.navigate('DeliveryZonesManagement'),
      color: '#FF9800'
    },
    {
      title: 'إدارة التوصيل',
      icon: 'truck-delivery',
      description: 'إدارة شركاء التوصيل والطلبات',
      onPress: () => navigation.navigate('DeliveryManagement'),
      color: '#9C27B0'
    },
    {
      title: 'التقارير المالية',
      icon: 'chart-line',
      description: 'عرض التقارير المالية والإحصائيات',
      onPress: () => navigation.navigate('FinancialReports'),
      color: '#F44336'
    },
    {
      title: 'إعدادات النظام',
      icon: 'cog',
      description: 'إعدادات النظام العامة',
      onPress: () => navigation.navigate('SystemSettings'),
      color: '#607D8B'
    }
  ];

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
            onPress={() => {
              lockManagement();
              Alert.alert('تم', 'تم إغلاق لوحة الإدارة');
            }}
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
          {managementFeatures.map((feature, index) => (
            <Card
              key={index}
              style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}
              onPress={feature.onPress}
            >
              <Card.Content style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: feature.color + '20' }]}>
                  <MaterialCommunityIcons 
                    name={feature.icon} 
                    size={28} 
                    color={feature.color} 
                  />
                </View>
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

// Placeholder screens for each management feature
const AccountsManagementScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>إدارة الحسابات - قيد التطوير</Text>
  </View>
);

const PromoCodeManagementScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const promoCodeFeatures = [
    {
      title: 'إضافة رمز خصم',
      icon: 'plus-circle',
      description: 'إنشاء رمز خصم جديد',
      onPress: () => navigation.navigate('AddPromoCode'),
      color: '#4CAF50'
    },
    {
      title: 'قائمة رموز الخصم',
      icon: 'format-list-bulleted',
      description: 'عرض وتعديل رموز الخصم الحالية',
      onPress: () => navigation.navigate('PromoCodeList'),
      color: '#2196F3'
    },
    {
      title: 'إحصائيات الخصم',
      icon: 'chart-pie',
      description: 'إحصائيات استخدام رموز الخصم',
      onPress: () => navigation.navigate('PromoCodeStats'),
      color: '#FF9800'
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopBar 
        title="إدارة رموز الخصم"
        showBackButton={true}
        backgroundColor={theme.colors.primary}
        titleColor={theme.colors.onPrimary}
      />
      
      <View style={styles.header}>
        <Text style={[styles.headerSubtitle, { color: theme.colors.onSurfaceVariant }]}>
          إدارة العروض الترويجية ورموز الخصم
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.featuresGrid}>
          {promoCodeFeatures.map((feature, index) => (
            <Card
              key={index}
              style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}
              onPress={feature.onPress}
            >
              <Card.Content style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: feature.color + '20' }]}>
                  <MaterialCommunityIcons 
                    name={feature.icon} 
                    size={28} 
                    color={feature.color} 
                  />
                </View>
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

const DeliveryManagementScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>إدارة التوصيل - قيد التطوير</Text>
  </View>
);

const FinancialReportsScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>التقارير المالية - قيد التطوير</Text>
  </View>
);

const SystemSettingsScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>إعدادات النظام - قيد التطوير</Text>
  </View>
);

const ManagementNavigator = () => {
  const { isManagementUnlocked } = useManagementStore();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isManagementUnlocked ? (
        <Stack.Screen name="ManagementUnlock" component={ManagementUnlockScreen} />
      ) : (
        <>
          <Stack.Screen name="ManagementDashboard" component={ManagementDashboard} />
          <Stack.Screen name="AccountsManagement" component={AccountsManagementScreen} />
          <Stack.Screen name="PromoCodeManagement" component={PromoCodeManagementScreen} />
          <Stack.Screen name="AddPromoCode" component={() => (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text>إضافة رمز خصم - قيد التطوير</Text>
            </View>
          )} />
          <Stack.Screen name="PromoCodeList" component={() => (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text>قائمة رموز الخصم - قيد التطوير</Text>
            </View>
          )} />
          <Stack.Screen name="PromoCodeStats" component={() => (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text>إحصائيات رموز الخصم - قيد التطوير</Text>
            </View>
          )} />
          <Stack.Screen name="DeliveryZonesManagement" component={DeliveryZonesManagementScreen} />
          <Stack.Screen name="DeliveryManagement" component={DeliveryManagementScreen} />
          <Stack.Screen name="FinancialReports" component={FinancialReportsScreen} />
          <Stack.Screen name="SystemSettings" component={SystemSettingsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIconContainer: {
    marginBottom: 32,
    alignItems: 'center',
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
  },
  featureCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  input: {
    width: 200,
    height: 56,
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 20,
    letterSpacing: 6,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    width: 200,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },

});

export default ManagementNavigator;


