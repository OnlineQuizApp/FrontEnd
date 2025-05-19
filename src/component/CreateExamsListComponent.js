import {ErrorMessage, Field, Form, Formik} from "formik";
import {useEffect, useState} from "react";
import {getAllCategory} from "../service/CategoryService";
import {createExams} from "../service/ExamsService";
import {useNavigate} from "react-router-dom";

const CreateExamsListComponent = () => {
   const [category,setCategory]=useState('');
    useEffect(() => {
        const fetchData= async ()=>{
            const category= await getAllCategory();
            setCategory(category);
        }
        fetchData();
    }, []);
    const navigate=useNavigate();

    const handleCreateExams=(value)=>{
        const fetchData = async ()=>{
           await createExams(value);
           navigate('/admin/exams')
        }
        fetchData();
    }
    return (
        <>
            <Formik initialValues={{
                id:'',
                title:'',
                category:'',
                numberOfQuestions:'',
                testTime:'',
                softDelete:false
            }} onSubmit={handleCreateExams}>
                <Form>
                    <label>Nhập tiêu đề</label>
                    <Field name={'title'}></Field>
                    <ErrorMessage name={'title'} component={'div'}></ErrorMessage>
                    <Field as={'select'} name={'category'}>
                        <option>--- Chọn danh mục đề thi</option>
                        {category && category.map((c) => (
                            <option value={c.name}>{c.name}</option>
                        ))}
                    </Field>
                    <ErrorMessage name={'category'} component={'div'}></ErrorMessage>
                    <label>Nhập số câu hỏi</label>
                    <Field name={'numberOfQuestions'}></Field>
                    <ErrorMessage name={'numberOfQuestions'} component={'div'}></ErrorMessage>
                    <label>Nhập thời gian làm bài</label>
                    <Field name={'testTime'}></Field>
                    <ErrorMessage name={'testTime'} component={'div'}></ErrorMessage>
                    <button type={'submit'}>Thêm mới</button>
                </Form>
            </Formik>
        </>
    );
}
export default CreateExamsListComponent;