import {useEffect, useState} from "react";
import {detailQuestions} from "../service/QuestionService";
import {useNavigate, useParams} from "react-router-dom";
import {ErrorMessage, Field, Form, Formik} from "formik";

const QuestionsDetailComponent = ()=>{
    const [questionsDetail,setQuestionsDetail] = useState(null);
    const {id}=useParams();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async ()=>{
            const data = await detailQuestions(id)
            setQuestionsDetail(data);
        }
        fetchData();
    }, []);
    if (!questionsDetail) return <h1>Loading....</h1>

    return(
        <>
            {/*<h1>Trang Chi Tiết</h1>*/}
            {/*<p><strong>ID Câu Hỏi: </strong>{questionsDetail&&questionsDetail.id}</p>*/}
            {/*<p><strong>Thuộc Danh Mục: </strong>{questionsDetail&&questionsDetail.category?.name}</p>*/}
            {/*<p><strong>Câu Hỏi: </strong>{questionsDetail&&questionsDetail.content}</p>*/}
            {/*<ul>*/}
            {/*    {questionsDetail.answers.map(answer => (*/}
            {/*        <li key={answer.id}>*/}
            {/*            <strong>{answer.content}</strong> — {answer.correct ? "✔️ Đúng" : "❌ Sai"}*/}
            {/*        </li>*/}
            {/*    ))}*/}
            {/*</ul>*/}
            {/*<Formik initialValues={{*/}
            {/*    id:'',*/}

            {/*}} onSubmit={}>*/}
            {/*    <Form>*/}
            {/*        <label>Nội dung câu hỏi</label>*/}
            {/*        <Field name={'content'} value={questionsDetail.content}></Field>*/}
            {/*        <ErrorMessage name={'content'} component={'div'}></ErrorMessage>*/}
            {/*    </Form>*/}
            {/*</Formik>*/}
        </>
    );
}
export default QuestionsDetailComponent;