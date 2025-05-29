import {useEffect, useState} from "react";
import {deleteQuestions, getAllQuestions} from "../../service/QuestionService";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Link} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import '../../css/admin-layout.css'
import '../../css/IconMessage.css'
import {getAllCategory} from "../../service/CategoryService";


const QuestionService = () => {
    const [questions, setQuestions] = useState([]);
    const [page, setPage] = useState(0);
    const [questionContentSearch, setQuestionContentSearch] = useState('')
    const [categorySearch, setCategorySearch] = useState('')
    const [totalPage, setTotalPage] = useState(0);
    const [isShowModal, setIsShowModal] = useState(false);
    const [questionsContent, setQuestionsContent] = useState(null);
    const [idDelete, setIdDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const {data, totalPage} = await getAllQuestions(page, questionContentSearch, categorySearch);
            console.log(data)
            setQuestions(data);
            setTotalPage(totalPage);
            const category = await getAllCategory();
            setCategories(category);
        }
        fetchData();
    }, [loading, page, questionContentSearch, categorySearch]);
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
        setQuestionContentSearch(value.content)
        setCategorySearch(value.category);
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

    const renderPagination = () => {
        let startPage = Math.max(0, page - 1);
        let endPage = Math.min(totalPage - 1, page + 1);

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages.map(p => (
            <button
                key={p}
                className={`btn btn-sm btn-outline btn-hover ${page === p ? ' active  ' : ' '}`}
                onClick={() => setPage(p)}
                style={{marginRight: 4, marginLeft: 4}}
            >
                {p + 1}
            </button>
        ));
    };

    return (
        <>
            <h2 className="mb-4" style={{fontSize: "1.5rem", fontWeight: "bold"}}>Danh Sách Câu Hỏi</h2>
            <div className="question-service-wrapper">
                <div className="container mt-5">
                    <div className=" mt-4">
                        <Formik
                            initialValues={{content: '', category: ''}}
                            onSubmit={handleSearch}
                        >
                            <Form className="d-flex align-items-center gap-2 flex-wrap mb-1 mt-3">
                                <Field
                                    placeholder="Nhập nội dung cần tìm"
                                    name="content"
                                    type="text"
                                    className="form-control form-control-sm"
                                    style={{maxWidth: '250px'}}
                                />
                                <Field as="select" name="category" className="form-select form-select-sm"
                                       style={{maxWidth: '200px'}}>
                                    <option value="">-- Chọn danh mục --</option>
                                    {categories && categories.map((c) => (
                                        <option value={c.name} key={c.id}>{c.name}</option>
                                    ))}
                                </Field>
                                <button className="btn btn-sm btn-outline btn-hover" type="submit">Tìm Kiếm</button>
                            </Form>
                        </Formik>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered mt-0">
                            <thead>
                            <tr>
                                <th class="col-id">STT</th>
                                <th>Nội Dung Câu Hỏi</th>
                                <th style={{width: '240px', whiteSpace: 'nowrap'}}>Loại Câu Hỏi</th>
                                <th style={{width: '200px', whiteSpace: 'nowrap'}}>Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {questions && questions.length > 0 && (
                                questions && questions.map((q, i) => (
                                    <tr key={q.id}>
                                        <td class="col-id">{i + 1}</td>
                                        <td>{q.content}</td>
                                        <td style={{width: '240px', whiteSpace: 'nowrap'}}>{q?.category?.name}</td>
                                        <td className="col-button">
                                            <div className="action-buttons">
                                                {!q.exitsExamsId && <>
                                                    <Link to={'detail/' + q.id} className="icon-btn edit"
                                                          title="Chỉnh sửa">
                                                        ✏️
                                                    </Link>
                                                    <button onClick={() => handleShowModal(q.id, q.content)}
                                                            className="icon-btn delete" title="Xoá">🗑️
                                                    </button>
                                                </>
                                                }

                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                        {questions && questions.length === 0 && (
                            <p style={{justifyContent: 'center'}}>Không có câu hỏi nào trong hệ thống! </p>)}
                    </div>
                    {isShowModal && (
                        <div className="modal-overlay">
                            <div className="custom-modal">
                                <h4>Xác nhận xoá câu hỏi này khỏi đề thi?</h4>
                                <p>
                                    Thao tác này sẽ xoá câu hỏi "{questionsContent}" của bạn. Bạn sẽ không thể
                                    huỷ được thao tác này sau khi thực hiện.
                                </p>
                                <div className="modal-buttons">
                                    <button className="cancel-btn" onClick={closeModal}>
                                        Huỷ
                                    </button>
                                    <button className="delete-btn" onClick={handleDeleteQuestions}>
                                        Xác nhận xoá câu hỏi
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="pagination-buttons"
                         style={{justifyContent: 'center', textAlign: 'center', marginTop: '10px'}}>
                        <button
                            className="btn btn-sm btn-outline btn-hover"
                            onClick={() => setPage(0)}
                            disabled={page === 0}
                            style={{marginRight: 4}}
                        >
                            {'<<'}
                        </button>
                        <button style={{marginRight: 4}} className="btn btn-sm btn-outline btn-hover"
                                onClick={() => (handlePrePage())}
                                disabled={page === 0}>
                            {'<'}
                        </button>
                        {renderPagination()}
                        <button style={{marginLeft: 4}} className="btn btn-sm btn-outline btn-hover"
                                onClick={() => (handleNextPage())}
                                disabled={page >= totalPage - 1}>
                            {'>'}
                        </button>
                        <button
                            className="btn btn-sm btn-outline btn-hover"
                            onClick={() => setPage(totalPage - 1)}
                            disabled={page >= totalPage - 1}
                            style={{marginLeft: 4}}
                        >
                            {'>>'}
                        </button>
                    </div>
                </div>
            </div>
            <a href="https://m.me/739909372528743"
               target="_blank"
               rel="noopener noreferrer"
               className="messenger-btn">
                <svg className="messenger-icon" viewBox="0 0 24 24">
                    <path
                        d="M12,2A9.65,9.65,0,0,0,2,12c0,2.52,1.23,4.97,3.29,6.64L4.54,21a.84.84,0,0,0,.19.78A.86.86,0,0,0,5.3,22a.93.93,0,0,0,.35-.07L8.9,20.76A9.19,9.19,0,0,0,12,21,9.65,9.65,0,0,0,22,12,9.65,9.65,0,0,0,12,2ZM7,12.5a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,7,12.5Zm5,0A1.5,1.5,0,1,1,13.5,11,1.5,1.5,0,0,1,12,12.5Zm5,0A1.5,1.5,0,1,1,18.5,11,1.5,1.5,0,0,1,17,12.5Z"/>
                </svg>
            </a>
        </>
    )
        ;
}
export default QuestionService;