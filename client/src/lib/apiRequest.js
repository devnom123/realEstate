import axios from "axios";

console.log(localStorage.getItem("token"),"token");
const apiRequest = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    }
});

export default apiRequest;