import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import Header from '../src/Components/Header';
import Form from './Components/Form';
import UserData from './Components/UserData';
import { ToastContainer } from 'react-toastify';
import App from './App';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/">
        <Route index element={<App />} />
        <Route path="test" element={<App />} />
      </Route>
    </Routes>
  </BrowserRouter>  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
