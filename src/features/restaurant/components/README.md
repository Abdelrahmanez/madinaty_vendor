# RestaurantStatus Component

## الوصف
مكون أفقي مضغوط يعرض حالة المطعم (مفتوح/مقفل) مع إمكانية تغيير الحالة.

## الموقع الجديد
تم نقل المكون من `features/home/components/` إلى `features/restaurant/components/` لتحسين التنظيم.

## الميزات
✅ **تصميم أفقي مضغوط** - يأخذ مساحة أقل عمودياً  
✅ **صف واحد** - جميع العناصر في خط أفقي واحد  
✅ **أيقونات صغيرة** - حجم 24x24 بدلاً من 40x40  
✅ **زر مضغوط** - ارتفاع 32 بدلاً من 48  
✅ **مسافات محسنة** - padding أقل و margins محسنة  

## التخطيط الأفقي
```
[اسم المطعم] [🔴] [مفتوح] [زر التغيير]
```

## الاستخدام
```jsx
import { RestaurantStatus } from '../../../restaurant/components';

// في الشاشة
<RestaurantStatus />
```

## المتطلبات
- `useGetRestaurant` hook
- `useUpdateRestaurant` hook  
- `useAlertStore`
- `MaterialCommunityIcons`

## البيانات المطلوبة
- `restaurant.id` - معرف المطعم
- `restaurant.name` - اسم المطعم
- `restaurant.isOpen` - حالة المطعم (boolean)

## التصميم
- **أفقي**: جميع العناصر في صف واحد
- **مضغوط**: ارتفاع أقل ومساحات محسنة
- **أيقونات صغيرة**: 24x24 بدلاً من 40x40
- **زر مضغوط**: 60x32 بدلاً من 80x36
