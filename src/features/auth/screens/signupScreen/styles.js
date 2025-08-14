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
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: theme.colors.primary,
    marginBottom: 10,
  },
  form: {
    marginVertical: 10,
  },
  input: {
    marginVertical: 8,
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
  button: {
    marginVertical: 20,
    paddingVertical: 6,
    borderRadius: theme.roundnessValues?.sm || 12,
  },
  loginContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  loginText: {
    marginRight: isRTL ? 0 : 5,
    marginLeft: isRTL ? 5 : 0,
    fontSize: 14,
    color: theme.colors.onSurface,
  },
  loginLink: {
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
  },
  areaSelector: {
    height: 56,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: theme.roundnessValues?.xs || 12,
    marginVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    textAlign: isRTL ? 'right' : 'left',
  },
  areaSelectorError: {
    borderColor: theme.colors.error,
  },
  areaSelectorText: {
    color: theme.colors.onSurface,
    fontSize: 16,
    textAlign: isRTL ? 'right' : 'left',
  },
  areaSelectorPlaceholder: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 16,
    textAlign: isRTL ? 'right' : 'left',
  },
  areaMenu: {
    maxHeight: 300,
    width: '80%',
    borderRadius: theme.roundnessValues?.sm || 12,
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
    outline: '#808080',
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