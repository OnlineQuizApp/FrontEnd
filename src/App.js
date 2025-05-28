
import './App.css';
import React from "react";
import LoginComponent from "./component/LoginComponent";
import HomePage from "./component/HomeComponent";
import QuestionListComponent from "./component/questions/QuestionListComponent";
import {Route, Routes} from "react-router-dom";
import QuestionsDetailComponent from "./component/questions/QuestionsDetailComponent";
import CreateQuestionsComponent from "./component/questions/CreateQuestionsComponent";
import CreateQuestionOnFileExcelComponent from "./component/questions/CreateQuestionOnFileExcelComponent";
import CreateQuestionsOnImg from "./component/questions/CreateQuestionsOnImg";
import {ToastContainer} from "react-toastify";
import PrivateRoute from "./component/PrivateRoute";
import RegisterComponent from "./component/RegisterComponent";
import ProfileComponent from "./component/ProfileComponent";
import ForgotPasswordComponent from "./component/ForgotPasswordComponent";
import ResetPasswordComponent from "./component/ResetPasswordComponent";
import ChangePasswordComponent from "./component/ChangePasswordComponent";
import AdminLayout from "./component/AdminLayout"
import ExamsListComponent from "./component/exams/ExamsListComponent";
import CreateExamsRandomComponent from "./component/exams/CreateExamsRandomComponent";
import ConfirmExamsComponent from "./component/exams/ConfirmExamsComponent";
import CreateExamsComponent from "./component/exams/CreateExamsComponent";
import UnauthorizedComponent from "./component/UnauthorizedComponent";
import HeaderComponent from "./component/HeaderComponent";
import FooterComponent from "./component/FooterComponent";
import DetailExamsComponent from "./component/exams/DetailExamsComponent";
import CreateCategoryComponent from './component/category/CreateCategoryComponent'
import CreateQuestionsVideo from "./component/questions/CreateQuestionsVideo";
import UpdateExamsComponent from "./component/exams/UpdateExamsComponent";
import ConfirmExamsUpdateComponent from "./component/exams/ConfirmExamsUpdateComponent";
import CreateExamSetComponent from "./component/examSet/CreateExamSetComponent";
import ConfirmExamSetComponent from "./component/examSet/ConfirmExamSetComponent";
import ConfirmExamSetUpdateComponent from "./component/examSet/ConfirmExamSetUpdateComponent";
import ExamSetListComponent from "./component/examSet/ExamSetListComponent";
import UpdateExamSetComponent from "./component/examSet/UpdateExamSetComponent";
import GetRatingPointsComponent from "./component/ratingPoints/GetRatingPointsComponent";
import UserChat from "./component/chatSocKetTest/UserChat";
import AdminChat from "./component/chatSocKetTest/AdminChat";

function App() {
  return (
    <>
        <ToastContainer/>
        <Routes>
            <Route path="/admin" element={ <PrivateRoute roles={['ADMIN']}>
                <AdminLayout />
            </PrivateRoute>}>
                <Route path={'questions'} element={<QuestionListComponent/>}/>
                <Route path={'questions/create'} element={<CreateQuestionsComponent/>}/>
                <Route path={'questions/upload-file-excel'} element={<CreateQuestionOnFileExcelComponent/>}/>
                <Route path={'questions/upload-file-img'} element={<CreateQuestionsOnImg/>}/>
                <Route path={'questions/upload-video'} element={<CreateQuestionsVideo/>}/>
                <Route path={'questions/detail/:id'} element={<QuestionsDetailComponent/>}/>
                <Route path={'exams'} element={<ExamsListComponent/>}/>
                <Route path={'exams/update/:id'} element={<UpdateExamsComponent/>}/>
                <Route path={'category/create'} element={<CreateCategoryComponent/>}/>
                <Route path={'exams/create'} element={<CreateExamsComponent/>}/>
                <Route path={'exams/confirm/:id'} element={<ConfirmExamsComponent/>}/>
                <Route path={'exams-set'} element={<ExamSetListComponent/>}/>
                <Route path={'exams-set/create'} element={<CreateExamSetComponent/>}/>
                <Route path={'exams-set-create/confirm/:id'} element={<ConfirmExamSetComponent/>}/>
                <Route path={'exams-set-update/detail/:id'} element={<UpdateExamSetComponent/>}/>
                <Route path={'exams-set/confirmUpdate/:id'} element={<ConfirmExamSetUpdateComponent/>}/>
                <Route path={'exams/confirmUpdate/:id'} element={<ConfirmExamsUpdateComponent/>}/>
                <Route path={'exams/create-random'} element={<CreateExamsRandomComponent/>}/>
                <Route path={'exams/detail/:id'} element={<DetailExamsComponent/>}/>
            </Route>
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/register" element={<RegisterComponent />} />
            <Route path="/profile" element={<ProfileComponent />} />
            <Route path="/resetPassword" element={<ForgotPasswordComponent />} />
            <Route path="/reset-password" element={<ResetPasswordComponent />} />
            <Route path="/change-password" element={<ChangePasswordComponent />} />
            <Route path="/leaderboard" element={<GetRatingPointsComponent/>} />
            <Route path="/chat/user" element={<UserChat/>} />
            <Route path="/chat/admin" element={<AdminChat/>} />
            <Route
                path="/"
                element={
                        <HomePage />
                }
            />
            <Route path="/unauthorized" element={<UnauthorizedComponent />} />
            <Route path="/header" element={<HeaderComponent />} />
            <Route path="/footer" element={<FooterComponent />} />
        </Routes>
    </>
  );
}

export default App;
