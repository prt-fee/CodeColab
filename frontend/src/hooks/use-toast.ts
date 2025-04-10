
import { useToast as useToastHook, toast as toastFunction } from "@/components/ui/use-toast";

export const useToast = useToastHook;
export const toast = toastFunction;

// Helper functions for consistent toast messages
export const toastSuccess = (title: string, description?: string) => {
  return toastFunction({
    title,
    description,
  });
};

export const toastError = (title: string, description = "An unexpected error occurred. Please try again.") => {
  return toastFunction({
    title,
    description,
    variant: "destructive",
  });
};

export const toastInfo = (title: string, description?: string) => {
  return toastFunction({
    title,
    description,
    variant: "default",
  });
};
