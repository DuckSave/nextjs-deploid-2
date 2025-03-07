import axiosClient from "./axiosClient";
const baseUrl = "/api/auth";

const user = { 
    account : { 
        signIn : (data) => axiosClient.post(`${baseUrl}/login`, data),
        signUp : (data) => axiosClient.post(`${baseUrl}/register`, data),
    }
}
export default user; 