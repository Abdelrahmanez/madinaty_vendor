import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useTheme, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { I18nManager } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fontSize, fontStyleBold, FONTS } from '../theme/fontSizes';

const TopBar = ({ 
  title, 
  showBackButton = true, 
  onBackPress, 
  rightComponent,
  backgroundColor,
  titleColor,
  iconColor,
  elevation = 0,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const isRTL = I18nManager.isRTL;
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <>
      <StatusBar 
        backgroundColor={backgroundColor || theme.colors.surface} 
        barStyle={theme.dark ? 'light-content' : 'dark-content'} 
        translucent
      />
      <View 
        style={[
          styles.container, 
          { 
            backgroundColor: backgroundColor || theme.colors.primary,
            elevation,
            borderBottomColor: theme.colors.surfaceVariant,
            paddingTop: Math.max(insets.top, 10),
            height: 40 + Math.max(insets.top, 10)
          }
        ]}
      >
        {/* Left/Right section (back button) */}
        <View style={[styles.sideSection, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          {showBackButton && (
            <IconButton
              icon={isRTL ? "arrow-right" : "arrow-left"}
              iconColor={iconColor || theme.colors.surface}
              size={24}
              onPress={handleBackPress}
            />
          )}
        </View>
        
        {/* Center section (title) */}
        <View style={styles.titleSection}>
          <Text 
            style={[
              styles.title, 
              { 
                color: titleColor || theme.colors.surface,
                textAlign: 'center',
              }
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
        
        {/* Right/Left section (action buttons) */}
        <View style={[styles.sideSection, { alignItems: isRTL ? 'flex-start' : 'flex-end' }]}>
          {rightComponent}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderBottomWidth: 1,
    width: '100%',
  },
  sideSection: {
    width: 60,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  titleSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.lg,
    fontFamily: FONTS.ALMARAI.BOLD,
  }
});

export default TopBar; 