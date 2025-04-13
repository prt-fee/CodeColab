
import React from 'react';
import NavBar from '../components/navbar';

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        <p className="text-muted-foreground">This is a placeholder for the profile page.</p>
      </main>
    </div>
  );
};

export default Profile;
