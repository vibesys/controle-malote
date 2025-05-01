
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface QuickAddDialogProps {
  title: string;
  placeholder: string;
  onSave: (value: string) => Promise<boolean>;
}

export function QuickAddDialog({ title, placeholder, onSave }: QuickAddDialogProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!inputValue.trim()) return;
    
    setIsSubmitting(true);
    try {
      const success = await onSave(inputValue);
      if (success) {
        setInputValue("");
        setOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="icon" className="border border-blue-300">
          <Plus className="text-blue-dark"/>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Input 
          placeholder={placeholder} 
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
        <Button 
          className="mt-4 w-full" 
          onClick={handleSave}
          disabled={isSubmitting || !inputValue.trim()}
        >
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
