
import React from 'react';
import { useAuth } from '@/context/AuthContext';

const DashboardHeader = () => {
  const { user } = useAuth();

  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome back, {user?.name || 'User'}!
      </p>
    </header>
  );
};

export default DashboardHeader;
