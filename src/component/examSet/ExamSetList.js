import React, { useEffect, useState } from 'react';
import examSetService from '../../service/ExamSetService';
import '../../css/ExamSetList.css';
import {Link} from "react-router-dom";

function ExamSetList() {
    const [examSets, setExamSets] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchExamSets(page);
    }, [page]);

    const fetchExamSets = async (pageNumber) => {
        try {
            const response = await examSetService.getAll(pageNumber);
            setExamSets(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="exam-set-list-container">
            <div className="exam-set-grid">
                {examSets.map((set) => (
                    <div key={set.id} className="exam-set-card">
                        <img src={set.img || '/default.jpg'} alt={set.name} />
                        <Link to={`/exams/${set.id}`}>
                            <h3>{set.name}</h3>
                        </Link>
                        <p>Ngày tạo: {new Date(set.creationDate).toLocaleDateString('vi-VN')}</p>
                    </div>
                ))}
            </div>

            <div className="pagination">
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
                    ←
                </button>
                <span>{page + 1} / {totalPages}</span>
                <button onClick={() => handlePageChange(page + 1)} disabled={page + 1 >= totalPages}>
                    →
                </button>
            </div>
        </div>
    );
}

export default ExamSetList;
