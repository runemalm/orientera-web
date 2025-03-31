
import React, { useMemo, useState, useEffect } from "react";
import { Competition } from "@/types";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isWeekend, parseISO, isSameMonth } from "date-fns";
import { sv } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Flag, Star, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Key for storing favorites in localStorage
const FAVORITES_KEY = "competition-favorites";

interface CompetitionListViewProps {
  competitions: Competition[];
}

const CompetitionListView: React.FC<CompetitionListViewProps> = ({ 
  competitions 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
  
  // Sort competitions by date in ascending order
  const sortedCompetitions = useMemo(() => 
    [...competitions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  , [competitions]);

  // Group competitions by month
  const competitionsByMonth = useMemo(() => {
    const grouped = new Map<string, Competition[]>();
    
    sortedCompetitions.forEach(competition => {
      const date = parseISO(competition.date);
      const monthKey = format(date, 'yyyy-MM');
      const monthName = format(date, 'MMMM yyyy', { locale: sv });
      
      if (!grouped.has(monthKey)) {
        grouped.set(monthKey, []);
      }
      grouped.get(monthKey)?.push(competition);
    });
    
    return Array.from(grouped.entries()).map(([key, comps]) => ({
      monthKey: key,
      monthName: format(parseISO(`${key}-01`), 'MMMM yyyy', { locale: sv }),
      competitions: comps
    }));
  }, [sortedCompetitions]);

  // Toggle favorite status
  const toggleFavorite = (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    
    let newFavorites: string[];
    if (favorites.includes(id)) {
      newFavorites = favorites.filter(fav => fav !== id);
      toast({
        title: "Borttagen från favoriter",
        description: "Tävlingen har tagits bort från dina favoriter"
      });
    } else {
      newFavorites = [...favorites, id];
      toast({
        title: "Tillagd som favorit",
        description: "Tävlingen har lagts till i dina favoriter"
      });
    }
    
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  };

  if (competitions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Inga tävlingar hittades med dessa filter</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {competitionsByMonth.map(({ monthKey, monthName, competitions }) => (
        <div key={monthKey} className="space-y-4">
          <div className="sticky top-0 z-10 bg-background pt-2 pb-1">
            <h3 className="text-xl font-semibold capitalize border-b pb-2">{monthName}</h3>
          </div>
          
          <div className="space-y-3">
            {competitions.map((competition) => {
              const date = parseISO(competition.date);
              const isWeekendDay = isWeekend(date);
              const isFavorite = favorites.includes(competition.id);
              
              return (
                <Card 
                  key={competition.id}
                  className={cn(
                    "overflow-hidden transition-all hover:shadow-md cursor-pointer",
                    isWeekendDay ? "border-l-4 border-l-amber-400" : "",
                    competition.featured ? "border-accent border-l-4" : "",
                    isFavorite ? "border-amber-400 border-l-4" : ""
                  )}
                  onClick={() => navigate(`/competition/${competition.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center mb-1.5">
                          <div className={cn(
                            "flex items-center justify-center min-w-[40px] h-10 mr-3 rounded font-medium text-sm",
                            isWeekendDay ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"
                          )}>
                            <div className="flex flex-col items-center leading-tight">
                              <span>{format(date, 'd')}</span>
                              <span className="text-xs capitalize">{format(date, 'EEE', { locale: sv })}</span>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium flex items-center">
                              {competition.featured && (
                                <Star className="h-4 w-4 text-accent mr-1.5" />
                              )}
                              {competition.name}
                            </h4>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{competition.location}</span>
                              {competition.distance !== undefined && (
                                <Badge variant="outline" className="ml-1 text-xs">
                                  <Navigation className="h-3 w-3 mr-1" />
                                  {competition.distance} km
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:ml-4">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={cn(
                            "hover:bg-amber-50",
                            isFavorite ? "text-amber-500 hover:text-amber-600" : "text-muted-foreground hover:text-amber-500"
                          )}
                          onClick={(e) => toggleFavorite(e, competition.id)}
                          aria-label={isFavorite ? "Ta bort från favoriter" : "Lägg till i favoriter"}
                        >
                          <Star className={cn("h-5 w-5", isFavorite ? "fill-current" : "")} />
                        </Button>
                        <Badge variant="secondary">{competition.discipline}</Badge>
                        <Badge variant="muted">{competition.level}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompetitionListView;
