
const express = require('express');
const Chat = require('../models/Chat.cjs');
const Message = require('../models/Message.cjs');
const User = require('../models/User.cjs');
const auth = require('../middleware/auth.cjs');

const router = express.Router();

// @route   GET api/chats
// @desc    Get all chats for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Find all chats where the authenticated user is a participant
    const chats = await Chat.find({ participants: req.user.id })
      .populate('participants', 'name email avatar')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });
    
    res.json(chats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/chats
// @desc    Create a new chat
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { type, participants, name, projectId } = req.body;
    
    // Add the authenticated user to the participants list
    let allParticipants = [...participants];
    if (!allParticipants.includes(req.user.id)) {
      allParticipants.push(req.user.id);
    }
    
    // For direct messages, ensure there are exactly 2 participants
    if (type === 'direct' && allParticipants.length !== 2) {
      return res.status(400).json({ message: 'Direct messages must have exactly 2 participants' });
    }
    
    // Check if a direct message chat already exists between these users
    if (type === 'direct') {
      const existingChat = await Chat.findOne({
        type: 'direct',
        participants: { $all: allParticipants }
      });
      
      if (existingChat) {
        return res.json(existingChat);
      }
    }
    
    // Create a new chat
    const newChat = new Chat({
      type,
      participants: allParticipants,
      name: type === 'group' ? name : undefined,
      project: projectId,
      createdBy: req.user.id,
    });
    
    const chat = await newChat.save();
    
    // Populate the participants field
    await chat.populate('participants', 'name email avatar');
    
    res.json(chat);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/chats/:id
// @desc    Get a specific chat
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants', 'name email avatar')
      .populate('lastMessage');
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    // Check if the authenticated user is a participant
    if (!chat.participants.some(p => p._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to access this chat' });
    }
    
    res.json(chat);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/chats/:id/messages
// @desc    Get messages for a specific chat
// @access  Private
router.get('/:id/messages', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    // Check if the authenticated user is a participant
    if (!chat.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to access this chat' });
    }
    
    const messages = await Message.find({ chat: req.params.id })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/chats/:id/messages
// @desc    Send a message in a specific chat
// @access  Private
router.post('/:id/messages', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    // Check if the authenticated user is a participant
    if (!chat.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to access this chat' });
    }
    
    const { content } = req.body;
    
    const newMessage = new Message({
      chat: req.params.id,
      sender: req.user.id,
      content,
      read: [req.user.id], // Mark as read by the sender
    });
    
    const message = await newMessage.save();
    
    // Update the lastMessage field in the chat document
    chat.lastMessage = message._id;
    chat.updatedAt = Date.now();
    await chat.save();
    
    await message.populate('sender', 'name avatar');
    
    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/chats/:id/read
// @desc    Mark all messages in a chat as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    // Check if the authenticated user is a participant
    if (!chat.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to access this chat' });
    }
    
    // Mark all messages as read by the authenticated user
    await Message.updateMany(
      { 
        chat: req.params.id,
        read: { $ne: req.user.id },
        sender: { $ne: req.user.id } // Don't need to update the user's own messages
      },
      { 
        $addToSet: { read: req.user.id } 
      }
    );
    
    res.json({ message: 'Messages marked as read' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
