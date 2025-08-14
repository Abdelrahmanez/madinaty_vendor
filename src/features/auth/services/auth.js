import axios from "axios";
import axiosInstance, { mainUrl } from "./axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const registerRequest = async (requestData) => {
  const response = await axiosInstance({
    method: "post",
    url: "/accounts/accounts-handler",
    data: requestData,
  });
  return response.data;
};

export const loginRequest = async (requestData) => {
  const response = await axios.post(`${mainUrl}api/token/`, requestData);
  await AsyncStorage.setItem("access_token", response.data.access);
  await AsyncStorage.setItem("refresh_token", response.data.refresh);
  axiosInstance.defaults.headers.Authorization = `JWT ${response.data.access}`;
  return response.data;
};

export const logoutRequest = async () => {
  const refreshToken = await AsyncStorage.getItem("refresh_token");
  const response = await axiosInstance({
    method: "post",
    url: "/accounts/logout",
    data: { refresh_token: refreshToken },
  });
  await AsyncStorage.removeItem("access_token");
  await AsyncStorage.removeItem("refresh_token");
  await AsyncStorage.removeItem("reviewProgram");
  return response.data;
};
