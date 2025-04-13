
import React from 'react';
import NavBar from '../components/navbar';

const Features = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-6">Features</h1>
        <p className="text-muted-foreground">This is a placeholder for the features page.</p>
      </main>
    </div>
  );
};

export default Features;
