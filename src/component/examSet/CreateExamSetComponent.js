import {ErrorMessage, Field, Form, Formik} from "formik";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Button} from "react-bootstrap";
import "../../css/Create-exams.css"
import * as Yup from 'yup';
import {createExamSet} from "../../service/ExamSetService";
import {useState} from "react";
const CreateExamSetComponent = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const handleImageChange = (e) => {                 // Hàm xử lý việc chọn file
        setFile(e.target.files[0]);                        // lấy file đầu tiên trong danh sách
    };
    const handleCreateExamSet = async (value) => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("name", value.name);
            formData.append("creationDate", value.creationDate);
            const newExamSetId = await createExamSet(formData);
            navigate('/admin/exams-set-create/confirm/' + newExamSetId)
        } catch (error) {
            toast.error("Đề thi đã tồn tại trong hệ thống!")
        }finally {
            setIsUploading(false)
        }
    }
    const back =()=>{
        navigate('/admin/exams-set')
    }
    const validationSchema = Yup.object({
        name: Yup.string()
            .required("Tên bộ đề không được để trống")
            .max(100, "Tên không được vượt quá 100 ký tự"),
        creationDate: Yup.date()
            .required("Vui lòng chọn ngày tạo")
            .test(
                'is-today',
                "Chỉ được chọn ngày hôm nay",
                function (value) {
                    if (!value) return false;
                    const today = new Date();
                    const selected = new Date(value);

                    // So sánh ngày, bỏ qua giờ/phút/giây
                    return (
                        today.getFullYear() === selected.getFullYear() &&
                        today.getMonth() === selected.getMonth() &&
                        today.getDate() === selected.getDate()
                    );
                }
            )
    });


    return (
        <>
            <h2 className="mb-4" style={{fontSize: "1.5rem", fontWeight: "bold"}}> Thêm Mới Bộ Đề Thi</h2>
            <Formik initialValues={{
                id: '',
                name: '',
                img:'',
                creationDate: '',
                softDelete: false
            }} onSubmit={handleCreateExamSet} validationSchema={validationSchema}  >
                <Form>
                    <div className="mb-3">
                        <label>Nhập tên bộ đề <span className="text-danger">*</span></label>
                        <Field name="name" className="form-control" placeholder="Nhập tiêu đề đề thi"/>
                        <ErrorMessage name="name" component="div" className="text-danger"/>
                    </div>
                    <div className="mb-3">
                        <label>Chọn hình ảnh cho bộ đề<span className="text-danger">*</span></label>
                        <input
                            name="img"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                            onInvalid={e => e.target.setCustomValidity('Vui lòng chọn một hình ảnh đại diện cho câu hỏi!')}
                            onInput={e => e.target.setCustomValidity('')}
                            className="form-control"
                            placeholder="Chọn hình ảnh cho bộ đề"
                        />
                        <ErrorMessage name="img" component="div" className="text-danger"/>
                    </div>

                    <div className="mb-3">
                        <label>Ngày tạo đề <span className="text-danger">*</span></label>
                        <Field type={'date'} name="creationDate" className="form-control"
                               placeholder="Chọn ngày tạo bộ đề">
                        </Field>
                        <ErrorMessage name="creationDate" component="div" className="text-danger"/>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap">
                        <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap">
                            <div className="d-flex gap-3  flex-wrap">
                                <button onClick={back}
                                        type="button"   className="btn btn-sm btn-outline-back btn-hover"
                                        disabled={isUploading}>
                                    {isUploading ? 'Đang tải hình ảnh...' : 'Quay lại'}
                                </button>
                                <button type="submit" className="btn btn-sm btn-outline btn-hover"
                                        disabled={isUploading}>
                                        {isUploading ? 'Đang tải hình ảnh ...' : 'Tải lên'}
                                </button>
                            </div>
                        </div>
                    </div>
                </Form>
            </Formik>
        </>
    );
}
export default CreateExamSetComponent;