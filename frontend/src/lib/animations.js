
import { gsap } from 'gsap';

// Fade in animation for elements
export const fadeIn = (element, delay = 0, duration = 0.5) => {
  if (!element) return;
  
  gsap.fromTo(
    element,
    { opacity: 0, y: 10 },
    { 
      opacity: 1, 
      y: 0, 
      duration, 
      delay, 
      ease: 'power2.out',
      clearProps: 'transform' 
    }
  );
};

// Fade out animation for elements
export const fadeOut = (element, delay = 0, duration = 0.3) => {
  if (!element) return;
  
  return gsap.fromTo(
    element,
    { opacity: 1, y: 0 },
    { 
      opacity: 0, 
      y: 10, 
      duration, 
      delay, 
      ease: 'power2.in' 
    }
  );
};

// Staggered animation for multiple elements
export const staggerAnimation = (elements, staggerDelay = 0.1, duration = 0.5) => {
  if (!elements || elements.length === 0) return;
  
  gsap.fromTo(
    elements,
    { 
      opacity: 0, 
      y: 20 
    },
    { 
      opacity: 1, 
      y: 0, 
      duration, 
      stagger: staggerDelay,
      ease: 'power2.out',
      clearProps: 'transform'
    }
  );
};

// Animate page content
export const animatePageContent = (selector, delay = 0.2) => {
  const elements = document.querySelectorAll(selector);
  if (!elements || elements.length === 0) return;
  
  gsap.fromTo(
    elements,
    { 
      opacity: 0, 
      y: 20 
    },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.6, 
      delay,
      stagger: 0.1,
      ease: 'power2.out',
      clearProps: 'transform'
    }
  );
};

// Slide in animation for elements
export const slideIn = (element, direction = 'right', delay = 0, duration = 0.5) => {
  if (!element) return;
  
  const xValue = direction === 'left' ? -50 : direction === 'right' ? 50 : 0;
  const yValue = direction === 'up' ? -50 : direction === 'down' ? 50 : 0;
  
  gsap.fromTo(
    element,
    { 
      x: xValue, 
      y: yValue, 
      opacity: 0 
    },
    { 
      x: 0, 
      y: 0, 
      opacity: 1, 
      duration, 
      delay, 
      ease: 'power2.out',
      clearProps: 'transform' 
    }
  );
};

// Scale animation for elements
export const scaleAnimation = (element, delay = 0, duration = 0.4) => {
  if (!element) return;
  
  gsap.fromTo(
    element,
    { 
      scale: 0.95, 
      opacity: 0 
    },
    { 
      scale: 1, 
      opacity: 1, 
      duration, 
      delay, 
      ease: 'back.out(1.5)',
      clearProps: 'transform' 
    }
  );
};

// Pulse animation for drawing attention
export const pulseAnimation = (element, delay = 0, duration = 0.8) => {
  if (!element) return;
  
  gsap.fromTo(
    element,
    { scale: 1 },
    { 
      scale: 1.05, 
      duration: duration / 2, 
      repeat: 1, 
      yoyo: true, 
      delay,
      ease: 'power1.inOut',
      clearProps: 'transform' 
    }
  );
};
