
import React, { useMemo } from "react";
import { Competition } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  isWeekend, 
  parseISO, 
  getWeek,
  isSameDay,
  addMonths
} from "date-fns";
import { sv } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, MapPin, Star, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompetitionWallCalendarViewProps {
  competitions: Competition[];
}

const CompetitionWallCalendarView: React.FC<CompetitionWallCalendarViewProps> = ({ 
  competitions 
}) => {
  const navigate = useNavigate();
  
  // Create a map of dates to competitions for quick lookup
  const competitionsByDate = useMemo(() => {
    const map = new Map<string, Competition[]>();
    
    competitions.forEach(competition => {
      const dateKey = format(parseISO(competition.date), 'yyyy-MM-dd');
      
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)?.push(competition);
    });
    
    return map;
  }, [competitions]);
  
  // Determine the date range to display
  const calendarMonths = useMemo(() => {
    // If no competitions, show current month and next 2 months
    if (competitions.length === 0) {
      const today = new Date();
      return [today, addMonths(today, 1), addMonths(today, 2)];
    }
    
    // Get min and max dates from competitions
    const dates = competitions.map(comp => parseISO(comp.date));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    // Create an array of the first day of each month in the range
    const months: Date[] = [];
    let currentMonth = startOfMonth(minDate);
    
    while (currentMonth <= maxDate) {
      months.push(new Date(currentMonth));
      currentMonth = addMonths(currentMonth, 1);
    }
    
    return months;
  }, [competitions]);
  
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
    <div className="space-y-10">
      {calendarMonths.map(monthDate => {
        const daysInMonth = eachDayOfInterval({
          start: startOfMonth(monthDate),
          end: endOfMonth(monthDate)
        });
        
        // Group days by week for displaying week numbers
        const weeks: Date[][] = [];
        let currentWeek: Date[] = [];
        
        daysInMonth.forEach(day => {
          if (currentWeek.length === 0 || getWeek(currentWeek[0], { locale: sv }) === getWeek(day, { locale: sv })) {
            currentWeek.push(day);
          } else {
            weeks.push(currentWeek);
            currentWeek = [day];
          }
        });
        
        if (currentWeek.length > 0) {
          weeks.push(currentWeek);
        }
        
        return (
          <div key={format(monthDate, 'yyyy-MM')} className="space-y-4">
            <div className="sticky top-0 z-10 bg-background pt-2 pb-1">
              <h3 className="text-xl font-semibold capitalize border-b pb-2">
                {format(monthDate, 'MMMM yyyy', { locale: sv })}
              </h3>
            </div>
            
            <div className="grid grid-cols-8 gap-1 text-sm">
              {/* Header row with week number and weekday names */}
              <div className="font-medium text-center p-2 bg-muted rounded-l-md">Vecka</div>
              {['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'].map(day => (
                <div key={day} className="font-medium text-center p-2 bg-muted last:rounded-r-md">
                  {day}
                </div>
              ))}
              
              {/* Calendar grid with week numbers and days */}
              {weeks.map((week, weekIndex) => (
                <React.Fragment key={weekIndex}>
                  {/* Week number cell */}
                  <div className="font-medium text-center p-2 bg-muted/50 flex items-center justify-center">
                    {getWeek(week[0], { locale: sv })}
                  </div>
                  
                  {/* Day cells */}
                  {Array(7).fill(null).map((_, dayIndex) => {
                    // Find the day for this position or use null if it doesn't exist
                    const dayForPosition = week.find(d => d.getDay() === (dayIndex + 1) % 7);
                    
                    if (!dayForPosition) {
                      return <div key={dayIndex} className="min-h-[80px] p-1 border border-dashed border-muted" />;
                    }
                    
                    const dateKey = format(dayForPosition, 'yyyy-MM-dd');
                    const dayCompetitions = competitionsByDate.get(dateKey) || [];
                    const isWeekendDay = isWeekend(dayForPosition);
                    
                    return (
                      <div 
                        key={dayIndex}
                        className={cn(
                          "min-h-[80px] p-1 border rounded-md transition-colors",
                          isWeekendDay ? "bg-amber-50" : "",
                          dayCompetitions.length > 0 ? "border-primary/40" : "border-muted"
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <span className={cn(
                            "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                            isWeekendDay ? "bg-amber-100 text-amber-700" : "text-muted-foreground"
                          )}>
                            {format(dayForPosition, 'd')}
                          </span>
                        </div>
                        
                        {dayCompetitions.length > 0 && (
                          <div className="mt-1 space-y-1">
                            {dayCompetitions.map(competition => (
                              <div 
                                key={competition.id}
                                onClick={() => navigate(`/competition/${competition.id}`)}
                                className={cn(
                                  "p-1 text-xs rounded cursor-pointer hover:bg-muted",
                                  competition.featured ? "border-l-2 border-l-primary" : ""
                                )}
                              >
                                <div className="font-medium flex items-center gap-1 truncate">
                                  {competition.featured && <Star className="h-3 w-3 text-primary" />}
                                  {competition.name}
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground truncate">
                                  <MapPin className="h-2 w-2" />
                                  <span className="truncate">{competition.location}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CompetitionWallCalendarView;
