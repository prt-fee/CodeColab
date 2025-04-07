
/**
 * Animations utility functions for smooth UI transitions
 */

// Create a staggered animation effect for multiple elements
export const staggerAnimation = (elements, delayBetween = 0.1, duration = 0.5) => {
  if (!Array.isArray(elements) || elements.length === 0) {
    console.warn('staggerAnimation: No elements provided');
    return;
  }
  
  try {
    elements.forEach((element, index) => {
      if (!element) return;
      
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = `opacity ${duration}s ease, transform ${duration}s ease`;
      
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * (delayBetween * 1000));
    });
  } catch (error) {
    console.error('Error in staggerAnimation:', error);
  }
};

// Fade in animation
export const fadeIn = (element, duration = 300) => {
  if (!element) return;
  
  element.style.opacity = '0';
  element.style.transition = `opacity ${duration}ms ease-in-out`;
  
  setTimeout(() => {
    element.style.opacity = '1';
  }, 10); // Small delay to ensure the transition applies
};

// Fade out animation
export const fadeOut = (element, duration = 300) => {
  if (!element) return;
  
  element.style.transition = `opacity ${duration}ms ease-in-out`;
  element.style.opacity = '0';
};

// Slide in from bottom
export const slideInFromBottom = (element, duration = 300, delay = 0) => {
  if (!element) return;
  
  element.style.transform = 'translateY(20px)';
  element.style.opacity = '0';
  element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
  
  setTimeout(() => {
    element.style.transform = 'translateY(0)';
    element.style.opacity = '1';
  }, delay);
};

// Slide in from right
export const slideInFromRight = (element, duration = 300) => {
  if (!element) return;
  
  element.style.transform = 'translateX(20px)';
  element.style.opacity = '0';
  element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
  
  setTimeout(() => {
    element.style.transform = 'translateX(0)';
    element.style.opacity = '1';
  }, 10);
};

// Add smooth page transitions
export const addPageTransitions = () => {
  document.addEventListener('DOMContentLoaded', () => {
    const content = document.querySelector('main') || document.querySelector('#root > div');
    if (content) {
      content.style.opacity = '0';
      content.style.transition = 'opacity 300ms ease-in-out';
      
      setTimeout(() => {
        content.style.opacity = '1';
      }, 50);
    }
  });
};

// Apply animations to page content
export const animatePageContent = (parentSelector = 'main') => {
  try {
    const parent = document.querySelector(parentSelector);
    if (!parent) return;
    
    // Find direct children to animate
    const elements = Array.from(parent.children);
    staggerAnimation(elements, 0.1, 0.3);
  } catch (error) {
    console.error('Error animating page content:', error);
  }
};

// Preload images to prevent flickering
export const preloadImages = (imageUrls) => {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) return;
  
  imageUrls.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};
