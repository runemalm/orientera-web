
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Compass className="h-6 w-6 text-orienteering-green" />
          <span className="font-bold text-xl text-orienteering-dark">Orientera.com</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Hem
          </Link>
          <Link to="/search" className="text-muted-foreground hover:text-foreground transition-colors">
            Sök tävlingar
          </Link>
          <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Min profil
          </Link>
          <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Hjälp
          </Link>
        </nav>
        <div className="flex items-center space-x-2">
          <Button asChild variant="ghost">
            <Link to="/login">Logga in</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Skapa konto</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
