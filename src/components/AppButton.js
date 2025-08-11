import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { DEFAULT_FONT_FAMILY, FONTS, fontSize } from '../theme/fontSizes';

/**
 * مكون زر مخصص يستخدم خط Almarai بشكل افتراضي
 * يتم استخدامه بدلاً من مكون Button الأصلي لضمان استخدام نفس الخط في كل مكان
 */
const AppButton = ({ labelStyle, contentStyle, style, ...props }) => {
  return (
    <Button 
      labelStyle={[styles.buttonLabel, labelStyle]}
      contentStyle={[styles.buttonContent, contentStyle]}
      style={[styles.button, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontFamily: FONTS.ALMARAI.BOLD,
    fontSize: fontSize.lg,
    letterSpacing: 0,
  }
});

// أنواع مختلفة من الأزرار مع أوزان مختلفة للخط
export const PrimaryButton = (props) => (
  <AppButton 
    mode="contained" 
    labelStyle={{ fontFamily: FONTS.ALMARAI.BOLD }}
    {...props} 
  />
);

export const SecondaryButton = (props) => (
  <AppButton 
    mode="outlined" 
    labelStyle={{ fontFamily: FONTS.ALMARAI.REGULAR }}
    {...props} 
  />
);

export const TextButton = (props) => (
  <AppButton 
    mode="text" 
    labelStyle={{ fontFamily: FONTS.ALMARAI.REGULAR }}
    {...props} 
  />
);

// أزرار بأوزان خط مختلفة
export const LightButton = (props) => (
  <AppButton 
    labelStyle={{ fontFamily: FONTS.ALMARAI.LIGHT }}
    {...props} 
  />
);

export const BoldButton = (props) => (
  <AppButton 
    labelStyle={{ fontFamily: FONTS.ALMARAI.BOLD }}
    {...props} 
  />
);

export const ExtraBoldButton = (props) => (
  <AppButton 
    labelStyle={{ fontFamily: FONTS.ALMARAI.EXTRA_BOLD }}
    {...props} 
  />
);

export default AppButton; 