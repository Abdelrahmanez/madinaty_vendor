import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import TopBar from '../../../../components/TopBar';

const PaymentMethodsScreen = ({ navigation }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopBar 
        title="وسائل الدفع"
        leftIconName="arrow-left"
        onLeftIconPress={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <Text style={[styles.text, { color: theme.colors.onSurface }]}>
          شاشة وسائل الدفع - قيد التطوير
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PaymentMethodsScreen;
