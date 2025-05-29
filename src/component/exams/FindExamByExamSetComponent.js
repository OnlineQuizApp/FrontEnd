import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../../css/ExamList.css';
const apiUrl = process.env.REACT_APP_API_URL;

const ExamList = () => {
    const { examSetId } = useParams();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Gọi API để lấy danh sách đề thi
    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/exams/exam-set/${examSetId}`);
                setExams(response.data);
                setLoading(false);
            } catch (err) {
                setError('Không thể tải danh sách đề thi');
                setLoading(false);
            }
        };

        fetchExams();
    }, [examSetId]);

    if (loading) return <div className="exam-list-container">Đang tải...</div>;
    if (error) return <div className="exam-list-container error">{error}</div>;

    return (
        <div className="exam-list-container">
            <h2>Danh sách đề thi trong bộ đề {examSetId}</h2>
            {exams.length === 0 ? (
                <p>Không có đề thi nào trong bộ đề này.</p>
            ) : (
                <div className="exam-grid">
                    {exams.map((exam) => (
                        <div key={exam.id} className="exam-card">
                            <h3>{exam.title}</h3>
                            <p><strong>Danh mục:</strong> {exam.category}</p>
                            <p><strong>Số câu hỏi:</strong> {exam.numberOfQuestions}</p>
                            <p><strong>Thời gian:</strong> {exam.testTime}</p>
                            <Link to={`/exam/${exam.id}`} className="start-exam-button">
                                Làm bài thi
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExamList;