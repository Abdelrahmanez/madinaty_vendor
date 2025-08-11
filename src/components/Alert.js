import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
// react-native-paper
import { Snackbar, useTheme } from "react-native-paper";
// stores
import useAlertStore from "../stores/alertStore";
// react-native-size-matters
import { moderateScale } from "react-native-size-matters";

// ----------------------------------------------------------------------------------------------

const Alert = () => {
  const theme = useTheme();

  const { isTriggered, type, message, resetAlert } = useAlertStore();

  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const onDismissSnackBar = () => {
    resetAlert();
  };

  const snackBarBackgroundColor = () => {
    let color;
    if (type === "success") {
      color = "#54D62C";
    } else if (type === "warning") {
      color = "#FFC107";
    } else if (type === "error") {
      color = "#FF4842";
    }

    return color;
  };

  useEffect(() => {
    if (isTriggered) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isTriggered]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0], // Adjust the slide distance as needed
  });

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        opacity: opacityAnim,
        zIndex: 100,
      }}
    >
      <Snackbar
        visible={isTriggered}
        style={{
          ...styles.container,
          backgroundColor: snackBarBackgroundColor(),
        }}
        onDismiss={onDismissSnackBar}
      >
        {message}
      </Snackbar>
    </Animated.View>
  );
};

export default Alert;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: moderateScale(20),
    marginBottom: moderateScale(10),
    borderRadius: 9,
  },
});
