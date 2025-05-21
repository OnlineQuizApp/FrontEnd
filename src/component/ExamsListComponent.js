import {useEffect, useState} from "react";
import React from "react";
import {getAllExams} from "../service/ExamsService";
import "../css/admin-layout.css"
import {Link} from "react-router-dom";
const ExamsListComponent = () => {
    const [exams, setExams] = useState([]);
    const [page, setPage] = useState(0);
    const [category, setCategory] = useState('');
    const [totalPage, setTotalPage] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            const {data, totalPage} = await getAllExams(page, category);
            setExams(data);
            setTotalPage(totalPage);
        }
        fetchData();
    }, [page, category]);
    const handlePre = () => {
        if (page > 0) setPage(page - 1);
    }
    const handleNext = () => {
        if (page < totalPage - 1) setPage(page + 1);
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
                className={`btn btn-sm btn-outline-success btn-hover ${page === p ? 'active' : ''}`}
                onClick={() => setPage(p)}
            >
                {p + 1}
            </button>
        ));
    };
    return (
        <>
            <div className="container">
                <div className="question-service-wrapper">
                    <div className="container mt-5">
                        <table className="table table-bordered mt-4">
                            <thead>
                            <tr>
                                <th>Id</th>
                                <th>Tiêu đề</th>
                                <th>Loại đề</th>
                                <th>số câu</th>
                                <th>Thời gian làm bài</th>
                                <th>Chi tiết</th>
                                <th>Chỉnh sửa</th>
                                <th>Xoá</th>
                            </tr>
                            </thead>
                            <tbody>
                            {exams && exams.map((e) => (
                                <tr key={e.id}>
                                    <td>{e.id}</td>
                                    <td>{e.title}</td>
                                    <td>{e.category}</td>
                                    <td>{e.numberOfQuestions}</td>
                                    <td>{e.testTime}</td>
                                    <td>
                                        <Link className={'btn btn-sm btn-outline-success btn-hover'}
                                              to={'/admin/exams/detail/' + e.id}>
                                            Chi tiết
                                        </Link>
                                    </td>
                                    <td>
                                        <Link className={'btn btn-sm btn-outline-success btn-hover'}
                                              to={'/admin/exams/update/' + e.id}>
                                           Chỉnh sửa
                                        </Link>
                                    </td>
                                    <td>
                                        <button className={'btn btn-sm btn-outline-success btn-hover'}>Xoá</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div style={{justifyContent: 'center', textAlign: 'center'}}>
                            <button className={'btn btn-sm btn-outline-success btn-hover'}
                                    onClick={() => (handlePre())}>Trang
                                Trước
                            </button>
                            {renderPagination()}
                            <button className={'btn btn-sm btn-outline-success btn-hover'}
                                    onClick={() => (handleNext())}>Trang
                                Sau
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default ExamsListComponent;