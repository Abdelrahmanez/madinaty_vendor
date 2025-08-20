import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal as RNModal
} from 'react-native';
import { useTheme, Surface, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * SharedModal Component
 * Reusable modal component following OrderAssignmentModal design pattern
 * 
 * @param {Object} props
 * @param {boolean} props.visible - Modal visibility
 * @param {string} props.title - Modal title
 * @param {Function} props.onDismiss - Function to close modal
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.footerContent - Footer content (optional)
 * @param {boolean} props.showDivider - Show divider before footer (default: true)
 * @param {string} props.animationType - Modal animation type (default: 'slide')
 * @param {number} props.height - Modal height percentage (default: 90)
 */
const SharedModal = ({
  visible,
  title,
  onDismiss,
  children,
  footerContent,
  showDivider = true,
  animationType = 'slide',
  height = 90
}) => {
  const theme = useTheme();

  return (
    <RNModal
      visible={visible}
      animationType={animationType}
      transparent={true}
      onRequestClose={onDismiss}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContent, 
          { 
            backgroundColor: theme.colors.background,
            height: `${height}%`
          }
        ]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
              {title}
            </Text>
            <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
              <MaterialCommunityIcons 
                name="close" 
                size={24} 
                color={theme.colors.onSurface} 
              />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.modalBody} 
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>

          {/* Footer */}
          {footerContent && (
            <>
              {showDivider && <Divider style={styles.divider} />}
              <View style={styles.modalFooter}>
                {footerContent}
              </View>
            </>
          )}
        </View>
      </View>
    </RNModal>
  );
};

/**
 * ModalSection Component
 * For grouping content within the modal
 */
export const ModalSection = ({ title, children, style }) => {
  const theme = useTheme();
  
  return (
    <View style={[styles.section, style]}>
      {title && (
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          {title}
        </Text>
      )}
      {children}
    </View>
  );
};

/**
 * ModalCard Component
 * For card-style content within sections
 */
export const ModalCard = ({ children, style, elevation = 1 }) => {
  return (
    <Surface style={[styles.card, style]} elevation={elevation}>
      {children}
    </Surface>
  );
};

/**
 * ModalRow Component
 * For consistent row layouts
 */
export const ModalRow = ({ label, value, style, labelStyle, valueStyle }) => {
  const theme = useTheme();
  
  return (
    <View style={[styles.row, style]}>
      <Text style={[
        styles.rowLabel, 
        { color: theme.colors.onSurfaceVariant },
        labelStyle
      ]}>
        {label}
      </Text>
      <Text style={[
        styles.rowValue, 
        { color: theme.colors.onSurface },
        valueStyle
      ]}>
        {value}
      </Text>
    </View>
  );
};

/**
 * ModalFooterActions Component
 * For consistent footer button layouts
 */
export const ModalFooterActions = ({ 
  leftButton, 
  rightButton, 
  style 
}) => {
  return (
    <View style={[styles.footerActions, style]}>
      {leftButton && (
        <View style={styles.footerButton}>
          {leftButton}
        </View>
      )}
      {rightButton && (
        <View style={styles.footerButton}>
          {rightButton}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
    // paddingHorizontal: 20,
  },
  modalFooter: {
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  divider: {
    marginVertical: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'left',
    flex: 1,
    marginLeft: 16,
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default SharedModal;
