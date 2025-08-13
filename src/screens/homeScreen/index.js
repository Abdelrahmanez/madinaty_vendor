import React from "react";
// react-native
import { SafeAreaView } from "react-native";
// react-native-paper
import { Text } from "react-native-paper";
// styles
import homeScreenStyles from "./styles";
// hooks
import useLocales from "../../hooks/useLocales";

const HomeScreen = ({ navigation }) => {
  const { translate } = useLocales();
  return (
    <SafeAreaView style={homeScreenStyles.mainContainer}>
      <Text>HomeScreen</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;
