
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null; // Will redirect via the useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {user.name}</CardTitle>
              <CardDescription>Your project management dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is a placeholder for your personalized dashboard. More features coming soon!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>Your most recent tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <p>No tasks yet. Start by creating your first task.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Your current projects</CardDescription>
            </CardHeader>
            <CardContent>
              <p>No projects yet. Create your first project to get started.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
