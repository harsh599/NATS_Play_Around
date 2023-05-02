import axios from "axios";
import apiClient from "../axios";

export default {
  getAllUserDetails() {
    return apiClient.get("/user-details");
  }
}