import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Text, Button } from 'react-native-paper';
import TopBar from '../../../../components/TopBar';

const AddMenuItemScreen = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets);

  return (
    <View style={styles.container}>
      <TopBar
        title="إضافة عنصر جديد"
        showBackButton={true}
        backgroundColor={theme.colors.primary}
        titleColor={theme.colors.onPrimary}
        onBackPress={() => navigation.goBack()}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>إضافة عنصر جديد</Text>
        <Text style={styles.subtitle}>
          سيتم إضافة نموذج إضافة عنصر جديد هنا
        </Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          العودة
        </Button>
      </View>
    </View>
  );
};

const createStyles = (theme, insets) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  button: {
    borderRadius: 8,
  },
});

export default AddMenuItemScreen;

