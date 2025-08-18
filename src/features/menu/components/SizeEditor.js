import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, TextInput, Button, Card, Text, Switch } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SizeEditor = ({ 
  size, 
  onSave, 
  onCancel, 
  onUpdateStock,
  isEditing = false,
  dishId 
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  
  const [name, setName] = useState(size?.name || '');
  const [price, setPrice] = useState(size?.price?.toString() || '');
  const [currentStock, setCurrentStock] = useState(size?.currentStock?.toString() || '');
  const [loading, setLoading] = useState(false);
  const [stockLoading, setStockLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !price.trim() || !currentStock.trim()) {
      return;
    }

    setLoading(true);
    try {
      const data = {
        name: name.trim(),
        price: parseFloat(price),
        currentStock: parseInt(currentStock)
      };

      await onSave(data);
    } catch (error) {
      console.error('Error saving size:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async () => {
    if (!currentStock.trim()) return;

    setStockLoading(true);
    try {
      await onUpdateStock(parseInt(currentStock));
    } catch (error) {
      console.error('Error updating stock:', error);
    } finally {
      setStockLoading(false);
    }
  };

  const isValid = name.trim() && price.trim() && currentStock.trim() && 
                 parseFloat(price) > 0 && parseInt(currentStock) >= 0;

  return (
    <Card style={styles.container}>
      <Card.Content>
        <View style={styles.header}>
          <MaterialCommunityIcons 
            name="ruler" 
            size={24} 
            color={theme.colors.primary} 
          />
          <Text variant="titleMedium" style={styles.title}>
            {isEditing ? 'تعديل الحجم' : 'إضافة حجم جديد'}
          </Text>
        </View>

        <TextInput
          label="اسم الحجم"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
          right={<TextInput.Icon icon="tag" />}
        />

        <TextInput
          label="السعر (ج.م)"
          value={price}
          onChangeText={setPrice}
          style={styles.input}
          mode="outlined"
          keyboardType="numeric"
          right={<TextInput.Icon icon="currency-usd" />}
        />

        <TextInput
          label="المخزون الحالي"
          value={currentStock}
          onChangeText={setCurrentStock}
          style={styles.input}
          mode="outlined"
          keyboardType="numeric"
          right={<TextInput.Icon icon="package-variant" />}
        />

        <View style={styles.actions}>
          {isEditing && (
            <Button
              mode="outlined"
              onPress={handleStockUpdate}
              loading={stockLoading}
              disabled={stockLoading || !currentStock.trim()}
              style={[styles.button, styles.stockButton]}
              icon="package-variant-closed"
            >
              تحديث المخزون
            </Button>
          )}
          
          <Button
            mode="contained"
            onPress={handleSave}
            loading={loading}
            disabled={loading || !isValid}
            style={[styles.button, styles.saveButton]}
            icon="content-save"
          >
            {isEditing ? 'حفظ التغييرات' : 'إضافة الحجم'}
          </Button>

          <Button
            mode="outlined"
            onPress={onCancel}
            disabled={loading}
            style={[styles.button, styles.cancelButton]}
            icon="close"
          >
            إلغاء
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    marginVertical: 8,
    // marginHorizontal: 16,
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
  input: {
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    gap: 8,
  },
  button: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  cancelButton: {
    borderColor: theme.colors.outline,
  },
  stockButton: {
    borderColor: theme.colors.secondary,
  },
});

export default SizeEditor;
