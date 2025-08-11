import { RFValue } from 'react-native-responsive-fontsize';
import { Platform } from 'react-native';

/**
 * مركز إدارة الخطوط - المكان الوحيد لتعديل الخطوط وأحجامها
 * عند تغيير أي شيء هنا، يتغير في التطبيق بأكمله
 */

// عائلات الخطوط المتاحة
export const FONTS = {
  ALMARAI: {
    LIGHT: 'Almarai-Light',
    REGULAR: 'Almarai-Regular',
    BOLD: 'Almarai-Bold',
    EXTRA_BOLD: 'Almarai-ExtraBold',
  },
  SPACE_MONO: {
    REGULAR: 'SpaceMono-Regular',
  }
};

// =========================================================================
// 👇 هذا هو القسم الوحيد الذي تحتاج لتعديله لتغيير أحجام الخط في كل التطبيق 👇
// =========================================================================

// عامل تكبير الخط - لتغيير حجم كل الخطوط دفعة واحدة (1.0 = عادي، 1.2 = أكبر بنسبة 20%)
export const FONT_SCALE = 1.1; // زيادة كل الخطوط بنسبة 10%

// الحجم الأساسي الذي تشتق منه باقي الأحجام (تعديله يغير كل الأحجام بالتناسب)
const BASE_SIZE = 14; // الحجم الأساسي المعياري للنص

// أحجام الخط كنسب من الحجم الأساسي
const SIZES = {
  xs: BASE_SIZE * 0.714,     // 10
  sm: BASE_SIZE * 0.857,     // 12
  md: BASE_SIZE * 1.0,       // 14 (الحجم الأساسي)
  lg: BASE_SIZE * 1.143,     // 16
  xl: BASE_SIZE * 1.286,     // 18
  xxl: BASE_SIZE * 1.429,    // 20
  title: BASE_SIZE * 1.571,  // 22
  heading: BASE_SIZE * 1.714, // 24
  displaySm: BASE_SIZE * 2.0, // 28
  display: BASE_SIZE * 2.286,   // 32
};

// الخط الافتراضي المستخدم في التطبيق
export const DEFAULT_FONT_FAMILY = FONTS.ALMARAI.REGULAR;

// =========================================================================
// 👆 انتهى القسم الذي تحتاج لتعديله 👆
// =========================================================================

export const DEFAULT_FONT_WEIGHT = '400'; // الوزن الافتراضي

// خريطة أوزان الخط
export const FONT_WEIGHTS = {
  thin: Platform.OS === 'ios' ? '100' : { fontFamily: FONTS.ALMARAI.LIGHT, fontWeight: '100' },
  light: Platform.OS === 'ios' ? '300' : { fontFamily: FONTS.ALMARAI.LIGHT, fontWeight: '300' },
  regular: Platform.OS === 'ios' ? '400' : { fontFamily: FONTS.ALMARAI.REGULAR, fontWeight: '400' },
  medium: Platform.OS === 'ios' ? '500' : { fontFamily: FONTS.ALMARAI.REGULAR, fontWeight: '500' },
  semiBold: Platform.OS === 'ios' ? '600' : { fontFamily: FONTS.ALMARAI.BOLD, fontWeight: '600' },
  bold: Platform.OS === 'ios' ? '700' : { fontFamily: FONTS.ALMARAI.BOLD, fontWeight: '700' },
  extraBold: Platform.OS === 'ios' ? '800' : { fontFamily: FONTS.ALMARAI.EXTRA_BOLD, fontWeight: '800' },
};

// -------------------------------------------------------------------------
// حساب أحجام الخط النهائية بناءً على الإعدادات أعلاه
// -------------------------------------------------------------------------

// الأحجام الأساسية المحسوبة من النسب
export const baseSizes = Object.entries(SIZES).reduce((acc, [key, size]) => {
  acc[key] = Math.round(size * 10) / 10; // تقريب لأقرب 0.1
  return acc;
}, {});

// إنشاء أحجام خط متجاوبة مع تطبيق عامل التكبير
export const fontSize = {};
Object.keys(baseSizes).forEach(key => {
  fontSize[key] = RFValue(baseSizes[key] * FONT_SCALE);
});

// -------------------------------------------------------------------------
// أنماط الخط (حجم + عائلة)
// -------------------------------------------------------------------------

// أنماط الخط الكاملة التي تجمع بين الحجم والعائلة
export const fontStyle = {};

// نسخة عادية من كل حجم
Object.keys(baseSizes).forEach(key => {
  fontStyle[key] = {
    fontSize: fontSize[key],
    fontFamily: DEFAULT_FONT_FAMILY,
  };
});

// نسخة خفيفة من كل حجم
export const fontStyleLight = {};
Object.keys(baseSizes).forEach(key => {
  fontStyleLight[key] = {
    fontSize: fontSize[key],
    fontFamily: FONTS.ALMARAI.LIGHT,
  };
});

// نسخة سميكة من كل حجم
export const fontStyleBold = {};
Object.keys(baseSizes).forEach(key => {
  fontStyleBold[key] = {
    fontSize: fontSize[key],
    fontFamily: FONTS.ALMARAI.BOLD,
  };
});

// نسخة سميكة جدًا من كل حجم
export const fontStyleExtraBold = {};
Object.keys(baseSizes).forEach(key => {
  fontStyleExtraBold[key] = {
    fontSize: fontSize[key],
    fontFamily: FONTS.ALMARAI.EXTRA_BOLD,
  };
});

// -------------------------------------------------------------------------
// تصدير كل شيء
// -------------------------------------------------------------------------

export default {
  FONTS,
  FONT_WEIGHTS,
  FONT_SCALE,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_WEIGHT,
  baseSizes,
  fontSize,
  fontStyle,
  fontStyleLight,
  fontStyleBold,
  fontStyleExtraBold,
}; 