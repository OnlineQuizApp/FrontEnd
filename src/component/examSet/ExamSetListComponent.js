import {useEffect, useState} from "react";
import React from "react";
import {deleteExams, getAllExams} from "../../service/ExamsService";
import "../../css/admin-layout.css"
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import {deleteExamSet, getAllExamSet} from "../../service/ExamSetService";
import {Field, Form, Formik} from "formik";
const ExamSetListComponent = () => {
    const [examSet, setExamSet] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [idDelete,setIdDelete] = useState(null);
    const [loading,setLoading]=useState(false);
    const [examSetSearch, setExamSetSearch] = useState('')
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllExamSet(page, examSetSearch);
                if (result) {
                    setExamSet(result.data);
                    setTotalPage(result.totalPage);
                }else {
                    setExamSet([]);
                    setTotalPage(0);
                }
            }catch (error) {
                console.error("Lỗi khi lấy bộ đề thi:", error);
                setExamSet([]);
                setTotalPage(0);
            }

        }
        fetchData();
    }, [page, examSetSearch,loading]);
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
        await deleteExamSet(idDelete);
        setIdDelete(null);
        setShowConfirmModal(false);
        setLoading((pre)=>!pre);
        toast.success("Xoá đề thi thành công!")
    }
    const handleSearch = async (value) => {
        setExamSetSearch(value.content)
        setPage(0);
    }
    return (
        <>
            <h2 className="mb-4" style={{fontSize: "1.5rem", fontWeight: "bold"}}>Danh Sách Bộ Đề Thi</h2>
            <div className="question-service-wrapper">
                <div className="container mt-5">
                    <div className=" mt-4">
                        <Formik
                            initialValues={{content: '', category: ''}}
                            onSubmit={handleSearch}
                        >
                            <Form className="d-flex align-items-center gap-2 flex-wrap mb-1 mt-3">
                                <Field
                                    placeholder="Nhập tên bộ đề cần tìm"
                                    name="content"
                                    type="text"
                                    className="form-control form-control-sm"
                                    style={{maxWidth: '250px'}}
                                />
                                <button className="btn btn-sm btn-outline btn-hover" type="submit">Tìm Kiếm</button>
                            </Form>
                        </Formik>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered mt-0">
                            <thead>
                            <tr>
                                <th >STT</th>
                                <th>Tên bộ đề</th>
                                <th>Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {examSet && examSet.length > 0 && (
                                examSet && examSet.map((e, i) => (
                                    <tr key={e.id}>
                                        <td >{i + 1}</td>
                                        <td>{e.name}</td>
                                        <td >
                                            <Link
                                                to={`/admin/exams-set-update/detail/${e.id}`}
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
                        {examSet && examSet.length === 0 && (<p style={{textAlign:'center'}}>Không có bộ đề nào trong hệ thống!</p>)}
                        {showConfirmModal && (
                            <div className="modal-overlay">
                                <div className="custom-modal">
                                    <h4>Xác nhận xoá đề thi này khỏi bộ đề?</h4>
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
export default ExamSetListComponent;