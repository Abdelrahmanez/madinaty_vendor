// components/LoadingIndicator.js

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const LoadingIndicator = ({ message, color }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  
  // Use provided message or default translation
  const displayMessage = message || t('loading');

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={color ? color : theme.colors.primary} />
      <Text style={[styles.text, { color: color ? color : theme.colors.surface }]}>
        {displayMessage}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});

export default LoadingIndicator;
