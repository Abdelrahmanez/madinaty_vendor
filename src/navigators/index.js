import { useState, useEffect } from "react";
// react-native
import AsyncStorage from "@react-native-async-storage/async-storage";
// react navigation
import { NavigationContainer } from "@react-navigation/native";
// navigation layouts
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import NavigationService from "./NavigationService";
// stores
import useAuthStore from "../stores/authStore";

// -------------------------------------------------------------------------------------------

function Navigation() {
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, login, logout } = useAuthStore();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("access_token");
        const refreshToken = await AsyncStorage.getItem("refresh_token");
        if (accessToken && refreshToken) {
          login();
        } else {
          logout();
        }
      } catch (error) {
        console.log("Error checking auth status:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (loading) {
    // You can return a loading indicator here
    return null;
  }

  return (
    <NavigationContainer
      ref={(navigatorRef) => {
        NavigationService.setNavigator(navigatorRef);
      }}
    >
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default Navigation;
