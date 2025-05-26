import {ErrorMessage, Field, Form, Formik} from "formik";
import {Button} from "react-bootstrap";
import * as Yup from "yup";
import React from "react";
import {createCategory} from "../../service/CategoryService";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
const CreateCategoryComponent = ()=>{

    const navigate=useNavigate();
    const  handleCreateCategory= async (value)=>{
       await createCategory(value);
       navigate('/admin/questions/create');
       toast.success("Thêm danh mục câu hỏi thành công !");
    }

    const validationSchema = Yup.object({
        name: Yup.string()
            .required("Vui lòng nhập tên danh mục")
    });
    const handleBack = ()=>{
        navigate('/admin/questions/create');
    }
    return (
        <>
            <>
                <h1>Thêm Danh Mục Câu Hỏi</h1>
                <Formik
                    initialValues={{
                        id: '',
                        name: '',
                        softDelete:false
                    }}
                    onSubmit={handleCreateCategory} validationSchema={validationSchema}>
                    <Form>
                        <label>
                            Nhập danh mục câu hỏi <span className="text-danger">*</span>
                        </label>
                        <Field name={'name'} className="form-control"></Field>
                        <ErrorMessage name="name" component="div" className="text-danger"/>
                        <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap">
                            <div className="d-flex gap-3  flex-wrap">
                                <Button type={'submit'}
                                        className="d-flex justify-content-center gap-3 mt-4
                                         btn btn-sm btn-outline btn-hover"
                                >Thêm danh
                                    mục</Button>
                                <Button type={'submit'} className="d-flex justify-content-center gap-3 mt-4
                                         btn btn-sm btn-outline btn-hover"
                                        onClick={() => {
                                            handleBack()
                                        }}>Quay lại</Button>
                            </div>
                            </div>
                    </Form>
                </Formik>
            </>
        </>
);
}
export default CreateCategoryComponent;