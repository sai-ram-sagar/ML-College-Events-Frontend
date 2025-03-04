import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import RecommendationForm from "./components/RecommendationForm";
import Home from "./components/Home";
import Favorites from "./components/Favorites";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import LoginAndRegister from "./components/LoginAndRegister";
import Navbar from "./components/SideBar";
import styled from "styled-components";
import EventDetails from "./components/EventDetails";
import AllEvents from "./components/AllEvents";
import RegisteredEvents from "./components/RegisteredEvents";
import MachineLearning from "./components/MachineLearning";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("userId"));

  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(!!localStorage.getItem("userId"));
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth); 
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <ToastContainer style={{ marginTop: "40px" }} position="top-right" autoClose={3500} hideProgressBar={true} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      {isAuthenticated ? (
        <>
          <Navbar onLogout={handleLogout} />
          <MainContent>
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Home /></ProtectedRoute>} />
              <Route path="/events" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AllEvents /></ProtectedRoute>} />
              <Route path="/recommend" element={<ProtectedRoute isAuthenticated={isAuthenticated}><RecommendationForm /></ProtectedRoute>} />
              <Route path="/favorites" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Favorites /></ProtectedRoute>} />
              <Route path="/registered" element={<ProtectedRoute isAuthenticated={isAuthenticated}><RegisteredEvents /></ProtectedRoute>} />
              <Route path="/machineLearnning" element={<ProtectedRoute isAuthenticated={isAuthenticated}><MachineLearning /></ProtectedRoute>} />
              <Route path="/event/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EventDetails /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </MainContent>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<LoginAndRegister setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
};

const MainContent = styled.div`
  padding: 60px 20px 0px 20px;
  overflow-y: auto;
  height: 100vh;
`;

export default App;
