
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Features = () => {
  const featuresList = [
    {
      title: "Task Management",
      description: "Create, assign, and track tasks with ease. Set priorities, deadlines, and monitor progress in real-time.",
      icon: Check
    },
    {
      title: "Project Planning",
      description: "Plan and organize projects with intuitive tools. Create project timelines, set milestones, and allocate resources effectively.",
      icon: Check
    },
    {
      title: "Team Collaboration",
      description: "Collaborate seamlessly with team members. Share files, comment on tasks, and communicate within the platform.",
      icon: Check
    },
    {
      title: "Time Tracking",
      description: "Track time spent on tasks and projects. Generate detailed reports to analyze productivity and improve efficiency.",
      icon: Check
    },
    {
      title: "Gantt Charts",
      description: "Visualize project timelines with interactive Gantt charts. Adjust schedules and dependencies with drag-and-drop simplicity.",
      icon: Check
    },
    {
      title: "Resource Management",
      description: "Manage team workload and resource allocation. Prevent bottlenecks and ensure optimal utilization of resources.",
      icon: Check
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-20">
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Powerful Features to Boost Your Productivity</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Everything you need to manage projects, collaborate with your team, and deliver outstanding results on time.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuresList.map((feature, index) => (
                <Card key={index} className="border shadow-sm hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Features;
