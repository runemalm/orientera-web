
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, Sparkles } from "lucide-react";
import WaitlistDialog from "./WaitlistDialog";

const Header = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  
  const showWaitlist = () => {
    setWaitlistOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <a href="https://orientera.com" className="flex items-center space-x-2">
          <Compass className="h-6 w-6 text-orienteering-green" />
          <span className="font-bold text-xl text-orienteering-dark">Orientera.com</span>
        </a>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Hem
          </Link>
          <Link to="/search" className="text-muted-foreground hover:text-foreground transition-colors">
            Sök tävlingar
          </Link>
          <Link to="/ai-search" className="text-muted-foreground hover:text-foreground transition-colors">
            <span className="flex items-center">
              <Sparkles className="h-4 w-4 mr-1" /> Sök med AI
            </span>
          </Link>
          <Link to="/profil" className="text-muted-foreground hover:text-foreground transition-colors">
            Min profil
          </Link>
          <Link to="/om-oss" className="text-muted-foreground hover:text-foreground transition-colors">
            Om Oss
          </Link>
        </nav>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={showWaitlist}>
            Logga in
          </Button>
          <Button onClick={showWaitlist}>
            Skapa konto
          </Button>
        </div>
      </div>
      
      <WaitlistDialog open={waitlistOpen} setOpen={setWaitlistOpen} />
    </header>
  );
};

export default Header;
