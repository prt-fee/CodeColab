
const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  name: {
    type: String,
    // Required for group chats, optional for direct messages
    required: function() {
      return this.type === 'group';
    }
  },
  type: {
    type: String,
    enum: ['direct', 'group', 'project'],
    required: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  pinnedMessages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  }],
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  avatar: {
    type: String,
  },
  description: {
    type: String,
  },
  metadata: {
    typingUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    unreadCount: {
      type: Map,
      of: Number,
      default: new Map(),
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt timestamp before save
ChatSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Chat', ChatSchema);
