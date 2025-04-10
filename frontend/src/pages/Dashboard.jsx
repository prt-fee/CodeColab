
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/NavBar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { fadeIn, animatePageContent } from '@/lib/animations';

const Dashboard = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [dashboardElement, setDashboardElement] = useState(null);
  const navigate = useNavigate();

  // Debounced state update to prevent flickering
  const setReadyWithDelay = useCallback(() => {
    const timer = setTimeout(() => {
      setContentReady(true);
      
      // Animate dashboard content when it's ready
      requestAnimationFrame(() => {
        if (dashboardElement) {
          fadeIn(dashboardElement);
        }
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [dashboardElement]);

  // Handle setting ref to the dashboard container
  const dashboardRef = useCallback(node => {
    if (node !== null) {
      setDashboardElement(node);
    }
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated && !isRedirecting) {
      console.log("User not authenticated, redirecting to login");
      setIsRedirecting(true);
      toast({
        title: "Authentication required",
        description: "Please log in to access the dashboard",
        variant: "destructive"
      });
      navigate('/login');
    } else if (isAuthenticated && user) {
      console.log("User authenticated:", user.id);
      setReadyWithDelay();
    }
  }, [isAuthenticated, loading, navigate, user, isRedirecting, setReadyWithDelay]);

  // Apply animations to page content
  useEffect(() => {
    if (contentReady && dashboardElement) {
      animatePageContent('.dashboard-content');
    }
  }, [contentReady, dashboardElement]);

  // Show loading state while checking authentication
  if (loading || isRedirecting || !contentReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If still loading or no user, don't render the main content
  if (!user) return null;

  return (
    <div ref={dashboardRef} className="min-h-screen bg-background transition-opacity duration-300" style={{ opacity: 0 }}>
      <NavBar />
      <hr className="border-b border-border my-4" />
      <main className="container mx-auto px-4 py-6 pt-24 dashboard-content">
        <DashboardHeader />
        <DashboardContent />
      </main>
    </div>
  );
};

export default Dashboard;
