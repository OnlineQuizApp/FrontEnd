import {useEffect, useState} from "react";
import {getAllCategory} from "../../service/CategoryService";
import {useNavigate, useParams} from "react-router-dom";
import {deleteQuestionsOfExams, getExamsByIdUpdate, updateExams} from "../../service/ExamsService";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {toast} from "react-toastify";
import './../../css/admin-layout.css'
import {Button} from "react-bootstrap";

const UpdateExamsComponent = () => {
    const [exams, setExams] = useState('')
    const [category, setCategory] = useState('');
    const [questions, setQuestions] = useState([]);
    const [idQuestionsDelete, setIdQuestionsDelete] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const categoryData = await getAllCategory();
                const data = await getExamsByIdUpdate(id);
                setCategory(categoryData || []);
                setExams(data.exam || {});
                setQuestions(data.questions || []);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu đề thi:', error);
                // Có thể thêm toast lỗi hoặc xử lý tùy ý
            }
        }
        fetchData();
    }, [loading]);
    const navigate = useNavigate();

    const handleUpdateExams = async (value) => {
        try {
            await updateExams(id, value);
            navigate('/admin/exams');
            toast.success("Chỉnh sửa đề thi thành công!")
        } catch (error) {
            toast.error("Đề thi đã tồn tại trong hệ thống!")
        }


    }
    const handleCreateExams = () => {
        navigate('/admin/exams/confirmUpdate/' + id)
    }
    const handleConfirmDeleteAnswers = async () => {
        try {
            await deleteQuestionsOfExams(id, idQuestionsDelete);
            setShowConfirmModal(false);
            setLoading((pre) => !pre);
            toast.success("Xoá câu hỏi thành công!");
            setIdQuestionsDelete(null);
            try {
                const data = await getExamsByIdUpdate(id);
                setExams(data.exam || {});
                setQuestions(data.questions || []);
            } catch (error) {

                setExams({});
                setQuestions([]);
            }
        } catch (error) {
            toast.error("Xoá câu hỏi thất bại!");
        }
    }
    return (
        <>
            <h2 className="mb-4" style={{fontSize: "1.5rem", fontWeight: "bold"}}>Chỉnh Sửa Đề Thi</h2>
            <Formik initialValues={exams || {
                id: "",
                title: "",
                category: "",
                numberOfQuestions: "",
                testTime: ""
            }} onSubmit={handleUpdateExams} enableReinitialize={true}>
                {({dirty}) => (
                    <Form>
                        <label>Nhập tiêu đề</label>
                        <Field name={'id'} type={'hidden'}></Field>
                        <Field name={'title'}></Field>
                        <ErrorMessage name={'title'} component={'div'}></ErrorMessage>
                        <label>Chọn danh mục</label>
                        <Field as={'select'} name={'category'} disabled>
                            <option>--- Chọn danh mục đề thi</option>
                            {category && category.map((c) => (
                                <option value={c.name}>{c.name}</option>
                            ))}
                        </Field>
                        <ErrorMessage name={'category'} component={'div'}></ErrorMessage>
                        <label>Nhập số câu hỏi</label>
                        <Field name={'numberOfQuestions'} disabled></Field>
                        <ErrorMessage name={'numberOfQuestions'} component={'div'}></ErrorMessage>
                        <label>Nhập thời gian làm bài</label>
                        <Field name={'testTime'}></Field>
                        <ErrorMessage name={'testTime'} component={'div'}></ErrorMessage>
                        <div
                            style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: '15px',   // khoảng cách trên
                                marginBottom: '15px' // khoảng cách dưới
                            }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-between',  // giãn đều 2 đầu trái phải
                                    alignItems: 'center',             // canh giữa theo chiều dọc
                                    marginTop: '15px',
                                    marginBottom: '15px'
                                }}
                            >
                                <h2 className="title" style={{margin: 0}}>
                                    Danh sách các câu hỏi có trong đề
                                </h2>
                                <div className="button-group">
                                    {dirty && (
                                        <Button
                                            type="submit"
                                            className="btn btn-sm btn-outline btn-hover"
                                            style={{marginRight: '10px'}}
                                        >
                                            Chỉnh sửa
                                        </Button>
                                    )}
                                    <Button
                                        onClick={handleCreateExams}
                                        className="btn btn-sm btn-outline btn-hover"
                                    >
                                        Thêm câu hỏi
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}

            </Formik>
            <div>

                {questions && questions.length > 0 ? (
                    questions.map((q, index) => (
                        <div key={index}>
                            <div className="question-item" key={index}>
                                <div className="question-content">
                                    Câu {index + 1}: {q.questions[0]?.content || "Không có nội dung"}
                                </div>
                                <label
                                    className="delete-label"
                                    onClick={() => {
                                        setIdQuestionsDelete(q.questions[0]?.id);
                                        setShowConfirmModal(true);
                                    }}
                                >
                                    ❌
                                </label>
                            </div>
                            {q.img && <img src={q.img} alt="Hình ảnh" style={{maxWidth: "200px"}}/>}
                            {q.video && <video src={q.video} controls style={{maxWidth: "200px"}}/>}
                            <ul>
                                {q.questions[0]?.examAnswers?.map((a, i) => (
                                    <li key={i}>{a.content} ({a.correct ? "Đúng" : "Sai"})</li>
                                ))}
                            </ul>
                            <hr/>
                        </div>
                    ))
                ) : (
                    <p>Không có câu hỏi</p>
                )}
            </div>
            {showConfirmModal && (
                <div className="modal-overlay">
                    <div className="custom-modal">
                        <h4>Xác nhận xoá câu hỏi này khỏi đề thi?</h4>
                        <p>
                            Thao tác này sẽ xoá nội dung câu hỏi của bạn trong đề thi. Bạn sẽ không thể
                            huỷ được thao tác này sau khi thực hiện.
                        </p>
                        <div className="modal-buttons">
                            <button className="cancel-btn" onClick={() => setShowConfirmModal(false)}>
                                Huỷ
                            </button>
                            <button className="delete-btn" onClick={handleConfirmDeleteAnswers}>
                                Xác nhận xoá câu hỏi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
export default UpdateExamsComponent;