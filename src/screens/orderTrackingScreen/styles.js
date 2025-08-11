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
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  dummyMap: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: theme.colors.onSurface,
    textAlign: isRTL ? 'right' : 'left',
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  cardRow: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    textAlign: isRTL ? 'right' : 'left',
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurface,
    textAlign: isRTL ? 'left' : 'right',
  },
  divider: {
    marginVertical: 12,
  },
  infoContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: isRTL ? 0 : 12,
    marginLeft: isRTL ? 12 : 0,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
    color: theme.colors.onSurface,
    textAlign: isRTL ? 'right' : 'left',
  },
  infoSubtitle: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    textAlign: isRTL ? 'right' : 'left',
  },
  actionButton: {
    marginLeft: isRTL ? 0 : 8,
    marginRight: isRTL ? 8 : 0,
  },
  progressTrack: {
    marginVertical: 24,
    paddingHorizontal: 8,
  },
  progressLine: {
    position: 'absolute',
    left: 22,
    top: 30,
    bottom: 20,
    width: 2,
  },
  progressStep: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    marginBottom: 24,
  },
  progressStepIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: isRTL ? 0 : 16,
    marginLeft: isRTL ? 16 : 0,
  },
  progressStepContent: {
    flex: 1,
  },
  progressStepTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
    textAlign: isRTL ? 'right' : 'left',
  },
  progressStepTime: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    textAlign: isRTL ? 'right' : 'left',
  },
  progressStepDescription: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
    textAlign: isRTL ? 'right' : 'left',
  },
  contactCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  contactHeader: {
    padding: 16,
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: isRTL ? 0 : 16,
    marginLeft: isRTL ? 16 : 0,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
    color: theme.colors.onSurface,
    textAlign: isRTL ? 'right' : 'left',
  },
  contactRole: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    textAlign: isRTL ? 'right' : 'left',
  },
  contactActions: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    padding: 8,
  },
  contactButton: {
    flex: 1,
    margin: 4,
  },
  deliveryInfoContainer: {
    backgroundColor: `${theme.colors.primary}10`,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
  },
  deliveryTimeContainer: {
    flex: 1,
    marginLeft: isRTL ? 0 : 12,
    marginRight: isRTL ? 12 : 0,
  },
  deliveryEstimate: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
    textAlign: isRTL ? 'right' : 'left',
  },
  deliveryTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    textAlign: isRTL ? 'right' : 'left',
  },
  orderSummaryContainer: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  orderSummaryHeader: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  orderSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    textAlign: isRTL ? 'right' : 'left',
  },
  orderSummaryButton: {
    fontSize: 14,
    color: theme.colors.primary,
    textAlign: isRTL ? 'left' : 'right',
  },
  orderItem: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderItemName: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.onSurface,
    textAlign: isRTL ? 'right' : 'left',
  },
  orderItemQuantity: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginHorizontal: 8,
    minWidth: 30,
    textAlign: 'center',
  },
  orderItemPrice: {
    fontSize: 14,
    color: theme.colors.onSurface,
    textAlign: isRTL ? 'left' : 'right',
  },
  orderTotalContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
  },
  orderTotalRow: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  orderTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    textAlign: isRTL ? 'right' : 'left',
  },
  orderTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: isRTL ? 'left' : 'right',
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
  actionButtonFull: {
    flex: 1,
  },
});

export const useStyles = () => {
  return createStyles;
};

export default useStyles; 