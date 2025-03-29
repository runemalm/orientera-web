
import React, { useMemo } from "react";
import { Competition } from "@/types";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isWeekend, parseISO, isSameMonth } from "date-fns";
import { sv } from "date-fns/locale";
import { formatDate } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Flag, Star, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompetitionCalendarViewProps {
  competitions: Competition[];
}

const CompetitionCalendarView: React.FC<CompetitionCalendarViewProps> = ({ 
  competitions 
}) => {
  const navigate = useNavigate();
  
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
              
              return (
                <Card 
                  key={competition.id}
                  className={cn(
                    "overflow-hidden transition-all hover:shadow-md cursor-pointer",
                    isWeekendDay ? "border-l-4 border-l-amber-400" : "",
                    competition.featured ? "border-accent border-l-4" : ""
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

export default CompetitionCalendarView;
