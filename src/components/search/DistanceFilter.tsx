
import React, { useState } from "react";
import { MapPin, Ruler } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import LocationDialog from "./LocationDialog";
import { LocationInfo } from "@/hooks/useGeolocation";

interface DistanceFilterProps {
  userLocation?: { lat: number; lng: number };
  detectedLocationInfo?: LocationInfo;
  distance?: number;
  isManualLocation: boolean;
  locationCity?: string;
  onDistanceChange: (distance: number | null) => void;
  onDetectLocation: () => void;
  onSetManualLocation: (cityName: string) => Promise<boolean>;
}

const DistanceFilter = ({
  userLocation,
  detectedLocationInfo,
  distance,
  isManualLocation,
  locationCity,
  onDistanceChange,
  onDetectLocation,
  onSetManualLocation,
}: DistanceFilterProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Preset distance options in kilometers
  const distanceOptions = [10, 25, 50, 100, 150];

  const handleCitySelect = async (cityName: string) => {
    const success = await onSetManualLocation(cityName);
    return success;
  };

  return (
    <AccordionItem value="distance" className="border px-2 rounded-lg">
      <AccordionTrigger className="px-2">
        <div className="flex items-center gap-2">
          <Ruler className="h-4 w-4" />
          <span>Avstånd</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-2 pt-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Din position</div>
              {userLocation && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => onDistanceChange(null)}
                >
                  Rensa
                </Button>
              )}
            </div>

            {userLocation ? (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  {isManualLocation ? (
                    <div className="font-medium">{locationCity}</div>
                  ) : (
                    <div className="font-medium">
                      {detectedLocationInfo?.city || "Din position"}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {isManualLocation
                      ? "Manuellt angiven position"
                      : detectedLocationInfo?.display_name || "Automatiskt upptäckt position"}
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-5 px-0 text-xs"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Ändra position
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  {isManualLocation
                    ? "Kunde inte hitta position"
                    : "För att filtrera på avstånd behöver du ange din position"}
                </p>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDetectLocation}
                    className="w-full"
                  >
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span>Använd min position</span>
                  </Button>
                  <LocationDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    onCitySelect={handleCitySelect}
                  />
                </div>
              </div>
            )}
          </div>

          {userLocation && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Radie</div>
                <div className="font-medium text-sm">{distance || 0} km</div>
              </div>
              <ToggleGroup 
                type="single" 
                value={distance?.toString()} 
                onValueChange={(value) => onDistanceChange(value ? parseInt(value) : null)}
                className="justify-between"
              >
                {distanceOptions.map((option) => (
                  <ToggleGroupItem 
                    key={option} 
                    value={option.toString()}
                    size="sm"
                    className="flex-1"
                  >
                    {option} km
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default DistanceFilter;
