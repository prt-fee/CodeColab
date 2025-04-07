
import React, { useEffect, useState } from 'react';
import { ChevronRight, Code, Users, Calendar, Workflow, FileCheck, Globe } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { staggerAnimation, fadeIn } from '@/lib/animations';

const featuresData = [
  {
    title: "Interactive Code Editor",
    description: "Collaborate on code in real-time with syntax highlighting and version control integration.",
    icon: Code
  },
  {
    title: "Team Collaboration",
    description: "Invite team members, assign roles, and work together seamlessly on projects.",
    icon: Users
  },
  {
    title: "Meeting Scheduler",
    description: "Plan and organize project meetings with integrated calendar and notifications.",
    icon: Calendar
  },
  {
    title: "Workflow Management",
    description: "Visualize project progress with kanban boards and task management tools.",
    icon: Workflow
  },
  {
    title: "Task Tracking",
    description: "Create, assign, and track tasks with deadlines and progress indicators.",
    icon: FileCheck
  },
  {
    title: "Deployment Integration",
    description: "Deploy your projects directly to various hosting platforms with a single click.",
    icon: Globe
  }
];

const Features = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [container, setContainer] = useState(null);
  
  // Set container ref for animations
  const containerRef = (node) => {
    if (node !== null) {
      setContainer(node);
    }
  };
  
  useEffect(() => {
    // Add a small delay before showing content to allow DOM to be ready
    const timer = setTimeout(() => {
      setIsLoaded(true);
      
      if (container) {
        fadeIn(container);
        
        // Apply staggered animation to feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        if (featureCards.length > 0) {
          staggerAnimation(Array.from(featureCards), 0.1, 0.4);
        }
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [container]);
  
  return (
    <div 
      ref={containerRef} 
      className="min-h-screen bg-background flex flex-col"
      style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}
    >
      <NavBar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 md:px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Powerful Features for Modern Teams</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover how our platform can transform your project management workflow with powerful tools designed for modern development teams.
          </p>
          <Button 
            onClick={() => navigate('/register')}
            size="lg"
            className="px-8"
          >
            Get Started Free
          </Button>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="py-16 px-4 md:px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card bg-background p-6 rounded-lg shadow-sm border border-border transition-transform duration-300 hover:shadow-md hover:-translate-y-1"
                style={{ opacity: 0, transform: 'translateY(20px)' }}
              >
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <Button variant="link" className="p-0 flex items-center text-primary">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 bg-primary">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">
            Ready to enhance your project workflow?
          </h2>
          <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto mb-8">
            Join thousands of teams that use our platform to collaborate effectively and deliver projects on time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => navigate('/register')}
              variant="secondary"
              size="lg"
            >
              Sign Up Free
            </Button>
            <Button 
              onClick={() => navigate('/contact')}
              variant="outline"
              size="lg"
              className="bg-transparent border-white text-white hover:bg-white/10"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Features;
