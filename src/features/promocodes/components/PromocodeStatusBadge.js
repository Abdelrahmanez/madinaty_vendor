/**
 * PromocodeStatusBadge Component
 * --------------------------------------------
 * مكون لعرض حالة كود الخصم
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

const PromocodeStatusBadge = ({ promocode, size = 'medium' }) => {
  const theme = useTheme();

  const getStatusInfo = () => {
    if (!promocode.isActive) {
      return {
        text: 'غير مفعل',
        color: theme.colors.error,
        backgroundColor: theme.colors.errorContainer
      };
    }

    if (promocode.hasExpired) {
      return {
        text: 'منتهي الصلاحية',
        color: theme.colors.error,
        backgroundColor: theme.colors.errorContainer
      };
    }

    if (!promocode.hasStarted) {
      return {
        text: 'لم يبدأ بعد',
        color: theme.colors.warning,
        backgroundColor: theme.colors.warningContainer
      };
    }

    if (promocode.usageLimitReached) {
      return {
        text: 'تم استنفاذ الحد',
        color: theme.colors.error,
        backgroundColor: theme.colors.errorContainer
      };
    }

    return {
      text: 'مفعل',
      color: theme.colors.primary,
      backgroundColor: theme.colors.primaryContainer
    };
  };

  const statusInfo = getStatusInfo();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.smallContainer,
          text: styles.smallText
        };
      case 'large':
        return {
          container: styles.largeContainer,
          text: styles.largeText
        };
      default:
        return {
          container: styles.mediumContainer,
          text: styles.mediumText
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={[
      styles.container,
      sizeStyles.container,
      {
        backgroundColor: statusInfo.backgroundColor,
        borderColor: statusInfo.color
      }
    ]}>
      <Text style={[
        styles.text,
        sizeStyles.text,
        { color: statusInfo.color }
      ]}>
        {statusInfo.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start'
  },
  smallContainer: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8
  },
  mediumContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  largeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  text: {
    fontWeight: '600',
    textAlign: 'center'
  },
  smallText: {
    fontSize: 10
  },
  mediumText: {
    fontSize: 12
  },
  largeText: {
    fontSize: 14
  }
});

export default PromocodeStatusBadge;
