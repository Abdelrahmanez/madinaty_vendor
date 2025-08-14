import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { I18nManager } from 'react-native';

// استخدام I18nManager للتحقق مما إذا كانت اللغة RTL
const isRTL = I18nManager.isRTL;

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    position: 'relative',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: theme.colors.primary,
    textAlign: 'center',
  },
  diagnosticsButton: {
    position: 'absolute',
    [isRTL ? 'left' : 'right']: 0,
    top: 0,
  },
  form: {
    marginVertical: 20,
  },
  input: {
    marginVertical: 10,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundnessValues?.xs || 10,
    textAlign: isRTL ? 'right' : 'left',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: isRTL ? 0 : 8,
    marginRight: isRTL ? 8 : 0,
    textAlign: isRTL ? 'right' : 'left',
  },
  forgotPassword: {
    alignSelf: isRTL ? 'flex-start' : 'flex-end',
    marginVertical: 10,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: 14,
    textAlign: isRTL ? 'left' : 'right',
  },
  button: {
    marginVertical: 20,
    paddingVertical: 6,
    borderRadius: theme.roundnessValues?.sm || 12,
  },
  signupContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  signupText: {
    marginRight: isRTL ? 0 : 5,
    marginLeft: isRTL ? 5 : 0,
    fontSize: 14,
    color: theme.colors.onSurface,
  },
  signupLink: {
    fontSize: 14,
    color: theme.colors.primary,
    fontFamily: 'Inter-Medium',
  },
  skipButton: {
    alignSelf: 'center',
    marginVertical: 10,
    padding: 10,
    borderRadius: theme.roundnessValues?.xs || 10,
  },
  skipButtonText: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
    textAlign: 'center',
  }
});

export default function useStyles() {
  const theme = useTheme();
  return createStyles(theme);
}

// For direct usage in components
const styles = createStyles({
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#E01105',
    onSurface: '#262626',
    onSurfaceVariant: '#404040',
    error: '#C62828',
  },
  roundnessValues: {
    xs: 10,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    full: 9999
  }
});

export { styles };
