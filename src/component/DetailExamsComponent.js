import React, {useEffect, useState} from "react";
import {detailExams, getAllExams} from "../service/ExamsService";

const DetailExamsComponent = ()=>{
    const [examsDetail,setExamsDetail]= useState([]);
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [idDetail,setIdDetail]=useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const {data, totalPage} = await detailExams(idDetail,page);
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
    return(
        <>
            

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