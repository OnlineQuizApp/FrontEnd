import React, {useEffect, useState} from "react";
import {detailExams} from "../service/ExamsService";
import {useParams} from "react-router-dom";

const DetailExamsComponent = ()=>{
    const [examsDetail,setExamsDetail]= useState([]);
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [isImageZoomed, setIsImageZoomed] = useState(false);
    const [zoomedQuestion, setZoomedQuestion] = useState(null);
    const {id} = useParams();
    useEffect(() => {
        const fetchData = async () => {
            const {data, totalPage} = await detailExams(id,page);
            setExamsDetail(data);
            setTotalPage(totalPage);
        }
        fetchData();
    }, [page]);
    const handlePre = () => {
        if (page > 0) setPage(page - 1);
    }
    const handleNext = () => {
        if (page < totalPage - 1) setPage(page + 1);
    }
    const pageSize=1;
    return(
        <>

            <div className="container mt-4">
                {examsDetail && examsDetail.length > 0 && examsDetail.map((exam, index) => {
                    console.log("Exam questions:", exam.questions);
                    return (
                        <div key={index}>
                            {exam?.questions?.length > 0 ? exam.questions.map((question, qIndex) => (
                                <div key={qIndex} className="mb-4 p-3 border rounded shadow-sm">
                                    <h6>
                                        <strong>Câu {qIndex + 1 + page * pageSize}:</strong>
                                        {question?.img==null&&question?.video!=null&&(
                                            <>
                                                <video width="320" height="240" controls
                                                       onClick={() => {
                                                           setIsImageZoomed(true);
                                                           setZoomedQuestion(question)}}>
                                                    <source src={question?.video} type="video/mp4"/>
                                                    Trình duyệt của bạn không hỗ trợ thẻ video.
                                                </video>
                                                <p>{question?.content}</p>
                                            </>
                                        )}
                                        {question?.img!==null&&question?.video==null&&(
                                            <>
                                                <img src={question?.img} alt="Câu hỏi"
                                                     style={{maxWidth: '200px', marginBottom: '10px'}}
                                                     onClick={() => {
                                                         setIsImageZoomed(true);
                                                         setZoomedQuestion(question)}}/>
                                                <p>{question?.content}</p>
                                            </>
                                        )}
                                        {question?.img===null&&question?.video===null&&question?.content!=null&&(
                                            <p>{question?.content}</p>
                                        )}

                                    </h6>
                                    {question?.examAnswers?.map((answer, aIndex) => (
                                        <div key={aIndex} style={{marginLeft: "20px"}}>
                                            <input type="checkbox" name={`q_${qIndex}`} disabled
                                                   checked={answer?.correct}/>
                                            <label style={{marginLeft: 8}}>{answer?.content}</label>
                                        </div>
                                    ))}
                                </div>
                            )) : (
                                <p>Không có câu hỏi hiển thị</p>
                            )}
                        </div>
                    );
                })}
            </div>
            {isImageZoomed && zoomedQuestion&&(
                <div className="zoom-overlay">
                    {zoomedQuestion?.img ? (
                        <img
                            src={zoomedQuestion?.img}
                            alt="Ảnh phóng to"
                            className="zoomed-image"
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <video
                            src={zoomedQuestion?.video}
                            controls
                            autoPlay
                            className="zoomed-video"
                            onClick={(e) => e.stopPropagation()}
                        />
                    )}
                    <button className="close-button" onClick={() => setIsImageZoomed(false)}>×</button>
                </div>
            )}
            <div style={{justifyContent: 'center', textAlign: 'center'}}>
                <button className={'btn btn-sm btn-outline-success btn-hover'}
                        onClick={() => (handlePre())}>Trang
                    Trước
                </button>
                {[...new Array(totalPage)].map((p, i) => (
                    <button
                        className={`btn btn-sm btn-outline-success btn-hover ${page === i ? 'active' : ''}`}
                        onClick={() => (setPage(i))}>{i + 1}</button>
                ))}
                <button className={'btn btn-sm btn-outline-success btn-hover'}
                        onClick={() => (handleNext())}>Trang
                    Sau
                </button>
            </div>
        </>
    );
}
export default DetailExamsComponent;