const Task = require("../models/taskModel");
const User = require("../models/userModel");

// Admin - Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate(
      "createdBy assignedTo comments.user"
    );
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// User - Get tasks assigned to the user
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id }).populate(
      "createdBy comments.user"
    );
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// Admin - Create task
exports.createTask = async (req, res) => {
  const { title, description, deadline } = req.body;
  try {
    const task = await Task.create({
      title,
      description,
      deadline,
      createdBy: req.user.id,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Task creation failed" });
  }
};

// Admin - Assign users to a task
exports.assignUsersToTask = async (req, res) => {
  const { taskId } = req.params;
  const { userIds } = req.body; // array of user IDs

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.assignedTo.push(
      ...userIds.filter((id) => !task.assignedTo.includes(id))
    );
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to assign users" });
  }
};

// Add a comment to task (assigned users or admin)
exports.addCommentToTask = async (req, res) => {
  const { taskId } = req.params;
  const { comment, mentioned } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const newComment = {
      user: req.user.id,
      text: comment,
      mentioned,
      createdAt: new Date(),
    };

    task.comments.push(newComment);
    await task.save();

    await task.populate("comments.user comments.mentioned", "name email");
    const latest = task.comments[task.comments.length - 1];

    res.status(201).json(latest);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin - Update task status (e.g., mark as completed)
exports.updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body; // expected values could be "in-progress", "completed", etc.

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.status = status;
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task status" });
  }
};

exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (
      task.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this task" });
    }

    await task.deleteOne();

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    return res.status(500).json({ error: "Server error while deleting task" });
  }
};

exports.getTaskComments = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId).populate(
      "comments.user",
      "name email"
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Optionally restrict access
    if (
      req.user.role !== "admin" &&
      !task.assignedTo.includes(req.user._id.toString())
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view comments" });
    }

    res.json(task.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};
