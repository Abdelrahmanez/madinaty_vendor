import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  I18nManager,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { 
  useTheme, 
  Button, 
  Avatar,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TopBar from '../../components/TopBar';
import useAuth from '../../hooks/useAuth';
import useAuthStore from '../../stores/authStore';

const isRTL = I18nManager.isRTL;

// مكون للعناصر القابلة للنقر في القائمة
const MenuListItem = ({ icon, title, onPress, iconColor, theme }) => (
  <TouchableOpacity 
    style={styles.menuItem} 
    onPress={onPress}
  >
    <View style={styles.menuItemContent}>
      <MaterialCommunityIcons 
        name={icon} 
        size={24} 
        color={iconColor || theme.colors.primary} 
        style={styles.menuItemIcon}
      />
      <Text style={[styles.menuItemTitle, { color: theme.colors.onSurface }]}>{title}</Text>
    </View>
    <MaterialCommunityIcons 
      name={isRTL ? "chevron-left" : "chevron-right"} 
      size={20} 
      color={theme.colors.outline} 
    />
  </TouchableOpacity>
);

// مكون لعنوان القسم
const SectionHeader = ({ title, theme }) => (
  <View style={[styles.sectionHeader, { backgroundColor: theme.colors.background }]}>
    <Text style={[styles.sectionHeaderText, { color: theme.colors.primary }]}>
      {title}
    </Text>
  </View>
);

const ProfileScreen = ({ navigation }) => {
  const theme = useTheme();
  const { logout } = useAuth();
  const { user } = useAuthStore();
  
  // استخراج معلومات المستخدم من المخزن، استخدام معلومات افتراضية إذا لم تكن متوفرة
  const userName = user?.name || "مستخدم مدينتي";
  const phoneNumber = user?.phoneNumber || "";
  const email = user?.email || "";

  const handleLogout = async () => {
    try {
      const { success } = await logout();
      if (success) {
        // بعد تسجيل الخروج بنجاح، توجيه المستخدم إلى شاشة تسجيل الدخول
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    } catch (error) {
      console.error('خطأ أثناء تسجيل الخروج:', error);
    }
  };

  // التنقل إلى صفحات أخرى
  const navigateTo = (screen, params) => {
    navigation.navigate(screen, params);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopBar 
        title="حسابي"
        rightIconName="cog"
        onRightIconPress={() => navigateTo('Settings')}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* قسم معلومات المستخدم الأساسية */}
        <View style={[styles.userInfoContainer, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.avatarContainer}>
            {/* استخدام Avatar مع حرف من اسم المستخدم بدلاً من صورة */}
            <Avatar.Text 
              size={70} 
              label={userName.charAt(0).toUpperCase()} 
              backgroundColor={theme.colors.primary}
              color={theme.colors.onPrimary}
            />
            <TouchableOpacity 
              style={[styles.editAvatarButton, { backgroundColor: theme.colors.primary + '80' }]}
              onPress={() => navigateTo('ChangePassword')}
            >
              <MaterialCommunityIcons name="pencil" size={16} color={theme.colors.onPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.userDetailsContainer}>
            <Text style={[styles.userName, { color: theme.colors.onSurface }]}>{userName}</Text>
            {phoneNumber ? (
              <View style={styles.userContactInfo}>
                <MaterialCommunityIcons name="phone" size={16} color={theme.colors.primary} />
                <Text style={[styles.userContactText, { color: theme.colors.onSurfaceVariant }]}>
                  {phoneNumber}
                </Text>
              </View>
            ) : null}
            {email ? (
              <View style={styles.userContactInfo}>
                <MaterialCommunityIcons name="email" size={16} color={theme.colors.primary} />
                <Text style={[styles.userContactText, { color: theme.colors.onSurfaceVariant }]}>
                  {email}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        
        {/* قسم الحساب الشخصي */}
        <SectionHeader title="الحساب الشخصي" theme={theme} />
        <View style={[styles.sectionContainer, { backgroundColor: theme.colors.surface }]}>
          <MenuListItem 
            icon="lock-reset" 
            title="تغيير كلمة المرور"
            onPress={() => navigateTo('ChangePassword')}
            theme={theme}
          />
          <View style={[styles.divider, {backgroundColor: theme.colors.outlineVariant}]} />
          <MenuListItem 
            icon="map-marker" 
            title="العناوين المحفوظة"
            onPress={() => navigateTo('Address')}
            theme={theme}
          />
          <View style={[styles.divider, {backgroundColor: theme.colors.outlineVariant}]} />
          <MenuListItem 
            icon="credit-card" 
            title="وسائل الدفع"
            onPress={() => navigateTo('PaymentMethods')}
            theme={theme}
          />
        </View>
        
        {/* قسم الطلبات */}
        <SectionHeader title="الطلبات" theme={theme} />
        <View style={[styles.sectionContainer, { backgroundColor: theme.colors.surface }]}>
          <MenuListItem 
            icon="clipboard-list" 
            title="طلباتي السابقة"
            onPress={() => navigateTo('OrderHistory')}
            theme={theme}
          />
          <View style={[styles.divider, {backgroundColor: theme.colors.outlineVariant}]} />
          <MenuListItem 
            icon="clipboard-clock" 
            title="الطلبات الحالية"
            onPress={() => navigateTo('CurrentOrders')}
            theme={theme}
          />
        </View>
        
        {/* قسم الإعدادات والدعم */}
        <SectionHeader title="الإعدادات والدعم" theme={theme} />
        <View style={[styles.sectionContainer, { backgroundColor: theme.colors.surface }]}>
          <MenuListItem 
            icon="bell" 
            title="الإشعارات"
            onPress={() => navigateTo('NotificationSettings')}
            theme={theme}
          />
          <View style={[styles.divider, {backgroundColor: theme.colors.outlineVariant}]} />
          <MenuListItem 
            icon="translate" 
            title="اللغة"
            onPress={() => navigateTo('LanguageSettings')}
            theme={theme}
          />
          <View style={[styles.divider, {backgroundColor: theme.colors.outlineVariant}]} />
          <MenuListItem 
            icon="help-circle" 
            title="المساعدة والدعم"
            onPress={() => navigateTo('Support')}
            theme={theme}
          />
          <View style={[styles.divider, {backgroundColor: theme.colors.outlineVariant}]} />
          <MenuListItem 
            icon="information" 
            title="عن التطبيق"
            onPress={() => navigateTo('About')}
            theme={theme}
          />
        </View>
        
        {/* زر تسجيل الخروج */}
        <Button 
          mode="contained" 
          onPress={handleLogout}
          icon="logout"
          contentStyle={styles.logoutButtonContent}
          style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
          labelStyle={styles.buttonText}
        >
          تسجيل الخروج
        </Button>
        
        {/* نسخة التطبيق */}
        <Text style={[styles.versionText, { color: theme.colors.outline }]}>
          نسخة التطبيق: 1.0.0
        </Text>
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
  userInfoContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    borderRadius: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginEnd: 16,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetailsContainer: {
    flex: 1,
    alignItems: isRTL ? 'flex-start' : 'flex-start',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: isRTL ? 'right' : 'left',
  },
  userContactInfo: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  userContactText: {
    fontSize: 14,
    marginStart: 6,
    textAlign: isRTL ? 'right' : 'left',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: isRTL ? 'right' : 'left',
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
  },
  menuItem: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemContent: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    marginEnd: 16,
  },
  menuItemTitle: {
    fontSize: 16,
    textAlign: isRTL ? 'right' : 'left',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginVertical: 24,
    borderRadius: 10,
  },
  logoutButtonContent: {
    height: 48,
    flexDirection: isRTL ? 'row-reverse' : 'row',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 24,
  },
});

export default ProfileScreen; 