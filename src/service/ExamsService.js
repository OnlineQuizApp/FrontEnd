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

export async function createExamsRandom(newExams){
    try {
        const response = await axios.post(`http://localhost:8080/api/exams`,newExams,authHeader);
    }catch (e){
        console.log("Lỗi thêm dữ liệu: "+e)
    }
}
export async function createExams(newExams){
    try {
        const response = await axios.post(`http://localhost:8080/api/exams/create`,newExams,authHeader);
        return response.data;
    }catch (e){
        console.log("Lỗi thêm dữ liệu: "+e)
    }
}


export async function updateExams(id,newExams){
    try {
        const response = await axios.put(`http://localhost:8080/api/exams/${id}`,newExams,authHeader);
        console.log(response.data)
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

    export async function detailExams(id,page){
        try {
            const response = await axios.get(`http://localhost:8080/api/exams/${id}?page=${page}`,authHeader);
            const data=response.data.content;
            const totalPage=response.data.totalPages;
            return {data,totalPage}
        }catch (e){
            console.log("Lỗi lấy dữ liệu: "+e)
        }
    }
export async function getQuestionsByCategory(category){
    // try {
        const response = await axios.get(`http://localhost:8080/api/exams/questions-by-category/${category}`,authHeader);
        return response.data
    // }catch (e) {
    //     console.log("Lỗi update: "+e);
    //     return { data: [], totalPage: 0 };
    // }
}
export async function getExamsById(id){
    // try {
        const response = await axios.get(`http://localhost:8080/api/exams/findById/${id}`,authHeader);
        return response.data
    // }catch (e) {
    //     console.log("Lỗi update: "+e);
    //     return { data: [], totalPage: 0 };
    // }
}
export async function confirmExams(id,listQuestionsId){
    // try {
        const response = await axios.post(`http://localhost:8080/api/exams/create-confirm/${id}`,listQuestionsId,authHeader);
    //     return response.data;
    // }catch (e){
    //     console.log("Lỗi thêm dữ liệu: "+e)
    // }
}
