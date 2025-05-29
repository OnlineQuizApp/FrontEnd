import React, { useState, useEffect } from 'react';
import "../../css/Examstatis.css";
import HeaderComponent from "../HeaderComponent";
import FooterComponent from "../FooterComponent";
const apiUrl = process.env.REACT_APP_API_URL;

const ExamStatistics = () => {
    const [statistics, setStatistics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/exams/statistics`);
                if (!response.ok) {
                    throw new Error('Failed to fetch statistics');
                }
                const data = await response.json();
                setStatistics(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchStatistics();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl font-semibold text-gray-600">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl font-semibold text-red-600">Error: {error}</div>
            </div>
        );
    }

    return (
        <>
        <HeaderComponent/>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4 text-center">Thống kê</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">STT</th>
                            <th className="py-3 px-4 text-left">Đề thi</th>
                            <th className="py-3 px-4 text-left">Tham gia thi</th>
                            <th className="py-3 px-4 text-left">Điểm số > 8</th>
                        </tr>
                        </thead>
                        <tbody>
                        {statistics.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="py-4 px-4 text-center text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            statistics.map((stat, index) => (
                                <tr key={stat.examId} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4" data-label="No.">{index + 1}</td>
                                    <td className="py-3 px-4" data-label="Exam Title">{stat.examTitle}</td>
                                    <td className="py-3 px-4" data-label="Total Participants">{stat.totalParticipants}</td>
                                    <td className="py-3 px-4" data-label="Percentage Above 8">{stat.percentageAboveEight.toFixed(2)}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
            <FooterComponent/>
        </>
    );
};

export default ExamStatistics;