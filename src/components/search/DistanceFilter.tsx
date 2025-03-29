
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
  const [cityInput, setCityInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cityInput.trim().length < 2) {
      toast({
        title: "För kort sökord",
        description: "Ange minst två tecken för att söka",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    const success = await onLocationSearch(cityInput);
    setIsSearching(false);
    
    if (success) {
      setCityInput("");
      toast({
        title: "Plats hittad",
        description: `Söker nu runt ${cityInput}`
      });
    } else {
      toast({
        title: "Kunde inte hitta platsen",
        description: "Försök med en annan ort i Sverige",
        variant: "destructive"
      });
    }
  };

  return (
    <AccordionItem value="distance" className="border-b-0">
      <AccordionTrigger className="py-2 hover:no-underline">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-medium">Avstånd</span>
          {locationName && (
            <Badge variant="outline" className="ml-2 font-normal">
              {locationName}
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2 items-center">
            <Input 
              placeholder="Sök ort i Sverige..."
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              className="flex-1 focus-visible:ring-primary"
            />
            <Button 
              type="submit" 
              size="sm"
              disabled={isSearching || cityInput.trim().length < 2}
            >
              Sök
            </Button>
          </form>
          
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
