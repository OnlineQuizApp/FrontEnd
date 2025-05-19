
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
import CreateExamsListComponent from "./component/CreateExamsListComponent";
function App() {
  return (
    <>
        <ToastContainer/>
        <Routes>
            <Route path="/admin" element={<AdminLayout/>}>
                <Route path={'questions'} element={<QuestionListComponent/>}/>
                <Route path={'questions/create'} element={<CreateQuestionsComponent/>}/>
                <Route path={'questions/upload-file-excel'} element={<CreateQuestionOnFileExcelComponent/>}/>
                <Route path={'questions/upload-file-img'} element={<CreateQuestionsOnImg/>}/>
                <Route path={'questions/detail/:id'} element={<QuestionsDetailComponent/>}/>
                <Route path={'exams'} element={<ExamsListComponent/>}/>
                <Route path={'exams/create'} element={<CreateExamsListComponent/>}/>
            </Route>
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/register" element={<RegisterComponent />} />
            <Route path="/profile" element={<ProfileComponent />} />
            <Route path="/resetPassword" element={<ForgotPasswordComponent />} />
            <Route path="/reset-password" element={<ResetPasswordComponent />} />
            <Route path="/change-password" element={<ChangePasswordComponent />} />
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <HomePage />
                    </PrivateRoute>
                }
            />
        </Routes>
    </>
  );
}

export default App;
