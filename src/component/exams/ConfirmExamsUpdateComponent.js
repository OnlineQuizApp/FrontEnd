import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getExamsById, getQuestionsByCategory, confirmExamsUpdate, getExamsByIdUpdate} from "../../service/ExamsService";
import {toast} from "react-toastify";
import "../../css/admin-layout.css";
import {Button} from "react-bootstrap";

const ConfirmExamsUpdateComponent = () => {
    const [questions, setQuestions] = useState([]);
    const [existingQuestions, setExistingQuestions] = useState([]);
    const {id} = useParams();
    const [selectedQuestionsId, setSelectedQuestionsId] = useState([]);
    const navigate = useNavigate();
    const [isImageZoomed, setIsImageZoomed] = useState(false);
    const [zoomedQuestion, setZoomedQuestion] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getExamsByIdUpdate(id);
                const exams = res.exam;
                const examQuestions = res?.questions || [];
                const getQuestionByCategory = await getQuestionsByCategory(exams.category);
                const existingQuestionIds = examQuestions.flatMap(exam => exam.questions.map(q => q.id));
                const availableQuestions = getQuestionByCategory.filter(q => !existingQuestionIds.includes(q.id));
                if (availableQuestions.length === 0) {
                    toast.warn("Tất cả câu hỏi trong danh mục đã được gán cho đề thi hoặc không có câu hỏi mới!");
                }
                setQuestions(availableQuestions);
                setExistingQuestions(examQuestions);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu đề và câu hỏi", error);
                toast.error("Lỗi khi tải dữ liệu!");
            }
        };
        fetchData();
    }, [id]);

    const handleCheckboxChange = (questionId) => {
        setSelectedQuestionsId(prev => {
            if (prev.includes(questionId)) {
                return prev.filter(id => id !== questionId);
            } else {
                return [...prev, questionId];
            }
        });
    };

    const handleConfirm = async () => {
        try {
            console.log("Gửi yêu cầu confirmExamsUpdate với ID: ", id, ", Questions: ", selectedQuestionsId);
            await confirmExamsUpdate(id, selectedQuestionsId);
            navigate(`/admin/exams/update/${id}`);
            toast.success("Cập nhật đề thi thành công!");
        } catch (error) {
            console.error("Lỗi từ server:", error?.response?.data);
            toast.error("Lỗi: " + (error?.response?.data || "Không thể cập nhật đề thi!"));
        }
    };

    return (
        <>
            <h3>Chọn câu hỏi mới để thêm vào đề</h3>
            {questions.length > 0 ? (
                <table className="table table-sm table-success-custom mt-3">
                    <thead>
                    <tr>
                        <th>Số thứ tự</th>
                        <th>Nội dung câu hỏi</th>
                        <th>Hình ảnh hoặc video minh họa</th>
                        <th>Chọn câu hỏi<span className="text-danger">*</span></th>
                    </tr>
                    </thead>
                    <tbody>
                    {questions && questions.map((q, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>

                            <td>{q?.content}</td>
                            <td>
                                {q?.video == null && q?.img !== null ? (
                                    <div className="mb-3">
                                        <label className="form-label">Ảnh mô tả:</label><br/>
                                        <img
                                            src={q?.img}
                                            alt="Câu hỏi"
                                            style={{maxWidth: '200px', marginBottom: '10px'}}
                                            onClick={() => {
                                                setZoomedQuestion(q);
                                                setIsImageZoomed(true);
                                            }}
                                        />
                                    </div>
                                ) : q?.img == null && q?.video !== null ? (
                                    <div className="mb-3">
                                        <label className="form-label">Video mô tả:</label><br/>
                                        <video
                                            width="320"
                                            height="240"
                                            controls
                                            onClick={() => {
                                                setZoomedQuestion(q);
                                                setIsImageZoomed(true);
                                            }}
                                        >
                                            <source src={q?.video} type="video/mp4"/>
                                            Trình duyệt của bạn không hỗ trợ thẻ video.
                                        </video>
                                    </div>
                                ) : (
                                    <div className="mb-3">
                                        <p>Không có hình ảnh hoặc video mô tả</p>
                                    </div>
                                )}
                            </td>
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
                <p>Không có câu hỏi khả dụng trong danh mục này.</p>
            )}

            {isImageZoomed && zoomedQuestion && (
                <div className="zoom-overlay">
                    {zoomedQuestion?.img ? (
                        <img
                            src={zoomedQuestion?.img}
                            alt="Ảnh phóng to"
                            className="zoomed-image"
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : zoomedQuestion?.video ? (
                        <video
                            src={zoomedQuestion?.video}
                            controls
                            autoPlay
                            className="zoomed-video"
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <p>Không có hình ảnh hoặc video để hiển thị</p>
                    )}
                    <button className="close-button" onClick={() => setIsImageZoomed(false)}>
                        ×
                    </button>
                </div>
            )}

                <button
                    onClick={handleConfirm}
                    disabled={selectedQuestionsId.length === 0}
                    className="btn btn-sm btn-outline btn-hover"
                >
                    Thêm câu hỏi vào đề
                </button>

        </>
    );
};

export default ConfirmExamsUpdateComponent;