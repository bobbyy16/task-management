import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const { logout, role, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-600">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-white font-bold text-xl">
              Task Manager
            </Link>
          </div>

          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/notifications"
              className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Notifications
            </Link>
            {role === "admin" && (
              <Link
                to="/create-task"
                className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Create Task
              </Link>
            )}

            <div className="ml-4 relative flex-shrink-0 flex items-center">
              <div className="ml-3">
                <div className="text-indigo-100 text-sm">
                  {user?.email} ({role})
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 bg-indigo-700 hover:bg-indigo-800 text-white px-3 py-1 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
