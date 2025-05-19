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
        const updatedQuestion = {
            content: values.content, // Nội dung câu hỏi
            category: values.category, // ID danh mục
            answers: answers // Mảng các đáp án
        };
        const hasCorrectAnswer = answers.some(answer => answer.correct);
        if (!hasCorrectAnswer) {
            toast.error("Phải có ít nhất một đáp án đúng!");
            return;
        }
        try {
            await updateQuestions(id, updatedQuestion); // Gửi yêu cầu cập nhật câu hỏi
            navigate('/admin/questions'); // Chuyển hướng về danh sách câu hỏi
            toast.success('Cập nhật câu hỏi thành công!');
        } catch (error) {
            toast.error('Lỗi khi cập nhật câu hỏi!');
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
                        answers: questionDetail?.answers
                    }}
                    onSubmit={handleEditQuestions} validationSchema={validationSchema}>
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
            </div>
            </>
            );
            };

            export default QuestionsDetailComponent;