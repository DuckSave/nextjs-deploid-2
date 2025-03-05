import axiosClient from "./axiosClient";
const baseUrl = "/api/admin";

const user = { 
    account : { 
        getAllusers : () => axiosClient.get(`${baseUrl}/all/user`)
    }
}
export default user; 