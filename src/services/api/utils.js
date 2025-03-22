
import { toast } from "@/hooks/use-toast";

// Helper to handle API responses
export const handleResponse = async (promise) => {
  try {
    const data = await promise;
    return data;
  } catch (error) {
    const errorMessage = error.message || "An error occurred";
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive"
    });
    throw error;
  }
};
