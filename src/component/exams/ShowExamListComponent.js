import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchExamsByUser } from '../../service/ExamsService';
import '../../css/ExamList.css';

const ExamList = () => {
    const { userId } = useParams();
    const [examList, setExamList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadExams = async () => {
            try {
                const data = await fetchExamsByUser(userId);
                setExamList(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            loadExams();
        }
    }, [userId]);

    const handleAction = (exam) => {
        if (exam.trangThai === 'Đã thi') {
            // Navigate to history page for exams that have been taken
            navigate(`/user/${userId}/history/${exam.id}`);
        } else {
            // Navigate to exam-taking page for exams not yet taken
            navigate(`/user/${userId}/exam/${exam.id}`);
        }
    };

    if (loading) return <div className="loading">Đang tải danh sách đề thi...</div>;
    if (error) return <div className="error">Lỗi: {error}</div>;

    return (
        <div className="exam-list-container">
            <h2>Danh sách đề thi của bạn</h2>
            {examList.length === 0 ? (
                <p className="no-exams">Không có đề thi nào.</p>
            ) : (
                <table className="exam-table">
                    <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên đề thi</th>
                        <th>Loại đề thi</th>
                        <th>Số câu hỏi</th>
                        <th>Thời gian thi</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {examList.map((exam) => (
                        <tr key={exam.id}>
                            <td>{exam.stt}</td>
                            <td>{exam.name}</td>
                            <td>{exam.category}</td>
                            <td>{exam.numberOfQuestions}</td>
                            <td>{exam.testTime}</td>
                            <td>{exam.trangThai}</td>
                            <td>
                                <button
                                    onClick={() => handleAction(exam)}
                                    className={`action-button ${exam.trangThai === 'Đã thi' ? 'view-result' : 'take-exam'}`}
                                >
                                    {exam.chucNang}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ExamList;