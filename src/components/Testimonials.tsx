
import React, { useRef, useEffect } from 'react';
import { staggerAnimation } from '@/lib/animations';

const testimonials = [
  {
    quote: "ProjectHub has completely transformed how our team works together. The interface is beautiful and intuitive.",
    author: "Sarah Johnson",
    role: "Product Manager at TechCorp",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    quote: "I've tried countless project management tools, but this one strikes the perfect balance between functionality and simplicity.",
    author: "David Chen",
    role: "UX Designer at CreativeStudio",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg"
  },
  {
    quote: "The real-time collaboration features have made our remote work so much more productive. It feels like we're in the same room.",
    author: "Maria Rodriguez",
    role: "Team Lead at InnovateLabs",
    avatar: "https://randomuser.me/api/portraits/women/23.jpg"
  }
];

const Testimonials: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const testimonialCardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && testimonialCardsRef.current.length > 0) {
          staggerAnimation(testimonialCardsRef.current, 0.15, 0.6);
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

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-medium text-primary mb-2">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by teams worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of satisfied teams who have enhanced their productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              ref={(el) => el && (testimonialCardsRef.current[index] = el)}
              className="bg-white rounded-xl p-6 shadow-sm border border-border opacity-0"
            >
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <svg className="h-8 w-8 text-primary/30" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div>

                <p className="text-foreground mb-6 flex-grow">
                  {testimonial.quote}
                </p>

                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-foreground">
                      {testimonial.author}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
