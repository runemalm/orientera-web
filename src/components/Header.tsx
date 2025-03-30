
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, Menu } from "lucide-react";
import WaitlistDialog from "./WaitlistDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";

const Header = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const isMobile = useIsMobile();
  
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
        
        {isMobile ? (
          <div className="flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <nav className="flex flex-col space-y-6 mt-8">
                  <Link to="/" className="text-lg font-medium hover:text-foreground transition-colors">
                    Hem
                  </Link>
                  <Link to="/search" className="text-lg font-medium hover:text-foreground transition-colors">
                    Tävlingskalender
                  </Link>
                  <Link to="/profil" className="text-lg font-medium hover:text-foreground transition-colors">
                    Min profil
                  </Link>
                  <Link to="/om-oss" className="text-lg font-medium hover:text-foreground transition-colors">
                    Om Oss
                  </Link>
                  <div className="pt-4 border-t">
                    <Button className="w-full mb-2" onClick={showWaitlist}>
                      Skapa konto
                    </Button>
                    <Button variant="outline" className="w-full" onClick={showWaitlist}>
                      Logga in
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <>
            <nav className="flex items-center space-x-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Hem
              </Link>
              <Link to="/search" className="text-muted-foreground hover:text-foreground transition-colors">
                Tävlingskalender
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
          </>
        )}
      </div>
      
      <WaitlistDialog open={waitlistOpen} setOpen={setWaitlistOpen} />
    </header>
  );
};

export default Header;
