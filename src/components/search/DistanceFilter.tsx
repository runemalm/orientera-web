
import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import LocationDialog from "./LocationDialog";

interface DistanceFilterProps {
  userLocation?: { lat: number; lng: number };
  distance?: number;
  locationName?: string;
  onDistanceChange: (distance: number | null) => void;
  onLocationSearch: (city: string) => Promise<boolean>;
}

const distances = [25, 50, 100];

const DistanceFilter = ({ 
  userLocation, 
  distance,
  locationName,
  onDistanceChange,
  onLocationSearch
}: DistanceFilterProps) => {
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const { toast } = useToast();

  return (
    <AccordionItem value="distance" className="border-b-0">
      <AccordionTrigger className="py-2 hover:no-underline">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-medium">
            Avstånd
          </span>
          {locationName && (
            <Badge variant="outline" className="ml-2 font-normal">
              {locationName}
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-1">
        <div className="space-y-4 pt-2">
          <div className="flex flex-col gap-2">
            <LocationDialog 
              open={locationDialogOpen} 
              onOpenChange={setLocationDialogOpen} 
              onCitySelect={onLocationSearch} 
            />
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <Button 
              variant={distance === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => onDistanceChange(null)}
              className="w-full"
            >
              Alla
            </Button>
            {distances.map(dist => (
              <Button 
                key={dist}
                variant={distance === dist ? "default" : "outline"}
                size="sm"
                disabled={!userLocation}
                onClick={() => onDistanceChange(dist)}
                className="w-full"
              >
                {dist} km
              </Button>
            ))}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default DistanceFilter;
