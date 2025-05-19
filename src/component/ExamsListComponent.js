import {useEffect, useState} from "react";
import React from "react";
import {getAllExams} from "../service/ExamsService";

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
    return (
        <>
            <div className="container">
                <div className="question-service-wrapper">
                    <div className="container mt-5">
                        <table>
                            <thead>
                            <tr>
                                <th>Id</th>
                                <th>Tiêu đề</th>
                                <th>Loại đề</th>
                                <th>số câu</th>
                                <th>Thời gian làm bài</th>
                                <th>Chỉnh Sửa</th>
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
                                        <button>Chi tiết</button>
                                    </td>
                                    <td>
                                        <button>Xoá</button>
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
                            {[...new Array(totalPage)].map((p, i) => (
                                <button
                                    className={`btn btn-sm btn-outline-success btn-hover ${page === i ? 'active' : ''}`}
                                    onClick={() => (setPage(i))}>{i + 1}</button>
                            ))}
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