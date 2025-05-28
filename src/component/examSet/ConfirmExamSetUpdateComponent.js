import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import "../../css/admin-layout.css"
import {confirmExamSetUpdate, getAllExams, getExamSetByIdUpdate} from "../../service/ExamSetService";
import {Button} from "react-bootstrap";

const ConfirmExamSetUpdateComponent = () => {
    const [exam, setExam] = useState([]);
    const {id} = useParams();
    const [selectedQuestionsId, setSelectedQuestionsId] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const allExams = await getAllExams();
                const data = await getExamSetByIdUpdate(id);
                const examSet = data?.examSetDetailDto || [];
                const currentExamIds = examSet.flatMap(e => e.exams.map(exam => exam.id));
                const filterExams = allExams.filter(e => !currentExamIds.includes(e.id));
                if (filterExams.length===0){
                    toast.warn("Tất cả đề thi trong hệ thống đã hết hoặc không có đề thi nào mới!");
                }
                setExam(filterExams);

            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu đề và câu hỏi", error);
            }
        }
        fetchData();
    }, [id]);
    const handleCheckboxChange = (questionId) => {
        setSelectedQuestionsId(prev => {
            if (prev.includes(questionId)) {
                return prev.filter(id => id !== questionId); // nếu admin chọn thì cập nhật lại id câu hỏi
            } else {
                return [...prev, questionId];
            }
        });
    };
    const handleConfirm = async () => {
        try {
            await confirmExamSetUpdate(id, selectedQuestionsId);
            navigate('/admin/exams-set-update/detail/' + id);
            toast.success("Cập nhật bộ đề thi thành công!")
        } catch (error) {
            toast.error("Lỗi: " + error?.response?.data)
        }
    };
    return (
        <>
            <h2 className="mb-4" style={{fontSize: "1.5rem", fontWeight: "bold"}}>Chọn đề thi cho bộ đề</h2>
            {exam.length > 0 ? (
                <table className="table table-sm table-success-custom mt-3">
                    <thead>
                    <tr>
                        <th>Số thứ tự</th>
                        <th>Tên đề thi</th>
                        <th>Chọn đề thi<span className="text-danger">*</span></th>
                    </tr>
                    </thead>
                    <tbody>
                    {exam && exam.map((q, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{q.title}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedQuestionsId.includes(q.id)}
                                    onChange={() => handleCheckboxChange(q.id)}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>Đã hết đề thi trong hệ thống</p>)}
            <div>
                <button className="btn btn-sm btn-outline btn-hover" onClick={handleConfirm}
                        disabled={selectedQuestionsId.length === 0}>
                    Xác nhận thêm các đề thi này
                </button>
            </div>
        </>
    );
}
export default ConfirmExamSetUpdateComponent;