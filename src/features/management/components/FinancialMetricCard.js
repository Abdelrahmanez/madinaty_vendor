import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FinancialMetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color,
  isLoading = false 
}) => {
  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '0.00';
    return amount.toLocaleString('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2
    });
  };

  const formatNumber = (number) => {
    if (typeof number !== 'number') return '0';
    return number.toLocaleString('ar-EG');
  };

  const displayValue = () => {
    if (isLoading) return '...';
    if (title.includes('رصيد') || title.includes('أرباح') || title.includes('مدفوع')) {
      return formatCurrency(value);
    }
    return formatNumber(value);
  };

  return (
    <Card style={[styles.card, { borderLeftColor: color }]}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            <MaterialCommunityIcons 
              name={icon} 
              size={24} 
              color={color} 
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && (
              <Text style={styles.subtitle}>{subtitle}</Text>
            )}
          </View>
        </View>
        <Text style={[styles.value, { color }]}>
          {displayValue()}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    elevation: 2,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.7,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'right',
  },
});

export default FinancialMetricCard;
