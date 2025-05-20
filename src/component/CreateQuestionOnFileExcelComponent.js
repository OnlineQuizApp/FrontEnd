import "../css/admin-layout.css"
import "../css/Spinner.css"
import {useState} from "react";
import {createQuestionsOnFileExcel} from "../service/QuestionService";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Button} from "react-bootstrap";


const CreateQuestionOnFileExcelComponent = ()=>{
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const navigate= useNavigate();
    const [isUploading, setIsUploading] = useState(false);
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
        setIsUploading(true); // ⏳ Bắt đầu loading
        try {
            await createQuestionsOnFileExcel(formData) ;
            navigate('/admin/questions');
            toast.success("Dữ liệu đã được tải lên thành công!")
            setMessage('✅ Dữ liệu đã được tải lên thành công!');
        } catch (error) {
            setMessage('❌ ' + (error.response?.data || 'Đã xảy ra lỗi!'));
        }finally {
            setIsUploading(false); // ✅ Kết thúc loading
        }
    };
    const back =()=>{
        navigate('/admin/questions')
    }
    return (
        <>
            <h2 className="mb-4" style={{fontSize: "1.5rem", fontWeight: "bold"}}> Thêm Mới Câu Hỏi Bằng File Excel</h2>
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
                    <div className="d-flex justify-content-center gap-3 mt-4">
                        {!isUploading && (
                            <Button
                                onClick={back}
                                type="button"
                                className="btn btn-sm btn-outline-success btn-hover"
                            >
                                Quay lại
                            </Button>
                        )}
                        <button type="submit" className="btn btn-sm btn-outline-success btn-hover"
                                disabled={isUploading}>
                            {isUploading ? 'Đang tải...' : 'Tải lên'}
                        </button>
                    </div>
                </form>
                {message && <div className="mt-3">{message}</div>}
                {isUploading && (
                    <div className="text-center mt-3">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                        <p>Đang xử lý file Excel...</p>
                    </div>
                )}
            </div>
        </>
    );
}
export default CreateQuestionOnFileExcelComponent;