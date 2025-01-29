import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import "./styles/login.css";
import "./styles/dashboard.css";


const App = () => {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("auth") === "true";
    setAuth(isAuthenticated);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setAuth={setAuth} />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute auth={auth}>
              <Dashboard setAuth={setAuth} />
            </PrivateRoute>
          }
        />
      </Routes>
      
    </Router>
  );
};

export default App;
