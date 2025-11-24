// services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://rutaya.onrender.com",   // BACKEND NODE
});

export default API;
