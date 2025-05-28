import {ErrorMessage, Field, Form, Formik} from "formik";
import {useEffect, useState} from "react";
import {getAllCategory} from "../../service/CategoryService";
import {useNavigate} from "react-router-dom";
import {createExams} from "../../service/ExamsService";
import {toast} from "react-toastify";
import {Button} from "react-bootstrap";
import "../../css/Create-exams.css"
import * as Yup from 'yup';
const CreateExamsComponent = () => {
    const [category, setCategory] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const category = await getAllCategory();
            setCategory(category);
        }
        fetchData();
    }, []);
    const navigate = useNavigate();

    const handleCreateExams = async (value) => {
        try {
            const newExamId = await createExams(value);
            console.log("idExams: " + newExamId)
            navigate('/admin/exams/confirm/' + newExamId)
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data);
            } else {
                toast.error("Có lỗi xảy ra!");
            }
        }
    }
    const back =()=>{
        navigate('/admin/exams')
    }
    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required("Tiêu đề không được để trống")
            .min(5, "Tiêu đề phải ít nhất 5 ký tự"),
        category: Yup.string()
            .required("Danh mục không được để trống"),
        numberOfQuestions: Yup.number()
            .typeError("Số câu hỏi phải là số")
            .integer("Số câu hỏi phải là số nguyên")
            .min(1, "Số câu hỏi phải lớn hơn 0")
            .required("Số câu hỏi không được để trống"),
        testTime: Yup.string()
            .required("Vui lòng nhập thời gian làm bài")
            .matches(/^([0-9]{1,3}):([0-5][0-9])$/, "Định dạng phải là HH:mm, VD: 90:30")
            .test(
                "max-time",
                "Tổng thời gian không được vượt quá 180 phút",
                function (value) {
                    if (!value) return false;
                    const [hours, minutes] = value.split(":").map(Number);
                    const totalMinutes = hours * 60 + minutes;
                    return totalMinutes <= 180*60;
                }
            )
    });


    return (
        <>
            <h2 className="mb-4" style={{fontSize: "1.5rem", fontWeight: "bold"}}> Thêm Mới Đề Thi</h2>
            <Formik initialValues={{
                id: '',
                title: '',
                category: '',
                numberOfQuestions: '',
                testTime: '',
                softDelete: false
            }} onSubmit={handleCreateExams}  validationSchema={validationSchema}  >
                <Form>
                    <div className="mb-3">
                        <label>Nhập tiêu đề <span className="text-danger">*</span></label>
                        <Field name="title" className="form-control" placeholder="Nhập tiêu đề đề thi"/>
                        <ErrorMessage name="title" component="div" className="text-danger"/>
                    </div>

                    <div className="mb-3">
                        <label>Chọn danh mục đề thi <span className="text-danger">*</span></label>
                        <Field as="select" name="category" className="form-control">
                            <option value="">--- Chọn danh mục đề thi ---</option>
                            {category && category.map((c) => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                        </Field>
                        <ErrorMessage name="category" component="div" className="text-danger"/>
                    </div>

                    <div className="mb-3">
                        <label>Nhập số câu hỏi <span className="text-danger">*</span></label>
                        <Field name="numberOfQuestions" className="form-control" placeholder="VD: 20"/>
                        <ErrorMessage name="numberOfQuestions" component="div" className="text-danger"/>
                    </div>

                    <div className="mb-3">
                        <label>Nhập thời gian làm bài (phút) <span className="text-danger">*</span></label>
                        <Field name="testTime" type={'text'} className="form-control" placeholder="ví dụ: 30:00"/>
                        <ErrorMessage name="testTime" component="div" className="text-danger"/>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap">
                        <div className="d-flex gap-3 flex-wrap">
                            <Button onClick={back}
                                    type="button"
                                    className="btn btn-sm btn-outline-back btn-hover">
                                Quay lại
                            </Button>
                            <Button type="submit" className="btn btn-sm btn-outline btn-hover">
                                Thêm mới
                            </Button>
                        </div>
                        <a
                            style={{cursor: 'pointer'}}
                            type="button"
                            onClick={() => {
                            }}
                        ></a>
                    </div>
                </Form>
            </Formik>
        </>
    );
}
export default CreateExamsComponent;