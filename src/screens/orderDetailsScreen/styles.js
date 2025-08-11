import { StyleSheet } from 'react-native';
import { I18nManager } from 'react-native';

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
    paddingBottom: 80,
  },
  headerSection: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: isRTL ? 'right' : 'left',
    color: theme.colors.onSurface,
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: isRTL ? 'right' : 'left',
    color: theme.colors.onSurfaceVariant,
  },
  section: {
    marginBottom: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: theme.colors.onSurface,
    textAlign: isRTL ? 'right' : 'left',
    padding: 16,
    paddingBottom: 0,
  },
  sectionContent: {
    padding: 16,
    paddingTop: 8,
  },
  statusChip: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    textAlign: isRTL ? 'right' : 'left',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurface,
    textAlign: isRTL ? 'left' : 'right',
    maxWidth: '60%',
  },
  divider: {
    marginVertical: 16,
  },
  addressContainer: {
    marginTop: 4,
  },
  addressLine: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginBottom: 2,
    textAlign: isRTL ? 'right' : 'left',
  },
  addressNote: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
    textAlign: isRTL ? 'right' : 'left',
    fontStyle: 'italic',
  },
  orderItemRow: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 15,
    color: theme.colors.onSurface,
    marginBottom: 2,
    textAlign: isRTL ? 'right' : 'left',
  },
  orderItemOptions: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    textAlign: isRTL ? 'right' : 'left',
  },
  orderItemQuantity: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    width: 30,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  orderItemPrice: {
    fontSize: 14,
    color: theme.colors.onSurface,
    textAlign: isRTL ? 'left' : 'right',
    minWidth: 70,
  },
  summaryRow: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    textAlign: isRTL ? 'right' : 'left',
  },
  summaryValue: {
    fontSize: 14,
    color: theme.colors.onSurface,
    textAlign: isRTL ? 'left' : 'right',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    textAlign: isRTL ? 'right' : 'left',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: isRTL ? 'left' : 'right',
  },
  discountValue: {
    fontSize: 14,
    color: theme.colors.tertiary,
    textAlign: isRTL ? 'left' : 'right',
  },
  restaurantInfoContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  restaurantLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: isRTL ? 0 : 16,
    marginLeft: isRTL ? 16 : 0,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.onSurface,
    marginBottom: 2,
    textAlign: isRTL ? 'right' : 'left',
  },
  restaurantAddress: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    textAlign: isRTL ? 'right' : 'left',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: theme.colors.background,
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
  },
  actionButton: {
    flex: 1,
    marginLeft: isRTL ? 0 : 8,
    marginRight: isRTL ? 8 : 0,
  },
  ratingContainer: {
    alignItems: 'center',
    padding: 16,
    marginVertical: 12,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.onSurface,
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    marginBottom: 16,
  },
  ratingComment: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    borderRadius: 8,
    textAlign: isRTL ? 'right' : 'left',
    color: theme.colors.onSurface,
  },
  receiptContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    borderRadius: 12,
    marginBottom: 16,
  },
  receiptHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  receiptLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  receiptSubtitle: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
  receiptOrderId: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  receiptDivider: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    marginVertical: 16,
  },
  receiptFooter: {
    alignItems: 'center',
    marginTop: 16,
  },
  barcode: {
    width: '100%',
    height: 60,
    marginBottom: 8,
  },
  receiptFooterText: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
});

export const useStyles = () => {
  return createStyles;
};

export default useStyles; 