import axios from "axios";


const axiosClient = axios.create({
  baseURL: "https://3.107.182.209:8080/"
});

// Interceptors
// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Handle response error
    return Promise.reject(error);
  }
);

export default axiosClient;
