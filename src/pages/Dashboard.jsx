
import React from 'react';
import NavBar from '@/components/NavBar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-6 px-4 md:px-6 pt-20">
        <DashboardHeader />
        <DashboardContent />
      </div>
    </div>
  );
};

export default Dashboard;
