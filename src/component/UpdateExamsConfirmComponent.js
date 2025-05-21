import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {confirmExams, getExamsById, getQuestionsByCategory} from "../service/ExamsService";
import {toast} from "react-toastify";

const UpdateExamsConfirmComponent = ()=>{
    const [questions, setQuestions] = useState([]);
    const {id} = useParams();
    const [selectedQuestionsId, setSelectedQuestionsId] = useState([]);
    const navigate = useNavigate();
    const [isImageZoomed, setIsImageZoomed] = useState(false);
    const [zoomedQuestion, setZoomedQuestion] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const exams = await getExamsById(id);
                const data = await getQuestionsByCategory(exams.category);
                console.log("Exams lấy được:", exams);
                console.log("Category của đề:", exams.category);
                console.log("Danh sách câu hỏi theo category:", data);
                setQuestions(data);
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
            await confirmExams(id, selectedQuestionsId);
            console.log("danh  sách câu hỏi: " + selectedQuestionsId)
            navigate('/admin/exams')
            toast.success("Chỉnh sửa  đề thi thành công!")
        } catch (error) {
            toast.error("Lỗi: " + error?.response?.data)
        }
    };
    return (
        <>
            <h2 className="mb-4" style={{fontSize: "1.5rem", fontWeight: "bold"}}>Chọn câu hỏi cho đề thi</h2>
            <table className="table table-sm table-success-custom mt-3">
                <thead>
                <tr>
                    <th>Số thứ tự</th>
                    <th>Nội dung câu hỏi</th>
                    <th>Hình ảnh hoặc video minh hoạ</th>
                    <th>Chọn câu hỏi<span className="text-danger">*</span></th>
                </tr>
                </thead>
                <tbody>
                {questions && questions.map((q, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{q.content}</td>
                        {q.video == null && q.img !== null ? (
                            <div className="mb-3">
                                <label className="form-label">Ảnh mô tả câu hỏi:</label><br/>
                                <img src={q.img} alt="Câu hỏi"
                                     style={{maxWidth: '200px', marginBottom: '10px'}}
                                     onClick={() => {
                                         setZoomedQuestion(q);
                                         setIsImageZoomed(true);
                                     }}/>
                            </div>
                        ) : q.img == null && q.video !== null ? (
                                <div className="mb-3">
                                    <label className="form-label">Video mô tả câu hỏi:</label><br/>
                                    <video width="320" height="240" controls
                                           onClick={() => {
                                               setZoomedQuestion(q);
                                               setIsImageZoomed(true);
                                           }}
                                    >
                                        <source src={q?.video} type="video/mp4"/>
                                        Trình duyệt của bạn không hỗ trợ thẻ video.
                                    </video>
                                </div>
                            ) :
                            <div className="mb-3">
                                <p>Không có hình ảnh hoặc video mô tả</p>
                            </div>}
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
            {isImageZoomed && zoomedQuestion && (
                <div className="zoom-overlay">
                    {zoomedQuestion.img ? (
                        <img
                            src={zoomedQuestion.img}
                            alt="Ảnh phóng to"
                            className="zoomed-image"
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : zoomedQuestion.video ? (
                        <video
                            src={zoomedQuestion.video}
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
            <button onClick={handleConfirm} disabled={selectedQuestionsId.length === 0}>
                Xác nhận chọn câu hỏi
            </button>
        </>
    );
}
export default UpdateExamsConfirmComponent;
