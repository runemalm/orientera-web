
import React, { useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Competition } from "@/types";
import { formatDate } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface CompetitionCalendarViewProps {
  competitions: Competition[];
}

const CompetitionCalendarView: React.FC<CompetitionCalendarViewProps> = ({ 
  competitions 
}) => {
  const navigate = useNavigate();
  
  // Group competitions by date
  const competitionsByDate = useMemo(() => {
    const grouped = new Map<string, Competition[]>();
    
    competitions.forEach(competition => {
      const dateKey = competition.date.split('T')[0];
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)?.push(competition);
    });
    
    return grouped;
  }, [competitions]);

  // Create date objects for use in calendar
  const competitionDates = useMemo(() => {
    return Array.from(competitionsByDate.keys()).map(dateStr => new Date(dateStr));
  }, [competitionsByDate]);

  // Selected date state
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    competitionDates.length > 0 ? competitionDates[0] : undefined
  );

  // Get competitions for selected date
  const selectedDateCompetitions = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = selectedDate.toISOString().split('T')[0];
    return competitionsByDate.get(dateKey) || [];
  }, [selectedDate, competitionsByDate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Välj datum</CardTitle>
            <CardDescription>
              {competitionDates.length} datum med tävlingar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="p-3 pointer-events-auto"
              components={{
                DayContent: (props) => {
                  const date = props.date;
                  const dateKey = date.toISOString().split('T')[0];
                  const hasEvents = competitionsByDate.has(dateKey);
                  
                  return (
                    <div className="relative">
                      <div>{props.date.getDate()}</div>
                      {hasEvents && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                      )}
                    </div>
                  );
                },
              }}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate 
                ? `Tävlingar ${formatDate(selectedDate.toISOString())}` 
                : "Välj ett datum för att se tävlingar"}
            </CardTitle>
            <CardDescription>
              {selectedDateCompetitions.length} 
              {selectedDateCompetitions.length === 1 ? ' tävling' : ' tävlingar'}
              {selectedDate ? ` ${formatDate(selectedDate.toISOString())}` : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDateCompetitions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tävling</TableHead>
                    <TableHead>Arrangör</TableHead>
                    <TableHead>Disciplin</TableHead>
                    <TableHead>Nivå</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedDateCompetitions.map((competition) => (
                    <TableRow 
                      key={competition.id}
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => navigate(`/competition/${competition.id}`)}
                    >
                      <TableCell className="font-medium">{competition.name}</TableCell>
                      <TableCell>{competition.organizer}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{competition.discipline}</Badge>
                      </TableCell>
                      <TableCell>{competition.level}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                {selectedDate 
                  ? "Inga tävlingar detta datum" 
                  : "Välj ett datum i kalendern för att se tävlingar"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompetitionCalendarView;
