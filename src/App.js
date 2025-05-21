
import './App.css';
import React from "react";
import LoginComponent from "./component/LoginComponent";
import HomePage from "./component/HomeComponent";
import QuestionListComponent from "./component/QuestionListComponent";
import {Route, Routes} from "react-router-dom";
import QuestionsDetailComponent from "./component/QuestionsDetailComponent";
import CreateQuestionsComponent from "./component/CreateQuestionsComponent";
import CreateQuestionOnFileExcelComponent from "./component/CreateQuestionOnFileExcelComponent";
import CreateQuestionsOnImg from "./component/CreateQuestionsOnImg";
import {ToastContainer} from "react-toastify";
import PrivateRoute from "./component/PrivateRoute";
import RegisterComponent from "./component/RegisterComponent";
import ProfileComponent from "./component/ProfileComponent";
import ForgotPasswordComponent from "./component/ForgotPasswordComponent";
import ResetPasswordComponent from "./component/ResetPasswordComponent";
import ChangePasswordComponent from "./component/ChangePasswordComponent";
import AdminLayout from "./component/AdminLayout"
import ExamsListComponent from "./component/ExamsListComponent";
import CreateExamsRandomComponent from "./component/CreateExamsRandomComponent";
import ConfirmExamsComponent from "./component/ConfirmExamsComponent";
import CreateExamsComponent from "./component/CreateExamsComponent";
import UnauthorizedComponent from "./component/UnauthorizedComponent";
import HeaderComponent from "./component/HeaderComponent";
import FooterComponent from "./component/FooterComponent";

import DetailExamsComponent from "./component/DetailExamsComponent";
import CreateCategoryComponent from './component/CreateCategoryComponent'
import CreateQuestionsVideo from "./component/CreateQuestionsVideo";
import TestVideo from "./component/TestVideo";
import UpdateExamsConfirmComponent from "./component/UpdateExamsConfirmComponent";
import UpdateExamsComponent from "./component/UpdateExamsComponent";

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
                <Route path={'exams/updateConfirm/:id'} element={<UpdateExamsConfirmComponent/>}/>
                <Route path={'exams/update/:id'} element={<UpdateExamsComponent/>}/>
                <Route path={'category/create'} element={<CreateCategoryComponent/>}/>
                <Route path={'exams/create'} element={<CreateExamsComponent/>}/>
                <Route path={'exams/confirm/:id'} element={<ConfirmExamsComponent/>}/>
                <Route path={'exams/create-random'} element={<CreateExamsRandomComponent/>}/>
                <Route path={'exams/detail/:id'} element={<DetailExamsComponent/>}/>
            </Route>
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/test" element={<TestVideo />} />
            <Route path="/register" element={<RegisterComponent />} />
            <Route path="/profile" element={<ProfileComponent />} />
            <Route path="/resetPassword" element={<ForgotPasswordComponent />} />
            <Route path="/reset-password" element={<ResetPasswordComponent />} />
            <Route path="/change-password" element={<ChangePasswordComponent />} />
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
