import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (__DEV__) {
      console.error('Global ErrorBoundary caught an error:', error, errorInfo);
    }
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    const theme = this.props.theme || { colors: { error: '#FF4842' } };
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={[styles.title, { color: theme.colors.error }]}>حدث خطأ غير متوقع</Text>
          <Text style={styles.subtitle}>حاول إعادة تحميل الشاشة</Text>
          <Button mode="contained" onPress={this.handleReload} style={styles.button}>
            إعادة المحاولة
          </Button>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});

export default function ThemedErrorBoundary(props) {
  const theme = useTheme();
  return <ErrorBoundary theme={theme} {...props} />;
}


