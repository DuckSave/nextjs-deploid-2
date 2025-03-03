import axiosClient from "./axiosClient";
const baseUrl = "/api/user";

const user = { 
    account : { 
        getAllusers : () => axiosClient.get(`${baseUrl}/all/admin`)
    }
}
export default user; 