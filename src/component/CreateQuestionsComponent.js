    import {ErrorMessage, Field, Form, Formik} from "formik";
    import {useEffect, useState} from "react";
    import {getAllCategory} from "../service/CategoryService";
    import {createQuestions} from "../service/QuestionService";
    import {Button, Modal} from "react-bootstrap";
    import {useNavigate} from "react-router-dom";
    import {toast} from "react-toastify";
    import "../css/admin-layout.css"
    import * as Yup from 'yup';
    import 'bootstrap/dist/js/bootstrap.min.js'
    import 'bootstrap/dist/css/bootstrap.min.css'
    import "../css/ModalConfirm.css";
    const CreateQuestionsComponent = ()=>{
        const [category,setCategory]=useState([]);
        const [showConfirmModal, setShowConfirmModal] = useState(false);
        const [message, setMessage] = useState('');
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
            const hasCorrectAnswer = answers.some(answer => answer.correct);
            if (!hasCorrectAnswer) {
                toast.error("Phải có ít nhất một đáp án đúng!");
                return;
            }
            try {
                await createQuestions(newQuestion);  // Gửi dữ liệu lên API
                navigate('/admin/questions');  // Chuyển hướng sau khi thêm câu hỏi thành công
                toast.success('Thêm mới câu hỏi thành công!');
            } catch (error) {
                let errorMsg = 'Đã xảy ra lỗi!';
                if (Array.isArray(error.response?.data)) {
                    errorMsg = error.response.data.map(e => e.defaultMessage).join(', ');
                } else {
                    errorMsg = error.response?.data || errorMsg;
                }
                setMessage(errorMsg);
            }
        }
        const handleCorrectAnswerChange = (index) => {
            const updatedAnswers =[...answers]
            updatedAnswers[index].correct=!updatedAnswers[index].correct
            setAnswers(updatedAnswers);
        }; /// hàm check đáp án đúng sai khi click bào checkbox
        const handleAnswerChange = (index, field, value) => {
            const updatedAnswers = [...answers];
            updatedAnswers[index][field] = value;
            setAnswers(updatedAnswers);
        }; // hàm nhập đáp án
        const validationSchema = Yup.object({
            content: Yup.string()
                .required("Vui lòng nhập nội dung câu hỏi").max(1000,"Đáp án không được quá 1000 kí tự"),
            category: Yup.string()
                .required("Vui lòng chọn danh mục")
        });
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


        const [errors, setErrors] = useState({}); // để lưu lỗi từ backend
        return (
            <>
                <h2 className="mb-4" style={{fontSize: "1.5rem", fontWeight: "bold"}}> Thêm Mới Câu Hỏi</h2>
                <Formik
                    initialValues={{
                        content: '',
                        category: ''
                    }}
                    onSubmit={handleCreateQuestions} validationSchema={validationSchema}>
                    <Form>
                        <div>
                            <label>
                                Nhập nội dung câu hỏi <span className="text-danger">*</span>
                            </label>
                            <Field
                                name="content"
                                as="textarea"
                                placeholder="Nhập câu hỏi"
                                className="form-control"
                            />
                            {errors.content && <div style={{color: "red"}}>{errors.content}</div>}
                            <ErrorMessage name="content" component="div" className="text-danger"/>
                        </div>
                        <div className="d-flex align-items-center gap-1 my-2">
                            <Field as="select" name="category" className="form-control">
                                <option value="">-- Chọn Danh Mục Câu Hỏi--</option>
                                {category && category.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="category" component="div" className="text-danger mt-1"/>
                            <Button
                                type="button"
                                className="btn btn-sm btn-outline btn-hover py-0.3 px-0.3"
                                style={{whiteSpace: "nowrap", fontSize: "1.1rem"}}
                                onClick={() => navigate('/admin/category/create')}
                            >
                                Thêm Danh mục
                            </Button>
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
                            <div className="d-flex gap-3 flex-wrap">
                                <Button onClick={back}
                                        type="button"
                                        className="btn btn-sm btn-outline-back btn-hover">
                                    Quay lại
                                </Button>
                                <Button type="submit" className="btn btn-sm btn-outline btn-hover">
                                    Thêm mới
                                </Button>
                            </div>
                                <a
                                    style={{cursor: 'pointer'}}
                                    type="button"
                                    onClick={() => {
                                        showModal()
                                    }}
                                >Xoá hết đáp án</a>
                        </div>
                    </Form>
                </Formik>
                {message && <div className="mt-3">{message}</div>}
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
            </>
        );
    }
    export default CreateQuestionsComponent;