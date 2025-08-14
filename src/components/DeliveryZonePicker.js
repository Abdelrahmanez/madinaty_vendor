import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu, Divider, ActivityIndicator } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { I18nManager } from 'react-native';
import useDeliveryZones from '../hooks/useDeliveryZones';

/**
 * مكون قائمة منسدلة لاختيار منطقة التوصيل
 * @param {Object} props - خصائص المكون
 * @param {Object} props.selectedZone - المنطقة المختارة حاليًا
 * @param {Function} props.onSelectZone - دالة تُستدعى عند اختيار منطقة (تستقبل كائن المنطقة المختارة)
 * @param {string} props.placeholder - النص المعروض عندما لا تكون هناك منطقة مختارة
 * @param {string} props.label - تسمية الحقل
 * @param {boolean} props.error - إذا كان هناك خطأ في الاختيار
 * @param {string} props.errorText - نص رسالة الخطأ
 */
const DeliveryZonePicker = ({
  selectedZone,
  onSelectZone,
  placeholder = 'اختر منطقة التوصيل',
  label = 'منطقة التوصيل',
  error = false,
  errorText = 'يرجى اختيار منطقة توصيل',
}) => {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const { zones, loading, error: zonesError } = useDeliveryZones();

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const closeMenu = () => setMenuVisible(false);

  const handleSelectZone = (zone) => {
    onSelectZone(zone);
    closeMenu();
  };

  // تحديد الاتجاه بناءً على اللغة الحالية
  const isRTL = I18nManager.isRTL;

  return (
    <View style={styles.container}>
      {label && (
        <Text 
          style={[
            styles.label, 
            { 
              textAlign: isRTL ? 'right' : 'left',
              writingDirection: isRTL ? 'rtl' : 'ltr'
            }
          ]}
        >
          {label}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.selector,
          { 
            borderColor: error ? theme.colors.error : theme.colors.outline,
            borderRadius: theme.roundnessValues?.xs || 10,
            paddingLeft: isRTL ? 48 : 16,
            paddingRight: isRTL ? 16 : 48
          }
        ]}
        onPress={toggleMenu}
        disabled={loading}
      >
        {loading ? (
          <View style={[styles.loadingContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text 
              style={[
                styles.loadingText, 
                { 
                  marginLeft: isRTL ? 0 : 8, 
                  marginRight: isRTL ? 8 : 0,
                  writingDirection: isRTL ? 'rtl' : 'ltr'
                }
              ]}
            >
              جاري تحميل المناطق...
            </Text>
          </View>
        ) : (
          <Text 
            style={[
              styles.selectorText,
              !selectedZone && styles.placeholderText,
              error && styles.errorText,
              { 
                textAlign: isRTL ? 'right' : 'left',
                writingDirection: isRTL ? 'rtl' : 'ltr'
              }
            ]}
          >
            {selectedZone ? selectedZone.name : placeholder}
          </Text>
        )}
      </TouchableOpacity>

      {error && errorText && (
        <Text 
          style={[
            styles.errorMessage, 
            { 
              color: theme.colors.error, 
              textAlign: isRTL ? 'right' : 'left',
              marginLeft: isRTL ? 0 : 8, 
              marginRight: isRTL ? 8 : 0,
              writingDirection: isRTL ? 'rtl' : 'ltr'
            }
          ]}
        >
          {errorText}
        </Text>
      )}

      {zonesError && (
        <Text 
          style={[
            styles.errorMessage, 
            { 
              color: theme.colors.error, 
              textAlign: isRTL ? 'right' : 'left',
              marginLeft: isRTL ? 0 : 8, 
              marginRight: isRTL ? 8 : 0,
              writingDirection: isRTL ? 'rtl' : 'ltr'
            }
          ]}
        >
          {zonesError}
        </Text>
      )}

      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={{x: 0, y: 0}}
        style={[
          styles.menu, 
          { 
            borderRadius: theme.roundnessValues?.sm || 12,
            alignItems: isRTL ? 'flex-end' : 'flex-start'
          }
        ]}
      >
        {zones && zones.length > 0 ? (
          zones.map((zone) => (
            <React.Fragment key={zone._id}>
              <Menu.Item
                title={zone.name}
                onPress={() => handleSelectZone(zone)}
                style={[
                  selectedZone && selectedZone._id === zone._id ? 
                    { backgroundColor: theme.colors.surfaceVariant } : {},
                  { paddingHorizontal: 16 }
                ]}
                titleStyle={{ 
                  textAlign: isRTL ? 'right' : 'left',
                  writingDirection: isRTL ? 'rtl' : 'ltr',
                  width: '100%'
                }}
              />
              <Divider />
            </React.Fragment>
          ))
        ) : (
          <Menu.Item 
            title="لا توجد مناطق متاحة" 
            disabled 
            titleStyle={{ 
              textAlign: isRTL ? 'right' : 'left',
              writingDirection: isRTL ? 'rtl' : 'ltr' 
            }}
          />
        )}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  selector: {
    height: 56,
    borderWidth: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  selectorText: {
    fontSize: 16,
  },
  placeholderText: {
    opacity: 0.6,
  },
  errorText: {
    color: 'red',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    opacity: 0.7,
  },
  errorMessage: {
    fontSize: 12,
    marginTop: 4,
  },
  menu: {
    width: '80%',
    maxHeight: 300,
    marginTop: 56, // height of the selector
  },
});

export default DeliveryZonePicker; 