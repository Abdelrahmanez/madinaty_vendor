# ميزة إدارة مناطق التوصيل للمطعم

## نظرة عامة

تم تطوير ميزة كاملة لإدارة مناطق التوصيل للمطعم مع إعادة استخدام المكونات الموجودة في المشروع. الميزة تتيح للمطعم إدارة أسعار التوصيل للمناطق المختلفة والتحقق من صحة الإعدادات.

## الهيكل التنظيمي

```
src/features/deliveryZones/
├── api/
│   └── deliveryZonesApi.js          # API functions للمطعم
├── components/
│   ├── ZoneCard.js                  # بطاقة عرض منطقة التوصيل
│   ├── ZoneForm.js                  # نموذج إضافة/تعديل منطقة (للإدارة)
│   └── PriceForm.js                 # نموذج تعديل سعر المنطقة
├── hooks/
│   └── useDeliveryZonesManagement.js # Hook إدارة الحالة
├── screens/
│   └── DeliveryZonesManagementScreen.js # الشاشة الرئيسية
└── index.js                         # تصدير المكونات
```

## API Endpoints المستخدمة

### جلب مناطق التوصيل للمطعم
```
GET: API_ENDPOINTS.DELIVERY_ZONES.RESTAURANT_ZONES
```

**مثال للبيانات المُرجعة:**
```json
{
  "status": "success",
  "results": 3,
  "data": [
    {
      "_id": "68a4555c18a1d6992c3a20c2",
      "restaurant": "687d200c654033ec856ade96",
      "deliveryZone": {
        "_id": "687d2006654033ec856ade65",
        "name": "Downtown",
        "description": "Central area",
        "isActive": true,
        "id": "687d2006654033ec856ade65"
      },
      "deliveryPrice": 10,
      "isActive": true,
      "createdAt": "2025-08-19T10:43:40.233Z",
      "updatedAt": "2025-08-19T10:43:40.233Z",
      "id": "68a4555c18a1d6992c3a20c2"
    },
    {
      "_id": "68a4555c18a1d6992c3a20c3",
      "restaurant": "687d200c654033ec856ade96",
      "deliveryZone": {
        "_id": "687d2006654033ec856ade66",
        "name": "Suburbs",
        "description": "Outer ring",
        "isActive": true,
        "id": "687d2006654033ec856ade66"
      },
      "deliveryPrice": 10,
      "isActive": true,
      "createdAt": "2025-08-19T10:43:40.642Z",
      "updatedAt": "2025-08-19T10:43:40.642Z",
      "id": "68a4555c18a1d6992c3a20c3"
    },
    {
      "_id": "68a4555d18a1d6992c3a20c4",
      "restaurant": "687d200c654033ec856ade96",
      "deliveryZone": {
        "_id": "687d2006654033ec856ade67",
        "name": "Closed Zone",
        "description": "Temporarily unavailable",
        "isActive": false,
        "id": "687d2006654033ec856ade67"
      },
      "deliveryPrice": 10,
      "isActive": true,
      "createdAt": "2025-08-19T10:43:41.928Z",
      "updatedAt": "2025-08-19T10:43:41.928Z",
      "id": "68a4555d18a1d6992c3a20c4"
    }
  ]
}
```

### تعيين سعر لمنطقة توصيل
```
POST: API_ENDPOINTS.DELIVERY_ZONES.SET_ZONE_PRICE
Body: { zoneId, price }
```

**مثال للبيانات المُرسلة:**
```json
{
  "zoneId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "price": 20.00
}
```

**مثال للاستجابة:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "وسط البلد",
    "price": 20.00,
    "updatedAt": "2023-09-06T15:30:00.000Z"
  },
  "message": "تم تعيين سعر المنطقة بنجاح"
}
```

### تحديث سعر منطقة توصيل
```
PUT: API_ENDPOINTS.DELIVERY_ZONES.UPDATE_ZONE_PRICE(zoneId)
Body: { price }
```

**مثال للبيانات المُرسلة:**
```json
{
  "price": 18.50
}
```

**مثال للاستجابة:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "وسط البلد",
    "price": 18.50,
    "updatedAt": "2023-09-06T16:00:00.000Z"
  },
  "message": "تم تحديث سعر المنطقة بنجاح"
}
```

### إلغاء تفعيل منطقة توصيل
```
PATCH: API_ENDPOINTS.DELIVERY_ZONES.DEACTIVATE_ZONE
Body: { zoneId }
```

**مثال للبيانات المُرسلة:**
```json
{
  "zoneId": "64f8a1b2c3d4e5f6a7b8c9d2"
}
```

**مثال للاستجابة:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "name": "المعادي",
    "isActive": false,
    "updatedAt": "2023-09-06T17:00:00.000Z"
  },
  "message": "تم إلغاء تفعيل المنطقة بنجاح"
}
```

### التحقق من صحة مناطق التوصيل
```
GET: API_ENDPOINTS.DELIVERY_ZONES.VALIDATE_RESTAURANT_ZONES
```

**مثال للاستجابة (جميع المناطق صحيحة):**
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "totalZones": 3,
    "activeZones": 2,
    "pricedZones": 2,
    "unpricedZones": 0,
    "message": "جميع المناطق النشطة مسعرة بشكل صحيح"
  }
}
```

**مثال للاستجابة (يوجد مشاكل):**
```json
{
  "success": true,
  "data": {
    "isValid": false,
    "totalZones": 3,
    "activeZones": 2,
    "pricedZones": 1,
    "unpricedZones": 1,
    "unpricedZoneNames": ["مدينة نصر"],
    "message": "يوجد منطقة نشطة واحدة غير مسعرة"
  }
}
```

## المكونات

### 1. DeliveryZonesManagementScreen
الشاشة الرئيسية لإدارة مناطق التوصيل للمطعم تتضمن:
- **شريط البحث**: للبحث في المناطق
- **زر التحقق من الصحة**: للتحقق من أن جميع المناطق النشطة مسعرة
- **حالة التحقق**: عرض نتيجة التحقق من صحة المناطق
- **إحصائيات سريعة**: عرض إجمالي المناطق، المناطق النشطة، والمناطق المسعرة
- **قائمة المناطق**: عرض جميع المناطق مع إمكانية تعديل السعر وإلغاء التفعيل
- **تحديث السحب**: لتحميل البيانات من جديد

### 2. ZoneCard
بطاقة عرض منطقة التوصيل للمطعم تتضمن:
- **اسم المنطقة**: مع أيقونة الموقع
- **حالة المنطقة**: نشط/غير نشط مع chip ملون
- **الوصف**: وصف المنطقة (إذا كان موجود)
- **سعر التوصيل**: عرض السعر أو رسالة "لم يتم تعيين سعر"
- **وقت التوصيل**: وقت التوصيل المتوقع
- **إحداثيات المنطقة**: إحداثيات المنطقة (إذا كانت متاحة)
- **أزرار التحكم**: تعديل السعر، إلغاء التفعيل

### 3. PriceForm
نموذج تعديل سعر منطقة التوصيل يتضمن:
- **معلومات المنطقة**: اسم ووصف المنطقة
- **حقل السعر**: إدخال سعر التوصيل مع التحقق من الصحة
- **معلومات إضافية**: توضيح أن السعر سيتم تطبيقه على جميع الطلبات
- **أزرار التحكم**: حفظ السعر أو إلغاء

## هيكل البيانات

### نموذج منطقة التوصيل (Zone Model)
```typescript
interface DeliveryZone {
  _id: string;                    // معرف المنطقة الفريد
  name: string;                   // اسم المنطقة
  description?: string;           // وصف المنطقة (اختياري)
  isActive: boolean;              // حالة المنطقة (نشط/غير نشط)
  deliveryTime: number;           // وقت التوصيل بالدقائق
  coordinates?: {                 // إحداثيات المنطقة (اختياري)
    latitude: number;
    longitude: number;
  };
  radius?: number;                // نصف قطر المنطقة بالكيلومترات (اختياري)
  price?: number;                 // سعر التوصيل (اختياري - للمطعم)
  restaurantId: string;           // معرف المطعم
  createdAt: string;              // تاريخ الإنشاء
  updatedAt: string;              // تاريخ آخر تحديث
  // بيانات إضافية من الهيكل الجديد
  deliveryZoneId: string;         // معرف منطقة التوصيل الأساسية
  restaurantDeliveryZoneId: string; // معرف منطقة التوصيل للمطعم
  isRestaurantZoneActive: boolean;  // حالة منطقة التوصيل للمطعم
}
```

### نموذج استجابة API (API Response)
```typescript
interface RestaurantDeliveryZoneResponse {
  status: string;                 // حالة الاستجابة
  results: number;                // عدد النتائج
  data: RestaurantDeliveryZone[]; // قائمة مناطق التوصيل
}

interface RestaurantDeliveryZone {
  _id: string;                    // معرف منطقة التوصيل للمطعم
  restaurant: string;             // معرف المطعم
  deliveryZone: {                 // معلومات منطقة التوصيل الأساسية
    _id: string;
    name: string;
    description: string;
    isActive: boolean;
    id: string;
  };
  deliveryPrice: number;          // سعر التوصيل
  isActive: boolean;              // حالة منطقة التوصيل للمطعم
  createdAt: string;              // تاريخ الإنشاء
  updatedAt: string;              // تاريخ آخر تحديث
  id: string;                     // معرف إضافي
}
```

## تحويل البيانات

### تحويل من API إلى المكونات
يتم تحويل البيانات من هيكل `RestaurantDeliveryZone` إلى هيكل `DeliveryZone` في hook إدارة الحالة:

```javascript
// تحويل البيانات من هيكل restaurantDeliveryZones إلى هيكل deliveryZone
const transformedZones = response.data.map(item => ({
  _id: item._id,
  name: item.deliveryZone?.name || 'منطقة بدون اسم',
  description: item.deliveryZone?.description || '',
  isActive: item.deliveryZone?.isActive || false,
  deliveryTime: 30, // قيمة افتراضية
  coordinates: null, // قيمة افتراضية
  radius: 5, // قيمة افتراضية
  price: item.deliveryPrice || null,
  restaurantId: item.restaurant || '',
  createdAt: item.createdAt || '',
  updatedAt: item.updatedAt || '',
  // بيانات إضافية من الهيكل الجديد
  deliveryZoneId: item.deliveryZone?._id || '',
  restaurantDeliveryZoneId: item._id || '',
  isRestaurantZoneActive: item.isActive || false
}));
```

### منطق عرض الحالة
يتم عرض حالة المنطقة بناءً على:
- `zone.isActive`: حالة منطقة التوصيل الأساسية
- `zone.isRestaurantZoneActive`: حالة منطقة التوصيل للمطعم

```javascript
// المنطقة تعتبر نشطة إذا كانت كل من المنطقة الأساسية ومنطقة المطعم نشطة
const isZoneActive = zone.isActive && zone.isRestaurantZoneActive;
```

## Hook إدارة الحالة
