import axios from "axios";
import { BASE_URL } from "../constants/constants";

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  /* headers: {
    "Content-Type": "application/json",
  }, */
});
