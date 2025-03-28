
import { useState } from "react";
import { MapPin, MapPinOff, Locate, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import LocationDialog from "./LocationDialog";
import { GeolocationState } from "@/hooks/useGeolocation";

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

const distances = [10, 25, 50, 100, 200];

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

  return (
    <AccordionItem value="distance" className="border-b-0">
      <AccordionTrigger className="py-2 hover:no-underline">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-medium">Avstånd från min position</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm">
              {userLocation ? (
                <>
                  {isManualLocation ? (
                    <span className="text-sm text-muted-foreground">
                      {`Plats: ${locationCity || "Manuellt vald position"}`}
                    </span>
                  ) : (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <span className="text-sm text-muted-foreground cursor-help flex items-center">
                          <Locate className="h-3.5 w-3.5 mr-1.5" />
                          {detectedLocationInfo?.city ? 
                            `${detectedLocationInfo.city}` : 
                            "Detekterad position"}
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80 p-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">Din detekterade position</h4>
                          {detectedLocationInfo ? (
                            <div className="text-xs space-y-1">
                              {detectedLocationInfo.city && (
                                <p>
                                  <span className="font-medium">Ort: </span>
                                  {detectedLocationInfo.city}
                                </p>
                              )}
                              {detectedLocationInfo.municipality && (
                                <p>
                                  <span className="font-medium">Kommun: </span>
                                  {detectedLocationInfo.municipality}
                                </p>
                              )}
                              {detectedLocationInfo.county && (
                                <p>
                                  <span className="font-medium">Län: </span>
                                  {detectedLocationInfo.county}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                                {detectedLocationInfo.display_name}
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs">
                              Platsinformation saknas. Vi har dina koordinater men kunde inte 
                              hämta detaljerad information.
                            </p>
                          )}
                          <div className="text-xs text-muted-foreground mt-2">
                            Koordinater: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  )}
                </>
              ) : (
                <span className="text-sm text-destructive font-medium">
                  Ingen position tillgänglig
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <LocationDialog 
                open={isDialogOpen} 
                onOpenChange={setIsDialogOpen}
                onCitySelect={async (city) => {
                  const success = await onSetManualLocation(city);
                  if (success) setIsDialogOpen(false);
                  return success;
                }}
              />
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={onDetectLocation}
              >
                <Locate className="h-3.5 w-3.5 mr-1" />
                <span className="truncate">Auto</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
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
