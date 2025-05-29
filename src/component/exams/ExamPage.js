import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/ExamPage.css';
import HeaderComponent from "../HeaderComponent";
import Footer from "../FooterComponent";
import FooterComponent from "../FooterComponent";

const ExamPage = () => {
    const { id } = useParams(); // Lấy examId từ URL
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({}); // Lưu đáp án người dùng chọn
    const [timeLeft, setTimeLeft] = useState(null); // Thời gian còn lại (giây)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Kiểm tra trạng thái đăng nhập
    const isAuthenticated = () => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        return !!token;
    };

    // Lấy token để gửi kèm request
    const getAuthToken = () => {
        return localStorage.getItem('token') || sessionStorage.getItem('token');
    };

    // Kiểm tra số lượng đáp án đúng của câu hỏi
    const getCorrectAnswerCount = (answers) => {
        return answers.filter(answer => answer.correct).length;
    };

    // Lấy thông tin đề thi và câu hỏi
    useEffect(() => {
        const fetchExamData = async () => {
            try {
                const examResponse = await axios.get(`http://localhost:8080/api/exams/1/${id}`);
                const questionsResponse = await axios.get(`http://localhost:8080/api/exams/1/${id}/questions`);
                setExam(examResponse.data);
                setQuestions(questionsResponse.data);

                // Chuyển testTime (MM:ss) thành giây
                const timeParts = examResponse.data.testTime.split(':');
                const totalSeconds = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
                setTimeLeft(totalSeconds);
                setLoading(false);

                console.log('Thời gian làm bài:', examResponse.data.testTime);
                console.log('Tổng số giây:', totalSeconds);
                console.log('Trạng thái đăng nhập:', isAuthenticated());
            } catch (err) {
                console.error('Lỗi khi tải dữ liệu:', err);
                setError('Không thể tải đề thi');
                setLoading(false);
            }
        };
        fetchExamData();
    }, [id]);

    // Đồng hồ đếm ngược
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                console.log('Thời gian còn lại:', prev);
                if (prev <= 1) {
                    submitExam();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Xử lý chọn đáp án
    const handleAnswerChange = (questionId, answerId, isSingleCorrect) => {
        setUserAnswers((prev) => {
            if (isSingleCorrect) {
                // Radio: Chỉ lưu một đáp án
                return {
                    ...prev,
                    [questionId]: [answerId]
                };
            } else {
                // Checkbox: Thêm hoặc xóa đáp án
                const currentAnswers = prev[questionId] || [];
                if (currentAnswers.includes(answerId)) {
                    return {
                        ...prev,
                        [questionId]: currentAnswers.filter((id) => id !== answerId)
                    };
                } else {
                    return {
                        ...prev,
                        [questionId]: [...currentAnswers, answerId]
                    };
                }
            }
        });
    };

    // Nộp bài
    const submitExam = async () => {
        try {
            const submitRequest = {
                examId: parseInt(id),
                userAnswers: Object.keys(userAnswers).map((questionId) => ({
                    questionId: parseInt(questionId),
                    selectedAnswerIds: userAnswers[questionId] || []
                }))
            };

            let response;

            if (isAuthenticated()) {
                // Nếu đã đăng nhập, gọi API authenticated
                const token = getAuthToken();
                response = await axios.post(
                    'http://localhost:8080/api/exams/submit/authenticated',
                    submitRequest,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log("Gửi bài (đã đăng nhập):", submitRequest);
            } else {
                // Nếu chưa đăng nhập, gọi API thường
                response = await axios.post('http://localhost:8080/api/exams/submit', submitRequest);
                console.log("Gửi bài (chưa đăng nhập):", submitRequest);
            }

            // Chuyển hướng đến trang kết quả
            navigate('/exam/result', {
                state: {
                    ...response.data,
                    isAuthenticated: isAuthenticated()
                }
            });
        } catch (err) {
            console.error('Lỗi khi nộp bài:', err);
            setError('Lỗi khi nộp bài: ' + (err.response?.data?.message || err.message));
        }
    };

    // Định dạng thời gian (giây -> MM:SS)
    const formatTime = (seconds) => {
        if (seconds === null || seconds === undefined) return '00:00';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) return (
        <div className="exam-page-container">
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải đề thi...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="exam-page-container">
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={() => window.location.reload()}>Thử lại</button>
            </div>
        </div>
    );

    return (
        <>
        <HeaderComponent/>
            <div className="exam-page-container">
                <div className="exam-info">
                    <p><strong>Danh mục:</strong> {exam?.category || 'N/A'}</p>
                    <p><strong>Số câu hỏi:</strong> {exam?.numberOfQuestions || questions.length}</p>
                    <p><strong>Thời gian còn lại:</strong> {formatTime(timeLeft)}</p>
                    <p><strong>Trạng thái:</strong> {isAuthenticated() ? 'Đã đăng nhập (kết quả sẽ được lưu)' : 'Chưa đăng nhập (chỉ xem kết quả)'}</p>
                </div>
                <div className="questions-container">
                    {questions.map((question, index) => {
                        const correctAnswerCount = getCorrectAnswerCount(question.answers);
                        const isSingleCorrect = correctAnswerCount === 1;

                        return (
                            <div key={question.id} className="question-card">
                                <h3>Câu {index + 1}: {question.content}</h3>
                                {question.img && <img src={question.img} alt="Question" className="question-image" />}
                                <div className="answers">
                                    {question.answers?.map((answer) => (
                                        <label key={answer.id} className="answer-option">
                                            <input
                                                type={isSingleCorrect ? 'radio' : 'checkbox'}
                                                name={isSingleCorrect ? `question-${question.id}` : undefined}
                                                checked={userAnswers[question.id]?.includes(answer.id) || false}
                                                onChange={() => handleAnswerChange(question.id, answer.id, isSingleCorrect)}
                                            />
                                            {answer.content}
                                        </label>
                                    )) || <p>Không có đáp án</p>}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <button className="submit-button" onClick={submitExam}>
                    Hoàn thành và xem kết quả
                </button>
            </div>
            <FooterComponent/>
        </>
    );
};

export default ExamPage;