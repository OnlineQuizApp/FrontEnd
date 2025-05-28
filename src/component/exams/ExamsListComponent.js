import {useEffect, useState} from "react";
import React from "react";
import {deleteExams, getAllExams} from "../../service/ExamsService";
import "../../css/admin-layout.css"
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import {Field, Form, Formik} from "formik";
import {getAllCategory} from "../../service/CategoryService";
const ExamsListComponent = () => {
    const [exams, setExams] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [idDelete,setIdDelete] = useState(null);
    const [loading,setLoading]=useState(false);
    const [examsTitleSearch, setExamsTitleSearch] = useState('')
    const [categorySearch, setCategorySearch] = useState('')
    useEffect(() => {
        const fetchData= async ()=>{
            try {
                const {data, totalPage} = await getAllExams(page, categorySearch,examsTitleSearch);
                const category = await getAllCategory();
                setCategoryList(category);
                setExams(data || []);
                setTotalPage(totalPage || 0);
                if (page >= totalPage && totalPage > 0) {
                    setPage(0);
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu đề thi:", error);
                setExams([]);
                setTotalPage(0);
            }
        }
        fetchData();
    }, [page, categorySearch,loading,examsTitleSearch]);
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
    const handleConfirmDeleteAnswers = async ()=>{
        await deleteExams(idDelete);
        setIdDelete(null);
        setShowConfirmModal(false);
        setLoading((pre)=>!pre);
        toast.success("Xoá đề thi thành công!")
    }
    const handleSearch = async (value) => {
        setExamsTitleSearch(value.title)
        setCategorySearch(value.category);
        setPage(0);
    }
    return (
        <>
            <h2 className="mb-4" style={{fontSize: "1.5rem", fontWeight: "bold"}}>Danh Sách Đề Thi</h2>
                <div className="question-service-wrapper">
                    <div className="container mt-5">
                        <div className=" mt-4">
                            <Formik
                                initialValues={{content: '', category: ''}}
                                onSubmit={handleSearch}
                            >
                                <Form className="d-flex align-items-center gap-2 flex-wrap mb-1 mt-3">
                                    <Field
                                        placeholder="Nhập tên đề thi cần tìm"
                                        name="title"
                                        type="text"
                                        className="form-control form-control-sm"
                                        style={{maxWidth: '250px'}}
                                    />
                                    <Field as="select" name="category" className="form-select form-select-sm"
                                           style={{maxWidth: '200px'}}>
                                        <option value="">-- Chọn danh mục --</option>
                                        {categoryList && categoryList.map((c) => (
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
                                    <th>Tiêu đề</th>
                                    <th>Loại đề</th>
                                    <th>số câu</th>
                                    <th>Thời gian làm bài</th>
                                    <th>Hành động</th>
                                </tr>
                                </thead>
                                <tbody>
                                {exams&&exams.length>0 && (
                                    exams && exams.map((e,i) => (
                                        <tr key={e.id}>
                                            <td class="col-id" >{i+1}</td>
                                            <td>{e.title}</td>
                                            <td>{e.category}</td>
                                            <td>{e.numberOfQuestions}</td>
                                            <td>{e.testTime}</td>
                                            <td className={'col-button action-buttons'}>
                                                <Link
                                                    to={`/admin/exams/detail/${e.id}`}
                                                    title="Xem chi tiết"
                                                    className="icon-btn view"
                                                >
                                                    👁️
                                                </Link>
                                                <Link
                                                    to={`/admin/exams/update/${e.id}`}
                                                    title="Chỉnh sửa"
                                                    className="icon-btn edit"
                                                >
                                                    ✏️
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setShowConfirmModal(true);
                                                        setIdDelete(e.id);
                                                    }}
                                                    title="Xoá"
                                                    className="icon-btn delete"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                            {exams&&exams.length===0 && (<p style={{textAlign:'center'}}>Không có đề thi nào trong hệ thống!</p>)}
                            {showConfirmModal && (
                                <div className="modal-overlay">
                                    <div className="custom-modal">
                                        <h4>Xác nhận xoá đề thi của bạn?</h4>
                                        <p>
                                            Thao tác này sẽ đề thi của bạn. Bạn sẽ không thể
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
                </div>
        </>
    );
}
export default ExamsListComponent;