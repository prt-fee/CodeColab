
const express = require('express');
const Task = require('../models/Task.cjs');
const Project = require('../models/Project.cjs');
const auth = require('../middleware/auth.cjs');

const router = express.Router();

// @route   GET api/tasks
// @desc    Get all tasks for current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { assignedTo: req.user.id },
        { createdBy: req.user.id }
      ]
    })
    .populate('project', 'name')
    .populate('assignedTo', 'name avatar')
    .populate('createdBy', 'name avatar');
    
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/tasks/project/:projectId
// @desc    Get all tasks for a project
// @access  Private
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    // Check if user has access to this project
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.owner.toString() !== req.user.id && 
        !project.members.some(member => member.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name avatar')
      .populate('createdBy', 'name avatar');
      
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.status(500).send('Server error');
  }
});

// @route   GET api/tasks/:id
// @desc    Get task by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name avatar');
      
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the project this task belongs to
    const project = await Project.findById(task.project);
    
    if (project.owner.toString() !== req.user.id && 
        !project.members.some(member => member.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(500).send('Server error');
  }
});

// @route   POST api/tasks
// @desc    Create a task
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      project, 
      assignedTo, 
      status, 
      priority,
      dueDate 
    } = req.body;

    // Check if user has access to this project
    const projectDoc = await Project.findById(project);
    
    if (!projectDoc) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (projectDoc.owner.toString() !== req.user.id && 
        !projectDoc.members.some(member => member.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to create tasks in this project' });
    }

    const newTask = new Task({
      title,
      description,
      project,
      assignedTo,
      status,
      priority,
      dueDate,
      createdBy: req.user.id
    });

    const task = await newTask.save();
    
    // Add task to project
    projectDoc.tasks.push(task._id);
    await projectDoc.save();
    
    // Return populated task
    const populatedTask = await Task.findById(task._id)
      .populate('project', 'name')
      .populate('assignedTo', 'name avatar')
      .populate('createdBy', 'name avatar');
      
    res.json(populatedTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      assignedTo, 
      status, 
      priority,
      dueDate,
      completedAt
    } = req.body;

    // Find task
    let task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the project this task belongs to
    const project = await Project.findById(task.project);
    
    if (project.owner.toString() !== req.user.id && 
        !project.members.some(member => member.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // Update fields
    task.title = title || task.title;
    task.description = description || task.description;
    task.assignedTo = assignedTo || task.assignedTo;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    
    // Only set completedAt if status changed to completed
    if (status === 'completed' && task.status !== 'completed') {
      task.completedAt = Date.now();
    } else if (completedAt) {
      task.completedAt = completedAt;
    }

    // Save task
    await task.save();
    
    // Return populated task
    const updatedTask = await Task.findById(task._id)
      .populate('project', 'name')
      .populate('assignedTo', 'name avatar')
      .populate('createdBy', 'name avatar');
      
    res.json(updatedTask);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the project this task belongs to
    const project = await Project.findById(task.project);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    // Remove task from project
    project.tasks = project.tasks.filter(
      taskId => taskId.toString() !== req.params.id
    );
    await project.save();
    
    // Delete task
    await task.remove();
    res.json({ message: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(500).send('Server error');
  }
});

module.exports = router;
