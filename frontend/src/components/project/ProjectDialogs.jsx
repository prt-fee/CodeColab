
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export const NewFileDialog = ({ isOpen, onOpenChange, newFileName, setNewFileName, newFileType, setNewFileType, onAddFile }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New File</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="filename">File Name</Label>
            <Input
              id="filename"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="Enter file name with extension (e.g. main.js)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filetype">File Type</Label>
            <select
              id="filetype"
              value={newFileType}
              onChange={(e) => setNewFileType(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="js">JavaScript (.js)</option>
              <option value="html">HTML (.html)</option>
              <option value="css">CSS (.css)</option>
              <option value="md">Markdown (.md)</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onAddFile}>Create File</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const NewMeetingDialog = ({ isOpen, onOpenChange, newMeeting, setNewMeeting, onAddMeeting }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule a Meeting</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title</Label>
            <Input
              id="title"
              value={newMeeting.title}
              onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
              placeholder="Enter meeting title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newMeeting.date}
                onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={newMeeting.time}
                onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={newMeeting.duration}
              onChange={(e) => setNewMeeting({...newMeeting, duration: e.target.value})}
              min="15"
              step="15"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onAddMeeting}>Schedule Meeting</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const NewTaskDialog = ({ isOpen, onOpenChange, newTask, setNewTask, onAddTask }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              placeholder="Enter task title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              placeholder="Describe your task"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onAddTask}>Create Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const NewCommitDialog = ({ isOpen, onOpenChange, commitMessage, setCommitMessage, onAddCommit }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Commit Changes</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="message">Commit Message</Label>
            <Textarea
              id="message"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Describe your changes"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onAddCommit}>Commit Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
