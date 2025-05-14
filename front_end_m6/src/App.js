
import './App.css';
import React from "react";
import QuestionListComponent from "./component/QuestionListComponent";
import {Route, Routes} from "react-router-dom";
import QuestionsDetailComponent from "./component/QuestionsDetailComponent";
import CreateQuestionsComponent from "./component/CreateQuestionsComponent";

function App() {
  return (
    <>
        <Routes>
            <Route path={'/questions'} element={<QuestionListComponent/>}></Route>
            <Route path={'/questions/create'} element={<CreateQuestionsComponent/>}></Route>
            <Route path={'/questions/detail/:id'} element={<QuestionsDetailComponent/>}></Route>
        </Routes>
    </>
  );
}

export default App;
