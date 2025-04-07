import React, { useState, useEffect } from 'react';
import { projectAPI } from '@/services/firebaseAPI';
import { listenToList } from '@/services/firebaseAPI';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from '@/hooks/use-toast';

const FetchProjectTest = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await projectAPI.getProjects();
      setProjects(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: err.message || "Failed to fetch projects",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    let unsubscribe;

    const listenToProjects = async () => {
      try {
        if (!user) {
          setError('User not authenticated');
          return;
        }

        unsubscribe = listenToList('projects', 'owner', user.id, (data) => {
          setProjects(data);
          setLoading(false);
        }, (err) => {
          console.error('Error in Firebase listener:', err);
          setError(err.message);
          toast({
            title: "Error",
            description: err.message || "Failed to listen for project updates",
            variant: "destructive"
          });
        });
      } catch (err) {
        console.error('Error setting up listener:', err);
        setError(err.message);
        toast({
          title: "Error",
          description: err.message || "Failed to set up project listener",
          variant: "destructive"
        });
      }
    };

    listenToProjects();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
        <Button onClick={fetchProjects} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle>{project.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{project.description}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm">Priority:</span>
              <span 
                className={`px-2 py-1 rounded-full text-xs ${
                  project.priority === 'low' ? 'bg-green-100 text-green-800' :
                  project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  project.priority === 'high' ? 'bg-red-100 text-red-800' :
                  'bg-purple-100 text-purple-800'
                }`}
              >
                {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
              </span>
            </div>
            {project.dueDate && (
              <div className="mt-2">
                <span className="text-sm">Due Date:</span>
                <span className="ml-2 text-gray-600">
                  {new Date(project.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FetchProjectTest;