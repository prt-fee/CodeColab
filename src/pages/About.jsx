
import React from 'react';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-6 px-4 pt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">Our Story</h1>
          <p className="text-center text-muted-foreground mb-16">
            We're on a mission to make project management simpler, more efficient, and more
            enjoyable for teams of all sizes.
          </p>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
              <p className="text-muted-foreground mb-4">
              ProjectHub was founded in 2025 by a team of project managers and developers
                who were frustrated with the complexity and inefficiency of existing project
                management tools.
              </p>
              <p className="text-muted-foreground">
                Our team combines decades of experience in project management, software
                development, and user experience design to create a platform that truly
                understands the needs of modern teams.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3"
                alt="Team working together" 
                className="w-full h-auto" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center mb-20">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-1">5,000+</h3>
              <p className="text-muted-foreground text-sm">Teams using ProjectHub</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-1">30%</h3>
              <p className="text-muted-foreground text-sm">Average productivity increase</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-1">4.8/5</h3>
              <p className="text-muted-foreground text-sm">Average customer rating</p>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-center">Simplicity</h3>
              <p className="text-muted-foreground text-center">
                We believe that powerful tools don't have to be complicated. We focus on intuitive design
                that makes project management accessible to everyone.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-center">Collaboration</h3>
              <p className="text-muted-foreground text-center">
                We build features that bring teams together and make collaboration effortless, no matter
                where team members are located.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-center">Adaptability</h3>
              <p className="text-muted-foreground text-center">
                We understand that every team and project is unique. Our platform is designed to adapt
                to your workflow, not the other way around.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-center">Continuous Improvement</h3>
              <p className="text-muted-foreground text-center">
                We're committed to constantly improving our platform based on user feedback and
                emerging best practices in project management.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <Button onClick={() => navigate('/register')} size="lg">
              Join ProjectHub Today
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
