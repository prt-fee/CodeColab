
import React, { useRef, useEffect } from 'react';
import { 
  ListChecks, Calendar, FolderKanban, 
  Users, BellRing, BarChart, 
  MessageSquare, Lock, Zap
} from 'lucide-react';
import { staggerAnimation } from '@/lib/animations';

const features = [
  {
    title: "Task Boards",
    description: "Create, update, and track tasks with intuitive drag-and-drop interfaces.",
    icon: ListChecks
  },
  {
    title: "Meeting Scheduler",
    description: "Book meetings directly within projects and sync with your calendar.",
    icon: Calendar
  },
  {
    title: "Project Management",
    description: "Organize projects with descriptions, files, and version tracking.",
    icon: FolderKanban
  },
  {
    title: "Team Collaboration",
    description: "Invite team members and assign roles with granular permissions.",
    icon: Users
  },
  {
    title: "Real-time Notifications",
    description: "Stay informed of changes and updates with instant notifications.",
    icon: BellRing
  },
  {
    title: "Progress Tracking",
    description: "Visualize progress with beautiful charts and comprehensive reports.",
    icon: BarChart
  },
  {
    title: "Team Chat",
    description: "Communicate within projects to keep discussions organized.",
    icon: MessageSquare
  },
  {
    title: "Secure & Private",
    description: "End-to-end encryption and advanced privacy controls for your data.",
    icon: Lock
  },
  {
    title: "Lightning Fast",
    description: "Optimized performance for a smooth, responsive experience.",
    icon: Zap
  }
];

const Features: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && featureCardsRef.current.length > 0) {
          staggerAnimation(featureCardsRef.current, 0.1, 0.5);
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
    <section ref={sectionRef} className="py-20 md:py-28 bg-white" id="features">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-medium text-primary mb-2">Features</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to manage projects
          </h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive suite of tools designed with simplicity and efficiency in mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              ref={(el) => el && (featureCardsRef.current[index] = el)}
              className="bg-background rounded-xl p-6 border transition-all duration-300 hover:shadow-md hover:border-primary/20 opacity-0"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                <feature.icon size={22} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
