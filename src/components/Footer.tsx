
import { useState } from "react";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import WaitlistDialog from "./WaitlistDialog";

const Footer = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  
  const showWaitlist = () => {
    setWaitlistOpen(true);
  };

  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <a href="https://orientera.com" className="flex items-center space-x-2">
              <Compass className="h-6 w-6 text-orienteering-green" />
              <span className="font-bold text-xl text-orienteering-dark">Orientera.com</span>
            </a>
            <p className="text-muted-foreground text-sm">
              Din guide till orienteringstävlingar i Sverige.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Snabblänkar</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Hem
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sök tävlingar
                </Link>
              </li>
              <li>
                <Link to="/profil" className="text-muted-foreground hover:text-foreground transition-colors">
                  Min profil
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Resurser</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={showWaitlist}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm text-left w-full"
                >
                  Tävlingskalender
                </button>
              </li>
              <li>
                <button 
                  onClick={showWaitlist}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm text-left w-full"
                >
                  Resultat
                </button>
              </li>
              <li>
                <button 
                  onClick={showWaitlist}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm text-left w-full"
                >
                  Klubbar
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Kontakt</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/om-oss#kontakt" className="text-muted-foreground hover:text-foreground transition-colors">
                  Kontakta oss
                </Link>
              </li>
              <li>
                <Link to="/om-oss" className="text-muted-foreground hover:text-foreground transition-colors">
                  Om Oss
                </Link>
              </li>
              <li>
                <button 
                  onClick={showWaitlist}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm text-left w-full"
                >
                  För arrangörer
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Orientera.com. Alla rättigheter förbehållna.</p>
        </div>
      </div>
      
      <WaitlistDialog open={waitlistOpen} setOpen={setWaitlistOpen} />
    </footer>
  );
};

export default Footer;
