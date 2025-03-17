import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, CheckIcon, Users } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const projectTemplates = [
  { id: 'web', name: 'Web Development', icon: '🌐', description: 'Create a web application with frontend and backend components' },
  { id: 'mobile', name: 'Mobile App', icon: '📱', description: 'Develop a cross-platform mobile application' },
  { id: 'design', name: 'Design Project', icon: '🎨', description: 'Create UI/UX designs and assets for digital products' },
  { id: 'marketing', name: 'Marketing Campaign', icon: '📈', description: 'Plan and execute a marketing campaign across channels' },
  { id: 'research', name: 'Research Project', icon: '🔬', description: 'Conduct research and document findings' }
];

const colorOptions = [
  { id: 'blue', label: 'Blue', value: 'blue', color: 'bg-blue-500' },
  { id: 'green', label: 'Green', value: 'green', color: 'bg-green-500' },
  { id: 'purple', label: 'Purple', value: 'purple', color: 'bg-purple-500' },
  { id: 'orange', label: 'Orange', value: 'orange', color: 'bg-orange-500' },
  { id: 'pink', label: 'Pink', value: 'pink', color: 'bg-pink-500' },
  { id: 'cyan', label: 'Cyan', value: 'cyan', color: 'bg-cyan-500' },
];

const NewProjectDialog = ({ open, onClose, newProject, setNewProject, onCreateProject }) => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    template: '',
    color: 'blue',
    startDate: new Date(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    members: 2,
    tags: []
  });
  
  useEffect(() => {
    if (open) {
      setStep(1);
      setFormData({
        title: '',
        description: '',
        template: '',
        color: 'blue',
        startDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        members: 2,
        tags: []
      });
    }
  }, [open]);
  
  const [isCreating, setIsCreating] = useState(false);
  
  const updateFormData = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleNext = () => {
    if (step === 1) {
      if (!formData.title?.trim()) {
        toast({
          title: "Project title required",
          description: "Please enter a title for your project",
          variant: "destructive"
        });
        return;
      }
      if (!formData.template) {
        toast({
          title: "Template selection required",
          description: "Please select a project template",
          variant: "destructive"
        });
        return;
      }
    }
    
    setStep(step + 1);
  };
  
  const handleBack = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    
    try {
      const projectId = String(Date.now());
      
      const newProject = {
        id: projectId,
        ...formData,
        createdAt: new Date(),
        tasksCount: {
          total: 0,
          completed: 0
        },
        files: [],
        meetings: [],
        commits: []
      };
      
      const existingProjects = JSON.parse(localStorage.getItem('user_projects') || '[]');
      
      const updatedProjects = [...existingProjects, newProject];
      
      localStorage.setItem('user_projects', JSON.stringify(updatedProjects));
      
      if (onCreateProject) {
        onCreateProject(newProject);
      }
      
      toast({
        title: "Project created",
        description: `${formData.title} has been created successfully`,
      });
      
      navigate(`/projects/${projectId}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      toast({
        title: "Creation failed",
        description: "There was an error creating your project",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">
            {step === 1 ? 'Create new project' : step === 2 ? 'Project details' : 'Final setup'}
          </DialogTitle>
          <DialogDescription>
            {step === 1 ? 'Get started by selecting a template and basic information' : 
             step === 2 ? 'Set up your project schedule and team' : 
             'Review and finalize your project settings'}
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <div className="flex justify-between px-6 pt-4 pb-2">
            <div className="flex items-center space-x-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>1</div>
              <span className={`text-sm ${step >= 1 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>Template</span>
            </div>
            <div className="border-t border-border w-12 self-center"></div>
            <div className="flex items-center space-x-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>2</div>
              <span className={`text-sm ${step >= 2 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>Details</span>
            </div>
            <div className="border-t border-border w-12 self-center"></div>
            <div className="flex items-center space-x-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>3</div>
              <span className={`text-sm ${step >= 3 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>Finalize</span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
          {step === 1 && (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project title *</Label>
                  <Input 
                    id="title" 
                    value={formData.title}
                    onChange={(e) => updateFormData('title', e.target.value)}
                    placeholder="Enter project title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    placeholder="Brief description of the project"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Project color</Label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.id}
                        type="button"
                        className={`w-8 h-8 rounded-full ${color.color} flex items-center justify-center transition-all ${formData.color === color.value ? 'ring-2 ring-offset-2 ring-primary' : 'opacity-70 hover:opacity-100'}`}
                        onClick={() => updateFormData('color', color.value)}
                        title={color.label}
                      >
                        {formData.color === color.value && <CheckIcon className="h-4 w-4 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Template *</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {projectTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-all ${formData.template === template.id ? 'border-primary bg-primary/5' : 'hover:bg-accent'}`}
                        onClick={() => updateFormData('template', template.id)}
                      >
                        <div className="flex items-start">
                          <div className="text-2xl mr-2">{template.icon}</div>
                          <div>
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-xs text-muted-foreground">{template.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
          
          {step === 2 && (
            <>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? (
                            format(formData.startDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) => updateFormData('startDate', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.dueDate ? (
                            format(formData.dueDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.dueDate}
                          onSelect={(date) => updateFormData('dueDate', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="members">Team members</Label>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <Select
                      value={String(formData.members)}
                      onValueChange={(value) => updateFormData('members', parseInt(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Just me</SelectItem>
                        <SelectItem value="2">2 members</SelectItem>
                        <SelectItem value="3">3 members</SelectItem>
                        <SelectItem value="4">4 members</SelectItem>
                        <SelectItem value="5">5+ members</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Development', 'Design', 'Marketing', 'Research', 'Planning'].map((tag) => {
                      const isSelected = formData.tags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          className={`px-3 py-1 text-sm rounded-full transition-colors ${
                            isSelected 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              updateFormData('tags', formData.tags.filter(t => t !== tag));
                            } else {
                              updateFormData('tags', [...formData.tags, tag]);
                            }
                          }}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
          
          {step === 3 && (
            <>
              <div className="space-y-6">
                <div className="bg-accent/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Project Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Title:</span>
                      <span className="font-medium">{formData.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Template:</span>
                      <span className="font-medium">
                        {projectTemplates.find(t => t.id === formData.template)?.name || 'Custom'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">
                        {format(formData.startDate, "MMM d")} - {format(formData.dueDate, "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Team size:</span>
                      <span className="font-medium">{formData.members} {formData.members === 1 ? 'member' : 'members'}</span>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-col">
                        <span className="text-muted-foreground mb-1">Tags:</span>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {formData.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-secondary text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-accent/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">What happens next?</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    After creating your project, you'll be redirected to the project dashboard where you can:
                  </p>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center">
                      <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                      Add tasks and assign them to team members
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                      Schedule meetings and set milestones
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                      Create and edit project files
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                      Track progress and view project statistics
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </form>
        
        <DialogFooter className="p-6 pt-2">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="mr-auto"
              disabled={isCreating}
            >
              Back
            </Button>
          )}
          
          {step < 3 ? (
            <Button type="button" onClick={handleNext}>
              Continue
            </Button>
          ) : (
            <Button type="submit" onClick={handleSubmit} disabled={isCreating}>
              {isCreating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
