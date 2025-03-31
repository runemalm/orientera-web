import React, { useState, useEffect } from "react";
import { Competition } from "@/types";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Flag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

// Key for storing favorites in localStorage
const FAVORITES_KEY = "competition-favorites";

interface CompetitionFavoritesViewProps {
  competitions: Competition[];
}

const CompetitionFavoritesView: React.FC<CompetitionFavoritesViewProps> = ({ 
  competitions 
}) => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error("Failed to parse favorites", error);
        setFavorites([]);
      }
    }
  }, []);
  
  // Filter competitions to only show favorites
  const favoriteCompetitions = competitions.filter(comp => 
    favorites.includes(comp.id)
  );
  
  // Sort favorite competitions by date
  const sortedFavorites = [...favoriteCompetitions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Toggle favorite status
  const toggleFavorite = (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    
    let newFavorites: string[];
    if (favorites.includes(id)) {
      newFavorites = favorites.filter(fav => fav !== id);
    } else {
      newFavorites = [...favorites, id];
    }
    
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  };

  if (sortedFavorites.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Inga favorittävlingar</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Du har inte markerat några tävlingar som favoriter än. 
            Klicka på stjärnikonen på en tävling för att lägga till den i dina favoriter.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Dina favoriter</h3>
        <Badge variant="outline" className="font-normal">
          {sortedFavorites.length} {sortedFavorites.length === 1 ? "tävling" : "tävlingar"}
        </Badge>
      </div>
      
      {sortedFavorites.map((competition) => (
        <Card 
          key={competition.id}
          className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
          onClick={() => navigate(`/competition/${competition.id}`)}
        >
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  {competition.featured && (
                    <Badge variant="accent" className="mr-2">
                      <Star className="h-3 w-3 mr-1" /> Populär
                    </Badge>
                  )}
                  <h3 className="text-lg font-semibold">{competition.name}</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    <span>{formatDate(competition.date)}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1.5" />
                    <span>{competition.location}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Flag className="h-4 w-4 mr-1.5" />
                    <Badge variant="secondary">{competition.discipline}</Badge>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-1.5">Nivå:</span>
                    <Badge variant="muted">{competition.level}</Badge>
                  </div>
                </div>
                
                <p className="mt-2 text-sm line-clamp-1 text-muted-foreground">
                  {competition.description}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                  onClick={(e) => toggleFavorite(e, competition.id)}
                  aria-label="Ta bort från favoriter"
                >
                  <Star className="h-5 w-5 fill-current" />
                </Button>
                
                <Button size="sm" className="self-end md:self-center shrink-0">
                  Visa detaljer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CompetitionFavoritesView;
