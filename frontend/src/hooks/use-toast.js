
import { toast as toastFunction } from "../components/ui/toast";

export const useToast = () => {
  return {
    toast: toastFunction,
    toasts: []
  };
};

export const toast = toastFunction;

// Helper functions for consistent toast messages
export const toastSuccess = (title, description) => {
  return toastFunction({
    title,
    description,
  });
};

export const toastError = (title, description = "An unexpected error occurred. Please try again.") => {
  return toastFunction({
    title,
    description,
    variant: "destructive",
  });
};

export const toastInfo = (title, description) => {
  return toastFunction({
    title,
    description,
    variant: "default",
  });
};
