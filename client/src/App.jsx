import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import CreateTask from "./pages/CreateTask";
import Navbar from "./components/Navbar";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Admin only route component
const AdminRoute = ({ children }) => {
  const { token, role } = useAuth();

  if (!token || role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div>
                    <Navbar />
                    <div className="container mx-auto px-4 py-6">
                      <Dashboard />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div>
                    <Navbar />
                    <div className="container mx-auto px-4 py-6">
                      <Dashboard />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <div>
                    <Navbar />
                    <div className="container mx-auto px-4 py-6">
                      <Notifications />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-task"
              element={
                <AdminRoute>
                  <div>
                    <Navbar />
                    <div className="container mx-auto px-4 py-6">
                      <CreateTask />
                    </div>
                  </div>
                </AdminRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
