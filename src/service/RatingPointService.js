import axios from "axios";




const token = localStorage.getItem("token");
// Thiết lập header auth
const authHeader = token
    ? { headers: { Authorization: `Bearer ${token}` }}
    : {}; // không gửi gì cả nếu không có token

export async function getAllRatingPoints(){
    try {
        const response =await axios.get(`http://localhost:8080/api/rating-points/get-all`,authHeader);
        return response.data;
    }catch (e) {
        console.log("Lỗi lấy thông tin toàn bộ bảng xếp hạng :"+ e)
    }
}

export async function getRatingPointsByUser(){
    try {
        const response =await axios.get(`http://localhost:8080/api/rating-points`,authHeader);
        return response.data;
    }catch (e) {
        console.log("Lỗi lấy thông tin người dùng trong bảng xếp hạng :"+ e)
    }
}