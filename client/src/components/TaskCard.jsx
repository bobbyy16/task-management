import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import TaskCommentModal from "./TaskCommentModal";

function TaskCard({ task, onStatusChange }) {
  const [currentTask, setCurrentTask] = useState(task);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const { token, role } = useAuth();

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  console.log(task);

  const isOverdue = new Date(currentTask.deadline) < new Date();

  // Delete handler (Admin-only)
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      setIsUpdating(true);
      const response = await fetch(
        `http://localhost:5000/api/tasks/${currentTask._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete task");

      if (onStatusChange)
        onStatusChange({ deleted: true, _id: currentTask._id });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle comment modal
  const openCommentModal = () => {
    setIsCommentModalOpen(true);
  };

  const closeCommentModal = () => {
    setIsCommentModalOpen(false);
  };

  const handleCommentAdded = (newComment) => {
    // You can update the task if needed or just keep the modal open
    console.log("New comment added:", newComment);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-5">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800">
              {currentTask.title} -{" "}
              {currentTask.assignedTo?.map((user) => user.name).join(", ") ||
                "Unassigned"}
            </h3>
          </div>

          <p className="mt-2 text-gray-600">{currentTask.description}</p>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <span className="font-medium">Deadline:</span>{" "}
                {formatDate(currentTask.deadline)}
              </div>

              <div className="flex gap-2">
                {/* Comment button for both users and admins */}
                <button
                  onClick={openCommentModal}
                  className="px-3 py-1 text-white text-sm font-medium rounded bg-indigo-500 hover:bg-indigo-600 transition-colors flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  Comments
                </button>

                {role === "admin" && (
                  <button
                    onClick={handleDelete}
                    disabled={isUpdating}
                    className="px-3 py-1 text-white text-sm font-medium rounded bg-red-500 hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-2 text-sm text-red-600">Error: {error}</div>
            )}
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      <TaskCommentModal
        task={currentTask}
        isOpen={isCommentModalOpen}
        onClose={closeCommentModal}
        onCommentAdded={handleCommentAdded}
      />
    </>
  );
}

export default TaskCard;
