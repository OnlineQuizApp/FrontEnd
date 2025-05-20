import axios from "axios";



const token = localStorage.getItem("token");
// Thiết lập header auth
const authHeader = token
    ? { headers: { Authorization: `Bearer ${token}` }}
    : {}; // không gửi gì cả nếu không có token

export async function getAllQuestions(page,content,category){
    try {
        const response = await axios.get(`http://localhost:8080/api/questions?page=${page}&content=${content}&category=${category}`,authHeader);
        const  data = response.data.content;
        const totalPage = response.data.totalPages;
        return {data,totalPage}
    }catch (e) {
        console.log("Lỗi hiển thị: "+e);
        return { data: [], totalPage: 0 };
    }
}
export async function detailQuestions(id){

    try {
        const response = await axios.get(`http://localhost:8080/api/questions/${id}`,authHeader);
        console.log("detail:"+response.data);
        return  response.data
    }catch (e) {
        console.log("Lỗi detail: "+e);
        return { data: [], totalPage: 0 };
    }
}
export async function deleteQuestions(id){

    try {
        const response = await axios.delete(`http://localhost:8080/api/questions/${id}`,authHeader);
        console.log("delete:"+response.data);
    }catch (e) {
        console.log("Lỗi xoá câu hỏi: "+e);
        return { data: [], totalPage: 0 };
    }
}
export async function createQuestions(newQuestions){

    try {
        const response = await axios.post(`http://localhost:8080/api/questions`,newQuestions,authHeader);
        console.log("delete:"+response.data);
    }catch (e) {
        console.log("Lỗi thêm câuu hỏi: "+e);
        return { data: [], totalPage: 0 };
    }
}
export async function createQuestionsOnFileExcel(file){

    try {
        const response = await axios.post(`http://localhost:8080/api/questions/upload-file-excel`,file,authHeader);
        console.log("creteFileExcel:"+response.data);
    }catch (e) {
        console.log("Lỗi thêm file excel: "+e);
        throw e;
    }
}
export async function createQuestionsOnImg(newQuestion){
    console.log("token: ",authHeader)
    try {
        const response = await axios.post(`http://localhost:8080/api/questions/upload-file-img`,newQuestion,authHeader);
        console.log("createImg:"+response.data);
    }catch (e) {
        console.log("Lỗi thêm mới img: "+e);
        return { data: [], totalPage: 0 };
    }

}
export async function createQuestionsOnVideo(newQuestion){
    console.log("token: ",authHeader)
    try {
        const response = await axios.post(`http://localhost:8080/api/questions/upload-video`,newQuestion,authHeader);
        console.log("createImg:"+response.data);
    }catch (e) {
        console.log("Lỗi thêm mới img: "+e);
        return { data: [], totalPage: 0 };
    }

}

export async function updateQuestions(id,newQuestion){

    try {
        const response = await axios.put(`http://localhost:8080/api/questions/${id}`,newQuestion,authHeader);
        console.log("createImg:"+response.data);
    }catch (e) {
        console.log("Lỗi update: "+e);
        return { data: [], totalPage: 0 };
    }
}