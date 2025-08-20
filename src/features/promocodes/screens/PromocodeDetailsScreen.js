/**
 * PromocodeDetailsScreen
 * --------------------------------------------
 * شاشة تفاصيل كود الخصم
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme, Card, Button, Divider, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import TopBar from '../../../components/TopBar';
import PromocodeStatusBadge from '../components/PromocodeStatusBadge';

const PromocodeDetailsScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const { promocode } = route.params;

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-EG', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('خطأ في تنسيق التاريخ:', error);
      return dateString;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'percentage':
        return 'نسبة مئوية';
      case 'fixed_amount':
        return 'مبلغ ثابت';
      case 'free_delivery':
        return 'توصيل مجاني';
      default:
        return type;
    }
  };

  const getAppliesToText = (appliesTo) => {
    switch (appliesTo) {
      case 'all_orders':
        return 'جميع الطلبات';
      case 'specific_categories':
        return 'فئات محددة';
      case 'specific_items':
        return 'عناصر محددة';
      default:
        return appliesTo;
    }
  };

  const getValueText = () => {
    if (promocode.type === 'free_delivery') {
      return 'توصيل مجاني';
    }
    if (promocode.type === 'percentage') {
      return `${promocode.value}%`;
    }
    return `${promocode.value} جنية`;
  };

  const handleEdit = () => {
    navigation.navigate('EditPromocode', { promocode });
  };

  const renderInfoSection = (title, items) => (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
          {title}
        </Text>
        <Divider style={styles.divider} />
        {items.map((item, index) => (
          <View key={index} style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <MaterialCommunityIcons 
                name={item.icon} 
                size={20} 
                color={theme.colors.onSurfaceVariant} 
              />
              <Text style={[styles.infoLabelText, { color: theme.colors.onSurfaceVariant }]}>
                {item.label}:
              </Text>
            </View>
            <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
              {item.value}
            </Text>
          </View>
        ))}
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopBar 
        title="تفاصيل كود الخصم"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <Card style={[styles.headerCard, { backgroundColor: theme.colors.primary }]}>
          <Card.Content style={styles.headerContent}>
            <View style={styles.codeContainer}>
              <MaterialCommunityIcons 
                name="ticket-percent" 
                size={32} 
                color="white" 
              />
              <Text style={styles.codeText}>{promocode.code}</Text>
            </View>
            <PromocodeStatusBadge promocode={promocode} size="large" />
          </Card.Content>
        </Card>

                 {/* Basic Information */}
         {renderInfoSection('المعلومات الأساسية', [
           {
             icon: 'text',
             label: 'الوصف',
             value: promocode.description || 'لا يوجد وصف'
           },
           {
             icon: 'tag',
             label: 'النوع',
             value: getTypeText(promocode.type)
           },
           {
             icon: 'currency-usd',
             label: 'القيمة',
             value: getValueText()
           },
           {
             icon: 'target',
             label: 'ينطبق على',
             value: getAppliesToText(promocode.appliesTo)
           }
         ])}

        {/* Requirements */}
        {renderInfoSection('المتطلبات', [
          {
            icon: 'currency-usd',
            label: 'الحد الأدنى للطلب',
            value: `${promocode.minOrderAmount} جنية`
          },
          ...(promocode.maxDiscountAmount > 0 ? [{
            icon: 'trophy',
            label: 'الحد الأقصى للخصم',
            value: `${promocode.maxDiscountAmount} جنية`
          }] : [])
        ])}

        {/* Usage Information */}
        {renderInfoSection('معلومات الاستخدام', [
          {
            icon: 'account-multiple',
            label: 'عدد مرات الاستخدام',
            value: `${promocode.usageCount}/${promocode.usageLimit || 'غير محدود'}`
          },
          {
            icon: 'account',
            label: 'الحد لكل مستخدم',
            value: `${promocode.perUserLimit} مرة`
          }
        ])}

        {/* Dates */}
        {renderInfoSection('التواريخ', [
          {
            icon: 'calendar-start',
            label: 'تاريخ البداية',
            value: formatDate(promocode.startDate)
          },
          {
            icon: 'calendar-end',
            label: 'تاريخ الانتهاء',
            value: formatDate(promocode.endDate)
          },
          {
            icon: 'clock',
            label: 'تاريخ الإنشاء',
            value: formatDate(promocode.createdAt)
          }
        ])}

        {/* Status Information */}
        {renderInfoSection('حالة الكود', [
          {
            icon: 'check-circle',
            label: 'مفعل',
            value: promocode.isActive ? 'نعم' : 'لا'
          },
          {
            icon: 'calendar-check',
            label: 'بدأ',
            value: promocode.hasStarted ? 'نعم' : 'لا'
          },
          {
            icon: 'calendar-remove',
            label: 'منتهي الصلاحية',
            value: promocode.hasExpired ? 'نعم' : 'لا'
          },
          {
            icon: 'account-off',
            label: 'تم استنفاذ الحد',
            value: promocode.usageLimitReached ? 'نعم' : 'لا'
          }
        ])}

        {/* Created By */}
        {promocode.createdBy && renderInfoSection('تم الإنشاء بواسطة', [
          {
            icon: 'account',
            label: 'الاسم',
            value: promocode.createdBy.name
          }
        ])}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={handleEdit}
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            icon="pencil"
          >
            تعديل
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    flex: 1,
    padding: 16
  },
  headerCard: {
    marginBottom: 16
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  codeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12
  },
  card: {
    marginBottom: 16,
    elevation: 2
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8
  },
  divider: {
    marginBottom: 16
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  infoLabelText: {
    fontSize: 14,
    marginLeft: 8
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'left'
  },
  actionButtons: {
    marginTop: 24,
    marginBottom: 32
  },
  actionButton: {
    marginBottom: 12
  }
});

export default PromocodeDetailsScreen;
