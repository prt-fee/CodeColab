
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/NavBar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

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
      <hr className="border-b border-border my-4" />
      <main className="container mx-auto px-4 py-6 pt-24">
        <DashboardHeader />
        <DashboardContent />
      </main>
    </div>
  );
};

export default Dashboard;
