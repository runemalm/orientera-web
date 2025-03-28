
import React, { useState, useCallback, useEffect } from "react";
import { MapPinOff, History, X } from "lucide-react";
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
  CommandSeparator,
} from "@/components/ui/command";
import { debounce } from "@/lib/utils";

// Maximum number of locations to store in history
const MAX_HISTORY_ITEMS = 5;

// Get location history from localStorage
const getLocationHistory = (): {name: string, display: string}[] => {
  try {
    const history = localStorage.getItem('locationHistory');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error reading location history:", error);
    return [];
  }
};

// Save location history to localStorage
const saveLocationHistory = (location: {name: string, display: string}) => {
  try {
    // Get current history
    let history = getLocationHistory();
    
    // Remove if this location already exists (to move it to the top)
    history = history.filter(item => item.name !== location.name);
    
    // Add new location at the beginning
    history.unshift(location);
    
    // Limit history size
    if (history.length > MAX_HISTORY_ITEMS) {
      history = history.slice(0, MAX_HISTORY_ITEMS);
    }
    
    // Save updated history
    localStorage.setItem('locationHistory', JSON.stringify(history));
  } catch (error) {
    console.error("Error saving location history:", error);
  }
};

// Remove a location from history
const removeFromHistory = (locationName: string) => {
  try {
    // Get current history
    let history = getLocationHistory();
    
    // Filter out the location to remove
    history = history.filter(item => item.name !== locationName);
    
    // Save updated history
    localStorage.setItem('locationHistory', JSON.stringify(history));
    
    return history;
  } catch (error) {
    console.error("Error removing location from history:", error);
    return getLocationHistory();
  }
};

interface LocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCitySelect: (city: string) => Promise<boolean>;
}

const LocationDialog = ({ open, onOpenChange, onCitySelect }: LocationDialogProps) => {
  const [citySuggestions, setCitySuggestions] = useState<{name: string, display: string}[]>([]);
  const [citySearchValue, setCitySearchValue] = useState("");
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [locationHistory, setLocationHistory] = useState<{name: string, display: string}[]>([]);

  // Load location history when dialog opens
  useEffect(() => {
    if (open) {
      setLocationHistory(getLocationHistory());
    }
  }, [open]);

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

  const handleSelectCity = async (cityName: string, displayName?: string) => {
    const success = await onCitySelect(cityName);
    if (success) {
      // Save to history if selection was successful
      if (displayName) {
        saveLocationHistory({ name: cityName, display: displayName });
        // Update the local state to reflect changes
        setLocationHistory(getLocationHistory());
      }
      setCitySearchValue("");
    }
  };

  const handleRemoveFromHistory = (e: React.MouseEvent, name: string) => {
    e.stopPropagation(); // Prevent triggering the parent's onClick
    const updatedHistory = removeFromHistory(name);
    setLocationHistory(updatedHistory);
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
                <div className="flex items-center border-b px-3">
                  <Label htmlFor="city-search-input" className="sr-only">Search</Label>
                  <MapPinOff className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <CommandInput 
                    id="city-search-input"
                    placeholder="Sök efter stad eller ort..." 
                    value={citySearchValue}
                    onValueChange={setCitySearchValue}
                  />
                </div>
                <CommandList>
                  {isLoadingSuggestions ? (
                    <div className="py-6 text-center text-sm">Laddar förslag...</div>
                  ) : (
                    <>
                      {locationHistory.length > 0 && (
                        <>
                          <CommandGroup heading="Tidigare platser">
                            {locationHistory.map((city, index) => (
                              <CommandItem
                                key={`history-${index}`}
                                value={`history-${city.name}`}
                                onSelect={() => handleSelectCity(city.name, city.display)}
                                className="cursor-pointer flex items-center justify-between"
                              >
                                <div className="flex items-center space-x-2">
                                  <History className="h-4 w-4 opacity-50" />
                                  <div className="text-sm">
                                    <div className="font-medium">{city.name}</div>
                                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                      {city.display}
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-50 hover:opacity-100"
                                  onClick={(e) => handleRemoveFromHistory(e, city.name)}
                                >
                                  <X className="h-3 w-3" />
                                  <span className="sr-only">Ta bort från historik</span>
                                </Button>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                          <CommandSeparator />
                        </>
                      )}
                      
                      <CommandEmpty>Inga träffar i Sverige</CommandEmpty>
                      {citySuggestions.length > 0 && (
                        <CommandGroup heading="Sökresultat">
                          {citySuggestions.map((city, index) => (
                            <CommandItem
                              key={index}
                              value={city.name}
                              onSelect={() => handleSelectCity(city.name, city.display)}
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
                      )}
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
