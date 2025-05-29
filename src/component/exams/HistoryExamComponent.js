import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../../css/HistoryExam.css';
import HeaderComponent from "../HeaderComponent";
import Footer from "../FooterComponent";
import FooterComponent from "../FooterComponent";
const apiUrl = process.env.REACT_APP_API_URL;
const ExamHistory = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                console.log('Fetching exam history...');
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Vui lòng đăng nhập để xem lịch sử thi');
                    setLoading(false);
                    navigate('/login');
                    return;
                }

                let username;
                try {
                    const decoded = jwtDecode(token);
                    console.log('Decoded token:', decoded);
                    username = decoded.sub; // Giả sử 'sub' chứa username
                    if (!username) {
                        throw new Error('Username not found in token');
                    }
                } catch (err) {
                    console.error('Error decoding token:', err);
                    setError('Token không hợp lệ');
                    setLoading(false);
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }

                console.log('Fetching results for username:', username);
                const response = await axios.get(`${apiUrl}/api/results/user/username/${username}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('API response:', response.data);
                setResults(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Fetch error:', err);
                console.error('Error response:', err.response?.data);
                setError(`Không thể tải lịch sử thi: ${err.response?.data?.message || err.message}`);
                setLoading(false);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        fetchResults();
    }, [navigate]);

    if (loading) return <div className="exam-history-container">Đang tải...</div>;
    if (error) return <div className="exam-history-container error">{error}</div>;

    return (
        <>
        <HeaderComponent/>
            <div className="exam-history-container">
                <h2>Lịch sử thi</h2>
                {results.length === 0 ? (
                    <p>Không có kết quả thi nào.</p>
                ) : (
                    <div className="result-grid">
                        {results.map((result) => (
                            <div key={result.id} className="result-card">
                                <h3>{result.examTitle}</h3>
                                <p><strong>Số câu hỏi:</strong> {result.numberOfQuestions}</p>
                                <p><strong>Điểm:</strong> {result.totalScore}</p>
                                <p><strong>Ngày nộp:</strong> {new Date(result.submittedAt).toLocaleDateString('vi-VN')}</p>
                                <Link to={`/result/${result.id}`} className="review-button">
                                    Xem lại kết quả
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <FooterComponent/>
        </>
    );
};

export default ExamHistory;