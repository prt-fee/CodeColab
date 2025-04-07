const express = require('express');
const Project = require('../models/Project.cjs');
const auth = require('../middleware/auth.cjs');

const router = express.Router();

// @route   GET api/projects
// @desc    Get all projects for current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { members: req.user.id }
      ]
    }).populate('owner', 'name email avatar');
    
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar')
      .populate('tasks');
      
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has access to this project
    if (project.owner.toString() !== req.user.id && 
        !project.members.some(member => member._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(project);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.status(500).send('Server error');
  }
});

// @route   POST api/projects
// @desc    Create a project
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, status, startDate, endDate } = req.body;

    const newProject = new Project({
      name,
      description,
      status,
      owner: req.user.id,
      startDate,
      endDate
    });

    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, status, startDate, endDate } = req.body;

    // Find project
    let project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check ownership
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    // Update fields
    project.name = name || project.name;
    project.description = description || project.description;
    project.status = status || project.status;
    project.startDate = startDate || project.startDate;
    project.endDate = endDate || project.endDate;

    // Save project
    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check ownership
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await project.remove();
    res.json({ message: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.status(500).send('Server error');
  }
});

// @route   POST api/projects/:id/members
// @desc    Add a member to a project
// @access  Private
router.post('/:id/members', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Find project
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check ownership
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to add members to this project' });
    }

    // Check if member already exists
    if (project.members.includes(userId)) {
      return res.status(400).json({ message: 'User already a member of this project' });
    }

    // Add member
    project.members.push(userId);
    await project.save();
    
    const updatedProject = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');
      
    res.json(updatedProject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/projects/:id/members/:userId
// @desc    Remove a member from a project
// @access  Private
router.delete('/:id/members/:userId', auth, async (req, res) => {
  try {
    // Find project
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check ownership
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to remove members from this project' });
    }

    // Remove member
    project.members = project.members.filter(
      member => member.toString() !== req.params.userId
    );
    
    await project.save();
    
    const updatedProject = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');
      
    res.json(updatedProject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
