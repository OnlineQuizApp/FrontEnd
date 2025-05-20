import { useEffect, useState } from "react";
import { detailQuestions,updateQuestions  } from "../service/QuestionService";
import {getAllCategory} from "../service/CategoryService";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "../css/admin-layout.css"
import * as Yup from "yup";
const QuestionsDetailComponent = () => {

    const [file, setFile] = useState(null);
    const [category, setCategory] = useState([]);
    const [answers, setAnswers] = useState([
        { content: '', correct: false },
        { content: '', correct: false },
        { content: '', correct: false },
        { content: '', correct: false }
    ]);
    const [questionDetail, setQuestionDetail] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [isUploading, setIsUploading] = useState(false);

    // Lấy thông tin câu hỏi theo ID
    useEffect(() => {
        const fetchData = async () => {
            const data = await detailQuestions(id);
            console.log("data"+data);
            setQuestionDetail(data);
            // Cập nhật câu hỏi và đáp án vào form
            if (data) {
                setAnswers(data.answers);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchCategory = async () => {
            const data = await getAllCategory();
            setCategory(data);

        };
        fetchCategory();
    }, []);

    if (!questionDetail) return <h1>Loading....</h1>;

    const handleAnswerChange = (index, field, value) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index][field] = value;
        setAnswers(updatedAnswers);
    };

    const handleEditQuestions = async (values) => {
        const formData = new FormData();
        formData.append("content", values.content);
        formData.append("categoryId", values.category);
        formData.append("answers", JSON.stringify(answers));
        if (file) {
            formData.append("file", file);
        }
        const hasCorrectAnswer = answers.some(answer => answer.correct);
        if (!hasCorrectAnswer) {
            toast.error("Phải có ít nhất một đáp án đúng!");
            return;
        }
        setIsUploading(true); // ⏳ Bắt đầu loading
        try {
            await updateQuestions(id, formData); // Gửi yêu cầu cập nhật câu hỏi
            navigate('/admin/questions'); // Chuyển hướng về danh sách câu hỏi
            toast.success('Cập nhật câu hỏi thành công!');
        } catch (error) {
            toast.error('Lỗi khi cập nhật câu hỏi!');
        }finally {
            setIsUploading(false); // ✅ Kết thúc loading
        }
    };

    const validationSchema = Yup.object({
        content: Yup.string()
            .required("Vui lòng nhập nội dung câu hỏi"),
        category: Yup.string()
            .required("Vui lòng chọn danh mục")
    });
    return (
        <>
            <div className="container">
                <h1>Chỉnh Sửa Câu Hỏi</h1>
                <Formik
                    initialValues={{
                        content: questionDetail?.content,
                        category: questionDetail?.category?.id,
                        answers: questionDetail?.answers,
                        img:questionDetail?.img
                    }}
                    onSubmit={handleEditQuestions} validationSchema={validationSchema} enableReinitialize={true}>
                    <Form>
                        <div>
                            <label>Nhập nội dung câu hỏi:</label>
                            <Field
                                name="content"
                                as="textarea"
                                placeholder="Nhập câu hỏi"
                                className="form-control"
                            />
                            <ErrorMessage name="content" component="div" className="text-danger"/>
                        </div>
                        {questionDetail.img !== null && (
                            <div className="mb-3">
                                <label className="form-label">Ảnh hiện tại:</label><br/>
                                <img src={questionDetail.img} alt="Câu hỏi" style={{ maxWidth: '200px', marginBottom: '10px' }} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control mt-2"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </div>
                        )}

                        <div>
                            <label>Chọn danh mục:</label>
                            <Field as="select" name="category" className="form-control">
                                <option value="">-- Chọn Danh Mục Câu Hỏi --</option>
                                {category && category.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="category" component="div" className="text-danger"/>
                        </div>

                        {answers && answers.map((answer, index) => (
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
                        <Button type="submit" variant="primary">
                            Cập nhật
                        </Button>
                    </Form>
                </Formik>
                {isUploading && (
                    <div className="text-center mt-3">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                        <p>Đang xử lý hình ảnh...</p>
                    </div>
                )}
            </div>
            </>
            );
            };

            export default QuestionsDetailComponent;