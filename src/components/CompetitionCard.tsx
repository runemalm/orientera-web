
import { Link } from "react-router-dom";
import { Calendar, MapPin, Flag, Star, Navigation } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Competition } from "@/types";
import { formatDate, formatDistance } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CompetitionCardProps {
  competition: Competition;
  featured?: boolean;
}

const CompetitionCard = ({ competition, featured = false }: CompetitionCardProps) => {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${featured ? 'border-accent border-2' : ''}`}>
      <CardHeader className="p-4 pb-2">
        {featured && (
          <div className="flex items-center text-accent mb-1 text-sm font-medium">
            <Star className="mr-1 h-4 w-4" />
            Populär tävling
          </div>
        )}
        <CardTitle className="text-lg">{competition.name}</CardTitle>
        <CardDescription className="flex items-center mt-1">
          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
          <span className="mr-2">{competition.location}</span>
          {competition.distance !== undefined && (
            <span className="text-xs py-0 flex items-center border border-input rounded-full px-2">
              <Navigation className="h-3 w-3 mr-1" />
              {formatDistance(competition.distance)}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-2">
        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{formatDate(competition.date)}</span>
          </div>
          <div className="flex items-center">
            <Flag className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{competition.discipline}</span>
          </div>
        </div>
        <p className="mt-3 text-sm line-clamp-2 text-muted-foreground">
          {competition.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between items-center">
        <span className="text-sm font-medium">
          {competition.level}
        </span>
        <Button asChild size="sm">
          <Link to={`/competition/${competition.id}`}>
            Visa detaljer
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CompetitionCard;
