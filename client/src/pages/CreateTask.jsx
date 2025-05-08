import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { fetchUsers, createTask } from "../api";

function CreateTask() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers(token);
        if (!usersData || usersData.length === 0) {
          setError("No users found.");
          return;
        }
        setUsers(usersData);
      } catch (err) {
        console.error("Failed to load users:", err);
        setError("Failed to load users. Please try again later.");
      } finally {
        setUsersLoading(false);
      }
    };

    loadUsers();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createTask(token, {
        title,
        description,
        deadline,
        assignedTo,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Task</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="deadline"
            >
              Deadline
            </label>
            <input
              id="deadline"
              type="date"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="assignedTo"
            >
              Assign To
            </label>
            {usersLoading ? (
              <div className="text-center py-2">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent"></div>
                <span className="ml-2 text-sm text-gray-600">
                  Loading users...
                </span>
              </div>
            ) : (
              <select
                id="assignedTo"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                required
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading || usersLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-indigo-300"
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTask;
