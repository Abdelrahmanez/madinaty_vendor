// Deprecated: Home screen styles are no longer used. Keeping file for import safety.
export default {};
export const useStyles = () => ({});

// استخدام I18nManager للتحقق مما إذا كانت اللغة RTL
const isRTL = I18nManager.isRTL;

const createStyles = (theme) => StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  // عنصر الهيدر الذي يحتوي على العنوان وزر تسجيل الخروج
  header: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  title: {
    fontSize: fontSize.heading,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: isRTL ? 'right' : 'left',
  },
  // أسلوب زر تسجيل الخروج
  logoutButton: {
    backgroundColor: theme.colors.primaryContainer,
  },
  // محتوى الشاشة الرئيسية
  content: {
    flex: 1,
  },
  // نص الترحيب
  welcomeText: {
    fontSize: fontSize.xl,
    textAlign: 'center',
    marginVertical: 20,
    color: theme.colors.onSurface,
    fontFamily: 'Inter-Medium',
  },
  // حاوية المحتوى الرئيسية
  contentContainer: {
    marginVertical: 20,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundnessValues?.md || 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  // نص المحتوى
  contentText: {
    fontSize: fontSize.lg,
    lineHeight: 24,
    color: theme.colors.onSurface,
    textAlign: isRTL ? 'right' : 'left',
  },
  // نمط للقائمة التي ستضاف لاحقاً
  menuContainer: {
    marginVertical: 16,
  },
  menuTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 12,
    textAlign: isRTL ? 'right' : 'left',
  },
  // بطاقة عامة قد تستخدم في المستقبل
  card: {
    marginVertical: 10,
    borderRadius: theme.roundnessValues?.md || 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.onSurface,
    textAlign: isRTL ? 'right' : 'left',
  },
  cardDescription: {
    fontSize: fontSize.md,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 8,
    textAlign: isRTL ? 'right' : 'left',
  },
  button: {
    borderRadius: theme.roundnessValues?.sm || 12,
    marginTop: 16,
  },
  // فاصل
  divider: {
    marginVertical: 16,
  },
});

// For custom hooks usage
function useStyles() {
  const theme = useTheme();
  return createStyles(theme);
}

// For direct usage in components
const homeScreenStyles = createStyles({
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#E01105',
    onSurface: '#262626',
    onSurfaceVariant: '#404040',
    primaryContainer: '#FFE0DD', // لون خلفية زر تسجيل الخروج
    success: '#4CAF50',
    error: '#F44336',
    surfaceVariant: '#F5F5F5',
  },
  roundnessValues: {
    xs: 10,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    full: 9999
  },
  fontSize // Add our fontSize utility to the theme
});

export { useStyles };
export default homeScreenStyles;
