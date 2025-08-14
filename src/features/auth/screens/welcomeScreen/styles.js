import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
  },
  appName: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: theme.colors.primary,
    marginTop: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.onSurface,
    textAlign: 'center',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  loginButton: {
    marginBottom: 15,
    paddingVertical: 6,
    borderRadius: theme.roundnessValues?.sm || 12,
  },
  signupButton: {
    marginBottom: 15,
    paddingVertical: 6,
    borderRadius: theme.roundnessValues?.sm || 12,
    borderColor: theme.colors.primary,
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
    fontFamily: 'Inter-Regular',
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
    primary: '#E01105',
    onSurface: '#262626',
    onSurfaceVariant: '#404040',
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
