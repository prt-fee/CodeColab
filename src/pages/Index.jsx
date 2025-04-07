
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // If the user is already authenticated, redirect to dashboard
    // But only after we've confirmed loading is complete
    if (!loading && isAuthenticated && user) {
      console.log("User is authenticated, redirecting to dashboard");
      setRedirecting(true);
      
      // Short timeout to ensure smooth transition
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, loading, navigate]);

  if (loading || redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <Hero />
      <Features />
      <Testimonials />
      
      {/* CTA Section */}
      <section className="bg-primary py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to transform your project management?
          </h2>
          <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto mb-8">
            Join thousands of teams that use ProjectHub to collaborate more effectively and deliver projects on time.
          </p>
          <Button 
            onClick={() => navigate('/register')}
            className="bg-white text-primary font-medium px-6 py-3 rounded-lg hover:bg-primary-foreground/90 transition-colors"
          >
            Get Started Free
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
