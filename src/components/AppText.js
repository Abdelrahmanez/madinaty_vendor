import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { 
  DEFAULT_FONT_FAMILY, 
  FONTS, 
  fontStyle,
  fontStyleBold,
  fontStyleLight,
  fontStyleExtraBold
} from '../theme/fontSizes';

/**
 * مكون نص مخصص يستخدم خط Almarai بشكل افتراضي
 * يتم استخدامه بدلاً من مكون Text الأصلي لضمان استخدام نفس الخط في كل مكان
 */
const AppText = ({ style, children, ...props }) => {
  return (
    <Text style={[styles.defaultText, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontWeight: '500', // جعل الخط أثقل قليلاً من الوضع العادي
  },
});

// نقوم بإنشاء أنواع مختلفة من النصوص مع إمكانية الاختيار بين الأوزان المختلفة

// العناوين الرئيسية - استخدام الخط السميك
export const AppHeading = ({ style, children, ...props }) => (
  <AppText style={[fontStyleBold.heading, style]} {...props}>
    {children}
  </AppText>
);

// العناوين الفرعية - استخدام الخط السميك
export const AppSubheading = ({ style, children, ...props }) => (
  <AppText style={[fontStyleBold.title, style]} {...props}>
    {children}
  </AppText>
);

// الفقرات - استخدام الخط العادي
export const AppParagraph = ({ style, children, ...props }) => (
  <AppText style={[fontStyle.md, style]} {...props}>
    {children}
  </AppText>
);

// النصوص الصغيرة - استخدام الخط الخفيف
export const AppCaption = ({ style, children, ...props }) => (
  <AppText style={[fontStyleLight.sm, style]} {...props}>
    {children}
  </AppText>
);

// النص العريض - استخدام الخط السميك
export const AppBold = ({ style, children, ...props }) => (
  <AppText style={[{ fontFamily: FONTS.ALMARAI.BOLD }, style]} {...props}>
    {children}
  </AppText>
);

// النص الخفيف - استخدام الخط الخفيف
export const AppLight = ({ style, children, ...props }) => (
  <AppText style={[{ fontFamily: FONTS.ALMARAI.LIGHT }, style]} {...props}>
    {children}
  </AppText>
);

// النص السميك جدًا - استخدام الخط السميك جدًا
export const AppExtraBold = ({ style, children, ...props }) => (
  <AppText style={[{ fontFamily: FONTS.ALMARAI.EXTRA_BOLD }, style]} {...props}>
    {children}
  </AppText>
);

export default AppText; 