
import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { textRevealAnimation, fadeInAnimation } from '@/lib/animations';

const Hero: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      textRevealAnimation(titleRef.current, 0.2, 1.2);
    }
    
    if (subtitleRef.current) {
      fadeInAnimation(subtitleRef.current, 0.8, 0.8);
    }
    
    if (ctaRef.current) {
      fadeInAnimation(ctaRef.current, 1.2, 0.8);
    }
    
    if (imageRef.current) {
      fadeInAnimation(imageRef.current, 0.5, 1);
    }
  }, []);

  return (
    <div className="relative pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/50 to-background pointer-events-none"></div>
      
      {/* Content */}
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <h1 
              ref={titleRef}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
            >
              Manage projects<br />with absolute <span className="text-primary">clarity</span>
            </h1>
            
            <p 
              ref={subtitleRef}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
            >
              A thoughtfully designed workspace for teams to collaborate, plan and track projects with precision and elegance.
            </p>
            
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/register">
                <Button size="lg" className="font-medium w-full sm:w-auto">
                  Get started free
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link to="/features">
                <Button variant="outline" size="lg" className="font-medium w-full sm:w-auto">
                  Learn more
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div ref={imageRef} className="flex-1 flex justify-center lg:justify-end w-full max-w-xl lg:max-w-none">
            <div className="w-full relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-accent rounded-2xl blur-lg opacity-30"></div>
              <div className="relative bg-white rounded-2xl overflow-hidden border shadow-xl">
                <img 
                  src="https://cdn.pixabay.com/photo/2020/12/31/12/28/canva-5876229_1280.png" 
                  alt="Project Management Dashboard" 
                  className="w-full h-auto" 
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10"></div>
    </div>
  );
};

export default Hero;
