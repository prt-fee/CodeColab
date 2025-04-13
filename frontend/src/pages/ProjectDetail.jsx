
import React from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/navbar';

const ProjectDetail = () => {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-6">Project Details</h1>
        <p>Project ID: {id}</p>
        <p className="text-muted-foreground mt-4">This is a placeholder for the project detail page.</p>
      </main>
    </div>
  );
};

export default ProjectDetail;
