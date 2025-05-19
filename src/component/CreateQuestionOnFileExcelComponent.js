import "../admin-layout.css"
import {useState} from "react";
import {createQuestionsOnFileExcel} from "../service/QuestionService";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const CreateQuestionOnFileExcelComponent = ()=>{
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const navigate= useNavigate();
    const handleFileChange = (e) => {                 // Hàm xử lý việc chọn file
        setFile(e.target.files[0]);                        // lấy file đầu tiên trong danh sách
    };

    const handleSubmit = async (e) => {
        e.preventDefault();                               // ngăn hành vi reload mặc  định của form
        if (!file) {                                      // người dùng  chưa chọn file thì thông báo
            setMessage('❌ Vui lòng chọn một file Excel.');
            return;
        }
        const formData = new FormData();        // tạo một form data để gửi file lên server
        formData.append('file', file);             // đính kèm file đã chọn vào form với key là file
        try {
            await createQuestionsOnFileExcel(formData) ;
            navigate('/admin/questions');
            toast.success("Dữ liệu đã được tải lên thành công!")
            setMessage('✅ Dữ liệu đã được tải lên thành công!');
        } catch (error) {
            setMessage('❌ Lỗi khi tải lên file Excel. Vui lòng thử lại!');
        }
    };
    return (
        <>
            <h3>Thêm mới câu hỏi bằng file excel</h3>
            <div className="container mt-5">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="file" className="form-label">Chọn File Excel:</label>
                        <input
                            type="file"
                            id="file"
                            className="form-control"
                            onChange={handleFileChange}
                            accept=".xlsx,.xls"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Tải lên</button>
                </form>
                {message && <div className="mt-3">{message}</div>}
            </div>
        </>
    );
}
export default CreateQuestionOnFileExcelComponent;