
import React from "react";
import { Competition } from "@/types";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDistance } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Flag, Star, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompetitionListViewProps {
  competitions: Competition[];
}

const CompetitionListView: React.FC<CompetitionListViewProps> = ({ 
  competitions 
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {competitions.map((competition) => (
        <Card 
          key={competition.id}
          className={`overflow-hidden transition-all hover:shadow-md cursor-pointer ${
            competition.featured ? 'border-accent border-l-4' : ''
          }`}
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
                    {competition.distance !== undefined && (
                      <Badge variant="outline" className="ml-1.5 text-xs">
                        <Navigation className="h-3 w-3 mr-1" />
                        {formatDistance(competition.distance)}
                      </Badge>
                    )}
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
              
              <Button size="sm" className="self-end md:self-center shrink-0">
                Visa detaljer
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CompetitionListView;
