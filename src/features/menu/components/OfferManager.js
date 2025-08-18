import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, Text, Card, Button, TextInput, Switch, SegmentedButtons } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const OfferManager = ({ 
  dishId, 
  currentOffer = null, 
  onSaveOffer, 
  onDeleteOffer,
  onRefresh 
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Form state
  const [type, setType] = useState(currentOffer?.type || 'percentage');
  const [value, setValue] = useState(currentOffer?.value?.toString() || '');
  const [description, setDescription] = useState(currentOffer?.description || '');
  const [isActive, setIsActive] = useState(currentOffer?.isActive ?? true);
  const [startDate, setStartDate] = useState(currentOffer?.startDate ? new Date(currentOffer.startDate) : new Date());
  const [endDate, setEndDate] = useState(currentOffer?.endDate ? new Date(currentOffer.endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  
  // Date picker states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleSaveOffer = async () => {
    if (!value.trim() || !description.trim()) return;

    setLoading(true);
    try {
      const offerData = {
        type,
        value: parseFloat(value),
        description: description.trim(),
        isActive,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      await onSaveOffer(offerData);
      setShowForm(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error saving offer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOffer = async () => {
    setDeleteLoading(true);
    try {
      await onDeleteOffer();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error deleting offer:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const isValid = value.trim() && description.trim() && parseFloat(value) > 0 && endDate > startDate;

  const formatDate = (date) => {
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card style={styles.container}>
      <Card.Content>
        <View style={styles.header}>
          <MaterialCommunityIcons 
            name="tag-multiple" 
            size={24} 
            color={theme.colors.primary} 
          />
          <Text variant="titleMedium" style={styles.title}>
            إدارة العروض
          </Text>
        </View>

        {/* Current Offer Display */}
        {currentOffer && !showForm && (
          <View style={styles.currentOffer}>
            <Text variant="titleSmall" style={styles.sectionTitle}>
              العرض الحالي
            </Text>
            <View style={styles.offerInfo}>
              <Text variant="bodyMedium">
                {currentOffer.type === 'percentage' ? 'خصم' : 'تخفيض'} {currentOffer.value}
                {currentOffer.type === 'percentage' ? '%' : ' ج.م'}
              </Text>
              <Text variant="bodySmall" style={styles.offerDescription}>
                {currentOffer.description}
              </Text>
              <Text variant="bodySmall" style={styles.offerDates}>
                من {formatDate(new Date(currentOffer.startDate))} إلى {formatDate(new Date(currentOffer.endDate))}
              </Text>
              <View style={styles.offerStatus}>
                <Text variant="bodySmall">
                  الحالة: {currentOffer.isActive ? 'نشط' : 'غير نشط'}
                </Text>
                <Switch
                  value={currentOffer.isActive}
                  onValueChange={() => {}} // Read-only in display mode
                  disabled
                />
              </View>
            </View>
            <View style={styles.offerActions}>
              <Button
                mode="outlined"
                onPress={() => setShowForm(true)}
                icon="pencil"
                style={styles.editButton}
              >
                تعديل
              </Button>
              <Button
                mode="outlined"
                onPress={handleDeleteOffer}
                loading={deleteLoading}
                disabled={deleteLoading}
                icon="delete"
                style={styles.deleteButton}
                textColor={theme.colors.error}
              >
                حذف
              </Button>
            </View>
          </View>
        )}

        {/* Add/Edit Form */}
        {(!currentOffer || showForm) && (
          <View style={styles.form}>
            <View style={styles.formHeader}>
              <Text variant="titleSmall" style={styles.sectionTitle}>
                {currentOffer ? 'تعديل العرض' : 'إضافة عرض جديد'}
              </Text>
              {currentOffer && (
                <Button
                  mode="outlined"
                  onPress={() => setShowForm(false)}
                  icon="close"
                  compact
                >
                  إلغاء
                </Button>
              )}
            </View>

            <SegmentedButtons
              value={type}
              onValueChange={setType}
              buttons={[
                { value: 'percentage', label: 'نسبة مئوية' },
                { value: 'fixed_amount', label: 'مبلغ ثابت' }
              ]}
              style={styles.segmentedButtons}
            />

            <TextInput
              label={type === 'percentage' ? 'نسبة الخصم (%)' : 'مبلغ التخفيض (ج.م)'}
              value={value}
              onChangeText={setValue}
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
              right={<TextInput.Icon icon={type === 'percentage' ? "percent" : "currency-usd"} />}
            />

            <TextInput
              label="وصف العرض"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={2}
              right={<TextInput.Icon icon="text" />}
            />

            <View style={styles.dateSection}>
              <Text variant="bodyMedium" style={styles.dateLabel}>تاريخ البداية:</Text>
              <Button
                mode="outlined"
                onPress={() => setShowStartDatePicker(true)}
                icon="calendar"
                style={styles.dateButton}
              >
                {formatDate(startDate)}
              </Button>
            </View>

            <View style={styles.dateSection}>
              <Text variant="bodyMedium" style={styles.dateLabel}>تاريخ الانتهاء:</Text>
              <Button
                mode="outlined"
                onPress={() => setShowEndDatePicker(true)}
                icon="calendar"
                style={styles.dateButton}
              >
                {formatDate(endDate)}
              </Button>
            </View>

            <View style={styles.switchSection}>
              <Text variant="bodyMedium">تفعيل العرض:</Text>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                color={theme.colors.primary}
              />
            </View>

            <View style={styles.formActions}>
              <Button
                mode="contained"
                onPress={handleSaveOffer}
                loading={loading}
                disabled={loading || !isValid}
                icon="content-save"
                style={styles.saveButton}
              >
                {currentOffer ? 'حفظ التغييرات' : 'إضافة العرض'}
              </Button>
            </View>
          </View>
        )}

        {/* Add New Offer Button */}
        {!currentOffer && !showForm && (
          <Button
            mode="contained"
            onPress={() => setShowForm(true)}
            icon="plus"
            style={styles.addButton}
          >
            إضافة عرض جديد
          </Button>
        )}

        {/* Date Pickers */}
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            onChange={(event, selectedDate) => {
              setShowStartDatePicker(false);
              if (selectedDate) setStartDate(selectedDate);
            }}
          />
        )}

        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            onChange={(event, selectedDate) => {
              setShowEndDatePicker(false);
              if (selectedDate) setEndDate(selectedDate);
            }}
          />
        )}
      </Card.Content>
    </Card>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  title: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  currentOffer: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: theme.colors.onSurface,
    fontWeight: '600',
    marginBottom: 12,
  },
  offerInfo: {
    backgroundColor: theme.colors.surfaceVariant,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  offerDescription: {
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  offerDates: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  offerStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
    borderColor: theme.colors.primary,
  },
  deleteButton: {
    flex: 1,
    borderColor: theme.colors.error,
  },
  form: {
    gap: 16,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  input: {
    marginBottom: 8,
  },
  dateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateLabel: {
    flex: 1,
  },
  dateButton: {
    flex: 1,
    marginLeft: 12,
  },
  switchSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  formActions: {
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    marginTop: 8,
  },
});

export default OfferManager;
