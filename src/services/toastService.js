
import { toast } from "@/hooks/use-toast";

export const showSuccessToast = (title, description) => {
  toast({
    title,
    description,
    variant: "default"
  });
};

export const showErrorToast = (title, description) => {
  toast({
    title,
    description,
    variant: "destructive"
  });
};

export const showInfoToast = (title, description) => {
  toast({
    title,
    description,
    variant: "secondary"
  });
};
