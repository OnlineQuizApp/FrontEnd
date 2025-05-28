import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import "../../css/admin-layout.css"
import {deleteExamByExamSetId, getExamSetByIdUpdate, updateExamSet} from "../../service/ExamSetService";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Button} from "react-bootstrap";
import * as Yup from "yup";
const UpdateExamSetComponent = () => {
    const [examSet, setExamSet] = useState([]);
    const [existingExamSet, setExistingExamSet] = useState([]);
    const {id} = useParams();
    const navigate = useNavigate();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [idDelete,setIdDelete] = useState(null);
    const [loading,setLoading] = useState(null);
    const [file, setFile] = useState(null);
    const [isImageZoomed, setIsImageZoomed] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [fieldFile,setFieldFile] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getExamSetByIdUpdate(id);
                if (!data.examSets) {
                    setExamSet({});
                    setExistingExamSet([]);
                    toast.warn("Bộ đề hiện không còn đề thi nào.");
                    return;
                }
                const formattedData = {
                    ...data.examSets,
                    creationDate: data.examSets.creationDate?.split("T")[0] || ''
                };
                setExamSet(formattedData);
                setExistingExamSet(Array.isArray(data.examSetDetailDto) ? data.examSetDetailDto : []);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu bộ đề", error);
                setExamSet({});
                setExistingExamSet([]);
            }
        };
        fetchData();
    }, [id,loading]);
    const handleUpdateExams = async (value) => {
        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("name", value.name);
            formData.append("creationDate", value.creationDate);
            await updateExamSet(id, formData);
            setIsUploading(false);
            navigate('/admin/exams-set');
            toast.success("Chỉnh sửa bộ đề thi thành công!")
        } catch (error) {
            toast.error(" Bộ đề thi đã tồn tại trong hệ thống!");
        }
    }

    const handleConfirm = async () => {
        navigate('/admin/exams-set/confirmUpdate/'+id)
    };

    const handleConfirmDeleteAnswers= async ()=>{
        if (!id || !idDelete) {
            return;
        }
        try {
            await deleteExamByExamSetId(id,idDelete);
            setShowConfirmModal(false);
            setLoading((pre)=>!pre);
            toast.success("Xoá câu hỏi thành công!");
            setIdDelete(null);
            try {
                const data = await getExamSetByIdUpdate(id);
                if (!data || !data.examSets) {
                    setExamSet({});
                    setExistingExamSet([]);
                    return;
                }
                const formattedData = {
                    ...data.examSets,
                    creationDate: data.examSets.creationDate?.split("T")[0] || '' // Lấy phần YYYY-MM-DD
                };
                setExamSet(formattedData);
                setExistingExamSet(Array.isArray(data.examSetDetailDto));
            }catch (error){
                setExamSet({});
                setExistingExamSet([]);
            }
        }catch (error){
            setExamSet({});
            setExistingExamSet([]);
        }
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
    const handleImageChange = (e) => {                 // Hàm xử lý việc chọn file
        setFile(e.target.files[0]);// lấy file đầu tiên trong danh sách
        setFieldFile(true);
    };
    return (
        <>
            <h3>Cập nhật bộ đề thi</h3>
            <Formik initialValues={examSet || {
                id: examSet?.id,
                name: examSet?.name,
                img:examSet?.img,
                creationDate: examSet?.creationDate,
                softDelete: false
            }} validationSchema={validationSchema} onSubmit={handleUpdateExams} enableReinitialize={true}>
                {({dirty}) => (
                    <Form>
                        <div className="mb-3">
                            <label>Nhập tên muốn cập nhật cho bộ đề </label>
                            <Field name="name" className="form-control" placeholder="Nhập tiêu đề đề thi"/>
                            <ErrorMessage name="name" component="div" className="text-danger"/>
                        </div>
                        <div className="mb-3">
                            <img src={examSet.img} alt="Ảnh bộ đề"
                                 style={{maxWidth: '200px', marginBottom: '10px'}}
                                 onClick={() => setIsImageZoomed(true)}/>
                            <label>Chọn hình ảnh muốn cập nhật cho cho bộ đề</label>
                            <input
                                name="img"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                onInvalid={e => e.target.setCustomValidity('Vui lòng chọn một hình ảnh đại diện cho câu hỏi!')}
                                onInput={e => e.target.setCustomValidity('')}
                                className="form-control"
                                placeholder="Chọn hình ảnh cho bộ đề"
                            />
                            <ErrorMessage name="img" component="div" className="text-danger"/>
                        </div>

                        <div className="mb-3">
                            <label>Chọn ngày muốn cập nhật</label>
                            <Field type={'date'} name="creationDate" className="form-control"
                                   placeholder="Chọn ngày tạo bộ đề">
                            </Field>
                            <ErrorMessage name="creationDate" component="div" className="text-danger"/>
                        </div>
                        <div
                            style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: '15px',   // khoảng cách trên
                                marginBottom: '15px' // khoảng cách dưới
                            }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-between',  // giãn đều 2 đầu trái phải
                                    alignItems: 'center',             // canh giữa theo chiều dọc
                                    marginTop: '15px',
                                    marginBottom: '15px'
                                }}
                            >
                                <h2 className="title" style={{margin: 0}}>Danh sách đề thi</h2>

                                <div className="button-group">
                                    {(fieldFile || dirty) && (
                                        <Button type="submit" className="btn btn-sm btn-outline btn-hover" disabled={isUploading}>
                                            {isUploading ? 'Đang tải hình ảnh ...' : 'Chỉnh sửa'}
                                        </Button>
                                    )}
                                    <button
                                        onClick={() => handleConfirm()}
                                        className="btn btn-sm btn-outline btn-hover"
                                        disabled={isUploading}>
                                        {isUploading ? 'Đang tải hình ảnh ...' : 'Thêm đề thi vào bộ đề'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
            {Array.isArray(existingExamSet) && existingExamSet.length > 0 ? (
                existingExamSet.map((examSet, index) => (
                    <div key={index} className="mb-4">
                        {Array.isArray(examSet.exams) && examSet.exams.length > 0 ? (
                            <ul style={{paddingLeft: '20px'}} className={"list"}>
                                {examSet.exams.map((exam, i) => (
                                    <li key={i} style={{marginBottom: '1rem'}}>
                                        <div style={{whiteSpace: 'pre-line'}}>
                                            <strong>Đề {i + 1}:</strong> {exam.title}
                                            {"\n"}{" ".repeat(5)}<strong>Thể loại:</strong> {exam.category}
                                            {"\n"}{" ".repeat(5)}<strong>Số lượng câu hỏi:</strong> {exam.numberOfQuestions}
                                            {"\n"}{" ".repeat(5)}<strong>Thời gian làm bài:</strong> {exam.testTime}
                                        </div>
                                        <label
                                            className="delete-icon"
                                            style={{ cursor: "pointer", color: "red", display: 'inline-block', marginTop: '5px' }}
                                            onClick={() => {
                                                setIdDelete(exam.id);
                                                setShowConfirmModal(true);
                                            }}
                                        >
                                            ❌
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Không có đề thi</p>
                        )}
                    </div>
                ))
            ) : (
                <p style={{ textAlign: 'center', marginTop: '20px' }}>Không có đề thi nào trong bộ đề này.</p>
            )}
            {showConfirmModal && (
                <div className="modal-overlay">
                    <div className="custom-modal">
                        <h4>Xác nhận xoá đề thi này khỏi bộ đề?</h4>
                        <p>
                            Thao tác này sẽ xoá đề thi này trong bộ đề của bạn. Bạn sẽ không thể
                            huỷ được thao tác này sau khi thực hiện.
                        </p>
                        <div className="modal-buttons">
                            <button className="cancel-btn" onClick={() => setShowConfirmModal(false)}>
                                Huỷ
                            </button>
                            <button className="delete-btn" onClick={handleConfirmDeleteAnswers}>
                                Xác nhận xoá câu hỏi
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isImageZoomed && (
                <div className="zoom-overlay">
                    {examSet.img &&
                        <img
                            src={examSet.img}
                            alt="Ảnh phóng to"
                            className="zoomed-image"
                            onClick={(e) => e.stopPropagation()}
                        />
                    }
                    <button className="close-button" onClick={() => setIsImageZoomed(false)}>×</button>

                </div>
            )}
        </>
    )
        ;
};

export default UpdateExamSetComponent;