
import { toast } from '@/hooks/use-toast';

export const showSuccessToast = (title, description) => {
  toast({
    title,
    description,
  });
};

export const showErrorToast = (title, description) => {
  toast({
    title,
    description,
    variant: "destructive"
  });
};
