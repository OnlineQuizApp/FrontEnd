import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;
const token = localStorage.getItem("token");
const authHeader = token ? {headers: {Authorization: `Bearer ${token}`}} : {};


export async function getAllExamSet(page, name) {
    try {
        const response = await axios.get(`${apiUrl}/api/exam-set?page=${page}&name=${name}`, authHeader);
        const data = response.data.content;
        const totalPage = response.data.totalPages;
        return {data, totalPage}
    } catch (e) {
        console.log("Lỗi lấy dữ liệu: " + e)
    }
}

export async function createExamSet(newExams) {
    const response = await axios.post(`${apiUrl}/api/exam-set/create`, newExams, authHeader);
    return response.data;
}

export async function confirmExamSet(id, listExamId) {
    const response = await axios.post(`${apiUrl}/api/exam-set/create/confirm/${id}`, listExamId, authHeader);
    console.log(response.data,"dữ liệu thêm vào")
}
export async function confirmExamSetUpdate(id, listExamId) {
    const response = await axios.post(`${apiUrl}/api/exam-set/update/confirm/${id}`, listExamId, authHeader);
}

export async function getExamsSetById(id) {
    const response = await axios.get(`${apiUrl}/api/exam-set/findById/${id}`, authHeader);
    return response.data
}

export async function getAllExams() {
    const response = await axios.get(`${apiUrl}/api/exam-set/getAll-exams`, authHeader);
    return response.data
}
export async function updateExamSet(id, newExamSet) {

    const response = await axios.put(`${apiUrl}/api/exam-set/${id}`, newExamSet, authHeader);
}

export async function getExamSetByIdUpdate(id) {
    const response = await axios.get(`${apiUrl}/api/exam-set/findByIdForUpdate/${id}`, authHeader);
    return response.data
}
export async function deleteExamByExamSetId(idExamSet,idExams) {
    const response = await axios.delete(`${apiUrl}/api/exam-set/delete-exams-by-examSet/${idExamSet}/${idExams}`, authHeader);
}
export async function deleteExamSet(id) {
    const response = await axios.delete(`${apiUrl}/api/exam-set/${id}`, authHeader);
}
const getAll = (page = 0) => {
    return axios
        .get(`http://localhost:8080/api/exam-set/list?page=${page}`)
        .then((res) => res.data);
};

export default {
    getAll
};