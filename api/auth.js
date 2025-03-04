import axiosClient from "./axiosClient";
const baseUrl = "/api/auth";

const user = { 
    account : { 
        signIn : (data) => axiosClient.post(`${baseUrl}/login`, data),
    }
}
export default user; 