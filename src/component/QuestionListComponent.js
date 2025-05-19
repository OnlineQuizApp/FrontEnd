import {useEffect, useState} from "react";
import {deleteQuestions, getAllQuestions} from "../service/QuestionService";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Button, Modal} from "react-bootstrap";
import {Link} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import '../admin-layout.css'

const QuestionService = () => {
    const [questions, setQuestions] = useState([]);
    const [page, setPage] = useState(0);
    const [categorySearch, setCategorySearch] = useState('')
    const [totalPage, setTotalPage] = useState(0);
    const [isShowModal, setIsShowModal] = useState(false);
    const [questionsContent, setQuestionsContent] = useState(null);
    const [idDelete, setIdDelete] = useState(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            const {data, totalPage} = await getAllQuestions(page, categorySearch);
            setQuestions(data);
            setTotalPage(totalPage);
        }
        fetchData();
    }, [loading, page, categorySearch]);
    const handleNextPage = () => {
        if (page < totalPage - 1) {
            setPage((preV) => preV + 1)
        }
    }
    const handlePrePage = () => {
        if (page > 0) {
            setPage((preV) => preV - 1)
        }
    }
    const reloading = () => {
        setLoading((pre) => !pre)
    }
    const handleSearch = async (value) => {
        setCategorySearch(value.category)
        const {data, totalPage} = await getAllQuestions(0, categorySearch);
        setQuestions(data)
        setTotalPage(totalPage);
        setPage(0);
    }
    const closeModal = () => {
        setIsShowModal((pre) => !pre)
    }
    const handleDeleteQuestions = async () => {
        await deleteQuestions(idDelete);
        closeModal();
        reloading();
    }
    const handleShowModal = (id, content) => {
        setIsShowModal((pre) => !pre);
        setQuestionsContent(content);
        setIdDelete(id)
    }


    return (
        <>

            <div className="container">
                <h2 className="mb-4">Danh Sách Câu Hỏi</h2>
                <div className="question-service-wrapper">
                    <Formik initialValues={{
                        category: ''
                    }} onSubmit={handleSearch}>
                        <Form>
                            <label>Nhập Loại Câu Hỏi Cần Tìm</label>
                            <Field name={'category'} type={'text'}/>
                            <ErrorMessage style={{color: 'red'}} name={'category'} component={'div'}/>
                            <button className={'btn btn-sm btn-outline-primary'} type={'submit'}>Tìm Kiếm</button>
                        </Form>
                    </Formik>
                    <div className="container mt-5">
                        <table className="table table-bordered mt-4">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nội Dung Câu Hỏi</th>
                                <th>Loại Câu Hỏi</th>
                                <th>Hình ảnh</th>
                                <th>Chi tiết</th>
                                <th>Xoá</th>
                            </tr>
                            </thead>
                            <tbody>
                            {questions && questions.map(q => (
                                <tr key={q.id}>
                                    <td>{q.id}</td>
                                    <td>{q.content}</td>
                                    <td>{q?.category?.name}</td>
                                    <td>{q.img ? q.img : 'không có hình ảnh'}</td>
                                    <td>
                                        <Link className={'btn btn-sm btn-outline-success btn-hover'}
                                              to={'detail/' + q.id}>
                                            Chi tiết
                                        </Link>
                                    </td>
                                    <td>
                                        <button className={'btn btn-sm btn-outline-success btn-hover'} onClick={() => {
                                            handleShowModal(q.id, q.content)
                                        }}>
                                            Xoá
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <Modal show={isShowModal} onHide={closeModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Xác nhận xoá</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>Bạn có muốn xoá câu hỏi "{questionsContent}" này không?</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={closeModal}> Huỷ</Button>
                                <Button variant="primary" onClick={handleDeleteQuestions}>Xác Nhận Xoá</Button>
                            </Modal.Footer>
                        </Modal>
                        <div style={{justifyContent: 'center', textAlign: 'center'}}>
                            <button className={'btn btn-sm btn-outline-success btn-hover'}
                                    onClick={() => (handlePrePage())}>Trang
                                Trước
                            </button>
                            {[...new Array(totalPage)].map((p, i) => (
                                <button
                                    className={`btn btn-sm btn-outline-success btn-hover ${page === i ? 'active' : ''}`}
                                    onClick={() => (setPage(i))}>{i + 1}</button>
                            ))}
                            <button className={'btn btn-sm btn-outline-success btn-hover'}
                                    onClick={() => (handleNextPage())}>Trang
                                Sau
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default QuestionService;