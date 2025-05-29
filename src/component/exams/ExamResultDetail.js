import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/ExamResultDetail.css';
import HeaderComponent from "../HeaderComponent";
import FooterComponent from "../FooterComponent";

const ExamResultDetail = () => {
    const { resultId } = useParams();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResultDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/results/${resultId}/details`);
                setResult(response.data);
                setLoading(false);
            } catch (err) {
                setError('Không thể tải chi tiết kết quả');
                setLoading(false);
            }
        };
        fetchResultDetails();
    }, [resultId]);

    if (loading) return <div className="exam-result-detail-container">Đang tải...</div>;
    if (error) return <div className="exam-result-detail-container error">{error}</div>;

    return (
        <>
        <HeaderComponent/>
            <div className="exam-result-detail-container">
                <h2>Kết quả đề thi: {result.examTitle}</h2>
                <p><strong>Số câu hỏi:</strong> {result.numberOfQuestions}</p>
                <p><strong>Số câu đúng:</strong> {result.correctAnswers} / {result.numberOfQuestions}</p>
                <p><strong>Tổng điểm:</strong> {result.totalScore}</p>
                <div className="question-list">
                    {result.questions.map((question, index) => (
                        <div className="question-item" key={question.questionId}>
                            <h4>Câu hỏi {index + 1}: {question.content}</h4>
                            <div className="answer-section">
                                <p><strong>Đáp án bạn chọn:</strong> {question.userAnswer}</p>
                                <p><strong>Đáp án đúng:</strong> {question.correctAnswer}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => navigate('/history')} className="back-button">
                    Quay lại
                </button>
            </div>
            <FooterComponent/>
        </>
    );
};

export default ExamResultDetail;