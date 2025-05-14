import axios from "axios";
import {data} from "react-router-dom";


const token = localStorage.getItem("token");
// Thiết lập header auth
const authHeader = {
    headers: {
        Authorization: `Bearer ${token}`,
    },
};
export async function getAllQuestions(page,category){

    try {
        const response = await axios.get(`http://localhost:8080/api/questions?page=${page}&category=${category}`,authHeader);
        const  data = response.data.content;
        const totalPage = response.data.totalPages;
        return {data,totalPage}
    }catch (e) {
        console.log("Lỗi: "+e);
        return { data: [], totalPage: 0 };
    }
}
export async function detailQuestions(id){

    try {
        const response = await axios.get(`http://localhost:8080/api/questions/${id}`,authHeader);
        console.log("detail:"+response.data);
        return  response.data
    }catch (e) {
        console.log("Lỗi: "+e);
        return { data: [], totalPage: 0 };
    }
}
export async function deleteQuestions(id){

    try {
        const response = await axios.delete(`http://localhost:8080/api/questions/${id}`,authHeader);
        console.log("delete:"+response.data);
    }catch (e) {
        console.log("Lỗi: "+e);
        return { data: [], totalPage: 0 };
    }
}
export async function createQuestions(newQuestions){

    try {
        const response = await axios.post(`http://localhost:8080/api/questions`,newQuestions,authHeader);
        console.log("delete:"+response.data);
    }catch (e) {
        console.log("Lỗi: "+e);
        return { data: [], totalPage: 0 };
    }
}
export async function createQuestionsOnFileExcel(file){

    try {
        const response = await axios.post(`http://localhost:8080/api/questions/upload-file-excel`,file,authHeader);
        console.log("delete:"+response.data);
    }catch (e) {
        console.log("Lỗi: "+e);
        return { data: [], totalPage: 0 };
    }
}
export async function createQuestionsOnImg(file,categoryId,answers){
    try {
        const response = await axios.post(`http://localhost:8080/api/questions/upload-file-img`,file,categoryId,answers,authHeader);
        console.log("delete:"+response.data);
    }catch (e) {
        console.log("Lỗi: "+e);
        return { data: [], totalPage: 0 };
    }
}