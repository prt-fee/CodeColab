
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';

const Index = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is already authenticated, redirect to dashboard
    // But only after we've confirmed loading is complete
    if (!loading && isAuthenticated && user) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
          <button 
            onClick={() => navigate('/register')}
            className="bg-white text-primary font-medium px-6 py-3 rounded-lg hover:bg-primary-foreground/90 transition-colors"
          >
            Get Started Free
          </button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
