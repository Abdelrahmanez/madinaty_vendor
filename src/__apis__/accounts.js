import axiosInstance from "./axios";

export const exampleFetcher = async () =>
  axiosInstance
    .get("/accounts/fetch-example-handler")
    .then((response) => response.data);
