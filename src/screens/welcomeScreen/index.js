import React from "react";
// react-native
import { SafeAreaView, View } from "react-native";
// react-native-paper
import { Button, Text, useTheme } from "react-native-paper";
// styles
import welcomeScreenStyles from "./styles";
// stores
import useThemeStore from "../../stores/themeStore";
// hooks
import useLocales from "../../hooks/useLocales";

const WelcomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const { translate, onChangeLang } = useLocales();

  const { mode, toggleTheme } = useThemeStore();

  return (
    <SafeAreaView
      style={{
        ...welcomeScreenStyles.mainContainer,
        backgroundColor: theme.colors.background,
      }}
    >
      <Text>Welcome screens</Text>
      <Text variant="titleLarge" style={welcomeScreenStyles.text}>
        {translate(
          "screensTranslations.homeScreenTranslations.greeting.morning"
        )}
      </Text>
      <Button
        mode="contained"
        onPress={() => {
          // navigation.navigate("Login");
          toggleTheme();
          // onChangeLang("en");
        }}
      >
        Get Started
      </Button>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
