
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Award, BarChart, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-20">
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
              <p className="text-xl text-muted-foreground">
                We're on a mission to make project management simpler, more efficient, and more enjoyable for teams of all sizes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
                <p className="text-lg mb-4">
                  Projectify was founded in 2022 by a team of project managers and developers who were frustrated with the complexity and inefficiency of existing project management tools.
                </p>
                <p className="text-lg">
                  Our team combines decades of experience in project management, software development, and user experience design to create a platform that truly understands the needs of modern teams.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Team working together" 
                  className="w-full h-auto"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <div className="text-center p-6">
                <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">5,000+</h3>
                <p className="text-muted-foreground">Teams using Projectify</p>
              </div>
              <div className="text-center p-6">
                <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">30%</h3>
                <p className="text-muted-foreground">Average productivity increase</p>
              </div>
              <div className="text-center p-6">
                <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">4.8/5</h3>
                <p className="text-muted-foreground">Average customer rating</p>
              </div>
            </div>
            
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Simplicity</h3>
                  <p>We believe that powerful tools don't have to be complicated. We focus on intuitive design that makes project management accessible to everyone.</p>
                </div>
                <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
                  <p>We build features that bring teams together and make collaboration effortless, no matter where team members are located.</p>
                </div>
                <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Adaptability</h3>
                  <p>We understand that every team and project is unique. Our platform is designed to adapt to your workflow, not the other way around.</p>
                </div>
                <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Continuous Improvement</h3>
                  <p>We're committed to constantly improving our platform based on user feedback and emerging best practices in project management.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
