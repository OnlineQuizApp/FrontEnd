import {ErrorMessage, Field, Form, Formik} from "formik";
import {useEffect, useState} from "react";
import {getAllCategory} from "../service/CategoryService";
import {createQuestions} from "../service/QuestionService";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const CreateQuestionsComponent = ()=>{
    const [category,setCategory]=useState([]);
    useEffect(() => {
        const fetchData = async ()=>{
            const data =await getAllCategory();
            setCategory(data);
        }
        fetchData();
    }, []);
        const navigate = useNavigate();
    const [answers, setAnswers] = useState([
        { content: '', correct: false },
        { content: '', correct: false },
        { content: '', correct: false },
        { content: '', correct: false }
    ]);
    const handleCreateQuestions= async (value)=>{
        const newQuestion = {
            content: value.content,  // Nội dung câu hỏi
            category: value.category,  // ID danh mục
            answers: answers  // Mảng các đáp án
        };
        console.log(newQuestion.categoryId+"---------------")
        try {
            await createQuestions(newQuestion);  // Gửi dữ liệu lên API
            navigate('/questions');  // Chuyển hướng sau khi thêm câu hỏi thành công
            toast.success('Thêm mới câu hỏi thành công!');
        } catch (error) {
            toast.error('Lỗi khi thêm câu hỏi!');
        }

      navigate('/questions');
      toast.success('Thêm mới thành công!');
    }
    const handleAnswerChange = (index, field, value) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index][field] = value;
        setAnswers(updatedAnswers);
    };
    return (
        <>
            <h1>Thêm Câu Hỏi</h1>
            <Formik
                initialValues={{
                    content: '',
                    category: ''
                }}
                onSubmit={handleCreateQuestions}
            >
                <Form>
                    <div>
                        <label>Nhập nội dung câu hỏi:</label>
                        <Field
                            name="content"
                            as="textarea"
                            placeholder="Nhập câu hỏi"
                            className="form-control"
                        />
                        <ErrorMessage name="content" component="div" className="text-danger" />
                    </div>

                    <div>
                        <label>Chọn danh mục:</label>
                        <Field as="select" name="category" className="form-control">
                            <option value="">-- Chọn Danh Mục Câu Hỏi --</option>
                            {category && category.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </Field>
                        <ErrorMessage name="category" component="div" className="text-danger" />
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

                    <Button type="submit" variant="primary">
                        Thêm mới
                    </Button>
                </Form>
            </Formik>
        </>
    );
}
export default CreateQuestionsComponent;