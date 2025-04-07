
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const DeleteProjectDialog = ({ isOpen, onOpenChange, onConfirmDelete }) => {
  // Handle the confirmation safely with debounce to prevent duplicate clicks
  const handleConfirmDelete = () => {
    if (typeof onConfirmDelete === 'function') {
      onConfirmDelete();
    }
    if (typeof onOpenChange === 'function') {
      onOpenChange(false);
    }
  };

  // Handle dialog closing safely
  const handleOpenChange = (open) => {
    if (typeof onOpenChange === 'function') {
      onOpenChange(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Delete Project
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this project? This action cannot be undone and all project data will be permanently lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirmDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProjectDialog;
