import React, { Fragment } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import './App.css';
import "react-toastify/dist/ReactToastify.css";
import Login from "./Pages/LoginPage/Login";

function App() {
  return (
    <Fragment>
      {/* Toast Notifications for Global Use */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        theme="light"
        style={{
          width: "70%",
          maxWidth: "300px",
          margin: "0 auto",
          fontSize: "14px"
        }}
      />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
