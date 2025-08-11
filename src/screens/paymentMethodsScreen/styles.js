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
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
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
  methodsContainer: {
    marginBottom: 24,
  },
  paymentMethodItem: {
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    elevation: 1,
  },
  paymentMethodContent: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    padding: 16,
  },
  paymentMethodIcon: {
    marginHorizontal: 16,
  },
  paymentMethodDetails: {
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: isRTL ? 'right' : 'left',
  },
  paymentMethodDescription: {
    fontSize: 14,
    textAlign: isRTL ? 'right' : 'left',
  },
  comingSoonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  infoSection: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginEnd: 16,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    textAlign: isRTL ? 'right' : 'left',
  },
});

export const useStyles = () => {
  return createStyles;
};

export default useStyles; 