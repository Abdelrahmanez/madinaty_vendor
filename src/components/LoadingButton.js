import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const LoadingButton = ({ 
  onPress, 
  title, 
  loading = false, 
  disabled = false, 
  style = {},
  textStyle = {},
  loadingText,
  disabledText
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { t } = useTranslation();

  const isButtonDisabled = disabled || loading;

  const getButtonText = () => {
    if (loading) return loadingText || t('loading');
    if (disabled) return disabledText || t('notAvailable');
    return title;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isButtonDisabled && styles.disabledButton,
        style
      ]}
      onPress={onPress}
      disabled={isButtonDisabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color={theme.colors.onPrimary} />
      ) : (
        <Text style={[
          styles.buttonText,
          isButtonDisabled && styles.disabledButtonText,
          textStyle
        ]}>
          {getButtonText()}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (theme) => StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  disabledButton: {
    backgroundColor: theme.colors.surfaceDisabled,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.onPrimary,
  },
  disabledButtonText: {
    color: theme.colors.onSurfaceDisabled,
  },
});

export default LoadingButton; 