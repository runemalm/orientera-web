
import React from "react";
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
import { Star, Navigation } from "lucide-react";

interface CompetitionCompactViewProps {
  competitions: Competition[];
}

const CompetitionCompactView: React.FC<CompetitionCompactViewProps> = ({ 
  competitions 
}) => {
  const navigate = useNavigate();
  
  // Sort competitions by date in descending order
  const sortedCompetitions = [...competitions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="overflow-hidden">
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
          {sortedCompetitions.length > 0 ? (
            sortedCompetitions.map((competition) => (
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
