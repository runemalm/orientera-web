
import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface WaitlistDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const WaitlistDialog = ({ open, setOpen }: WaitlistDialogProps) => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setOpen(false);
      setEmail("");
      toast.success("Tack för ditt intresse!", {
        description: "Vi hör av oss när Orientera.com är redo för dig."
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ställ dig i vår väntlista</DialogTitle>
          <DialogDescription>
            Orientera.com är för närvarande i beta-testning. Lämna din e-postadress
            så kontaktar vi dig så snart appen är tillgänglig för användning.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              E-postadress
            </label>
            <Input
              id="email"
              type="email"
              placeholder="din@email.se"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <DialogFooter className="pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Avbryt
            </Button>
            <Button 
              type="submit" 
              disabled={submitting || !email}
            >
              {submitting ? "Skickar..." : "Anmäl intresse"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WaitlistDialog;
