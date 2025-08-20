/**
 * PromocodeCard Component
 * --------------------------------------------
 * مكون بطاقة لعرض معلومات كود الخصم
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, Card, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PromocodeStatusBadge from './PromocodeStatusBadge';

const PromocodeCard = ({ 
  promocode, 
  onPress, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}) => {
  const theme = useTheme();

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-EG', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
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

  const handleToggleStatus = () => {
    if (onToggleStatus) {
      onToggleStatus(promocode.id, !promocode.isActive);
    }
  };

  return (
    <Card 
      style={[
        styles.card, 
        { backgroundColor: theme.colors.surface }
      ]} 
      onPress={onPress}
      mode="elevated"
    >
      <Card.Content style={styles.cardContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.codeContainer}>
            <MaterialCommunityIcons 
              name="ticket-percent" 
              size={20} 
              color={theme.colors.primary} 
            />
            <Text style={[
              styles.codeText, 
              { color: theme.colors.primary }
            ]}>
              {promocode.code}
            </Text>
          </View>
          
          <View style={styles.actions}>
            <IconButton
              icon={promocode.isActive ? "eye-off" : "eye"}
              size={20}
              onPress={handleToggleStatus}
              iconColor={promocode.isActive ? theme.colors.error : theme.colors.primary}
            />
            {onEdit && (
              <IconButton
                icon="pencil"
                size={20}
                onPress={() => onEdit(promocode)}
                iconColor={theme.colors.primary}
              />
            )}
            {onDelete && (
              <IconButton
                icon="delete"
                size={20}
                onPress={() => onDelete(promocode.id)}
                iconColor={theme.colors.error}
              />
            )}
          </View>
        </View>

        {/* Description */}
        {promocode.description && (
          <Text style={[
            styles.description, 
            { color: theme.colors.onSurface }
          ]}>
            {promocode.description}
          </Text>
        )}

                 {/* Type and Value */}
         <View style={styles.typeValueRow}>
           <View style={styles.typeContainer}>
             <Text style={[
               styles.typeLabel, 
               { color: theme.colors.onSurfaceVariant }
             ]}>
               النوع:
             </Text>
             <Text style={[
               styles.typeValue, 
               { color: theme.colors.onSurface }
             ]}>
               {getTypeText(promocode.type)}
             </Text>
           </View>
           
           <View style={styles.valueContainer}>
             <Text style={[
               styles.valueLabel, 
               { color: theme.colors.onSurfaceVariant }
             ]}>
               القيمة:
             </Text>
             <Text style={[
               styles.valueText, 
               { color: theme.colors.primary }
             ]}>
               {getValueText()}
             </Text>
           </View>
         </View>

         {/* Applies To */}
         <View style={styles.appliesToRow}>
           <MaterialCommunityIcons 
             name="target" 
             size={16} 
             color={theme.colors.onSurfaceVariant} 
           />
           <Text style={[
             styles.appliesToText, 
             { color: theme.colors.onSurfaceVariant }
           ]}>
             ينطبق على: {getAppliesToText(promocode.appliesTo)}
           </Text>
         </View>

        {/* Requirements */}
        <View style={styles.requirementsRow}>
          <View style={styles.requirement}>
            <MaterialCommunityIcons 
              name="currency-usd" 
              size={16} 
              color={theme.colors.onSurfaceVariant} 
            />
            <Text style={[
              styles.requirementText, 
              { color: theme.colors.onSurfaceVariant }
            ]}>
              الحد الأدنى: {promocode.minOrderAmount} جنية
            </Text>
          </View>
          
          {promocode.maxDiscountAmount > 0 && (
            <View style={styles.requirement}>
              <MaterialCommunityIcons 
                name="trophy" 
                size={16} 
                color={theme.colors.onSurfaceVariant} 
              />
              <Text style={[
                styles.requirementText, 
                { color: theme.colors.onSurfaceVariant }
              ]}>
                الحد الأقصى: {promocode.maxDiscountAmount} جنية
              </Text>
            </View>
          )}
        </View>

        {/* Usage Info */}
        <View style={styles.usageRow}>
          <View style={styles.usageItem}>
            <MaterialCommunityIcons 
              name="account-multiple" 
              size={16} 
              color={theme.colors.onSurfaceVariant} 
            />
            <Text style={[
              styles.usageText, 
              { color: theme.colors.onSurfaceVariant }
            ]}>
              {promocode.usageCount}/{promocode.usageLimit || '∞'}
            </Text>
          </View>
          
          <View style={styles.usageItem}>
            <MaterialCommunityIcons 
              name="account" 
              size={16} 
              color={theme.colors.onSurfaceVariant} 
            />
            <Text style={[
              styles.usageText, 
              { color: theme.colors.onSurfaceVariant }
            ]}>
              {promocode.perUserLimit} لكل مستخدم
            </Text>
          </View>
        </View>

        {/* Dates */}
        <View style={styles.datesRow}>
          <View style={styles.dateItem}>
            <MaterialCommunityIcons 
              name="calendar-start" 
              size={16} 
              color={theme.colors.onSurfaceVariant} 
            />
            <Text style={[
              styles.dateText, 
              { color: theme.colors.onSurfaceVariant }
            ]}>
              {formatDate(promocode.startDate)}
            </Text>
          </View>
          
          <View style={styles.dateItem}>
            <MaterialCommunityIcons 
              name="calendar-end" 
              size={16} 
              color={theme.colors.onSurfaceVariant} 
            />
            <Text style={[
              styles.dateText, 
              { color: theme.colors.onSurfaceVariant }
            ]}>
              {formatDate(promocode.endDate)}
            </Text>
          </View>
        </View>

        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <PromocodeStatusBadge promocode={promocode} size="small" />
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2
  },
  cardContent: {
    padding: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  codeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8
  },
  actions: {
    flexDirection: 'row'
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20
  },
  typeValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  typeLabel: {
    fontSize: 12,
    marginRight: 4
  },
  typeValue: {
    fontSize: 12,
    fontWeight: '600'
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  valueLabel: {
    fontSize: 12,
    marginRight: 4
  },
  valueText: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  requirementsRow: {
    marginBottom: 12
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  requirementText: {
    fontSize: 12,
    marginLeft: 6
  },
  usageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  usageItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  usageText: {
    fontSize: 12,
    marginLeft: 4
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
     dateText: {
     fontSize: 12,
     marginLeft: 4
   },
   appliesToRow: {
     flexDirection: 'row',
     alignItems: 'center',
     marginBottom: 12
   },
   appliesToText: {
     fontSize: 12,
     marginLeft: 6
   },
   statusContainer: {
     alignItems: 'flex-end'
   }
});

export default PromocodeCard;
