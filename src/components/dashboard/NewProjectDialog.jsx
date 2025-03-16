
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, Plus, X, User, Users } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

const NewProjectDialog = ({ 
  isOpen, 
  onOpenChange, 
  newProject = { 
    name: '', 
    description: '',
    assignees: [],
    manager: null,
    startDate: null,
    endDate: null,
    category: 'uncategorized',
    status: 'active'
  }, 
  setNewProject = () => {}, 
  onCreateProject = () => {} 
}) => {
  const [step, setStep] = useState(1);
  
  const handleNameChange = (e) => {
    setNewProject({ ...newProject, name: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    setNewProject({ ...newProject, description: e.target.value });
  };
  
  const handleStartDateSelect = (date) => {
    setNewProject({ ...newProject, startDate: date });
  };
  
  const handleEndDateSelect = (date) => {
    setNewProject({ ...newProject, endDate: date });
  };
  
  const handleCategoryChange = (value) => {
    setNewProject({ ...newProject, category: value });
  };
  
  const handleStatusChange = (value) => {
    setNewProject({ ...newProject, status: value });
  };
  
  const handleAddAssignee = () => {
    // Mock adding an assignee
    const mockAssignee = {
      id: Date.now().toString(),
      name: 'AC',
      avatar: ''
    };
    setNewProject({ 
      ...newProject, 
      assignees: [...(newProject.assignees || []), mockAssignee] 
    });
  };
  
  const handleRemoveAssignee = (assigneeId) => {
    setNewProject({
      ...newProject,
      assignees: newProject.assignees.filter(a => a.id !== assigneeId)
    });
  };
  
  const handleSetManager = () => {
    // Mock adding a manager
    const mockManager = {
      id: Date.now().toString(),
      name: 'PM',
      avatar: ''
    };
    setNewProject({ ...newProject, manager: mockManager });
  };
  
  const handleDialogClose = () => {
    // Reset form when dialog closes
    setStep(1);
    onOpenChange(false);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateProject(e);
    setStep(1);
  };

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else handleSubmit({ preventDefault: () => {} });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Add project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="use-template" 
                className="border-gray-600 data-[state=checked]:bg-blue-500"
              />
              <Label htmlFor="use-template" className="text-white">Use template</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project-name" className="text-white">Title:</Label>
              <div className="relative">
                <div className="absolute left-3 top-3 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs">↓</span>
                </div>
                <Input
                  id="project-name"
                  placeholder="Enter project title"
                  value={newProject?.name || ''}
                  onChange={handleNameChange}
                  required
                  className="pl-12 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project-description" className="text-white">Description:</Label>
              <Textarea
                id="project-description"
                placeholder="Enter project description"
                value={newProject?.description || ''}
                onChange={handleDescriptionChange}
                rows={4}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Assignees:</Label>
              <div className="flex flex-wrap gap-2 items-center">
                {newProject.assignees && newProject.assignees.map(assignee => (
                  <div key={assignee.id} className="flex items-center bg-gray-800 rounded-full pr-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-red-500 text-white">
                        {assignee.name}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => handleRemoveAssignee(assignee.id)}
                      className="ml-1 text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddAssignee}
                  className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 border-gray-700 border"
                >
                  <Plus className="h-4 w-4 text-gray-400" />
                </button>
                {newProject.assignees && newProject.assignees.length > 0 && (
                  <button
                    type="button"
                    className="text-sm text-blue-400 hover:text-blue-300 ml-2"
                    onClick={() => setNewProject({ ...newProject, assignees: [] })}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Project manager:</Label>
              <div className="flex items-center gap-2">
                {newProject.manager ? (
                  <div className="flex items-center bg-gray-800 rounded-full pr-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-red-500 text-white">
                        {newProject.manager.name}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => setNewProject({ ...newProject, manager: null })}
                      className="ml-1 text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSetManager}
                    className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 border-gray-700 border"
                  >
                    <Plus className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Start:</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={cn(
                        "w-full justify-start text-left bg-gray-800 border-gray-700 hover:bg-gray-700",
                        !newProject.startDate && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newProject.startDate ? format(newProject.startDate, "PPP") : "Select"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                    <Calendar
                      mode="single"
                      selected={newProject.startDate}
                      onSelect={handleStartDateSelect}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">End:</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={cn(
                        "w-full justify-start text-left bg-gray-800 border-gray-700 hover:bg-gray-700",
                        !newProject.endDate && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newProject.endDate ? format(newProject.endDate, "PPP") : "Select"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                    <Calendar
                      mode="single"
                      selected={newProject.endDate}
                      onSelect={handleEndDateSelect}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Category:</Label>
                <Select value={newProject.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="uncategorized">Uncategorized</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Status:</Label>
                <Select value={newProject.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={handleDialogClose}
              className="bg-transparent hover:bg-gray-700 text-white"
            >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={handleNext}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Next <span className="ml-1">→</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
