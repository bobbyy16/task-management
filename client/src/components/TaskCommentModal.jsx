import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

function TaskCommentModal({ task, isOpen, onClose, onCommentAdded }) {
  const { token, user } = useAuth();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mentionedUser, setMentionedUser] = useState("");
  const [usersToMention, setUsersToMention] = useState([]);
  const [showMentions, setShowMentions] = useState(false);
  const commentInputRef = useRef(null);
  const mentionsDropdownRef = useRef(null);

  // Fetch comments when modal opens
  useEffect(() => {
    if (isOpen && task?._id) {
      fetchComments();
      fetchUsersForMention();
    }
  }, [isOpen, task]);

  // Close mentions dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        mentionsDropdownRef.current &&
        !mentionsDropdownRef.current.contains(event.target)
      ) {
        setShowMentions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus comment input when modal opens
  useEffect(() => {
    if (isOpen && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [isOpen]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${task._id}/comments`, // Ensure the correct endpoint for comments
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError("Failed to load comments. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersForMention = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsersToMention(data);
    } catch (err) {
      console.error("Failed to fetch users for mentions:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${task._id}/comments`, // Ensure the correct endpoint for comments
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment,
            mentioned: mentionedUser || null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const newComment = await response.json();

      // Add new comment to the list
      setComments([...comments, newComment]);

      // Reset form
      setComment("");
      setMentionedUser("");

      // Notify parent component
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }
    } catch (err) {
      setError("Failed to add comment. Please try again.");
      console.error(err);
    }
  };

  const handleMentionUser = (userId, userName) => {
    setMentionedUser(userId);
    setComment(`@${userName} ${comment}`);
    setShowMentions(false);
    commentInputRef.current.focus();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {task?.title} - Comments
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Comment List */}
        <div className="p-4 overflow-y-auto flex-grow">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-6">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-indigo-500 border-t-transparent"></div>
              <p className="mt-2 text-sm text-gray-600">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No comments yet. Be the first to add one!
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between">
                    <div className="font-medium text-indigo-600">
                      {comment.user?.name || comment.user?.email || "User"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </div>
                  </div>
                  <div className="mt-1 text-gray-700">
                    {comment.mentioned && (
                      <span className="text-blue-600 font-medium">
                        {comment.mentioned.name || comment.mentioned.email}{" "}
                      </span>
                    )}
                    {comment.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment Form */}
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <div className="relative">
              <input
                ref={commentInputRef}
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onFocus={() => setShowMentions(true)}
              />

              {/* Mention dropdown */}
              {showMentions && usersToMention.length > 0 && (
                <div
                  ref={mentionsDropdownRef}
                  className="absolute bottom-full left-0 mb-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-10"
                >
                  <div className="p-2 text-xs text-gray-500 border-b">
                    Mention a user
                  </div>
                  {usersToMention.map((user) => (
                    <div
                      key={user._id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() =>
                        handleMentionUser(user._id, user.name || user.email)
                      }
                    >
                      <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                        <span className="text-xs font-medium text-indigo-600">
                          {(
                            user.name?.charAt(0) ||
                            user.email?.charAt(0) ||
                            "U"
                          ).toUpperCase()}
                        </span>
                      </div>
                      <span>{user.name || user.email}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Comment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskCommentModal;
