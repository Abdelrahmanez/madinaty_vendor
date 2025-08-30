import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ManagementFeatureCard = ({ 
  title, 
  description, 
  icon, 
  color, 
  onPress 
}) => {
  return (
    <Card
      style={styles.featureCard}
      onPress={onPress}
    >
      <Card.Content style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <MaterialCommunityIcons 
            name={icon} 
            size={28} 
            color={color} 
          />
        </View>
        <Text style={styles.featureTitle}>
          {title}
        </Text>
        <Text style={styles.featureDescription}>
          {description}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
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
});

export default ManagementFeatureCard;
