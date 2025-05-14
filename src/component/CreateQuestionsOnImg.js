import {useEffect, useState} from "react";
import {createQuestionsOnFileExcel, createQuestionsOnImg} from "../service/QuestionService";
import {getAllCategory} from "../service/CategoryService";

const CreateQuestionsOnImg = ()=>{
    const [img, setImg] = useState(null);
    const [message, setMessage] = useState('');
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(null);
    useEffect(() => {
        const fetchData = async ()=>{
            const data =await getAllCategory();
            setCategories(data);
        }
        fetchData();
    }, []);
    const [answers, setAnswers] = useState([
        { content: '', correct: false },
        { content: '', correct: false },
        { content: '', correct: false },
        { content: '', correct: false }
    ]);
    const handleImageChange = (e) => {                 // Hàm xử lý việc chọn file
        setImg(e.target.files[0]);                        // lấy file đầu tiên trong danh sách
    };
    const handleAnswerChange = (index, field, value) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index][field] = value;
        setAnswers(updatedAnswers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!img || !categoryId) {
            setMessage("❌ Vui lòng chọn một hình ảnh và danh mục.");
            return;
        }

        // Chuẩn bị dữ liệu gửi lên (ví dụ: gửi qua FormData nếu có ảnh)
        const formData = new FormData();
        formData.append("image", img);
        formData.append("answers", JSON.stringify(answers));
        formData.append("categoryId", categoryId);

        try {
            await createQuestionsOnImg(formData)
            setMessage("✅ Câu hỏi đã được thêm thành công!");
        } catch (error) {
            setMessage("❌ Lỗi khi thêm câu hỏi. Vui lòng thử lại!");
        }
    };

    return(
        <>
            <div className="container mt-5">
                <h3>🖼️ Thêm mới câu hỏi bằng hình ảnh</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Chọn ảnh đề bài:</label>
                        <input type="file" accept="image/*" className="form-control" onChange={handleImageChange}
                               required/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Chọn danh mục (Category ID):</label>
                        <select value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="form-select">
                            <option value="">-- Chọn danh mục --</option>
                            {categories && categories.map((c) => (
                                <option value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {answers.map((answer, index) => (
                        <div className="mb-3" key={index}>
                            <label className="form-label">Đáp án {index + 1}:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={answer.content}
                                onChange={(e) => handleAnswerChange(index, 'content', e.target.value)}
                                required
                            />
                            <div className="form-check mt-1">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={answer.correct}
                                    onChange={(e) => handleAnswerChange(index, 'correct', e.target.checked)}
                                />
                                <label className="form-check-label">Là đáp án đúng</label>
                            </div>
                        </div>
                    ))}

                    <button type="submit" className="btn btn-primary">Tải lên</button>
                </form>

                {message && <div className="mt-3 alert alert-info">{message}</div>}
            </div>
        </>
    );

}