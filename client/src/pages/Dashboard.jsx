import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchAllTasks, fetchUserTasks } from "../api";
import TaskCard from "../components/TaskCard";

function Dashboard() {
  const { token, role } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        let taskData;
        if (role === "admin") {
          taskData = await fetchAllTasks(token);
        } else {
          taskData = await fetchUserTasks(token);
        }
        setTasks(taskData);
        setError("");
      } catch (err) {
        setError("Failed to load tasks. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [token, role]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
        {role === "admin" && (
          <a
            href="/create-task"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
          >
            Create Task
          </a>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No tasks assigned to you yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
