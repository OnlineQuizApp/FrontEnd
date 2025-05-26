import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import "../../css/admin-layout.css"
import {confirmExamSet, getAllExams, getExamsSetById} from "../../service/ExamSetService";

const ConfirmExamSetComponent = () => {
    const [exam, setExam] = useState([]);
    const {id} = useParams();
    const [selectedQuestionsId, setSelectedQuestionsId] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const exam = await getAllExams();
                console.log("Tất cả đề thi :",exam)
                setExam(exam);
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
            await confirmExamSet(id, selectedQuestionsId);
            navigate('/admin/exams-set')
            toast.success("Thêm bộ đề thi thành công!")
        } catch (error) {
            toast.error("Lỗi: " + error?.response?.data)
        }
    };
    return (
        <>
            <h2 className="mb-4" style={{fontSize: "1.5rem", fontWeight: "bold"}}>Chọn đề thi cho bộ đề</h2>
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
            <button   className="btn btn-sm btn-outline btn-hover" onClick={handleConfirm} disabled={selectedQuestionsId.length === 0}>
                Xác nhận chọn đề thi
            </button>
        </>
    );
}
export default ConfirmExamSetComponent;