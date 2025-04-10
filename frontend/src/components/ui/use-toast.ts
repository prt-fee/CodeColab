
// Direct re-export from the toast component
import { toast } from "@/components/ui/toast";
export { toast };

// Custom hook for React components
export const useToast = () => {
  return {
    toast
  };
};
