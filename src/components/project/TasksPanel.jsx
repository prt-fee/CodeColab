
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const TaskItem = ({ task }) => {
  return (
    <Card className="p-3">
      <h4 className="font-medium">{task.title}</h4>
      <p className="text-sm text-muted-foreground">{task.description}</p>
      <div className="flex justify-between mt-2">
        <span className={`text-xs px-2 py-1 rounded-full ${
          task.priority === 'high' ? 'bg-red-100 text-red-800' : 
          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-blue-100 text-blue-800'
        }`}>
          {task.priority}
        </span>
      </div>
    </Card>
  );
};

const TasksPanel = ({ tasks, onAddTaskClick }) => {
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>
            Manage tasks for this project
          </CardDescription>
        </div>
        <Button onClick={onAddTaskClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No tasks for this project yet</p>
            <Button onClick={onAddTaskClick}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Task
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium mb-3">To Do</h3>
              <div className="space-y-3">
                {todoTasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
                {todoTasks.length === 0 && (
                  <div className="text-center p-4 border rounded-md text-muted-foreground">
                    No tasks
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">In Progress</h3>
              <div className="space-y-3">
                {inProgressTasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
                {inProgressTasks.length === 0 && (
                  <div className="text-center p-4 border rounded-md text-muted-foreground">
                    No tasks
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Completed</h3>
              <div className="space-y-3">
                {completedTasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
                {completedTasks.length === 0 && (
                  <div className="text-center p-4 border rounded-md text-muted-foreground">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksPanel;
