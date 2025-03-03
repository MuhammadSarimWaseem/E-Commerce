import React, { Fragment } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./Pages/HomePage/Home";
import Login from "./Pages/LoginPage/Login";
import Signup from "./Pages/SignupPage/Signup";
import Navbar from "./Components/Navbar";

import './App.css';
import "react-toastify/dist/ReactToastify.css";
import Landing from "./Pages/LandingPage/Landing";


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
        <Navbar></Navbar>
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/landing" element={<Landing />} />
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
