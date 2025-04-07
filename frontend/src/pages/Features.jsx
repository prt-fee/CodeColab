
import React from 'react';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeatureCard = ({ title, description, icon }) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-start h-full">
          <div className="mb-4 text-blue-500 bg-blue-50 p-3 rounded-md">
            {icon}
          </div>
          <h3 className="text-xl font-bold mb-3">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const Features = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-6 px-4 pt-20">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">Powerful Features to Boost Your Productivity</h1>
          <p className="text-center text-muted-foreground mb-16 max-w-3xl mx-auto">
            Everything you need to manage projects, collaborate with your team, and deliver
            outstanding results on time.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <FeatureCard 
              title="Task Management"
              description="Create, assign, and track tasks with ease. Set priorities, deadlines, and monitor progress in real-time."
              icon={<CheckCircle2 className="h-6 w-6" />}
            />
            <FeatureCard 
              title="Project Planning"
              description="Plan and organize projects with intuitive tools. Create project timelines, set milestones, and allocate resources effectively."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                </svg>
              }
            />
            <FeatureCard 
              title="Team Collaboration"
              description="Collaborate seamlessly with team members. Share files, comment on tasks, and communicate within the platform."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
              }
            />
            <FeatureCard 
              title="Time Tracking"
              description="Track time spent on tasks and projects. Generate detailed reports to analyze productivity and improve efficiency."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              }
            />
            <FeatureCard 
              title="Gantt Charts"
              description="Visualize project timelines with interactive Gantt charts. Adjust schedules and dependencies with drag-and-drop simplicity."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                </svg>
              }
            />
            <FeatureCard 
              title="Resource Management"
              description="Manage team workload and resource allocation. Prevent bottlenecks and ensure optimal utilization of resources."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                </svg>
              }
            />
          </div>
          
          <div className="text-center mb-20">
            <Button onClick={() => navigate('/register')} size="lg" className="px-8">
              Get Started for Free
            </Button>
          </div>
          
          <div className="border-t pt-16">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="/features" className="text-muted-foreground hover:text-primary">Features</a></li>
                  <li><a href="#pricing" className="text-muted-foreground hover:text-primary">Pricing</a></li>
                  <li><a href="#integrations" className="text-muted-foreground hover:text-primary">Integrations</a></li>
                  <li><a href="#changelog" className="text-muted-foreground hover:text-primary">Changelog</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#docs" className="text-muted-foreground hover:text-primary">Documentation</a></li>
                  <li><a href="#guides" className="text-muted-foreground hover:text-primary">Guides</a></li>
                  <li><a href="#api" className="text-muted-foreground hover:text-primary">API Reference</a></li>
                  <li><a href="/about" className="text-muted-foreground hover:text-primary">About Us</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#blog" className="text-muted-foreground hover:text-primary">Blog</a></li>
                  <li><a href="/contact" className="text-muted-foreground hover:text-primary">Contact</a></li>
                  <li><a href="#privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</a></li>
                  <li><a href="#terms" className="text-muted-foreground hover:text-primary">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
