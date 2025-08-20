/**
 * MultiSelectField Component
 * --------------------------------------------
 * مكون اختيار متعدد للفئات وعناصر القائمة
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme, Text, Chip, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SharedModal from '../../../components/SharedModal';

const MultiSelectField = ({
  label,
  selectedItems = [],
  availableItems = [],
  onSelectionChange,
  itemKey = 'id',
  itemLabel = 'name',
  placeholder = 'اختر العناصر',
  disabled = false,
  loading = false
}) => {
  const theme = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [tempSelection, setTempSelection] = useState(selectedItems);

  const handleItemToggle = (item) => {
    const itemId = item[itemKey];
    const isSelected = tempSelection.some(selected => selected[itemKey] === itemId);
    
    if (isSelected) {
      setTempSelection(prev => prev.filter(selected => selected[itemKey] !== itemId));
    } else {
      setTempSelection(prev => [...prev, item]);
    }
  };

  const handleConfirm = () => {
    onSelectionChange(tempSelection);
    setShowModal(false);
  };

  const handleCancel = () => {
    setTempSelection(selectedItems);
    setShowModal(false);
  };

  const isItemSelected = (item) => {
    return selectedItems.some(selected => selected[itemKey] === item[itemKey]);
  };

  const getSelectedLabels = () => {
    if (selectedItems.length === 0) return placeholder;
    if (selectedItems.length === 1) return selectedItems[0][itemLabel];
    return `${selectedItems.length} عنصر محدد`;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.onSurface }]}>
        {label}
      </Text>
      
      <Button
        mode="outlined"
        onPress={() => setShowModal(true)}
        disabled={disabled || loading}
        style={styles.selectButton}
        contentStyle={styles.buttonContent}
      >
        <View style={styles.buttonContent}>
          <MaterialCommunityIcons 
            name="format-list-bulleted" 
            size={20} 
            color={theme.colors.onSurfaceVariant} 
          />
          <Text style={[styles.buttonText, { color: theme.colors.onSurface }]}>
            {getSelectedLabels()}
          </Text>
        </View>
      </Button>

      {/* Selected Items Display */}
      {selectedItems.length > 0 && (
        <View style={styles.selectedContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedItems.map((item, index) => (
              <Chip
                key={`${item[itemKey]}-${index}`}
                mode="outlined"
                onClose={() => {
                  const newSelection = selectedItems.filter(selected => selected[itemKey] !== item[itemKey]);
                  onSelectionChange(newSelection);
                }}
                style={styles.chip}
                textStyle={styles.chipText}
              >
                {item[itemLabel]}
              </Chip>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Selection Modal */}
      <SharedModal
        visible={showModal}
        title={label}
        onDismiss={handleCancel}
        footerContent={
          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={handleCancel}
              style={styles.modalButton}
            >
              إلغاء
            </Button>
            <Button
              mode="contained"
              onPress={handleConfirm}
              style={styles.modalButton}
            >
              تأكيد
            </Button>
          </View>
        }
      >
        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {availableItems.map((item, index) => {
            const isSelected = tempSelection.some(selected => selected[itemKey] === item[itemKey]);
            return (
              <Button
                key={`${item[itemKey]}-${index}`}
                mode={isSelected ? "contained" : "outlined"}
                onPress={() => handleItemToggle(item)}
                style={styles.itemButton}
                contentStyle={styles.itemButtonContent}
              >
                <View style={styles.itemContent}>
                  <MaterialCommunityIcons 
                    name={isSelected ? "check-circle" : "circle-outline"} 
                    size={20} 
                    color={isSelected ? theme.colors.onPrimary : theme.colors.onSurface} 
                  />
                  <Text style={[
                    styles.itemText,
                    { color: isSelected ? theme.colors.onPrimary : theme.colors.onSurface }
                  ]}>
                    {item[itemLabel]}
                  </Text>
                </View>
              </Button>
            );
          })}
        </ScrollView>
      </SharedModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8
  },
  selectButton: {
    borderRadius: 8
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 14
  },
  selectedContainer: {
    marginTop: 8
  },
  chip: {
    marginRight: 8,
    marginBottom: 4
  },
  chipText: {
    fontSize: 12
  },
  modalContainer: {
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600'
  },
  modalContent: {
    maxHeight: 400,
    padding: 16
  },
  itemButton: {
    marginBottom: 8,
    borderRadius: 8
  },
  itemButtonContent: {
    justifyContent: 'flex-start'
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemText: {
    marginLeft: 8,
    fontSize: 14
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)'
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8
  }
});

export default MultiSelectField;
