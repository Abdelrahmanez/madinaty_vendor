import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationService from "../navigators/NavigationService";

export const mainUrl = "http://0.0.0.0:8000";

const axiosInstance = axios.create({
  baseURL: mainUrl,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

const customInstance = axios.create({
  baseURL: mainUrl,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

const setAuthHeaders = async (instance) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  if (accessToken) {
    instance.defaults.headers.Authorization = `JWT ${accessToken}`;
  }
};

setAuthHeaders(axiosInstance);
setAuthHeaders(customInstance);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401) {
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("refresh_token");
      NavigationService.navigate("SignIn");
      return Promise.reject(error);
    }

    if (
      error.response.data.code === "token_not_valid" &&
      error.response.status === 401 &&
      error.response.statusText === "Unauthorized"
    ) {
      const refreshToken = await AsyncStorage.getItem("refresh_token");

      if (refreshToken) {
        const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));
        const now = Math.ceil(Date.now() / 1000);

        if (tokenParts.exp > now) {
          try {
            const response = await customInstance.post("/api/token/refresh/", {
              refresh: refreshToken,
            });
            await AsyncStorage.setItem("access_token", response.data.access);
            await AsyncStorage.setItem("refresh_token", response.data.refresh);

            axiosInstance.defaults.headers.Authorization = `JWT ${response.data.access}`;
            originalRequest.headers.Authorization = `JWT ${response.data.access}`;

            return axiosInstance(originalRequest);
          } catch (err) {
            console.log(err);
          }
        } else {
          console.log("Refresh token expired.");
          await AsyncStorage.removeItem("refresh_token");
          NavigationService.navigate("SignIn");
        }
      } else {
        console.log("Refresh token not available.");
        NavigationService.navigate("SignIn");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
