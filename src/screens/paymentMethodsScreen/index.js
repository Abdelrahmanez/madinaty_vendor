import React from 'react';
import { 
  View, 
  Text, 
  ScrollView,
  TouchableOpacity,
  I18nManager
} from 'react-native';
import { 
  useTheme, 
  Surface,
  RadioButton,
} from 'react-native-paper';
import useStyles from './styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TopBar from '../../components/TopBar';
import { useTranslation } from 'react-i18next';

const isRTL = I18nManager.isRTL;

// مكون لخيار الدفع المتاح
const PaymentMethodItem = ({ 
  icon, 
  title, 
  description, 
  selected, 
  onSelect, 
  disabled = false,
  theme,
  styles,
  comingSoonLabel
}) => (
  <Surface 
    style={[
      styles.paymentMethodItem, 
      {
        backgroundColor: theme.colors.surface,
        borderColor: selected ? theme.colors.primary : theme.colors.outlineVariant,
      }
    ]}
  >
    <TouchableOpacity 
      style={styles.paymentMethodContent}
      onPress={onSelect}
      disabled={disabled}
    >
      <RadioButton
        value={title}
        status={selected ? 'checked' : 'unchecked'}
        disabled={disabled}
        color={theme.colors.primary}
        onPress={onSelect}
      />
      
      <View style={styles.paymentMethodIcon}>
        <MaterialCommunityIcons 
          name={icon} 
          size={32} 
          color={disabled ? theme.colors.outline : theme.colors.primary}
        />
      </View>
      
      <View style={styles.paymentMethodDetails}>
        <Text 
          style={[
            styles.paymentMethodTitle, 
            { 
              color: disabled ? theme.colors.outline : theme.colors.onSurface,
              opacity: disabled ? 0.7 : 1
            }
          ]}
        >
          {title}
        </Text>
        {description && (
          <Text 
            style={[
              styles.paymentMethodDescription, 
              { 
                color: theme.colors.onSurfaceVariant,
                opacity: disabled ? 0.7 : 1
              }
            ]}
          >
            {description}
          </Text>
        )}
      </View>
      
      {disabled && (
        <View style={[styles.comingSoonBadge, {backgroundColor: theme.colors.secondary}]}>
          <Text style={[styles.comingSoonText, {color: theme.colors.onSecondary}]}>
            {comingSoonLabel}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  </Surface>
);

const PaymentMethodsScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = useStyles()(theme);
  const { t } = useTranslation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState('cash');

  return (
    <View style={styles.container}>
      <TopBar 
        title={t('paymentMethodsScreen.title')}
        showBack={true}
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>
              {t('paymentMethodsScreen.choosePreferred')}
            </Text>
            <Text style={styles.headerSubtitle}>
              {t('paymentMethodsScreen.subtitle')}
            </Text>
          </View>
          
          <View style={styles.methodsContainer}>
            {/* خيار الدفع النقدي */}
            <PaymentMethodItem
              icon="cash"
              title={t('paymentMethodsScreen.cashPayment')}
              description={t('paymentMethodsScreen.cashOnDelivery')}
              selected={selectedPaymentMethod === 'cash'}
              onSelect={() => setSelectedPaymentMethod('cash')}
              theme={theme}
              styles={styles}
              comingSoonLabel={t('paymentMethodsScreen.comingSoon')}
            />
            
            {/* خيار الدفع بالبطاقة - غير متاح حاليًا */}
            <PaymentMethodItem
              icon="credit-card"
              title={t('paymentMethodsScreen.cardPayment')}
              description={t('paymentMethodsScreen.cardTypes')}
              selected={selectedPaymentMethod === 'card'}
              onSelect={() => {}}
              disabled={true}
              theme={theme}
              styles={styles}
              comingSoonLabel={t('paymentMethodsScreen.comingSoon')}
            />
            
            {/* خيار الدفع الإلكتروني - غير متاح حاليًا */}
            <PaymentMethodItem
              icon="wallet"
              title={t('paymentMethodsScreen.eWallets')}
              description={t('paymentMethodsScreen.eWalletTypes')}
              selected={selectedPaymentMethod === 'wallet'}
              onSelect={() => {}}
              disabled={true}
              theme={theme}
              styles={styles}
              comingSoonLabel={t('paymentMethodsScreen.comingSoon')}
            />
          </View>
          
          {/* قسم المعلومات */}
          <View style={[styles.infoSection, {backgroundColor: theme.colors.surfaceVariant}]}>
            <MaterialCommunityIcons 
              name="information" 
              size={24} 
              color={theme.colors.primary}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              {t('paymentMethodsScreen.infoMessage')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PaymentMethodsScreen; 