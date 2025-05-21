import {useEffect, useState} from "react";
import {getAllCategory} from "../service/CategoryService";
import {useNavigate, useParams} from "react-router-dom";
import {createExams, getExamsById, updateExams} from "../service/ExamsService";
import {ErrorMessage, Field, Form, Formik} from "formik";

const UpdateExamsComponent = ()=>{
    const [exams,setExams]=useState('')
    const [category,setCategory]=useState('');
    const {id} = useParams();
    useEffect(() => {
        const fetchData= async ()=>{
            const category= await getAllCategory();
            const data= await getExamsById(id)
            setCategory(category);
            setExams(data);
        }
        fetchData();
    }, []);
    const navigate=useNavigate();

    const handleUpdateExams=  (value)=>{
        const fetchData = async ()=>{
            const newExamId = await updateExams(id,value);
            console.log("new Exams: ", newExamId);
            navigate('/admin/exams/updateConfirm/'+newExamId)
        }
        fetchData();
    }
    return(
        <>
            <Formik initialValues={exams} onSubmit={handleUpdateExams} enableReinitialize={true}>
                <Form>
                    <label>Nhập tiêu đề</label>
                    <Field name={'id'} type={'hidden'}></Field>
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
export default UpdateExamsComponent;