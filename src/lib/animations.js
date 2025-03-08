
import { gsap } from "gsap";

// Stagger animation for items appearing one after another
export const staggerAnimation = (
  elements,
  staggerTime = 0.1,
  duration = 0.5
) => {
  gsap.fromTo(
    elements,
    { y: 20, opacity: 0 },
    { 
      y: 0, 
      opacity: 1, 
      duration, 
      stagger: staggerTime,
      ease: "power2.out"
    }
  );
};

// Subtle fade-in animation
export const fadeInAnimation = (
  element,
  delay = 0,
  duration = 0.5
) => {
  gsap.fromTo(
    element,
    { opacity: 0, y: 10 },
    { 
      opacity: 1, 
      y: 0, 
      duration, 
      delay,
      ease: "power2.out"
    }
  );
};

// Reveal text animation, character by character
export const textRevealAnimation = (
  element,
  delay = 0,
  duration = 1
) => {
  const text = element.textContent || "";
  const chars = text.split("");
  
  // Clear the element
  element.textContent = "";
  
  // Create spans for each character
  chars.forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    span.style.opacity = "0";
    span.style.display = "inline-block";
    element.appendChild(span);
  });
  
  const spans = element.querySelectorAll("span");
  
  gsap.to(spans, {
    opacity: 1,
    stagger: 0.03,
    delay,
    duration: duration / chars.length,
    ease: "power2.out"
  });
};

// Button hover animation
export const buttonHoverAnimation = (button) => {
  const originalScale = 1;
  
  button.addEventListener("mouseenter", () => {
    gsap.to(button, { scale: 1.03, duration: 0.3, ease: "power2.out" });
  });
  
  button.addEventListener("mouseleave", () => {
    gsap.to(button, { scale: originalScale, duration: 0.3, ease: "power2.out" });
  });
};

// Parallax scroll effect
export const parallaxEffect = (element, speed = 0.1) => {
  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY;
    const offset = scrollPosition * speed;
    
    gsap.to(element, {
      y: offset,
      duration: 0.5,
      ease: "none"
    });
  });
};

// Transition animations for page changes
export const pageTransition = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.3 } }
};
