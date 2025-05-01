
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type ToastType = "success" | "error" | "info" | "warning";

export const showSuccessToast = (message: string, type: ToastType = "success") => {
  toast[type](message);
};

export const showErrorToast = (message: string) => {
  toast.error(message);
};

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ConfirmDialog = ({ message, onConfirm, isOpen, setIsOpen }: ConfirmDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmação</DialogTitle>
        </DialogHeader>
        <p>{message}</p>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              setIsOpen(false);
            }}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const useConfirmDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    message: string;
    onConfirm: () => void;
  }>({
    message: "",
    onConfirm: () => {},
  });

  const showDialog = (message: string, onConfirm: () => void) => {
    setDialogConfig({ message, onConfirm });
    setIsDialogOpen(true);
  };

  const Dialog = () => (
    <ConfirmDialog
      message={dialogConfig.message}
      onConfirm={dialogConfig.onConfirm}
      isOpen={isDialogOpen}
      setIsOpen={setIsDialogOpen}
    />
  );

  return {
    showDialog,
    Dialog,
  };
};

// For backward compatibility with code that uses the simple function
export const showConfirmDialog = (message: string, onConfirm: () => void) => {
  const confirmResult = window.confirm(message);
  if (confirmResult) {
    onConfirm();
  }
};
