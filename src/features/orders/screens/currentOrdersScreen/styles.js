import { StyleSheet } from 'react-native';
import { I18nManager } from 'react-native';
import { fontSize } from '../../../../theme/fontSizes';

const isRTL = I18nManager.isRTL;

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80, // للتأكد من عدم تداخل المحتوى مع زر التصفية العائم
  },
  headerContainer: {
    marginBottom: 16,
    padding: 16,
  },
  headerTitle: {
    fontSize: fontSize.title,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: isRTL ? 'right' : 'left',
    color: theme.colors.onSurface,
  },
  headerSubtitle: {
    fontSize: fontSize.md,
    textAlign: isRTL ? 'right' : 'left',
    color: theme.colors.onSurfaceVariant,
  },
  // بطاقة الطلب - تصميم جديد
  orderCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 0,
  },
  orderCardHeader: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
  },
  orderRestaurantInfo: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    flex: 1,
  },
  restaurantLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: isRTL ? 0 : 12,
    marginLeft: isRTL ? 12 : 0,
  },
  restaurantName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: isRTL ? 'right' : 'left',
  },
  orderDate: {
    fontSize: fontSize.sm,
    textAlign: isRTL ? 'right' : 'left',
    opacity: 0.7,
  },
  orderCardContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 0,
  },
  orderItem: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    padding: 8,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 10,
  },
  orderItemName: {
    flex: 1,
    fontSize: fontSize.md,
    textAlign: isRTL ? 'right' : 'left',
    fontWeight: '500',
  },
  orderItemQuantity: {
    fontSize: fontSize.md,
    marginHorizontal: 8,
    minWidth: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: theme.colors.primary + '20',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  orderItemPrice: {
    fontSize: fontSize.md,
    textAlign: isRTL ? 'left' : 'right',
    fontWeight: '600',
  },
  statusChip: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 0,
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  // مكونات تتبع الطلب
  trackingContainer: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: theme.colors.surface,
  },
  progressBar: {
    marginVertical: 16,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.surfaceVariant,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  deliveryTimeContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
  },
  deliveryTimeText: {
    flex: 1,
    fontSize: fontSize.md,
    marginStart: 12,
    fontWeight: '500',
  },
  // تذييل بطاقة الطلب
  orderCardFooter: {
    padding: 16,
    borderTopWidth: 1,
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.surfaceVariant,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  totalRow: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 0,
    borderTopWidth: 0,
  },
  totalLabel: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    textAlign: isRTL ? 'right' : 'left',
  },
  totalValue: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    textAlign: isRTL ? 'left' : 'right',
  },
  actionButtonsContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    marginLeft: isRTL ? 0 : 8,
    marginRight: isRTL ? 8 : 0,
    marginTop: 8,
    borderRadius: 10,
  },
  // للحالات الفارغة
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyText: {
    fontSize: fontSize.xl,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 16,
  },
  emptySubText: {
    fontSize: fontSize.md,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
});

export const useStyles = () => {
  return createStyles;
};

export default useStyles; 