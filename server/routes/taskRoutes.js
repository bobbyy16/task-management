const express = require("express");
const router = express.Router();
const {
  createTask,
  getMyTasks,
  getAllTasks,
  assignUsersToTask,
  addCommentToTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getTaskComments } = require("../controllers/taskController");

router.get("/:taskId/comments", protect, getTaskComments);

// Admin: Create new task
router.post("/", protect, adminOnly, createTask);

// Admin: View all tasks
router.get("/all", protect, adminOnly, getAllTasks);

// Admin: Assign users to a task
router.put("/:taskId/assign", protect, adminOnly, assignUsersToTask);

// User/Admin: Add comment to task
router.post("/:taskId/comments", protect, addCommentToTask);

// User: View tasks assigned to them
router.get("/my", protect, getMyTasks);

// User: Update task status
router.patch("/:taskId", protect, updateTaskStatus);

router.delete("/:taskId", protect, adminOnly, deleteTask);

module.exports = router;
