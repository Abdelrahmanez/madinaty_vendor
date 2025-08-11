# مكونات النص والخطوط في التطبيق

## الخط الافتراضي للتطبيق

تم تطبيق خط `SpaceMono-Regular` كخط افتراضي في جميع أنحاء التطبيق. يتم تطبيق هذا الخط من خلال:

1. **المكونات الأساسية**: تم تعديل `Text` و `TextInput` الأساسية لاستخدام الخط افتراضيًا
2. **تنسيق React Native Paper**: تم ضبط جميع خطوط مكتبة Paper لاستخدام نفس الخط
3. **مكونات مخصصة**: تم إنشاء مكونات نصية مخصصة لضمان التناسق

## استخدام المكونات النصية المخصصة

للحفاظ على اتساق الخطوط في التطبيق، يرجى استخدام المكونات النصية المخصصة بدلًا من مكون `Text` المباشر:

```jsx
import AppText, { AppHeading, AppSubheading, AppParagraph, AppCaption } from '../components/AppText';

// للعناوين الرئيسية
<AppHeading>عنوان رئيسي</AppHeading>

// للعناوين الفرعية
<AppSubheading>عنوان فرعي</AppSubheading>

// للفقرات
<AppParagraph>نص طويل يحتوي على فقرة كاملة...</AppParagraph>

// للنصوص الصغيرة
<AppCaption>نص توضيحي صغير</AppCaption>

// للنصوص العادية مع خيارات التنسيق
<AppText style={{ color: 'red' }}>نص عادي بلون أحمر</AppText>
```

## استخدام الأزرار المخصصة

وبالمثل، استخدم مكونات الأزرار المخصصة للحفاظ على اتساق الخطوط في الأزرار:

```jsx
import AppButton, { PrimaryButton, SecondaryButton, TextButton } from '../components/AppButton';

// الزر الأساسي
<PrimaryButton onPress={handlePress}>زر أساسي</PrimaryButton>

// الزر الثانوي
<SecondaryButton onPress={handlePress}>زر ثانوي</SecondaryButton>

// زر النص
<TextButton onPress={handlePress}>زر نص</TextButton>

// زر مخصص
<AppButton 
  mode="contained" 
  onPress={handlePress}
  style={{ borderRadius: 20 }}
>
  زر مخصص
</AppButton>
```

## تغيير الخط المستخدم

إذا كنت ترغب في تغيير الخط الافتراضي للتطبيق، قم بتعديل الملف `src/theme/fontSizes.js` وتغيير قيمة `DEFAULT_FONT_FAMILY`. 
هذا سيؤدي إلى تطبيق الخط الجديد في جميع أنحاء التطبيق. 