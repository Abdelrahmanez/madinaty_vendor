import { StyleSheet } from "react-native";
import { useTheme } from 'react-native-paper';
import { I18nManager } from 'react-native';
import { fontSize } from '../../../../theme/fontSizes';

// استخدام I18nManager للتحقق مما إذا كانت اللغة RTL
const isRTL = I18nManager.isRTL;

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  headerTitle: {
    fontSize: fontSize.title,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    textAlign: isRTL ? 'right' : 'left',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: fontSize.md,
    color: theme.colors.onSurfaceVariant,
    textAlign: isRTL ? 'right' : 'left',
  },
  contentContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundnessValues?.md || 16,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: fontSize.title,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    flex: 1,
    textAlign: isRTL ? 'right' : 'left',
  },
  orderDate: {
    fontSize: fontSize.md,
    color: theme.colors.onSurfaceVariant,
    textAlign: isRTL ? 'right' : 'left',
  },
  orderDetailsContainer: {
    marginVertical: 8,
  },
  orderItem: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  orderItemName: {
    fontSize: fontSize.lg,
    color: theme.colors.onSurface,
    flex: 1,
    textAlign: isRTL ? 'right' : 'left',
  },
  orderItemQuantity: {
    fontSize: fontSize.sm,
    color: theme.colors.onSurfaceVariant,
    marginHorizontal: 8,
    textAlign: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.roundnessValues?.xs || 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  orderItemPrice: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: theme.colors.onSurface,
    textAlign: isRTL ? 'left' : 'right',
    minWidth: 70,
  },
  orderTotal: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceVariant,
  },
  orderTotalText: {
    fontSize: fontSize.md,
    color: theme.colors.onSurfaceVariant,
    textAlign: isRTL ? 'right' : 'left',
  },
  orderTotalAmount: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    textAlign: isRTL ? 'left' : 'right',
  },
  orderStatus: {
    marginTop: 16,
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderStatusText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: theme.colors.primary,
    textAlign: isRTL ? 'right' : 'left',
  },
  detailsButton: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: fontSize.lg,
    color: theme.colors.primary,
    marginHorizontal: 4,
    textAlign: isRTL ? 'right' : 'left',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: fontSize.xl,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: fontSize.md,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
  filterContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.surfaceVariant,
  },
  filterTitle: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant,
    flex: 1,
    textAlign: isRTL ? 'right' : 'left',
  },
  filterButtonsContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.roundnessValues?.xs || 10,
    marginLeft: isRTL ? 0 : 8,
    marginRight: isRTL ? 8 : 0,
    backgroundColor: theme.colors.surface,
  },
  filterButtonSelected: {
    backgroundColor: theme.colors.primaryContainer,
  },
  filterButtonText: {
    fontSize: fontSize.md,
    color: theme.colors.onSurfaceVariant,
  },
  filterButtonTextSelected: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// For custom hooks usage
function useStyles() {
  const theme = useTheme();
  return createStyles(theme);
}

// For direct usage in components
const orderHistoryStyles = createStyles({
  colors: {
    background: '#F7F7F7',
    surface: '#FFFFFF',
    surfaceVariant: '#F0F0F0',
    primary: '#E01105',
    primaryContainer: '#FFE0DD',
    onSurface: '#262626',
    onSurfaceVariant: '#404040',
  },
  roundnessValues: {
    xs: 10,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    full: 9999,
  },
  fontSize // Add our fontSize utility to the theme
});

export { useStyles };
export default orderHistoryStyles; 