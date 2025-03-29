
import { useState } from "react";
import { MapPin, Locate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import LocationDialog from "./LocationDialog";

interface DistanceFilterProps {
  userLocation?: { lat: number; lng: number };
  detectedLocationInfo?: {
    city?: string;
    municipality?: string;
    county?: string;
    display_name?: string;
  };
  distance?: number;
  isManualLocation: boolean;
  locationCity?: string;
  onDistanceChange: (distance: number | null) => void;
  onDetectLocation: () => void;
  onSetManualLocation: (city: string) => Promise<boolean>;
}

const distances = [25, 50, 100];

const DistanceFilter = ({ 
  userLocation, 
  detectedLocationInfo, 
  distance, 
  isManualLocation,
  locationCity,
  onDistanceChange,
  onDetectLocation,
  onSetManualLocation
}: DistanceFilterProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const locationName = isManualLocation 
    ? locationCity 
    : (detectedLocationInfo?.city || "Din position");

  return (
    <AccordionItem value="distance" className="border-b-0">
      <AccordionTrigger className="py-2 hover:no-underline">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-medium">Avstånd</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4">
          {userLocation ? (
            <div className="text-sm text-muted-foreground mb-2">
              Sökområde: {locationName}
            </div>
          ) : (
            <div className="text-sm text-destructive font-medium mb-2">
              Ingen position vald
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={onDetectLocation}
            >
              <Locate className="h-3.5 w-3.5 mr-1" />
              <span className="truncate">Min position</span>
            </Button>
            
            <LocationDialog 
              open={isDialogOpen} 
              onOpenChange={setIsDialogOpen}
              onCitySelect={async (city) => {
                const success = await onSetManualLocation(city);
                if (success) setIsDialogOpen(false);
                return success;
              }}
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
