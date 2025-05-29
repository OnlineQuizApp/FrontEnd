import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;


const token = localStorage.getItem("token");
// Thiết lập header auth
const authHeader = token
    ? { headers: { Authorization: `Bearer ${token}` }}
    : {}; // không gửi gì cả nếu không có token


export async function getAllCategory(){
    try {
        console.log(apiUrl)
        const response =await axios.get(`${apiUrl}/api/category`,authHeader);
        return response.data
    }catch (e){
        console.log("Lỗi: "+e)
    }

}

export async function createCategory(newCategory){
    try {
        const response =await axios.post(`${apiUrl}/api/category`,newCategory,authHeader);
        console.log("createCategory")
    }catch (e){
        console.log("Lỗi createCategory: "+e)
    }

}