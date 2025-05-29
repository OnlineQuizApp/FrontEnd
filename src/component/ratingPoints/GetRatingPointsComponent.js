import React, {useEffect, useState} from "react";
import {getAllRatingPoints, getRatingPointsByUser} from "../../service/RatingPointService";
import "../../css/RatingPoints.css"
import "../../css/ProfileComponent.css"
import HeaderComponent from "../HeaderComponent";
import FooterComponent from "../FooterComponent";


const GetRatingPointsComponent = () => {
    const [ratingPoints, setRatingPoints] = useState([]);
    const [user, setUser] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            const ratingPoints = await getAllRatingPoints();
            const user = await getRatingPointsByUser();
            console.log("user: ",user)
            const admin  = "ADMIN".includes(user?.role)
            console.log("Role: "+admin)
            const defaultValue= admin ? null: user;
            setRatingPoints(ratingPoints);
            setUser(defaultValue);
        }
        fetchData();
    }, []);
    return (
        <>
            <HeaderComponent/>
            <div className="ranking-container">
                <h2 className="ranking-title">Bảng Xếp Hạng Người Dùng</h2>
                <div className="ranking-content">
                    {user&& (
                        <div className="ranking-left">
                            <p><strong>Tên người dùng</strong>:  {user?.name}</p>
                            <p><strong>Điểm tích
                                luỹ</strong>: {ratingPoints.find(rp => rp?.user?.id === user.id)?.accumulatedPoints}</p>
                        </div>
                    )}

                    <div className="ranking-right">
                        <table className="ranking-table">
                            <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên người dùng</th>
                                <th>Điểm tích luỹ</th>
                            </tr>
                            </thead>
                            <tbody>
                            {ratingPoints && ratingPoints.map((rp, index) => (
                                <tr
                                    key={rp.id}
                                    style={{ cursor:'pointer'}}
                                    onClick={()=>{
                                        setUser(rp.user)
                                    }}
                                >
                                    <td>{index + 1}</td>
                                    <td style={{
                                        color: user && rp?.user?.id === user?.id ? 'red' : 'black',
                                        fontWeight: user && rp?.user?.id === user?.id ? 'highlight' : 'normal',

                                    }}

                                    >{rp?.user?.name} </td>
                                    <td style={{
                                        color: user && rp?.user?.id === user?.id ? 'red' : 'black',
                                        fontWeight: user && rp?.user?.id === user?.id ? 'highlight' : 'normal'
                                    }}
                                    >{rp?.accumulatedPoints}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <FooterComponent/>
        </>
    );
}
export default GetRatingPointsComponent;