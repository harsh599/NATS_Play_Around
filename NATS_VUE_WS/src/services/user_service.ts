import axios from "axios";
import apiClient from "../axios";

export default {
  async getAllUserDetails (key: string) {
    return await apiClient.get("/user-details?key="+key);
  },

  async submitUserDetail(key: string, value: any){
    return await apiClient.post("/user-add-details", {key,value});
  },

  async updateUserDetail(key: string, value: any){
    return await apiClient.put("/update-user-details", {key, value});
  },

  async deleteUserDetail(key: string){
     return apiClient.delete("/delete-user-details?key="+ key);
  }
}