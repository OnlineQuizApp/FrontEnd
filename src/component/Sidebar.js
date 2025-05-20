import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../css/admin-layout.css"
const Sidebar = () => {
    const [showQuestionsMenu, setShowQuestionsMenu] = useState(false);
    const [showExamsMenu, setShowExamsMenu] = useState(false);

    const toggleQuestionsMenu = () => {
        setShowQuestionsMenu(prev => !prev);
    };
    const toggleExamsMenu = () => {
        setShowExamsMenu(prev => !prev);
    };

    return (
        <>
            <div className="sidebar" style={{width: '250px', background: '#cccccf', padding: '20px', height: '100vh'}}>
                <h4
                    style={{cursor: 'pointer', userSelect: 'none', color: 'black'}}
                    onClick={toggleQuestionsMenu}
                >
                    Ngân hàng câu hỏi
                </h4>
                {showQuestionsMenu && (
                    <ul style={{listStyle: 'none', paddingLeft: '20px'}}>
                        <li><Link to="/admin/questions">📋 Danh sách câu hỏi</Link></li>
                        <li><Link to="/admin/questions/create">➕ Thêm câu hỏi mới</Link></li>
                        <li><Link to="/admin/questions/upload-file-excel">📄 Thêm từ excel</Link></li>
                        <li><Link to="/admin/questions/upload-file-img">🖼️ Thêm từ ảnh</Link></li>
                        <li><Link to="/admin/questions/upload-video">🎥 Thêm từ video</Link></li>
                    </ul>
                )}
                <h4
                    style={{cursor: 'pointer', userSelect: 'none', color: 'black'}}
                    onClick={toggleExamsMenu}
                >
                    Ngân hàng đề thi
                </h4>
                {showExamsMenu && (
                    <ul style={{listStyle: 'none', paddingLeft: '20px'}}>
                        <li><Link to="/admin/exams">📋 Danh sách đề thi</Link></li>
                        <li><Link to="/admin/exams/create">➕ Thêm đề thi</Link></li>
                    </ul>
                )}
            </div>

        </>
    );
};

export default Sidebar;