import {ErrorMessage, Field, Form, Formik} from "formik";
import {useEffect, useState} from "react";
import {getAllCategory} from "../service/CategoryService";
import {createQuestions} from "../service/QuestionService";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const CreateQuestionsComponent = ()=>{
    const [category,setCategory]=useState([]);
    useEffect(() => {
        const fetchData = async ()=>{
            const data =await getAllCategory();
            setCategory(data);
        }
        fetchData();
    }, []);
        const navigate = useNavigate();
    const handleCreateQuestions= async (value)=>{
      await createQuestions(value);
      navigate('/questions');
      toast.success('Thêm mới thành công!');
    }
    return (
        <>
            <h1>Thêm Câu Hỏi</h1>
              <Formik initialValues={{
                  id: '',
                  content: '',
                  img: '',
                  softDelete: false,
                  category: '',
                  answers: [
                      { content: '', isCorrect: false },
                      { content: '', isCorrect: false },
                      { content: '', isCorrect: false },
                      { content: '', isCorrect: false },
                  ]
              }} onSubmit={handleCreateQuestions}>
                  <Form>
                      <label>Nhập nội dung câu hỏi</label>
                      <Field name={'content'}></Field><br/>
                      <ErrorMessage name={'content'} component={'div'}></ErrorMessage>
                      <Field as={'select'} name={'category'}>
                          <option value={''}>-- Chọn Danh Mục Câu Hỏi --</option>
                          {category && category.map((c) => (
                              <option value={c.id}>{c.name}</option>
                          ))}
                      </Field><br/>
                      <ErrorMessage name={'category'} component={'div'}></ErrorMessage>
                      
                      <button type={'submit'}> Thêm mới</button>
                  </Form>
              </Formik>
        </>
    );
}
export default CreateQuestionsComponent;