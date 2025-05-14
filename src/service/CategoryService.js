import axios from "axios";


const token = localStorage.getItem("token");
// Thiết lập header auth
const authHeader = {
    headers: {
        Authorization: `Bearer ${token}`,
    },
};
export async function getAllCategory(){
    try {
        const response =await axios.get(`http://localhost:8080/api/category`,authHeader);
        return response.data
    }catch (e){
        console.log("Lỗi: "+e)
    }

}