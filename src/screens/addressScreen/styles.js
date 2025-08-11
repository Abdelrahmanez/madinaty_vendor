import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { I18nManager } from 'react-native';

const isRTL = I18nManager.isRTL;

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 12,
    color: theme.colors.onSurface,
    textAlign: isRTL ? 'right' : 'left',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 8,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  addressCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  currentAddressCard: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  addressHeader: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.surfaceVariant,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    textAlign: isRTL ? 'right' : 'left',
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  defaultBadgeText: {
    color: theme.colors.onPrimary,
    fontSize: 11,
    fontWeight: 'bold',
  },
  addressContent: {
    padding: 16,
  },
  addressText: {
    fontSize: 14,
    marginBottom: 4,
    color: theme.colors.onSurfaceVariant,
    textAlign: isRTL ? 'right' : 'left',
  },
  addressFooter: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    padding: 8,
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
  },
  formSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: theme.colors.primary,
    textAlign: isRTL ? 'right' : 'left',
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    textAlign: isRTL ? 'right' : 'left',
    marginHorizontal: 8,
  },
  buttonRow: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    borderRadius: 28,
  },
  zonePickerContainer: {
    marginBottom: 16,
  },
  zonePickerLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: theme.colors.onSurfaceVariant,
    textAlign: isRTL ? 'right' : 'left',
    fontWeight: '500',
  },
  zonePicker: {
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  zonePickerError: {
    borderColor: theme.colors.error,
    borderWidth: 1.5,
  },
  zonePickerText: {
    fontSize: 16,
    color: theme.colors.onSurface,
    textAlign: isRTL ? 'right' : 'left',
    fontWeight: '400',
  },
  zonePickerPlaceholder: {
    color: theme.colors.outline,
    fontWeight: '300',
  },
});

export default function useStyles() {
  const theme = useTheme();
  return createStyles(theme);
}
