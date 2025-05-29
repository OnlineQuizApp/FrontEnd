import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;


const token = localStorage.getItem("token");
const authHeader = token ? {headers: {Authorization: `Bearer ${token}`}} : {};// không gửi gì cả nếu không có token

export async function getAllExams(page, category,title) {
    try {
        const response = await axios.get(`${apiUrl}/api/exams?page=${page}&category=${category}&title=${title}`, authHeader);
        const data = response.data.content;
        const totalPage = response.data.totalPages;
        return {data, totalPage}
    } catch (e) {
        console.log("Lỗi lấy dữ liệu: " + e)
    }
}

export async function createExamsRandom(newExams) {
        const response = await axios.post(`${apiUrl}/api/exams`, newExams, authHeader);

}

export async function createExams(newExams) {
        const response = await axios.post(`${apiUrl}/api/exams/create`, newExams, authHeader);
        return response.data;
}


export async function updateExams(id, newExams) {
        const response = await axios.put(`${apiUrl}/api/exams/${id}`, newExams, authHeader);

}

export async function deleteExams(id) {
    try {
        const response = await axios.delete(`${apiUrl}/api/exams/${id}`, authHeader);
        return response.data;
    } catch (e) {
        console.log("Lỗi xoá dữ liệu: " + e)
    }
}

export async function detailExams(id, page) {
    try {
        const response = await axios.get(`${apiUrl}/api/exams/${id}?page=${page}`, authHeader);
        const data = response.data.content;
        const totalPage = response.data.totalPages;
        return {data, totalPage}
    } catch (e) {
        console.log("Lỗi lấy dữ liệu: " + e)
    }
}

export async function getQuestionsByCategory(category) {
    const response = await axios.get(`${apiUrl}/api/exams/questions-by-category/${category}`, authHeader);
    return response.data
}

export async function getExamsById(id) {
    const response = await axios.get(`${apiUrl}/api/exams/findById/${id}`, authHeader);
    return response.data

}

export async function getExamsByIdUpdate(id) {
    const response = await axios.get(`${apiUrl}/api/exams/findByIdForUpdate/${id}`, authHeader);
    return response.data

}

export async function confirmExams(id, listQuestionsId) {

    const response = await axios.post(`${apiUrl}/api/exams/create-confirm/${id}`, listQuestionsId, authHeader);

}
export async function confirmExamsUpdate(id, listQuestionsId) {
    const response = await axios.post(`${apiUrl}/api/exams/update-confirm/${id}`, listQuestionsId, authHeader);
}
export async function deleteQuestionsOfExams(idExams, idQuestions) {
    const response = await axios.delete(`${apiUrl}/api/exams/delete-questions-of-exams/${idExams}/${idQuestions}`,authHeader);
}