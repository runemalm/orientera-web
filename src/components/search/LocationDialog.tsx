
import React, { useState, useCallback } from "react";
import { MapPinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { debounce } from "@/lib/utils";

interface LocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCitySelect: (city: string) => Promise<boolean>;
}

const LocationDialog = ({ open, onOpenChange, onCitySelect }: LocationDialogProps) => {
  const [citySuggestions, setCitySuggestions] = useState<{name: string, display: string}[]>([]);
  const [citySearchValue, setCitySearchValue] = useState("");
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const fetchCitySuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setCitySuggestions([]);
        return;
      }
      
      setIsLoadingSuggestions(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}, Sweden&countrycodes=se&limit=5`
        );
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          const suggestions = data.map((item: any) => ({
            name: item.name,
            display: item.display_name
          }));
          setCitySuggestions(suggestions);
        } else {
          setCitySuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching city suggestions:", error);
        setCitySuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300),
    []
  );

  // Fetch suggestions when search value changes
  React.useEffect(() => {
    if (citySearchValue) {
      fetchCitySuggestions(citySearchValue);
    } else {
      setCitySuggestions([]);
    }
  }, [citySearchValue, fetchCitySuggestions]);

  const handleSelectCity = async (cityName: string) => {
    const success = await onCitySelect(cityName);
    if (success) {
      setCitySearchValue("");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full">
            <MapPinOff className="h-3.5 w-3.5 mr-1" />
            <span className="truncate">Ange ort</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ange stad eller ort i Sverige</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="city-search">Stad eller ort</Label>
              <Command className="rounded-lg border shadow-md">
                <CommandInput 
                  id="city-search"
                  placeholder="Sök efter stad eller ort..." 
                  value={citySearchValue}
                  onValueChange={setCitySearchValue}
                />
                <CommandList>
                  {isLoadingSuggestions ? (
                    <div className="py-6 text-center text-sm">Laddar förslag...</div>
                  ) : (
                    <>
                      <CommandEmpty>Inga träffar i Sverige</CommandEmpty>
                      <CommandGroup>
                        {citySuggestions.map((city, index) => (
                          <CommandItem
                            key={index}
                            value={city.name}
                            onSelect={() => handleSelectCity(city.name)}
                            className="cursor-pointer"
                          >
                            <div className="text-sm">
                              <div className="font-medium">{city.name}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[260px]">
                                {city.display}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Avbryt
              </Button>
              <Button 
                type="button"
                disabled={citySearchValue.length < 2}
                onClick={() => handleSelectCity(citySearchValue)}
              >
                Använd position
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LocationDialog;
