
import { useToast as useToastUI } from "@/components/ui/use-toast";

export const useToast = useToastUI;

export const toast = (options) => {
  // Get toast function from the global store that shadcn/ui creates
  // This is a workaround for using toast outside of React components
  const { toast: toastFn } = useToastUI();
  toastFn(options);
  return;
};

// For direct usage without hooks
export const showToast = (options) => {
  // Get toast function from global DOM event
  const showToastEvent = new CustomEvent("toast", { detail: options });
  document.dispatchEvent(showToastEvent);
};

// Event listener that will be initialized once in the Toaster component
export const initToastListener = (toastFn) => {
  const handleToastEvent = (event) => {
    if (event.detail) {
      toastFn(event.detail);
    }
  };
  
  document.addEventListener("toast", handleToastEvent);
  return () => document.removeEventListener("toast", handleToastEvent);
};

// Helper function to create consistent toast messages
export const toastSuccess = (title, description) => {
  return toast({
    title,
    description,
  });
};

export const toastError = (title, description = "An unexpected error occurred. Please try again.") => {
  return toast({
    title,
    description,
    variant: "destructive",
  });
};

export const toastInfo = (title, description) => {
  return toast({
    title,
    description,
    variant: "default",
  });
};
