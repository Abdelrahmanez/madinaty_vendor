import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import TopBar from '../../../components/TopBar';

const PlaceholderScreen = ({ title, message }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopBar 
        title={title}
        showBackButton={true}
        backgroundColor={theme.colors.primary}
        titleColor={theme.colors.onPrimary}
      />
      
      <View style={styles.content}>
        <Text style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>
          {message}
        </Text>
      </View>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PlaceholderScreen;
