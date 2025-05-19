import axios from "axios";


const token = localStorage.getItem("token");
const authHeader = token ? { headers: { Authorization: `Bearer ${token}` }} : {};// không gửi gì cả nếu không có token

export async function getAllExams(page,category){
    try {
        const response = await axios.get(`http://localhost:8080/api/exams?page=${page}&category=${category}`,authHeader);
        const data=response.data.content;
        const totalPage=response.data.totalPages;
        return {data,totalPage}
    }catch (e){
        console.log("Lỗi lấy dữ liệu: "+e)
    }
}


export async function createExams(newExams){
    try {
        const response = await axios.post(`http://localhost:8080/api/exams`,newExams,authHeader);
    }catch (e){
        console.log("Lỗi thêm dữ liệu: "+e)
    }
}

export async function updateExams(id,newExams){
    try {
        const response = await axios.put(`http://localhost:8080/api/exams/${id}`,newExams,authHeader);
        return response.data;
    }catch (e){
        console.log("Lỗi chỉnh sửa dữ liệu: "+e)
    }
}

export async function deleteExams(id){
    try {
        const response = await axios.delete(`http://localhost:8080/api/exams/${id}`,authHeader);
        return response.data;
    }catch (e){
        console.log("Lỗi xoá dữ liệu: "+e)
    }
}