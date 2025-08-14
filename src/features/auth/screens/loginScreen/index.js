import React from "react";
// react-native
import { SafeAreaView } from "react-native";
// react-native-paper
import { Text } from "react-native-paper";
// styles
import loginScreenStyles from "./styles";
// hooks
import useLocales from "../../hooks/useLocales";

const LoginScreen = ({ navigation }) => {
  const { translate } = useLocales();

  return (
    <SafeAreaView style={loginScreenStyles.mainContainer}>
      <Text>LoginScreen</Text>
    </SafeAreaView>
  );
};

export default LoginScreen;
