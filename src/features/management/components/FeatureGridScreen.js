import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import TopBar from '../../../components/TopBar';
import ManagementFeatureCard from './ManagementFeatureCard';

const FeatureGridScreen = ({ 
  title, 
  subtitle, 
  features, 
  navigation 
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const handleFeaturePress = (route) => {
    navigation.navigate(route);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopBar 
        title={title}
        showBackButton={true}
        backgroundColor={theme.colors.primary}
        titleColor={theme.colors.onPrimary}
      />
      
      <View style={styles.header}>
        <Text style={[styles.headerSubtitle, { color: theme.colors.onSurfaceVariant }]}>
          {subtitle}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.featuresGrid}>
          {features.map((feature) => (
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

export default FeatureGridScreen;
