
import React from 'react';

// Toasts array will store all active toasts
const toasts = [];

// Function to create toast
export function toast({ title, description, variant = "default", duration = 3000 }) {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast = { id, title, description, variant, duration };
  
  // Add toast to array
  toasts.push(newToast);
  
  // Remove toast after duration
  setTimeout(() => {
    const index = toasts.findIndex(t => t.id === id);
    if (index !== -1) {
      toasts.splice(index, 1);
    }
  }, duration);

  return { id };
}

export const Toaster = () => {
  // This simplified version doesn't re-render when toasts change
  // In a real app, this would use React state or a state manager
  return (
    <div className="fixed bottom-0 right-0 p-4 z-50">
      <div className="space-y-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-md shadow-md ${
              toast.variant === "destructive" 
                ? "bg-destructive text-destructive-foreground" 
                : "bg-background text-foreground"
            }`}
          >
            {toast.title && <h5 className="font-medium mb-1">{toast.title}</h5>}
            {toast.description && <p className="text-sm">{toast.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

// These components won't be used in our simplified implementation
export const ToastTitle = ({ children }) => <>{children}</>;
export const ToastDescription = ({ children }) => <>{children}</>;
export const ToastClose = () => null;
export const ToastViewport = () => null;
export const Toast = ({ children }) => <>{children}</>;
