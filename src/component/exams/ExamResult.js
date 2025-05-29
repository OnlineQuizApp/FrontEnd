import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../../css/ExamResult.css';

const ExamResult = () => {
    const { state } = useLocation(); // Lấy dữ liệu kết quả từ state
    const { correctAnswers, totalQuestions, totalScore } = state || {};

    if (!state) {
        return <div>Không có dữ liệu kết quả</div>;
    }

    return (
        <div className="exam-result-container">
            <h2>Kết quả bài thi</h2>
            <p><strong>Số câu đúng:</strong> {correctAnswers}/{totalQuestions}</p>
            <p><strong>Tổng điểm:</strong> {totalScore.toFixed(2)}</p>
            <Link to="/" className="back-button">
                Quay lại danh sách đề thi
            </Link>
        </div>
    );
};

export default ExamResult;