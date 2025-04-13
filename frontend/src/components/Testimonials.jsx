
import React, { useRef, useEffect } from 'react';

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

const Testimonials = () => {
  const sectionRef = useRef(null);
  const testimonialCardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && testimonialCardsRef.current.length > 0) {
          testimonialCardsRef.current.forEach((card, index) => {
            if (!card) return;
            
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, index * 200);
          });
          
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
    <section ref={sectionRef} className="py-20 bg-muted/20" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-medium text-primary mb-2">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by teams worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Here's what our customers have to say about their experience with ProjectHub.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              ref={el => testimonialCardsRef.current[index] = el}
              className="bg-background p-6 rounded-lg border shadow-sm transition-all duration-500"
              style={{
                opacity: 0,
                transform: "translateY(20px)"
              }}
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-semibold text-base">{testimonial.author}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <blockquote className="italic text-muted-foreground">
                "{testimonial.quote}"
              </blockquote>
              <div className="mt-4 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i}
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 fill-primary" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
