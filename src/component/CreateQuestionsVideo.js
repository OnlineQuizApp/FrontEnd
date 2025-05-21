import {useEffect, useState} from "react";
import {createQuestionsOnImg, createQuestionsOnVideo} from "../service/QuestionService";
import {getAllCategory} from "../service/CategoryService";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import "../css/admin-layout.css"
import {Button} from "react-bootstrap";
const CreateQuestionsVideo = ()=>{
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(null);
    const [content, setContent] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const MAX_SIZE_BYTES = 50 * 1024 * 1024; //  tối dđa 50mb
    useEffect(() => {
        const fetchData = async ()=>{
            const data =await getAllCategory();
            setCategories(data);
        }
        fetchData();
    }, []);
    useEffect(() => {
        if (message) {
            toast.error(message);
        }
    }, [message]);
    const [answers, setAnswers] = useState([
        { content: '', correct: false },
        { content: '', correct: false },
        { content: '', correct: false },
        { content: '', correct: false }
    ]);
    const handleImageChange = (e) => {                 // Hàm xử lý việc chọn file
        setFile(e.target.files[0]);                        // lấy file đầu tiên trong danh sách
    };
    const handleAnswerChange = (index, field, value) => {
        const updatedAnswers = [...answers];  // hàm xử lý checkbox chọn đáp án đúng
        updatedAnswers[index][field] = value;
        setAnswers(updatedAnswers);
    };
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file ) {
            setMessage("❌ Vui lòng chọn một video !");
            return;
        }
        if (!categoryId ) {
            setMessage("❌ Vui lòng chọn một danh mục câu hỏi !");
            return;
        }

        // Chuẩn bị dữ liệu gửi lên (ví dụ: gửi qua FormData nếu có ảnh)
        const formData = new FormData();
        formData.append("file", file);
        formData.append("categoryId", categoryId);
        formData.append("content", content);
        formData.append("answers", JSON.stringify(answers));

        const hasCorrectAnswer = answers.some(answer => answer.correct);
        if (!hasCorrectAnswer) {
            toast.error("Phải có ít nhất một đáp án đúng!");
            return;
        }
        const isAnyAnswerTooLong = answers.some(answer => answer.content.length > 1000);
        if (isAnyAnswerTooLong) {
            toast.error("Có đáp án vượt quá 1000 kí tự, vui lòng kiểm tra lại!");
            return ;
        }
        if (file.size > MAX_SIZE_BYTES) {
            toast.error(`Video quá lớn, vui lòng chọn file nhỏ hơn ...\`${MAX_SIZE_BYTES}\` MB`);
            return;
        }
        setIsUploading(true); // ⏳ Bắt đầu loading
        try {
            await createQuestionsOnVideo(formData);
            navigate('/admin/questions');
            toast.success("Câu hỏi đã được thêm thành công! ");
        } catch (error) {
            setMessage("❌ Lỗi khi thêm câu hỏi. Vui lòng thử lại!");
        }finally {
            setIsUploading(false); // ✅ Kết thúc loading
        }
    };
    const handleCorrectAnswerChange = (index) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index].correct = !updatedAnswers[index].correct; // đảo trạng thái đúng/sai
        setAnswers(updatedAnswers);
    }; /// hàm check đáp án đúng sai khi click bào checkbox
    const back =()=>{
        navigate('/admin/questions')
    }
    const handleConfirmDeleteAnswers = () => {
        setAnswers([
            {content: '', correct: false},
            {content: '', correct: false},
            {content: '', correct: false},
            {content: '', correct: false}
        ]);
        setShowConfirmModal(false);
    };
    const showModal = () => {
        setShowConfirmModal(true);
    };
    return(
        <>
            {/*<div className="container mt-5">*/}
            <h2 className="mb-4" style={{fontSize: "1.5rem", fontWeight: "bold"}}>🎥 Thêm Mới Câu Hỏi Bằng Video</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Chọn video đề bài <span className="text-danger">*</span> </label>
                    <input type="file"
                           accept="video/mp4"
                           className="form-control" onChange={handleImageChange}
                               required
                               onInvalid={e => e.target.setCustomValidity('Vui lòng chọn một video đại diện cho đề bài!')}
                               onInput={e => e.target.setCustomValidity('')}/>
                    </div>
                    <div className="mb-3">
                        <select value={categoryId}
                                onChange={(e) => setCategoryId(Number(e.target.value))}
                                className="form-select">
                            <option value="">-- Chọn danh mục --</option>
                            {categories && categories.map((c) => (
                                <option value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Nội dung câu hỏi <span className="text-danger">*</span> </label>
                        <textarea
                            className="form-control"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Nhập mô tả hoặc nội dung câu hỏi ..."
                            rows={3}
                            required
                            onInvalid={e => e.target.setCustomValidity('Vui lòng không để trống trường này')}
                            onInput={e => e.target.setCustomValidity('')}
                        />
                    </div>

                    <table className="table table-sm table-success-custom mt-3">
                        <thead>
                        <tr>
                            <th>Nội dung đáp án <span className="text-danger">*</span></th>
                            <th>Chọn đáp án đúng <span className="text-danger">*</span></th>
                        </tr>
                        </thead>
                        <tbody>
                        {answers.map((answer, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nhập nội dung đáp án..."
                                        value={answer.content}
                                        onChange={(e) => handleAnswerChange(index, 'content', e.target.value)}
                                        required
                                        onInvalid={e => e.target.setCustomValidity('Vui lòng nhập đáp án không được để trống!')}
                                        onInput={e => e.target.setCustomValidity('')}
                                    />
                                </td>
                                <td className="text-start align-middle">
                                    <input
                                        type="checkbox"
                                        checked={answer.correct}
                                        onChange={() => handleCorrectAnswerChange(index)}
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap">
                    <div className="d-flex gap-3  flex-wrap">
                        <div className="d-flex gap-3  flex-wrap">
                            <button onClick={back}
                                    type="button" className="btn btn-sm btn-outline btn-hover"
                                    disabled={isUploading}>
                                {isUploading ? 'Đang tải...' : 'Quay lại'}
                            </button>
                            <button type="submit" className="btn btn-sm btn-outline btn-hover"
                                    disabled={isUploading}>
                                {isUploading ? 'Đang tải...' : 'Tải lên'}
                            </button>
                        </div>
                    </div>
                    <a
                        style={{
                            textAlign: 'end',
                            pointerEvents: isUploading ? 'none' : 'auto',
                            opacity: isUploading ? 0.6 : 1
                        }}
                        onClick={showModal}
                    >
                        {isUploading ? 'Đang tải...' : 'Xoá hết đáp án'}
                    </a>
                </div>
            </form>
            {showConfirmModal && (
                <div className="modal-overlay">
                    <div className="custom-modal">
                        <h4>Xoá hết nội dung đáp án trong biểu mẫu?</h4>
                        <p>
                            Thao tác này sẽ xoá nội dung đáp án của bạn trong biểu mẫu. Bạn sẽ không thể
                            huỷ được thao tác này sau khi thực hiện.
                        </p>
                        <div className="modal-buttons">
                            <button className="cancel-btn" onClick={() => setShowConfirmModal(false)}>
                            Huỷ
                                </button>
                                <button className="delete-btn" onClick={handleConfirmDeleteAnswers}>
                                    Xoá hết nội dung đáp án
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {isUploading && (
                    <div className="text-center mt-3">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                        <p>Đang xử lý video...</p>
                    </div>
                )}
            {/*</div>*/}
        </>
    );

}
export default CreateQuestionsVideo;