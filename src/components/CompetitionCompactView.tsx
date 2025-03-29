
import React, { useState } from "react";
import { Competition } from "@/types";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate, formatDistance } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Star, Navigation, CalendarDays } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { cn } from "@/lib/utils";

interface CompetitionCompactViewProps {
  competitions: Competition[];
}

const CompetitionCompactView: React.FC<CompetitionCompactViewProps> = ({ 
  competitions 
}) => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isFiltering, setIsFiltering] = useState(false);

  // Filter competitions by date range
  const filteredCompetitions = dateRange && dateRange.from && isFiltering
    ? competitions.filter(competition => {
        const competitionDate = new Date(competition.date);
        const from = dateRange.from as Date;
        const to = dateRange.to ? new Date(dateRange.to) : new Date(from);
        to.setHours(23, 59, 59, 999); // End of the day
        
        return competitionDate >= from && competitionDate <= to;
      })
    : competitions;

  // Clear date filter
  const clearDateFilter = () => {
    setDateRange(undefined);
    setIsFiltering(false);
  };

  // Apply date filter
  const applyDateFilter = () => {
    setIsFiltering(true);
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-2 flex justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                "flex gap-1.5 items-center",
                isFiltering && "bg-accent text-accent-foreground"
              )}
            >
              <CalendarDays className="h-4 w-4" />
              <span>
                {isFiltering && dateRange?.from
                  ? `${formatDate(dateRange.from.toISOString())}${
                      dateRange.to ? ` – ${formatDate(dateRange.to.toISOString())}` : ''
                    }`
                  : "Filtrera datum"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <div className="p-3">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={new Date()}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
              <div className="flex gap-2 justify-end mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearDateFilter}
                  className="text-sm"
                >
                  Rensa
                </Button>
                <Button 
                  size="sm" 
                  onClick={applyDateFilter}
                  disabled={!dateRange?.from}
                  className="text-sm"
                >
                  Applicera
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tävling</TableHead>
            <TableHead>Datum</TableHead>
            <TableHead>Plats</TableHead>
            <TableHead>Disciplin</TableHead>
            <TableHead>Nivå</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCompetitions.length > 0 ? (
            filteredCompetitions.map((competition) => (
              <TableRow 
                key={competition.id}
                className="cursor-pointer hover:bg-muted"
                onClick={() => navigate(`/competition/${competition.id}`)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {competition.featured && (
                      <Star className="h-4 w-4 text-accent mr-1.5" />
                    )}
                    {competition.name}
                  </div>
                </TableCell>
                <TableCell>{formatDate(competition.date)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <span>{competition.location}</span>
                    {competition.distance !== undefined && (
                      <Badge variant="outline" className="ml-1 text-xs">
                        <Navigation className="h-3 w-3 mr-1" />
                        {formatDistance(competition.distance)}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{competition.discipline}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="muted">{competition.level}</Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                Inga tävlingar hittades under valt datumintervall
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default CompetitionCompactView;
