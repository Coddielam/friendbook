import axios from "axios";

const serverAxiosInstance = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

serverAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    switch (error.response.status) {
      default:
      case 500:
        throw new Error("Server error");
      case 401:
        throw new Error("Please authenticate");
      case 400:
        console.error(error)
        throw new Error(
          "Please make sure you're submiting the right information"
        );
    }
  }
);

export default serverAxiosInstance;
