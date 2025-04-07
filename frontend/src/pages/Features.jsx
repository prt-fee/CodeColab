
import React, { useEffect, useRef } from 'react';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, BarChart, Users, CalendarDays, FolderKanban, MessageSquare, 
  Lock, Zap, BellRing } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { staggerAnimation } from '@/lib/animations';

const FeatureCard = ({ title, description, icon, className = "" }) => {
  return (
    <Card className={`h-full transition-all duration-300 hover:shadow-lg hover:border-primary/30 ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col items-start h-full">
          <div className="mb-4 text-primary bg-primary/10 p-3 rounded-md">
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
  const cardsRef = useRef([]);
  const sectionRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && cardsRef.current.length > 0) {
          staggerAnimation(cardsRef.current, 0.1, 0.5);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);
  
  const mainFeatures = [
    {
      title: "Task Management",
      description: "Create, assign, and track tasks with ease. Set priorities, deadlines, and monitor progress in real-time.",
      icon: <CheckCircle2 className="h-6 w-6" />
    },
    {
      title: "Project Planning",
      description: "Plan and organize projects with intuitive tools. Create project timelines, set milestones, and allocate resources effectively.",
      icon: <FolderKanban className="h-6 w-6" />
    },
    {
      title: "Team Collaboration",
      description: "Collaborate seamlessly with team members. Share files, comment on tasks, and communicate within the platform.",
      icon: <Users className="h-6 w-6" />
    },
    {
      title: "Time Tracking",
      description: "Track time spent on tasks and projects. Generate detailed reports to analyze productivity and improve efficiency.",
      icon: <CalendarDays className="h-6 w-6" />
    },
    {
      title: "Reporting & Analytics",
      description: "Visualize project data with interactive charts and reports. Make data-driven decisions to improve project outcomes.",
      icon: <BarChart className="h-6 w-6" />
    },
    {
      title: "Resource Management",
      description: "Manage team workload and resource allocation. Prevent bottlenecks and ensure optimal utilization of resources.",
      icon: <Users className="h-6 w-6" />
    }
  ];

  const additionalFeatures = [
    {
      title: "Real-time Notifications",
      description: "Stay informed of changes and updates with instant notifications.",
      icon: <BellRing className="h-5 w-5" />
    },
    {
      title: "Team Chat",
      description: "Communicate within projects to keep discussions organized.",
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      title: "Secure & Private",
      description: "End-to-end encryption and advanced privacy controls for your data.",
      icon: <Lock className="h-5 w-5" />
    },
    {
      title: "Lightning Fast",
      description: "Optimized performance for a smooth, responsive experience.",
      icon: <Zap className="h-5 w-5" />
    }
  ];

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
          
          <div ref={sectionRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {mainFeatures.map((feature, index) => (
              <div
                key={feature.title}
                ref={(el) => el && (cardsRef.current[index] = el)}
                className="opacity-0"
              >
                <FeatureCard 
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                />
              </div>
            ))}
          </div>
          
          <div className="bg-muted/30 rounded-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Additional Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {additionalFeatures.map((feature) => (
                <Card key={feature.title} className="bg-background">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-primary">{feature.icon}</div>
                      <div>
                        <h3 className="font-medium">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
