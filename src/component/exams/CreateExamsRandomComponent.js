import {ErrorMessage, Field, Form, Formik} from "formik";
import {useEffect, useState} from "react";
import {getAllCategory} from "../../service/CategoryService";
import { createExamsRandom} from "../../service/ExamsService";
import {useNavigate} from "react-router-dom";
import {Button} from "react-bootstrap";
import {toast} from "react-toastify";
import * as Yup from "yup";

const CreateExamsRandomComponent = () => {
   const [category,setCategory]=useState('');
    useEffect(() => {
        const fetchData= async ()=>{
            const category= await getAllCategory();
            setCategory(category);
        }
        fetchData();
    }, []);
    const navigate=useNavigate();

    const handleCreateExams= async (value)=>{
        try {
           await createExamsRandom(value);
           navigate('/admin/exams');
            toast.success("Thêm mới đề thi thành công")
        }catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data);
            } else {
                toast.error("Có lỗi xảy ra!");
            }
        }
    }
    const validationSchema = Yup.object({
        title: Yup.string()
            .required("Tiêu đề không được để trống"),
        category: Yup.string()
            .required("Vui lòng chọn danh mục"),
        numberOfQuestions: Yup.number()
            .typeError("Số câu hỏi phải là số")
            .integer("Phải là số nguyên")
            .positive("Phải lớn hơn 0")
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
    const back =()=>{
        navigate('/admin/exams')
    }
    return (
        <>
            <h2 className="mb-4" style={{fontSize: "1.5rem", fontWeight: "bold"}}> Thêm Mới Đề Thi RanDom</h2>
            <Formik initialValues={{
                id: '',
                title: '',
                category: '',
                numberOfQuestions: '',
                testTime: '',
                softDelete: false
            }} onSubmit={handleCreateExams} validationSchema={validationSchema}>
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
                        <Field name="testTime" type={'text'} className="form-control" placeholder="ví dụ: 00:30"/>
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
                    </div>
                </Form>
            </Formik>
        </>
    );
}
export default CreateExamsRandomComponent;