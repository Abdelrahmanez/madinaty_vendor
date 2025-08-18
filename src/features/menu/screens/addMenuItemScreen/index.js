import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Text, Button, TextInput, HelperText, Switch, Divider, Chip, SegmentedButtons, ActivityIndicator } from 'react-native-paper';
import TopBar from '../../../../components/TopBar';
import ImageUploader from '../../../../components/ImageUploader';
import { fetchCategories } from '../../api/categories';
import { getRestaurantAddons } from '../../api/addons';
import { createDish, updateDishOffer } from '../../api/dish';
import useRestaurantStore from '../../../../stores/restaurantStore';
import useAlertStore from '../../../../stores/alertStore';
import OfferManager from '../../components/OfferManager';
import { normalizeNumericString } from '../../../../utils/numberUtils';

const AddMenuItemScreen = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { restaurant, fetchMyRestaurant, getRestaurantId } = useRestaurantStore();
  const triggerAlert = useAlertStore((s) => s.triggerAlert);

  // Form state
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [images, setImages] = useState([]);
  const [sizes, setSizes] = useState([{ name: '', price: '', currentStock: '' }]);
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState([]);
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [unitType, setUnitType] = useState('piece');
  const [isAvailable, setIsAvailable] = useState(true);
  const [extraDeliveryFee, setExtraDeliveryFee] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState('');
  const [allowedAddons, setAllowedAddons] = useState([]);
  const [offer, setOffer] = useState(null); // Will be applied after creation if provided

  // Reference data
  const [dishCategories, setDishCategories] = useState([]);
  const [restaurantAddons, setRestaurantAddons] = useState([]);

  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    (async () => {
      setLoading(true);
      try {
        if (!restaurant?._id) {
          await fetchMyRestaurant();
        }
        const restaurantId = getRestaurantId();
        const categories = await fetchCategories('meal');
        setDishCategories(Array.isArray(categories) ? categories : []);
        if (restaurantId) {
          const addonsRes = await getRestaurantAddons(restaurantId);
          setRestaurantAddons(addonsRes?.data?.data || addonsRes?.data || []);
        }
      } catch (e) {
        console.error('Error loading refs:', e?.response?.data || e?.message || e);
        triggerAlert && triggerAlert('error', 'تعذر تحميل البيانات المرجعية. حاول لاحقاً.', { autoClose: true, duration: 4000, showIcon: true });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addSize = useCallback(() => {
    setSizes((prev) => [...prev, { name: '', price: '', currentStock: '' }]);
  }, []);

  const updateSize = useCallback((index, field, value) => {
    setSizes((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }, []);

  const removeSize = useCallback((index) => {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const addTag = useCallback(() => {
    const trimmed = (tagsInput || '').trim();
    if (!trimmed) return;
    setTags((prev) => Array.from(new Set([...prev, trimmed])));
    setTagsInput('');
  }, [tagsInput]);

  const removeTag = useCallback((tag) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const addIngredient = useCallback(() => {
    const trimmed = (ingredientsInput || '').trim();
    if (!trimmed) return;
    setIngredients((prev) => Array.from(new Set([...prev, trimmed])));
    setIngredientsInput('');
  }, [ingredientsInput]);

  const removeIngredient = useCallback((ing) => {
    setIngredients((prev) => prev.filter((t) => t !== ing));
  }, []);

  const toggleAddon = useCallback((id) => {
    setAllowedAddons((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  // Using shared normalizer from utils

  const isNameValid = name.trim().length >= 2 && name.trim().length <= 100;
  const isCategoryValid = !!categoryId;
  const isDescriptionValid = description.trim().length > 0;
  // Accept either main imageUrl or at least one gallery image
  const isImageUrlValid = (imageUrl && String(imageUrl).trim().length > 0) || (images && images.length > 0);
  const normalizedSizes = useMemo(() =>
    sizes
      .map((s) => ({
        name: s.name?.trim(),
        price: (() => {
          const normalized = normalizeNumericString(s.price);
          const num = parseFloat(normalized);
          return isNaN(num) ? null : num;
        })(),
        currentStock: (() => {
          if (s.currentStock === '' || s.currentStock === undefined || s.currentStock === null) return undefined;
          const normalized = normalizeNumericString(s.currentStock);
          const num = parseInt(normalized, 10);
          return isNaN(num) ? undefined : num;
        })(),
      }))
      .filter((s) => s.name && s.name.length > 0 && s.price !== null)
  , [sizes, normalizeNumericString]);
  const isSizesValid = normalizedSizes.length > 0;

  const canSubmit = isNameValid && isCategoryValid && isDescriptionValid && isImageUrlValid && isSizesValid;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) {
      triggerAlert && triggerAlert('warning', 'يرجى إكمال الحقول المطلوبة', { autoClose: true, duration: 3000, showIcon: true });
      return;
    }

    try {
      setSubmitting(true);
      const restaurantId = getRestaurantId();
      const resolvedImageUrl = (imageUrl && String(imageUrl).trim().length > 0)
        ? String(imageUrl).trim()
        : (images && images.length > 0 ? images[0] : '');

      const payload = {
        name: name.trim(),
        restaurant: restaurantId,
        category: categoryId,
        description: description.trim(),
        imageUrl: resolvedImageUrl,
        sizes: normalizedSizes,
        tags,
        unitType,
        isAvailable,
        extraDeliveryFee: extraDeliveryFee === '' ? undefined : parseFloat(extraDeliveryFee),
        ingredients,
        isFeatured,
        allowedAddons,
        displayOrder: displayOrder === '' ? undefined : parseInt(displayOrder, 10),
        // images are optional array of strings (URIs); backend also supports processing uploaded files separately
        images,
      };

      const res = await createDish(payload);
      const createdId = res?.data?.data?._id || res?.data?._id;

      // If offer is prepared, attach it after creation
      if (offer && createdId) {
        try {
          await updateDishOffer(createdId, offer);
        } catch (offerErr) {
          console.error('Failed to attach offer:', offerErr?.response?.data || offerErr?.message || offerErr);
        }
      }
      triggerAlert && triggerAlert('success', 'تم إنشاء العنصر بنجاح', { autoClose: true, duration: 2500, showIcon: true });
      navigation.goBack();
      return res;
    } catch (e) {
      const msg = e?.response?.data?.message || 'تعذر إنشاء العنصر. تحقق من البيانات والمحاولة لاحقاً.';
      triggerAlert && triggerAlert('error', msg, { autoClose: true, duration: 4500, showIcon: true });
      console.error('Create dish error:', e?.response?.data || e?.message || e);
    } finally {
      setSubmitting(false);
    }
  }, [allowedAddons, canSubmit, categoryId, description, displayOrder, extraDeliveryFee, getRestaurantId, imageUrl, images, ingredients, isAvailable, isFeatured, name, navigation, normalizedSizes, tags, triggerAlert, unitType]);

  return (
    <View style={styles.container}>
      <TopBar
        title="إضافة عنصر جديد"
        showBackButton={true}
        backgroundColor={theme.colors.primary}
        titleColor={theme.colors.onPrimary}
        onBackPress={() => navigation.goBack()}
      />
      
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8 }}>جاري تحميل البيانات...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>تفاصيل العنصر</Text>

          <TextInput
            mode="outlined"
            label="اسم العنصر"
            value={name}
            onChangeText={setName}
            error={!isNameValid && name.length > 0}
            style={styles.input}
          />
          <HelperText type="info">المطلوب: 2–100 حرف</HelperText>

          <TextInput
            mode="outlined"
            label="الوصف"
            value={description}
            onChangeText={setDescription}
            multiline
            style={styles.input}
          />

          <Text style={styles.sectionTitle}>الصورة الرئيسية</Text>
          <ImageUploader
            label="الصورة الرئيسية"
            helperText="أدخل رابط صورة أو اختر من الجهاز (يفضل رابط خارجي)"
            multiple={false}
            value={imageUrl}
            onChange={setImageUrl}
            compact
          />

          <Text style={styles.sectionTitle}>صور إضافية (اختياري)</Text>
          <ImageUploader
            label="صور إضافية"
            helperText="يمكنك إضافة حتى 5 صور كحد أقصى"
            multiple
            max={5}
            value={images}
            onChange={setImages}
            compact
          />

          <Text style={styles.sectionTitle}>التصنيف</Text>
          <View style={styles.chipsRow}>
            {dishCategories.map((cat) => (
              <Chip
                key={cat._id}
                selected={categoryId === cat._id}
                onPress={() => setCategoryId(cat._id)}
                style={styles.chip}
              >
                {cat.name}
              </Chip>
            ))}
          </View>
          {!isCategoryValid && (
            <HelperText type="error">يرجى اختيار تصنيف</HelperText>
          )}

          <Divider style={styles.divider} />
          <Text style={styles.sectionTitle}>العرض (اختياري)</Text>
          <OfferManager
            dishId={null}
            currentOffer={offer}
            onSaveOffer={async (offerData) => {
              setOffer(offerData);
            }}
            onDeleteOffer={async () => {
              setOffer(null);
            }}
          />

          <Divider style={styles.divider} />
          <Text style={styles.sectionTitle}>الأحجام والأسعار</Text>
          {sizes.map((s, idx) => (
            <View key={idx} style={styles.sizeRow}>
              <TextInput
                mode="outlined"
                label="اسم الحجم"
                value={s.name}
                onChangeText={(t) => updateSize(idx, 'name', t)}
                style={[styles.input, styles.sizeInput]}
              />
              <TextInput
                mode="outlined"
                label="السعر"
                value={String(s.price)}
                onChangeText={(t) => updateSize(idx, 'price', t)}
                keyboardType="numeric"
                style={[styles.input, styles.sizeInput]}
              />
              <TextInput
                mode="outlined"
                label="المخزون (اختياري)"
                value={String(s.currentStock)}
                onChangeText={(t) => updateSize(idx, 'currentStock', t)}
                keyboardType="numeric"
                style={[styles.input, styles.sizeInput]}
              />
              <Button mode="text" onPress={() => removeSize(idx)} disabled={sizes.length <= 1}>حذف</Button>
            </View>
          ))}
          <Button mode="outlined" onPress={addSize} icon="plus">إضافة حجم</Button>
          {!isSizesValid && (
            <HelperText type="error">يجب إضافة حجم واحد على الأقل مع اسم وسعر صحيحين</HelperText>
          )}

          <Divider style={styles.divider} />
          <Text style={styles.sectionTitle}>الوسوم</Text>
          <View style={styles.inlineRow}>
            <TextInput
              mode="outlined"
              placeholder="وسم جديد"
              value={tagsInput}
              onChangeText={setTagsInput}
              style={[styles.input, { flex: 1 }]}
            />
            <Button mode="contained" onPress={addTag} disabled={!tagsInput.trim()}>إضافة</Button>
          </View>
          <View style={styles.chipsRow}>
            {tags.map((t) => (
              <Chip key={t} onClose={() => removeTag(t)} style={styles.chip}>{t}</Chip>
            ))}
          </View>

          <Text style={styles.sectionTitle}>المكونات</Text>
          <View style={styles.inlineRow}>
            <TextInput
              mode="outlined"
              placeholder="مكون جديد"
              value={ingredientsInput}
              onChangeText={setIngredientsInput}
              style={[styles.input, { flex: 1 }]}
            />
            <Button mode="contained" onPress={addIngredient} disabled={!ingredientsInput.trim()}>إضافة</Button>
          </View>
          <View style={styles.chipsRow}>
            {ingredients.map((t) => (
              <Chip key={t} onClose={() => removeIngredient(t)} style={styles.chip}>{t}</Chip>
            ))}
          </View>

          <Divider style={styles.divider} />
          <Text style={styles.sectionTitle}>نوع الوحدة</Text>
          <SegmentedButtons
            value={unitType}
            onValueChange={setUnitType}
            buttons={[
              { value: 'piece', label: 'قطعة' },
              { value: 'kg', label: 'كجم' },
              { value: 'liter', label: 'لتر' },
              { value: 'portion', label: 'حصة' },
              { value: 'other', label: 'أخرى' },
            ]}
            style={{ marginBottom: 8 }}
          />

          <View style={styles.switchRow}>
            <Text>متاح للبيع</Text>
            <Switch value={isAvailable} onValueChange={setIsAvailable} />
          </View>

          <View style={styles.inlineRow}>
            <TextInput
              mode="outlined"
              label="رسوم توصيل إضافية (اختياري)"
              value={String(extraDeliveryFee)}
              onChangeText={setExtraDeliveryFee}
              keyboardType="numeric"
              style={[styles.input, { flex: 1 }]}
            />
            <TextInput
              mode="outlined"
              label="ترتيب العرض (اختياري)"
              value={String(displayOrder)}
              onChangeText={setDisplayOrder}
              keyboardType="numeric"
              style={[styles.input, { flex: 1 }]}
            />
          </View>

          <View style={styles.switchRow}>
            <Text>تميز العنصر</Text>
            <Switch value={isFeatured} onValueChange={setIsFeatured} />
          </View>

          <Divider style={styles.divider} />
          <Text style={styles.sectionTitle}>الإضافات (Addons)</Text>
          <View style={styles.chipsRow}>
            {restaurantAddons.map((ad) => (
              <Chip
                key={ad._id}
                selected={allowedAddons.includes(ad._id)}
                onPress={() => toggleAddon(ad._id)}
                style={styles.chip}
              >
                {ad.name}
              </Chip>
            ))}
          </View>

          <Divider style={styles.divider} />
        <Button 
          mode="contained" 
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting || !canSubmit}
            style={styles.submitBtn}
          >
            إنشاء العنصر
        </Button>
          {!canSubmit && (
            <HelperText type="error">تحقق من الحقول المطلوبة قبل الإرسال</HelperText>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const createStyles = (theme, insets) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: insets.bottom + 24,
    paddingTop: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    marginBottom: 12,
    textAlign: 'right',
  },
  input: {
    marginBottom: 8,
  },
  sectionTitle: {
    marginTop: 12,
    marginBottom: 6,
    color: theme.colors.primary,
    fontWeight: '600',
    textAlign: 'right',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    marginRight: 6,
    marginBottom: 6,
  },
  divider: {
    marginVertical: 12,
  },
  sizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sizeInput: {
    flex: 1,
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  switchRow: {
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submitBtn: {
    marginTop: 8,
  },
});

export default AddMenuItemScreen;

