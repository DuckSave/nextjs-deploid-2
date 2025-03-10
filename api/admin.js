import axiosClient from "./axiosClient";
const baseUrl = "/api/admin";

const getToken = () => localStorage.getItem("token");

const user = {
  account: {
    getAllUsers: () => {
      const token = getToken();
      if (!token) {
        return Promise.reject(new Error("Token không tồn tại"));
      }
      return axiosClient.get(`${baseUrl}/all/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
  },
};

export default user;