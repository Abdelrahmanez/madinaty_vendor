import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FinancialSummaryCard = ({ 
  title, 
  data, 
  isLoading = false 
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'inactive':
        return '#F44336';
      case 'pending':
        return '#FF9800';
      default:
        return '#607D8B';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'inactive':
        return 'غير نشط';
      case 'pending':
        return 'في الانتظار';
      default:
        return 'غير محدد';
    }
  };

  if (isLoading) {
    return (
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Text style={styles.loadingText}>جاري التحميل...</Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <MaterialCommunityIcons 
            name="information-outline" 
            size={24} 
            color="#2196F3" 
          />
          <Text style={styles.title}>{title}</Text>
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>الحالة:</Text>
            <View style={styles.statusContainer}>
              <View 
                style={[
                  styles.statusDot, 
                  { backgroundColor: getStatusColor(data?.status) }
                ]} 
              />
              <Text style={styles.statusText}>
                {getStatusText(data?.status)}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>آخر تسوية:</Text>
            <Text style={styles.value}>
              {formatDate(data?.lastSettlementDate)}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>تاريخ الإنشاء:</Text>
            <Text style={styles.value}>
              {formatDate(data?.createdAt)}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>آخر تحديث:</Text>
            <Text style={styles.value}>
              {formatDate(data?.updatedAt)}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  infoContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'left',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default FinancialSummaryCard;
