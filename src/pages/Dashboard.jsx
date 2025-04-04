
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/NavBar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the dashboard",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If still loading or no user, don't render the main content
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-6 pt-24">
        <DashboardHeader />
        <DashboardContent />
      </main>
    </div>
  );
};

export default Dashboard;
